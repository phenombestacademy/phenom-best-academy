import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  try {
    const secretHash = Deno.env.get('FLW_SECRET_HASH');
    const incoming = req.headers.get('verif-hash');
    if (!secretHash || !incoming || incoming !== secretHash) return new Response('Unauthorized', { status: 401 });
    const event = await req.json();
    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const txRef = event?.data?.tx_ref;
    const paid = event?.event === 'charge.completed' && String(event?.data?.status || '').toLowerCase() === 'successful';
    if (txRef) {
      const { data: order } = await supabase.from('payment_orders').select('id,user_id,product_code,amount,currency').eq('tx_ref', txRef).maybeSingle();
      await supabase.from('payment_orders').update({ status: paid ? 'paid' : 'pending', provider_transaction_id: String(event?.data?.id || ''), paid_at: paid ? new Date().toISOString() : null }).eq('tx_ref', txRef);
      if (paid && order?.user_id) {
        const planMap: Record<string, string> = {
          'school-premium': 'school-premium',
          'individual-premium': 'individual-premium',
          'organisation-premium': 'organisation-premium',
        };
        const planCode = planMap[String(order.product_code || '')];
        if (planCode) {
          await supabase.from('subscriptions').insert({ user_id: order.user_id, plan_code: planCode, provider: 'flutterwave', amount: Number(order.amount || 0), currency: String(order.currency || 'NGN'), status: 'active', started_at: new Date().toISOString() });
        }
      }
    }
    return new Response('ok');
  } catch { return new Response('error', { status: 400 }); }
});
