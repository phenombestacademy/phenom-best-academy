import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const cors = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type'};
const SUPPORTED = new Set(['en-NG','en-GB','en-US','en-AU','en-CA','pcm-NG','fr-FR','es-ES','zh-CN','pt-PT','ar','de-DE','it-IT','ru-RU','yo-NG','ig-NG','ha-NG','sw-KE','sw-TZ','nl-NL','pl-PL','tr-TR','ko-KR','ja-JP','hi-IN','bn-BD','ur-PK','fa-IR','he-IL','id-ID','ms-MY','th-TH','vi-VN','fil-PH','uk-UA','ro-RO','cs-CZ','el-GR','da-DK','sv-SE','no-NO','fi-FI','hu-HU','am-ET','so-SO','zu-ZA','xh-ZA','en-NZ','en-PH','en-ZA','fr-CA','fr-CH','nl-BE','pt-BR','es-MX','es-AR','es-419','nb','nb-NO','he','iw']);
const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers:{...cors,'Content-Type':'application/json'}});
function quality(source:string,translated:string){if(!translated||translated===source)return 0;let score=80;if(translated.length<Math.max(2,source.length*.2))score-=25;if((source.match(/\{\{[^}]+\}\}/g)||[]).join('|')!==(translated.match(/\{\{[^}]+\}\}/g)||[]).join('|'))score-=40;if((source.match(/<[^>]+>/g)||[]).join('|')!==(translated.match(/<[^>]+>/g)||[]).join('|'))score-=30;return Math.max(0,Math.min(100,score));}
function cleanJson(raw:string){return raw.replace(/^\s*\`\`\`(?:json)?\s*/i,'').replace(/\s*\`\`\`\s*$/i,'').trim();}
async function translateThroughRouter(items:{key:string;text:string}[],locale:string){
 const url=Deno.env.get('SUPABASE_URL')!,serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
 const response=await fetch(url+'/functions/v1/ai-router',{method:'POST',headers:{Authorization:'Bearer '+serviceKey,apikey:serviceKey,'Content-Type':'application/json'},body:JSON.stringify({workflow:'translate-ui',mode:'fast',prompt:['Translate Phenom Best Academy interface resources.','Return JSON only as an array of objects: [{"key":"...","translation":"..."}].','Preserve every key exactly, preserve placeholders such as {{name}}, HTML tags, punctuation, product names and meaning.','Do not add commentary, markdown or code fences.','Target locale: '+locale,JSON.stringify(items)].join('\n')})});
 const data=await response.json().catch(()=>({}));if(!response.ok||!data?.text)throw new Error(data?.error||'Central AI Router did not return a translation.');
 const parsed=JSON.parse(cleanJson(String(data.text)));if(!Array.isArray(parsed))throw new Error('Central AI Router returned an invalid translation payload.');
 const map=new Map(parsed.map((x:any)=>[String(x.key),String(x.translation)]));
 return items.map(item=>({key:item.key,text:map.get(item.key)||item.text,score:quality(item.text,map.get(item.key)||item.text)}));
}
serve(async(req)=>{if(req.method==='OPTIONS')return new Response('ok',{headers:cors});try{
 const auth=req.headers.get('Authorization')||'',supabaseUrl=Deno.env.get('SUPABASE_URL')!,serviceKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,admin=createClient(supabaseUrl,serviceKey),token=auth.replace(/^Bearer\s+/i,'');
 const {data:userData}=await admin.auth.getUser(token);if(!userData.user)return json({error:'Authentication required.'},401);
 const {data:profile}=await admin.from('profiles').select('role').eq('id',userData.user.id).maybeSingle();if(profile?.role!=='super_admin')return json({error:'Super Admin access required.'},403);
 const body=await req.json(),locale=String(body.locale||''),items=Array.isArray(body.resources)?body.resources.map((x:any)=>({key:String(x.key),text:String(x.text)})).filter((x:any)=>x.key&&x.text):[];
 if(!SUPPORTED.has(locale)||!items.length)throw new Error('A supported locale and resource list are required.');
 const translations=await translateThroughRouter(items,locale);
 const rows=translations.map(item=>({locale,resource_key:item.key,source_text:items.find(x=>x.key===item.key)?.text||'',translated_text:item.text,source_version:String(body.sourceVersion||'v1'),quality_score:item.score,status:'draft',provider_trace:{architecture:'central-ai-router',workflow:'translate-ui'}}));
 const {error}=await admin.from('ui_translation_resources').upsert(rows,{onConflict:'locale,resource_key,source_version'});if(error)throw error;
 return json({ok:true,locale,count:rows.length,architecture:'central-ai-router',translations:translations.map(x=>({key:x.key,text:x.text}))});
}catch(e){return json({error:e instanceof Error?e.message:'Translation preparation failed.'},400)}});
