import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // SEC FIX: Webhook Authentication for PayPay Africa
    const webhookSecret = process.env.PAYPAY_WEBHOOK_SECRET;
    const authHeader = req.headers.authorization;
    
    // Some gateways use a signature in the headers, adapting standard bearer for now
    if (webhookSecret && authHeader !== `Bearer ${webhookSecret}`) {
      console.error('Tentativa de fraude bloqueada: Token invalido.');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const payload = req.body;
    console.log('Webhook PayPay Recebido:', payload);

    // Adapt these payload keys to match PayPay Africa's official documentation
    const orderId = payload.custom_id || payload.metadata?.order_id;
    const status = payload.status; // 'success', 'paid', etc

    if (!orderId || (status !== 'success' && status !== 'paid')) {
      return res.status(400).json({ error: 'Payload invalido ou pagamento nao concluido' });
    }

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase credentials in Vercel Environment Variables.');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1 e 2. Encontrar e Atualizar a Encomenda Atomicamente
    const { data: updatedOrders, error: updateError } = await supabase
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', orderId)
      .eq('status', 'pending')
      .select('*, products(*)');

    if (updateError) {
      throw new Error('Falha ao atualizar a encomenda: ' + updateError.message);
    }

    if (!updatedOrders || updatedOrders.length === 0) {
      return res.status(200).json({ message: 'Encomenda ja processada ou inexistente' });
    }

    const order = updatedOrders[0];

    // 3. Processar Dinheiro na Carteira do Criador
    const platformFeePercentage = 0.05;
    const platformFee = order.amount_total * platformFeePercentage;
    const creatorEarnings = order.amount_total - platformFee;

    const { error: ledgerError } = await supabase
      .from('wallet_ledger')
      .insert({
        user_id: order.creator_id,
        amount: creatorEarnings,
        currency: order.currency,
        type: 'sale',
        status: 'completed',
        reference_id: order.id,
        description: 'Venda via PayPay Africa - Produto: ' + (order.products?.title || orderId)
      });

    if (ledgerError) {
      console.error('Falha ao registar entrada no wallet_ledger:', ledgerError);
    }

    // 4. Disparar Webhook do SaaS se aplicavel
    const product = order.products;
    if (product?.type === 'software' && product?.webhook_url) {
      try {
        await fetch(product.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'payment.success',
            customer: { name: order.buyer_name, email: order.buyer_email },
            order: { id: order.id, amount: order.amount_total, currency: order.currency },
            product: { id: product.id, title: product.title }
          })
        });
      } catch (err) {
        console.error('Falha ao contactar o webhook do SaaS do criador:', err);
      }
    }

    return res.status(200).json({ success: true, message: 'Pagamento PayPay processado com sucesso!' });

  } catch (error) {
    console.error('Erro na Webhook PayPay:', error);
    return res.status(500).json({ error: error.message });
  }
}
