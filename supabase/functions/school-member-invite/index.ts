import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  const authHeader=req.headers.get("Authorization"); if(!authHeader)return Response.json({error:"Authentication required"},{status:401});
  const supabaseUrl=Deno.env.get("SUPABASE_URL")!; const anonKey=Deno.env.get("SUPABASE_ANON_KEY")??Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!; const serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const userClient=createClient(supabaseUrl,anonKey,{global:{headers:{Authorization:authHeader}}}); const admin=createClient(supabaseUrl,serviceKey);
  const {data:{user},error:userError}=await userClient.auth.getUser(); if(userError||!user)return Response.json({error:"Invalid session"},{status:401});
  const body=await req.json(); const schoolId=String(body.school_id??""); const email=String(body.email??"").trim().toLowerCase(); const fullName=String(body.full_name??"").trim(); const requestedRole=String(body.requested_role??"");
  if(!schoolId||!email||!fullName||!["school_admin","teacher","student","parent"].includes(requestedRole))return Response.json({error:"school_id, full_name, email and a valid role are required"},{status:400});
  const {data:allowed}=await userClient.rpc("is_school_admin_for",{p_school:schoolId}); const {data:superAdmin}=await userClient.rpc("is_super_admin"); if(!allowed&&!superAdmin)return Response.json({error:"You are not authorised to manage this school."},{status:403});
  const {data:existingProfiles}=await admin.from("profiles").select("id,email").eq("email",email).limit(1); const existing=existingProfiles?.[0];
  if(existing?.id){const {error:memberError}=await admin.from("school_members").upsert({school_id:schoolId,user_id:existing.id,role:requestedRole,status:"active"},{onConflict:"school_id,user_id"}); if(memberError)return Response.json({error:memberError.message},{status:400}); await admin.from("profiles").update({full_name:fullName,onboarding_role:requestedRole}).eq("id",existing.id); await admin.from("school_member_invites").upsert({school_id:schoolId,email,full_name:fullName,requested_role:requestedRole,status:"accepted",invited_by:user.id,invited_user_id:existing.id,accepted_at:new Date().toISOString()},{onConflict:"school_id,email,requested_role"}); return Response.json({status:"linked",user_id:existing.id});}
  const {data:invite,error:inviteError}=await admin.auth.admin.inviteUserByEmail(email,{data:{full_name:fullName,account_category:"individual",onboarding_role:requestedRole},redirectTo:new URL(req.url).origin+"/account"});
  if(inviteError||!invite.user)return Response.json({error:inviteError?.message??"Invitation failed"},{status:400});
  const {error:memberError}=await admin.from("school_members").upsert({school_id:schoolId,user_id:invite.user.id,role:requestedRole,status:"invited"},{onConflict:"school_id,user_id"}); if(memberError)return Response.json({error:memberError.message},{status:400});
  await admin.from("school_member_invites").upsert({school_id:schoolId,email,full_name:fullName,requested_role:requestedRole,status:"sent",invited_by:user.id,invited_user_id:invite.user.id,sent_at:new Date().toISOString()},{onConflict:"school_id,email,requested_role"});
  return Response.json({status:"invited",user_id:invite.user.id});
});