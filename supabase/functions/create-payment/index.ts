import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: req.headers.get('Authorization') || '' } } });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } });
    const { productCode, amount, currency = 'NGN', redirectUrl } = await req.json();
    if (!productCode || !Number.isFinite(Number(amount)) || Number(amount) <= 0) throw new Error('Invalid payment request');
    const txRef = `PBA-${Date.now()}-${crypto.randomUUID().slice(0,8)}`;
    const secret = Deno.env.get('FLW_SECRET_KEY');
    if (!secret) throw new Error('Flutterwave server key is not configured');
    const order = await supabase.from('payment_orders').insert({ user_id: user.id, product_code: productCode, amount: Number(amount), currency, tx_ref: txRef }).select().single();
    if (order.error) throw order.error;
    const response = await fetch('https://api.flutterwave.com/v3/payments', { method: 'POST', headers: { Authorization: `Bearer ${secret}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ tx_ref: txRef, amount: Number(amount), currency, redirect_url: redirectUrl, customer: { email: user.email, name: user.user_metadata?.full_name || user.user_metadata?.name || 'Phenom User' }, customizations: { title: 'Phenom Best Academy', description: productCode } }) });
    const payload = await response.json();
    if (!response.ok || payload.status !== 'success') throw new Error(payload.message || 'Payment checkout could not be created');
    return new Response(JSON.stringify({ link: payload.data.link, txRef }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (error) { return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Payment error' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } }); }
});
