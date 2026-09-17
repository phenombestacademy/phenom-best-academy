alter table public.profiles add column if not exists avatar_url text;
alter table public.profiles add column if not exists passport_url text;
drop function if exists public.get_classmates(uuid);
create function public.get_classmates(p_class uuid)
returns table(user_id uuid, full_name text, email text, avatar_url text, passport_url text)
language sql stable security definer set search_path=public as $$
 select p.id,p.full_name,p.email,p.avatar_url,p.passport_url from public.profiles p
 join public.class_members cm on cm.user_id=p.id
 where cm.class_id=p_class and exists(select 1 from public.class_members mine where mine.class_id=p_class and mine.user_id=auth.uid());
$$;
revoke all on function public.get_classmates(uuid) from public; grant execute on function public.get_classmates(uuid) to authenticated;
