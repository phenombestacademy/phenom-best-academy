-- Phenom Best LMS: activate invited members after account acceptance
create or replace function public.activate_school_membership_for_current_user() returns void language sql security definer set search_path=public as $$
 update public.school_members set status='active' where user_id=auth.uid() and status='invited';
 update public.school_member_invites set status='accepted', accepted_at=coalesce(accepted_at,now()), updated_at=now() where invited_user_id=auth.uid() and status in ('sent','pending');
$$;
revoke execute on function public.activate_school_membership_for_current_user() from public,anon;
grant execute on function public.activate_school_membership_for_current_user() to authenticated;