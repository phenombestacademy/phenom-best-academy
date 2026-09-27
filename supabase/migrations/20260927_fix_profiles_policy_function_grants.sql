-- Fix profile RLS policy evaluation for authenticated users.
-- public.profiles policies call is_super_admin(); authenticated must be allowed to execute it.
-- The function is SECURITY DEFINER and checks auth.uid() against the protected profile role.
grant execute on function public.is_super_admin() to authenticated;
revoke execute on function public.is_super_admin() from anon;
