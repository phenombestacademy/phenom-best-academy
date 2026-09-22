-- 045: reconcile profile/account safety fields and platform persistence with the live schema.
-- Safe to apply after 044. Existing account records are normalised to the
-- supported adult/teen/child values before the check is enforced.

alter table public.profiles
  add column if not exists parent_email text;

alter table public.profiles
  alter column account_type set default 'adult';

update public.profiles
set account_type = 'adult'
where account_type is null
   or account_type not in ('adult','teen','child');

alter table public.profiles
  drop constraint if exists profiles_account_type_check;

alter table public.profiles
  add constraint profiles_account_type_check
  check (account_type in ('adult','teen','child'));

alter table public.service_enquiries
  add column if not exists preferred_contact text;


alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role = any (array['user','parent','staff','admin','super_admin']::text[]));
