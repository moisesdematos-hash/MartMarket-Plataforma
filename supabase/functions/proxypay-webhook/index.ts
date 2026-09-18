import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // A Proxypay envia-nos um JSON quando o cliente paga no Multicaixa
    const payload = await req.json();
    console.log('Webhook Proxypay Recebido:', payload);

    // Estrutura esperada da Proxypay
    const reference = payload.reference?.number;
    const amountPaid = payload.payment?.amount;
    const orderId = payload.reference?.custom_fields?.order_id;

    if (!orderId || !reference) {
      return new Response(JSON.stringify({ error: 'Payload invalido da Proxypay' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Inicializar o Cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1 e 2. Encontrar e Atualizar a Encomenda Atómicamente (Prevenção de Race Conditions)
    // O status só atualiza se for 'pending'. Se já estiver 'completed', não faz update.
    const { data: updatedOrders, error: updateError } = await supabase
      .from('orders')
      .update({ status: 'completed', payment_result: payload })
      .eq('id', orderId)
      .eq('status', 'pending')
      .select('*, products(*)');

    if (updateError) {
      throw new Error('Falha ao atualizar a encomenda: ' + updateError.message);
    }

    if (!updatedOrders || updatedOrders.length === 0) {
      // Se não atualizou nenhuma linha, significa que ou a order não existe ou já foi paga (status != pending).
      return new Response(JSON.stringify({ message: 'Encomenda já processada ou inexistente' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const order = updatedOrders[0];

    // 3. Processar Dinheiro na Carteira do Criador
    // Taxa da plataforma: Ex: 5%
    const platformFeePercentage = 0.05;
    const platformFee = order.total_amount * platformFeePercentage;
    const creatorEarnings = order.total_amount - platformFee;

    // Obter carteira atual
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', order.creator_id)
      .single();

    if (!walletError && wallet) {
      // Atualizar saldos
      await supabase
        .from('wallets')
        .update({
          balance: wallet.balance + creatorEarnings,
          available_balance: wallet.available_balance + creatorEarnings,
          total_earned: wallet.total_earned + creatorEarnings,
        })
        .eq('id', wallet.id);

      // Inserir Transacao
      await supabase
        .from('wallet_transactions')
        .insert({
          wallet_id: wallet.id,
          amount: creatorEarnings,
          type: 'sale',
          description: 'Venda do produto: ' + order.product_title,
          status: 'completed'
        });
    }

    // 4. (MAGIA SAAS) Disparar o Webhook do Criador se for SaaS
    const product = order.products;
    if (product?.product_type === 'software' && product?.webhook_url) {
      console.log('Produto SaaS detetado! Disparando webhook para:', product.webhook_url);
      
      try {
        await fetch(product.webhook_url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: 'payment.success',
            customer: {
              name: order.buyer_name,
              email: order.buyer_email,
            },
            order: {
              id: order.id,
              amount: order.total_amount,
              currency: order.currency
            },
            product: {
              id: product.id,
              title: product.title
            }
          })
        });
      } catch (err) {
        console.error('Falha ao contactar o webhook do SaaS do criador:', err);
        // Não bloqueia o fluxo principal mesmo se o servidor do criador estiver em baixo
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Pagamento Multicaixa processado com sucesso!' }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Erro na Webhook Proxypay:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
