-- V5.6 Tool Hub entitlements.
-- Keeps Tools Premium and CPD separate while allowing a CPD programme
-- to unlock only the particular Tool capability it requires.

insert into public.subscription_features (code, name, description)
values
  ('tools_premium', 'Phenom Tools Premium', 'Expanded Phenom Calculator and Tool Hub capabilities.'),
  ('tools_speech_premium', 'Phenom Tools Speech Premium', 'Premium speech capability used by eligible Tool and CPD language workflows.')
on conflict (code) do update
set name = excluded.name,
    description = excluded.description;

create table if not exists public.subscription_tool_entitlements (
  id uuid primary key default gen_random_uuid(),
  plan_code_pattern text not null,
  service_code text not null references public.subscription_features(code) on delete cascade,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  unique (plan_code_pattern, service_code)
);

alter table public.subscription_tool_entitlements enable row level security;

drop policy if exists "tool entitlements super admin" on public.subscription_tool_entitlements;
create policy "tool entitlements super admin"
on public.subscription_tool_entitlements
for all
to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

-- Language CPD plans can use device/advanced speech where the programme requires it.
-- This does not grant the whole Tool Premium catalogue.
insert into public.subscription_tool_entitlements (plan_code_pattern, service_code)
values
  ('igbo-%', 'tools_speech_premium'),
  ('lang-igbo-%', 'tools_speech_premium'),
  ('lang-%', 'tools_speech_premium')
on conflict (plan_code_pattern, service_code) do nothing;

create or replace function public.has_premium_access(
  p_service_code text,
  p_user_id uuid default auth.uid()
)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    exists (
      select 1
      from public.profiles p
      where p.id = p_user_id
        and p.role = 'super_admin'
    )
    or exists (
      select 1
      from public.premium_service_grants g
      left join public.profiles p on p.id = p_user_id
      where g.enabled
        and g.revoked_at is null
        and g.service_code = p_service_code
        and (
          g.user_id = p_user_id
          or (
            p.email is not null
            and lower(g.email) = lower(p.email)
          )
        )
    )
    or exists (
      select 1
      from public.subscriptions s
      join public.subscription_feature_grants fg
        on fg.subscription_id = s.id
      join public.subscription_features f
        on f.id = fg.feature_id
       and f.code = p_service_code
      where s.user_id = p_user_id
        and s.status in ('active', 'trialing', 'paid')
        and (s.ends_at is null or s.ends_at > now())
    )
    or exists (
      select 1
      from public.subscriptions s
      join public.subscription_tool_entitlements te
        on te.enabled
       and te.service_code = p_service_code
       and s.plan_code like te.plan_code_pattern
      where s.user_id = p_user_id
        and s.status in ('active', 'trialing', 'paid')
        and (s.ends_at is null or s.ends_at > now())
    );
$$;

revoke all on function public.has_premium_access(text, uuid) from public;
grant execute on function public.has_premium_access(text, uuid) to authenticated;

create index if not exists subscription_tool_entitlements_service_idx
  on public.subscription_tool_entitlements(service_code);

create index if not exists subscription_tool_entitlements_pattern_idx
  on public.subscription_tool_entitlements(plan_code_pattern);
