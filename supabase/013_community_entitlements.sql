create table if not exists public.service_consents (id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, service_code text not null, policy_version text not null, consented_at timestamptz not null default now(), unique(user_id,service_code,policy_version));
alter table public.service_consents enable row level security;
drop policy if exists "consents own read" on public.service_consents; drop policy if exists "consents own insert" on public.service_consents;
create policy "consents own read" on public.service_consents for select using(user_id=auth.uid() or public.is_super_admin());
create policy "consents own insert" on public.service_consents for insert with check(user_id=auth.uid());
create table if not exists public.premium_service_grants (id uuid primary key default gen_random_uuid(), email text not null, user_id uuid references auth.users(id) on delete cascade, service_code text not null, granted_by uuid not null references auth.users(id) on delete restrict, enabled boolean not null default true, notes text, created_at timestamptz not null default now(), revoked_at timestamptz, unique(email,service_code));
alter table public.premium_service_grants enable row level security;
drop policy if exists "premium grants super admin" on public.premium_service_grants;
create policy "premium grants super admin" on public.premium_service_grants for all using(public.is_super_admin()) with check(public.is_super_admin());
create or replace function public.bind_premium_grants_to_profile() returns trigger language plpgsql security definer set search_path=public as $$ begin update public.premium_service_grants set user_id=new.id where lower(email)=lower(new.email) and (user_id is null or user_id=new.id); return new; end; $$;
drop trigger if exists trg_bind_premium_grants on public.profiles;
create trigger trg_bind_premium_grants after insert or update of email on public.profiles for each row execute function public.bind_premium_grants_to_profile();
create or replace function public.has_premium_access(p_service_code text, p_user_id uuid default auth.uid()) returns boolean language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.profiles p where p.id=p_user_id and p.role='super_admin') or exists(select 1 from public.premium_service_grants g left join public.profiles p on p.id=p_user_id where g.enabled and g.revoked_at is null and g.service_code=p_service_code and (g.user_id=p_user_id or (p.email is not null and lower(g.email)=lower(p.email)))) or exists(select 1 from public.subscriptions s join public.subscription_feature_grants fg on fg.subscription_id=s.id and fg.enabled join public.subscription_features f on f.id=fg.feature_id and f.code=p_service_code where s.user_id=p_user_id and s.status in ('active','trialing','paid') and (s.ends_at is null or s.ends_at>now()));
$$;
revoke all on function public.has_premium_access(text,uuid) from public; grant execute on function public.has_premium_access(text,uuid) to authenticated;
create index if not exists premium_service_grants_email_idx on public.premium_service_grants(lower(email));
create index if not exists premium_service_grants_user_idx on public.premium_service_grants(user_id);

create or replace function public.create_friend_conversation() returns trigger language plpgsql security definer set search_path=public as $$
declare c uuid;
begin
  if new.status='accepted' and (tg_op='INSERT' or old.status is distinct from 'accepted') then
    select c0.id into c from public.conversations c0 join public.conversation_members m1 on m1.conversation_id=c0.id and m1.user_id=new.requester_id join public.conversation_members m2 on m2.conversation_id=c0.id and m2.user_id=new.recipient_id where c0.kind='direct' limit 1;
    if c is null then
      insert into public.conversations(kind,created_by) values('direct',new.requester_id) returning id into c;
      insert into public.conversation_members(conversation_id,user_id) values(c,new.requester_id),(c,new.recipient_id) on conflict do nothing;
    end if;
  end if;
  return new;
end; $$;
drop trigger if exists trg_friend_conversation on public.friend_requests;
create trigger trg_friend_conversation after insert or update of status on public.friend_requests for each row execute function public.create_friend_conversation();
