const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};
Deno.serve(async req=>{
 if(req.method==="OPTIONS")return new Response("ok",{headers:cors});
 try{
  const auth=req.headers.get("Authorization")||"";
  const b=await req.json(); const score=Number(b.score??b.percentage??0),subject=String(b.subject||"the subject");
  const fallback=score>=80?`Excellent performance in ${subject}. Keep building on this strong foundation.`:score>=60?`Good progress in ${subject}. Continued practice can strengthen accuracy and confidence.`:score>=50?`A fair start in ${subject}. More guided practice and revision should improve performance.`:`Further support and regular practice in ${subject} are recommended.`;
  const r=await fetch(Deno.env.get("SUPABASE_URL")+"/functions/v1/ai-router",{method:"POST",headers:{"Content-Type":"application/json","Authorization":auth,"apikey":Deno.env.get("SUPABASE_ANON_KEY")!},body:JSON.stringify({mode:"fast",prompt:`Write one concise, encouraging school result comment for ${subject}. Score: ${score}%. Do not mention AI, providers, models or internal systems.`})});
  const j=await r.json().catch(()=>({}));
  const comment=r.ok&&j.text?String(j.text).trim():fallback;
  return new Response(JSON.stringify({comment}),{headers:{...cors,"Content-Type":"application/json"}});
 }catch(e){return new Response(JSON.stringify({error:e instanceof Error?e.message:"Comment generation failed."}),{status:400,headers:{...cors,"Content-Type":"application/json"}})}
});