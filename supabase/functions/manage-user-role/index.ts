import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const url = Deno.env.get('SUPABASE_URL')!;
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}').default;
    const anon = Deno.env.get('SUPABASE_ANON_KEY') || JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') || '{}').default;
    if (!service || !anon) throw new Error('Supabase server configuration is incomplete.');

    const auth = createClient(url, anon, { global: { headers: { Authorization: req.headers.get('Authorization') || '' } } });
    const { data: { user } } = await auth.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'Authentication required' }), { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } });

    const admin = createClient(url, service);
    const { data: actor } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (actor?.role !== 'super_admin') {
      return new Response(JSON.stringify({ error: 'Super Admin access required' }), { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    const body = await req.json();
    const targetUserId = String(body.userId || '');
    const role = String(body.role || '');
    if (!targetUserId || !['user', 'parent', 'staff', 'admin'].includes(role)) throw new Error('Only user, parent, staff or admin can be assigned here.');
    if (targetUserId === user.id) throw new Error('The Super Admin account cannot be changed from this control.');

    const { error } = await admin.from('profiles').update({ role, updated_at: new Date().toISOString() }).eq('id', targetUserId);
    if (error) throw error;
    await admin.from('audit_logs').insert({ actor_id: user.id, action: 'assign_role', target_type: 'profile', target_id: targetUserId, metadata: { role } });
    return Response.json({ ok: true, role }, { headers: cors });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Role update failed' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
