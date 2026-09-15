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
    if (txRef) {
      await supabase.from('payment_orders').update({ status: event.event === 'charge.completed' ? 'paid' : 'pending', provider_transaction_id: String(event?.data?.id || ''), paid_at: event.event === 'charge.completed' ? new Date().toISOString() : null }).eq('tx_ref', txRef);
    }
    return new Response('ok');
  } catch { return new Response('error', { status: 400 }); }
});
