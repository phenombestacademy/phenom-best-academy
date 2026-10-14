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

create or replace function public.school_cbt_publish_exam(p_exam uuid)
returns jsonb language plpgsql security definer set search_path=public
as $$
declare e public.school_cbt_exams%rowtype; uid uuid:=auth.uid(); qcount integer; assigned integer;
begin
 if uid is null then raise exception 'Authentication required'; end if;
 select * into e from public.school_cbt_exams where id=p_exam for update;
 if not found then raise exception 'Exam not found'; end if;
 if not (public.is_super_admin() or public.is_school_member(e.school_id,array['school_admin']) or e.teacher_id=uid) then raise exception 'Not authorised'; end if;
 if not public.school_has_cbt_access(e.school_id) and not public.is_super_admin() then raise exception 'School CBT subscription is not active or does not include CBT'; end if;
 if e.status not in ('draft','scheduled') then raise exception 'Only draft exams can be scheduled'; end if;
 if e.starts_at is null or e.ends_at is null or e.duration_minutes is null or e.duration_minutes<1 or e.ends_at<=e.starts_at then raise exception 'Set valid opening/closing times and duration'; end if;
 select count(*) into qcount from public.school_cbt_exam_questions where exam_id=p_exam;
 if qcount=0 then raise exception 'Add at least one question first'; end if;
 if exists(select 1 from public.school_cbt_exam_questions where exam_id=p_exam and (correct_answer is null or btrim(correct_answer)='')) then raise exception 'Every objective question requires an answer key'; end if;
 insert into public.school_cbt_exam_assignments(exam_id,school_id,student_id,assigned_by)
 select p_exam,e.school_id,cm.user_id,uid from public.class_members cm
 where cm.class_id=e.class_id and lower(cm.role)='student'
 on conflict do nothing;
 get diagnostics assigned=row_count;
 update public.school_cbt_exams set status='scheduled',question_count=qcount,updated_at=now() where id=p_exam;
 return jsonb_build_object('exam_id',p_exam,'question_count',qcount,'new_assignments',assigned,'status','scheduled');
end $$;

create or replace function public.school_cbt_start_attempt(p_exam uuid)
returns jsonb language plpgsql security definer set search_path=public
as $$
declare uid uuid:=auth.uid(); e public.school_cbt_exams%rowtype; a public.school_cbt_exam_assignments%rowtype; t public.school_cbt_exam_attempts%rowtype; n integer;
begin
 if uid is null then raise exception 'Authentication required'; end if;
 select * into e from public.school_cbt_exams where id=p_exam;
 if not found then raise exception 'Exam not found'; end if;
 if not public.school_has_cbt_access(e.school_id) then raise exception 'School CBT subscription is not active'; end if;
 if e.status not in ('scheduled','active') or e.starts_at>now() or e.ends_at<=now() then raise exception 'This exam is not currently open'; end if;
 select * into a from public.school_cbt_exam_assignments where exam_id=p_exam and student_id=uid and school_id=e.school_id;
 if not found then raise exception 'You are not assigned to this exam'; end if;
 select * into t from public.school_cbt_exam_attempts where exam_id=p_exam and student_id=uid and assignment_id=a.id order by attempt_no desc limit 1;
 if found then
  if t.status='in_progress' and t.started_at+make_interval(mins=>e.duration_minutes)>now() and e.ends_at>now() then
   return jsonb_build_object('attempt_id',t.id,'attempt_no',t.attempt_no,'started_at',t.started_at,'deadline',least(t.started_at+make_interval(mins=>e.duration_minutes),e.ends_at),'status',t.status);
  end if;
  if t.status='in_progress' then
   perform public.school_cbt_submit_attempt(t.id);
   if e.one_attempt or not e.allow_redo then
    select * into t from public.school_cbt_exam_attempts where id=t.id;
    return jsonb_build_object('attempt_id',t.id,'status','expired_submitted','score',t.score,'total_marks',t.total_marks,'correct_count',t.correct_count);
   end if;
  elsif e.one_attempt or not e.allow_redo then raise exception 'Your permitted attempt has already been used'; end if;
 end if;
 select coalesce(max(attempt_no),0)+1 into n from public.school_cbt_exam_attempts where exam_id=p_exam and student_id=uid;
 insert into public.school_cbt_exam_attempts(exam_id,assignment_id,school_id,student_id,attempt_no,answers,status)
 values(p_exam,a.id,e.school_id,uid,n,'{}'::jsonb,'in_progress') returning * into t;
 return jsonb_build_object('attempt_id',t.id,'attempt_no',t.attempt_no,'started_at',t.started_at,'deadline',least(t.started_at+make_interval(mins=>e.duration_minutes),e.ends_at),'status',t.status);
end $$;

