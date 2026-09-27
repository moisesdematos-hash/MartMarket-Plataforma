import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// ProxyPay specific constants (example)
const PROXYPAY_TOKEN = Deno.env.get('PROXYPAY_TOKEN') || '';

serve(async (req) => {
  try {
    // 1. Verify Method
    if (req.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    // 2. Parse payload from Gateway (e.g. ProxyPay, Unitel Money, Stripe)
    // Example for ProxyPay payload
    const payload = await req.json();
    
    // In ProxyPay, we receive an array of payments or a single payment object.
    // Example assuming single payment object: { reference_id: "...", amount: "...", custom_fields: { order_id: "uuid" } }
    
    // Basic Security: Check auth header from gateway
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${PROXYPAY_TOKEN}`) {
      console.warn("Unauthorized webhook attempt");
      return new Response('Unauthorized', { status: 401 });
    }

    const orderId = payload.custom_fields?.order_id || payload.order_id;
    if (!orderId) {
      return new Response('Missing order_id in payload', { status: 400 });
    }

    // 3. Connect to Supabase using Service Role (Bypasses RLS)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 4. Update the order status to 'completed'
    const { data: order, error: updateError } = await supabase
      .from('orders')
      .update({ status: 'completed' })
      .eq('id', orderId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Failed to update order: ${updateError.message}`);
    }

    // 5. Execute ledger/wallet movements (Platform Fee, Affiliate, Creator Net)
    // Note: In an MVP, this can be done in the frontend during creation (pending state),
    // and we just confirm it here, or we insert the ledger rows here.
    // Assuming the frontend already created the ledger rows in "pending" status, we update them:
    await supabase
      .from('wallet_ledger')
      .update({ status: 'completed' })
      .eq('reference_id', orderId);

    return new Response(JSON.stringify({ success: true, order: order.id }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Webhook Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
