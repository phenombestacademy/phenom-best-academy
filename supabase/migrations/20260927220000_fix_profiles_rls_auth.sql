-- Fix authenticated profile access for account creation, sign-in and recovery.
-- Keep profiles private to the signed-in user; privileged/admin operations should use dedicated server-side/RPC paths.

begin;

drop policy if exists "profiles self read" on public.profiles;
drop policy if exists "profiles self update" on public.profiles;
drop policy if exists "profiles insert self" on public.profiles;
drop policy if exists "profiles self insert" on public.profiles;

create policy "profiles self read"
on public.profiles
for select
to authenticated
using (id = auth.uid());

create policy "profiles self insert"
on public.profiles
for insert
to authenticated
with check (id = auth.uid());

create policy "profiles self update"
on public.profiles
for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

revoke all on public.profiles from anon;
grant select, insert, update on public.profiles to authenticated;

commit;
