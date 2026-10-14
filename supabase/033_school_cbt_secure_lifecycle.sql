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

-- Prevent direct browser writes from bypassing the server-side publish lifecycle.
create or replace function public.school_cbt_guard_exam_status()
returns trigger language plpgsql set search_path=public as $$
begin
 if new.status is distinct from old.status and new.status in ('scheduled','active')
    and current_user not in ('postgres','supabase_admin') then
  raise exception 'Use the authorised CBT publish workflow to schedule an exam';
 end if;
 return new;
end $$;

drop trigger if exists school_cbt_guard_exam_status on public.school_cbt_exams;
create trigger school_cbt_guard_exam_status before update of status on public.school_cbt_exams
for each row execute function public.school_cbt_guard_exam_status();

create or replace function public.school_cbt_guard_question_changes()
returns trigger language plpgsql security definer set search_path=public as $$
declare exam_uuid uuid; exam_status text;
begin
 exam_uuid:=case when tg_op='DELETE' then old.exam_id else new.exam_id end;
 select status into exam_status from public.school_cbt_exams where id=exam_uuid;
 if exam_status is distinct from 'draft' then
  raise exception 'Questions are locked after an exam is scheduled';
 end if;
 if tg_op='DELETE' then return old; else return new; end if;
end $$;

drop trigger if exists school_cbt_question_draft_only on public.school_cbt_exam_questions;
create trigger school_cbt_question_draft_only before insert or update or delete on public.school_cbt_exam_questions
for each row execute function public.school_cbt_guard_question_changes();

revoke all on function public.school_has_cbt_access(uuid) from public, anon;
grant execute on function public.school_has_cbt_access(uuid) to authenticated;

-- Close direct browser access before enabling the lifecycle RPCs in migration 034.
revoke all on table public.school_cbt_exam_attempts from public, anon, authenticated;

commit;
