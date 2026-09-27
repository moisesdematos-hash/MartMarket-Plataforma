import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';

serve(async (req) => {
  try {
    const payload = await req.json();
    
    // Supabase Database Webhook payload format
    const { type, record, old_record } = payload;
    
    // We only care about orders that JUST became "completed"
    if (type === 'UPDATE' && record.status === 'completed' && old_record.status !== 'completed') {
      
      const buyerEmail = record.buyer_email;
      const productName = "o seu Curso (MartMarket)"; // We can query the DB for the product name if needed
      
      // Call Resend API
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: 'MartMarket <naoresponder@martmarket.com>',
          to: [buyerEmail],
          subject: 'Pagamento Confirmado! O seu acesso foi libertado 🎉',
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h1 style="color: #10b981;">Pagamento Recebido!</h1>
              <p>Olá ${record.buyer_name},</p>
              <p>O seu pagamento de <strong>${record.total} ${record.currency}</strong> foi confirmado com sucesso.</p>
              <p>O seu acesso ao produto está agora disponível na sua conta.</p>
              <a href="https://martmarket-plataforma.vercel.app/app" style="display: inline-block; padding: 12px 24px; background: #3b82f6; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Aceder à Plataforma</a>
              <p style="margin-top: 20px; font-size: 12px; color: #888;">Se tiver dúvidas, responda a este e-mail.</p>
            </div>
          `
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Resend Error: ${errorText}`);
      }

      return new Response(JSON.stringify({ success: true, message: 'Email sent' }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    return new Response(JSON.stringify({ message: 'Event ignored' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Email Trigger Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