create or replace function public.school_cbt_save_answers(p_attempt uuid,p_answers jsonb)
returns jsonb language plpgsql security definer set search_path=public
as $$
declare t public.school_cbt_exam_attempts%rowtype; e public.school_cbt_exams%rowtype; uid uuid:=auth.uid(); deadline timestamptz;
begin
 if uid is null then raise exception 'Authentication required'; end if;
 if jsonb_typeof(coalesce(p_answers,'{}'::jsonb))<>'object' then raise exception 'Answers must be an object'; end if;
 select * into t from public.school_cbt_exam_attempts where id=p_attempt and student_id=uid for update;
 if not found then raise exception 'Attempt not found'; end if;
 if t.status<>'in_progress' or t.submitted_at is not null then raise exception 'Attempt is closed'; end if;
 select * into e from public.school_cbt_exams where id=t.exam_id;
 deadline:=least(t.started_at+make_interval(mins=>e.duration_minutes),e.ends_at);
 if now()>=deadline then raise exception 'Time is up'; end if;
 if exists(select 1 from jsonb_each_text(p_answers) x where not exists(select 1 from public.school_cbt_exam_questions_student q where q.exam_id=e.id and q.id::text=x.key)) then raise exception 'Answer references a question outside this exam'; end if;
 update public.school_cbt_exam_attempts set answers=p_answers where id=p_attempt;
 return jsonb_build_object('saved',true,'deadline',deadline);
end $$;

create or replace function public.school_cbt_submit_attempt(p_attempt uuid)
returns jsonb language plpgsql security definer set search_path=public
as $$
declare t public.school_cbt_exam_attempts%rowtype; e public.school_cbt_exams%rowtype; q record; v_score numeric:=0; v_total numeric:=0; v_correct integer:=0; uid uuid:=auth.uid();
begin
 if uid is null then raise exception 'Authentication required'; end if;
 select * into t from public.school_cbt_exam_attempts where id=p_attempt and student_id=uid for update;
 if not found then raise exception 'Attempt not found'; end if;
 if t.status<>'in_progress' then return jsonb_build_object('attempt_id',t.id,'score',t.score,'total_marks',t.total_marks,'correct_count',t.correct_count,'status',t.status); end if;
 select * into e from public.school_cbt_exams where id=t.exam_id;
 for q in select id,correct_answer,marks from public.school_cbt_exam_questions where exam_id=e.id loop
  v_total:=v_total+coalesce(q.marks,0);
  if t.answers->>q.id::text is not null and upper(btrim(t.answers->>q.id::text))=upper(btrim(q.correct_answer)) then v_score:=v_score+coalesce(q.marks,0); v_correct:=v_correct+1; end if;
 end loop;
 update public.school_cbt_exam_attempts set score=v_score,total_marks=v_total,correct_count=v_correct,submitted_at=now(),status='submitted' where id=p_attempt;
 return jsonb_build_object('attempt_id',p_attempt,'score',v_score,'total_marks',v_total,'correct_count',v_correct,'status','submitted');
end $$;

create or replace function public.school_cbt_set_results_visible(p_exam uuid,p_visible boolean)
returns void language plpgsql security definer set search_path=public
as $$
declare sid uuid; uid uuid:=auth.uid();
begin
 select school_id into sid from public.school_cbt_exams where id=p_exam for update;
 if sid is null then raise exception 'Exam not found'; end if;
 if not (public.is_super_admin() or public.is_school_member(sid,array['school_admin']) or exists(select 1 from public.school_cbt_exams where id=p_exam and teacher_id=uid)) then raise exception 'Not authorised'; end if;
 if p_visible and not public.school_has_cbt_access(sid) and not public.is_super_admin() then raise exception 'School CBT entitlement is inactive'; end if;
 update public.school_cbt_exams set results_visible_to_students=p_visible,updated_at=now() where id=p_exam;
end $$;

revoke all on function public.school_has_cbt_access(uuid) from public,anon;
revoke all on function public.school_cbt_publish_exam(uuid) from public,anon;
revoke all on function public.school_cbt_start_attempt(uuid) from public,anon;
revoke all on function public.school_cbt_save_answers(uuid,jsonb) from public,anon;
revoke all on function public.school_cbt_submit_attempt(uuid) from public,anon;
revoke all on function public.school_cbt_set_results_visible(uuid,boolean) from public,anon;
grant execute on function public.school_has_cbt_access(uuid) to authenticated;
grant execute on function public.school_cbt_publish_exam(uuid) to authenticated;
grant execute on function public.school_cbt_start_attempt(uuid) to authenticated;
grant execute on function public.school_cbt_save_answers(uuid,jsonb) to authenticated;
grant execute on function public.school_cbt_submit_attempt(uuid) to authenticated;
grant execute on function public.school_cbt_set_results_visible(uuid,boolean) to authenticated;

commit;
