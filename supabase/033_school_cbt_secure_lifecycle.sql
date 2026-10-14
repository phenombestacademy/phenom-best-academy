-- Secure CBT foundation. Apply 034_school_cbt_essay_marking_and_result_confidentiality.sql in the same controlled rollout.
-- This migration installs entitlement and immutable-after-scheduling guards only.
-- Lifecycle RPCs are intentionally defined in migration 034 so no insecure interim RPCs are exposed.

-- Secure server-side CBT lifecycle built on existing LMS CBT tables.
-- This migration is intentionally committed to the feature branch first; validate against a staging database before production rollout.
begin;

create or replace function public.school_has_cbt_access(p_school uuid)
returns boolean language sql stable security definer set search_path=public
as $$
 select exists (
  select 1 from public.subscriptions s
  left join public.subscription_plans p on p.code=s.plan_code
  where s.school_id=p_school and s.status in ('active','trial','trialing')
    and (s.ends_at is null or s.ends_at>now())
    and (
      coalesce(p.features,'[]'::jsonb) ?| array['school_cbt','cbt','school_assessment_suite']
      or exists(select 1 from public.subscription_feature_grants g join public.subscription_features f on f.id=g.feature_id where g.subscription_id=s.id and f.code in ('school_cbt','cbt','school_assessment_suite'))
      or exists(select 1 from public.subscription_tool_entitlements e where e.enabled and e.service_code in ('school_cbt','cbt','school_assessment_suite') and s.plan_code like e.plan_code_pattern)
    )
 );
$$;

-- Lifecycle guards and RPCs are installed atomically by migration 034.
revoke all on function public.school_has_cbt_access(uuid) from public, anon;
grant execute on function public.school_has_cbt_access(uuid) to authenticated;

commit;
