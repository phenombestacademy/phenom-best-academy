import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};
Deno.serve(async(req)=>{
 if(req.method==='OPTIONS')return new Response('ok',{headers:cors});
 try{
  const url=Deno.env.get('SUPABASE_URL')!; const publishable=Deno.env.get('SUPABASE_ANON_KEY')||JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS')||'{}').default; const secret=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}').default;
  const auth=createClient(url,publishable,{global:{headers:{Authorization:req.headers.get('Authorization')||''}}}); const {data:{user}}=await auth.auth.getUser(); if(!user)return new Response(JSON.stringify({error:'Authentication required'}),{status:401,headers:{...cors,'Content-Type':'application/json'}});
  const admin=createClient(url,secret); const {data:profile}=await admin.from('profiles').select('role').eq('id',user.id).maybeSingle();
  const {publicationId}=await req.json(); if(!publicationId)throw new Error('publicationId is required');
  const {data:publication}=await admin.from('school_result_publications').select('school_id').eq('id',publicationId).maybeSingle(); if(!publication)throw new Error('Publication not found');
  const {data:membership}=await admin.from('school_members').select('id').eq('school_id',publication.school_id).eq('user_id',user.id).eq('role','school_admin').eq('status','active').maybeSingle();
  if(profile?.role!=='super_admin' && !membership)return new Response(JSON.stringify({error:'Only this school administrator or the Academy Super Admin may release result emails'}),{status:403,headers:{...cors,'Content-Type':'application/json'}});
  const {data:rows,error}=await admin.from('result_release_notifications').select('id,email,recipient_type').eq('publication_id',publicationId).eq('status','queued'); if(error)throw error;
  const key=Deno.env.get('RESEND_API_KEY'); const from=Deno.env.get('ACADEMY_FROM_EMAIL'); if(!key||!from)throw new Error('Result email service is not configured yet.');
  let sent=0; for(const row of rows||[]){ if(!row.email)continue; const r=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${key}`,'Content-Type':'application/json'},body:JSON.stringify({from,to:[row.email],subject:'Phenom Best Academy — Result Released',html:`<p>Your school has released the result associated with this notification.</p><p>Please sign in to Phenom Best Academy to view it.</p>`})}); if(r.ok){await admin.from('result_release_notifications').update({status:'sent',sent_at:new Date().toISOString(),error_message:null}).eq('id',row.id);sent++;}else{await admin.from('result_release_notifications').update({status:'failed',error_message:await r.text()}).eq('id',row.id);}}
  return new Response(JSON.stringify({ok:true,sent,total:(rows||[]).length}),{headers:{...cors,'Content-Type':'application/json'}});
 }catch(e){return new Response(JSON.stringify({error:e instanceof Error?e.message:'Result email error'}),{status:400,headers:{...cors,'Content-Type':'application/json'}})}
});
