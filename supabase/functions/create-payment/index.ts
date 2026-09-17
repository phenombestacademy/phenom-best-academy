import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
const cors={"Access-Control-Allow-Origin":"*","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type"};
serve(async(req)=>{if(req.method==='OPTIONS')return new Response('ok',{headers:cors});try{
 const url=Deno.env.get('SUPABASE_URL')!; const anon=Deno.env.get('SUPABASE_ANON_KEY')||JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS')||'{}').default; const service=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')||JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS')||'{}').default;
 const auth=createClient(url,anon,{global:{headers:{Authorization:req.headers.get('Authorization')||''}}}); const {data:{user}}=await auth.auth.getUser(); if(!user)return new Response(JSON.stringify({error:'Authentication required'}),{status:401,headers:{...cors,'Content-Type':'application/json'}});
 const body=await req.json(); const provider=String(body.provider||'flutterwave'); const productCode=String(body.productCode||''); const amount=Number(body.amount); const currency=String(body.currency||'NGN'); const redirectUrl=String(body.redirectUrl||''); if(!productCode||!Number.isFinite(amount)||amount<=0)throw new Error('Invalid payment request');
 const txRef=`PBA-${Date.now()}-${crypto.randomUUID().slice(0,8)}`; const admin=createClient(url,service); const {error:orderError}=await admin.from('payment_orders').insert({user_id:user.id,product_code:productCode,amount,currency,provider,tx_ref:txRef}); if(orderError)throw orderError;
 const customerName=String(user.user_metadata?.full_name||user.user_metadata?.name||'Phenom User');
 if(provider==='flutterwave'){
  const secret=Deno.env.get('FLW_SECRET_KEY'); if(!secret)throw new Error('Flutterwave is not configured yet.');
  const r=await fetch('https://api.flutterwave.com/v3/payments',{method:'POST',headers:{Authorization:`Bearer ${secret}`,'Content-Type':'application/json'},body:JSON.stringify({tx_ref:txRef,amount,currency,redirect_url:redirectUrl,customer:{email:user.email,name:customerName},payment_options:'card,banktransfer,account,ussd,opay,nqr,enaira',customizations:{title:'Phenom Best Academy',description:productCode}})}); const p=await r.json(); if(!r.ok||p.status!=='success')throw new Error(p.message||'Flutterwave checkout could not be created'); return Response.json({link:p.data.link,txRef,provider},{headers:cors});
 }
 if(provider==='paystack'){
  const secret=Deno.env.get('PAYSTACK_SECRET_KEY'); if(!secret)throw new Error('Paystack is not configured yet.');
  const r=await fetch('https://api.paystack.co/transaction/initialize',{method:'POST',headers:{Authorization:`Bearer ${secret}`,'Content-Type':'application/json'},body:JSON.stringify({email:user.email,amount:Math.round(amount*100),currency,reference:txRef,callback_url:redirectUrl,metadata:{productCode}})}); const p=await r.json(); if(!r.ok||!p.status)throw new Error(p.message||'Paystack checkout could not be created'); return Response.json({link:p.data.authorization_url,txRef,provider},{headers:cors});
 }
 if(provider==='stripe'){
  const secret=Deno.env.get('STRIPE_SECRET_KEY'); if(!secret)throw new Error('Stripe is not configured yet.');
  const params=new URLSearchParams(); params.set('mode','payment'); params.set('success_url',redirectUrl); params.set('cancel_url',redirectUrl); params.set('customer_email',user.email||''); params.set('line_items[0][price_data][currency]',currency.toLowerCase()); params.set('line_items[0][price_data][product_data][name]','Phenom Best Academy'); params.set('line_items[0][price_data][product_data][description]',productCode); params.set('line_items[0][price_data][unit_amount]',String(Math.round(amount*100))); params.set('line_items[0][quantity]','1'); params.set('client_reference_id',txRef);
  const r=await fetch('https://api.stripe.com/v1/checkout/sessions',{method:'POST',headers:{Authorization:`Bearer ${secret}`,'Content-Type':'application/x-www-form-urlencoded'},body:params}); const p=await r.json(); if(!r.ok||!p.url)throw new Error(p.error?.message||'Stripe checkout could not be created'); return Response.json({link:p.url,txRef,provider},{headers:cors});
 }
 if(provider==='interswitch'){
  const token=Deno.env.get('INTERSWITCH_ACCESS_TOKEN'); const merchantCode=Deno.env.get('INTERSWITCH_MERCHANT_CODE'); const payableCode=Deno.env.get('INTERSWITCH_PAY_ITEM_ID'); if(!token||!merchantCode||!payableCode)throw new Error('Interswitch is not configured yet.');
  const r=await fetch('https://webpay.interswitchng.com/paymentgateway/api/v1/paybill',{method:'POST',headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},body:JSON.stringify({merchantCode,payableCode,amount:String(Math.round(amount*100)),redirectUrl,transactionReference:txRef,customerId:user.id,currencyCode:currency==='NGN'?'566':currency,customerEmail:user.email})}); const p=await r.json(); if(!r.ok||!p.paymentUrl)throw new Error(p.message||'Interswitch checkout could not be created'); return Response.json({link:p.paymentUrl,txRef,provider},{headers:cors});
 }
 throw new Error('Unsupported payment provider.');
}catch(error){return new Response(JSON.stringify({error:error instanceof Error?error.message:'Payment error'}),{status:400,headers:{...cors,'Content-Type':'application/json'}})}});
