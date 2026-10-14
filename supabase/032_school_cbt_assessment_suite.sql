-- Additive school CBT module inside the existing Phenom Best LMS.
create extension if not exists pgcrypto;
create table if not exists public.school_assessments (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade,
 class_id uuid not null references public.school_classes(id) on delete restrict,
 subject_id uuid not null references public.school_subjects(id) on delete restrict,
 teacher_id uuid not null references auth.users(id) on delete restrict,
 title text not null check(length(trim(title)) between 2 and 180),
 assessment_type text not null default 'cbt' check(assessment_type in ('practice','test','exam','cbt')),
 academic_session text not null, term_no smallint not null default 1 check(term_no between 1 and 4),
 starts_at timestamptz, ends_at timestamptz, duration_minutes integer not null default 30 check(duration_minutes between 1 and 600),
 max_score numeric(8,2) not null default 100 check(max_score>0),
 status text not null default 'draft' check(status in ('draft','scheduled','open','closed','marked','approved','published','archived')),
 contributes_to_report boolean not null default false, allow_review boolean not null default true,
 attempt_limit smallint not null default 1 check(attempt_limit between 1 and 20), instructions text not null default '',
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
 check(ends_at is null or starts_at is null or ends_at>starts_at), unique(id,school_id)
);
create index if not exists school_assessments_scope_idx on public.school_assessments(school_id,class_id,academic_session,term_no);
create table if not exists public.school_assessment_questions (
 id uuid primary key default gen_random_uuid(), assessment_id uuid not null references public.school_assessments(id) on delete cascade,
 position integer not null check(position>0),
 question_type text not null default 'single_choice' check(question_type in ('single_choice','multiple_choice','true_false','short_answer','essay')),
 prompt text not null check(length(trim(prompt))>0), options jsonb not null default '[]'::jsonb, answer_key jsonb,
 points numeric(8,2) not null default 1 check(points>0), topic text, learning_objective text, explanation text not null default '',
 created_at timestamptz not null default now(), unique(assessment_id,position), check(jsonb_typeof(options)='array')
);
create table if not exists public.school_assessment_attempts (
 id uuid primary key default gen_random_uuid(), assessment_id uuid not null references public.school_assessments(id) on delete restrict,
 school_id uuid not null references public.schools(id) on delete cascade, student_id uuid not null references auth.users(id) on delete restrict,
 attempt_number smallint not null default 1 check(attempt_number>0),
 status text not null default 'in_progress' check(status in ('in_progress','submitted','marked','pending_manual_mark','absent','excused','void')),
 started_at timestamptz not null default now(), submitted_at timestamptz, auto_score numeric(8,2), manual_score numeric(8,2),
 final_score numeric(8,2), maximum_score numeric(8,2), feedback text not null default '',
 marked_by uuid references auth.users(id) on delete set null, marked_at timestamptz,
 approved_by uuid references auth.users(id) on delete set null, approved_at timestamptz,
 unique(assessment_id,student_id,attempt_number)
);
create table if not exists public.school_assessment_responses (
 id uuid primary key default gen_random_uuid(), attempt_id uuid not null references public.school_assessment_attempts(id) on delete cascade,
 question_id uuid not null references public.school_assessment_questions(id) on delete restrict, response jsonb,
 is_correct boolean, awarded_points numeric(8,2), marker_feedback text not null default '',
 marked_by uuid references auth.users(id) on delete set null, marked_at timestamptz, unique(attempt_id,question_id)
);
create table if not exists public.school_assessment_audit (
 id bigint generated always as identity primary key, school_id uuid not null references public.schools(id) on delete cascade,
 assessment_id uuid references public.school_assessments(id) on delete set null, attempt_id uuid references public.school_assessment_attempts(id) on delete set null,
 actor_id uuid references auth.users(id) on delete set null, action text not null, reason text not null default '',
 before_state jsonb, after_state jsonb, created_at timestamptz not null default now()
);
create table if not exists public.school_assessment_grading_bands (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade,
 grade_code text not null, minimum_percent numeric(5,2) not null check(minimum_percent between 0 and 100),
 maximum_percent numeric(5,2) not null check(maximum_percent between 0 and 100), remark text not null default '',
 position integer not null default 1, active boolean not null default true, unique(school_id,grade_code),
 check(minimum_percent<=maximum_percent)
);
create table if not exists public.school_assessment_report_rules (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade,
 component_code text not null, component_label text not null, maximum_marks numeric(8,2) not null default 20 check(maximum_marks>0),
 weight_percent numeric(5,2) not null default 0 check(weight_percent between 0 and 100), required boolean not null default false,
 enabled boolean not null default true, contributes_to_general_sheet boolean not null default true,
 contributes_to_official_report boolean not null default true, position integer not null default 1, unique(school_id,component_code)
);
alter table public.school_assessments enable row level security;
alter table public.school_assessment_questions enable row level security;
alter table public.school_assessment_attempts enable row level security;
alter table public.school_assessment_responses enable row level security;
alter table public.school_assessment_audit enable row level security;
alter table public.school_assessment_grading_bands enable row level security;
alter table public.school_assessment_report_rules enable row level security;
create policy school_assessments_read on public.school_assessments for select to authenticated
using(public.is_super_admin() or public.is_school_member(school_id) or teacher_id=auth.uid());
create policy school_assessments_insert on public.school_assessments for insert to authenticated
with check(public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or
 (teacher_id=auth.uid() and public.is_teacher_for_subject_in_school(school_id,(select s.name from public.school_subjects s where s.id=subject_id))));
create policy school_assessments_update on public.school_assessments for update to authenticated
using(public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or (teacher_id=auth.uid() and status in ('draft','scheduled')))
with check(public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or teacher_id=auth.uid());
create policy school_assessment_questions_staff on public.school_assessment_questions for all to authenticated
using(exists(select 1 from public.school_assessments a where a.id=assessment_id and (public.is_super_admin() or public.is_school_member(a.school_id,array['school_admin']) or a.teacher_id=auth.uid())))
with check(exists(select 1 from public.school_assessments a where a.id=assessment_id and (public.is_super_admin() or public.is_school_member(a.school_id,array['school_admin']) or a.teacher_id=auth.uid())));
create policy school_assessment_attempts_read on public.school_assessment_attempts for select to authenticated
using(student_id=auth.uid() or public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or exists(select 1 from public.school_assessments a where a.id=assessment_id and a.teacher_id=auth.uid()));
create policy school_assessment_attempts_insert on public.school_assessment_attempts for insert to authenticated
with check(student_id=auth.uid() and exists(select 1 from public.school_assessments a join public.class_members cm on cm.class_id=a.class_id and cm.user_id=auth.uid() and cm.role='student' where a.id=assessment_id and a.school_id=school_id and a.status='open'));
create policy school_assessment_responses_read on public.school_assessment_responses for select to authenticated
using(exists(select 1 from public.school_assessment_attempts t where t.id=attempt_id and (t.student_id=auth.uid() or public.is_super_admin() or public.is_school_member(t.school_id,array['school_admin']) or exists(select 1 from public.school_assessments a where a.id=t.assessment_id and a.teacher_id=auth.uid()))));
create policy school_assessment_audit_read on public.school_assessment_audit for select to authenticated using(public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy school_assessment_grades_read on public.school_assessment_grading_bands for select to authenticated using(public.is_super_admin() or public.is_school_member(school_id));
create policy school_assessment_grades_manage on public.school_assessment_grading_bands for all to authenticated using(public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check(public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy school_assessment_rules_read on public.school_assessment_report_rules for select to authenticated using(public.is_super_admin() or public.is_school_member(school_id));
create policy school_assessment_rules_manage on public.school_assessment_report_rules for all to authenticated using(public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check(public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
-- Scoring runs in PostgreSQL. Students cannot directly write response rows or read answer keys.
create or replace function public.submit_school_assessment(p_attempt_id uuid,p_responses jsonb)
returns jsonb language plpgsql security definer set search_path=public as $$
declare t public.school_assessment_attempts%rowtype; a public.school_assessments%rowtype; q record;
 item jsonb; ans jsonb; resp jsonb; correct boolean; awarded numeric(8,2); score numeric(8,2):=0; max_score numeric(8,2):=0; manual boolean:=false;
begin
 if auth.uid() is null then raise exception 'Authentication required'; end if;
 select * into t from public.school_assessment_attempts where id=p_attempt_id for update;
 if not found or t.student_id<>auth.uid() then raise exception 'Attempt not found or not authorised'; end if;
 if t.status<>'in_progress' then raise exception 'Attempt already submitted'; end if;
 select * into a from public.school_assessments where id=t.assessment_id;
 if a.status<>'open' or (a.starts_at is not null and a.starts_at>now()) or (a.ends_at is not null and a.ends_at<=now()) then raise exception 'Assessment is not open'; end if;
 if jsonb_typeof(p_responses)<>'array' then raise exception 'Responses must be an array'; end if;
 for q in select * from public.school_assessment_questions where assessment_id=a.id order by position loop
   max_score:=max_score+q.points; item:=null;
   select value into item from jsonb_array_elements(p_responses) where value->>'questionId'=q.id::text limit 1;
   resp:=case when item is null then 'null'::jsonb else item->'response' end; correct:=null; awarded:=0;
   if q.question_type in ('single_choice','multiple_choice','true_false') then
     correct:=resp is not null and q.answer_key is not null and resp=q.answer_key;
     if coalesce(correct,false) then awarded:=q.points; score:=score+awarded; end if;
   else manual:=true; end if;
   insert into public.school_assessment_responses(attempt_id,question_id,response,is_correct,awarded_points)
   values(t.id,q.id,resp,correct,awarded) on conflict(attempt_id,question_id) do update set response=excluded.response,is_correct=excluded.is_correct,awarded_points=excluded.awarded_points;
 end loop;
 update public.school_assessment_attempts set status=case when manual then 'pending_manual_mark' else 'submitted' end,
 submitted_at=now(),auto_score=score,final_score=case when manual then null else score end,maximum_score=max_score where id=t.id;
 insert into public.school_assessment_audit(school_id,assessment_id,attempt_id,actor_id,action,after_state)
 values(t.school_id,t.assessment_id,t.id,auth.uid(),'attempt_submitted',jsonb_build_object('auto_score',score,'maximum_score',max_score,'manual_mark_required',manual));
 return jsonb_build_object('attemptId',t.id,'status',case when manual then 'pending_manual_mark' else 'submitted' end,'autoScore',score,'maximumScore',max_score,'manualMarkRequired',manual);
end; $$;
revoke all on function public.submit_school_assessment(uuid,jsonb) from public,anon;
grant execute on function public.submit_school_assessment(uuid,jsonb) to authenticated;
-- CA1/CA2/Exam are defaults only; school admins may change them.
insert into public.school_assessment_report_rules(school_id,component_code,component_label,maximum_marks,weight_percent,required,position)
select s.id,x.code,x.label,x.marks,x.weight,x.required,x.pos from public.schools s
cross join (values ('ca1','CA1',20::numeric,20::numeric,false,1),('ca2','CA2',20::numeric,20::numeric,false,2),('exam','Examination',60::numeric,60::numeric,true,3)) x(code,label,marks,weight,required,pos)
on conflict(school_id,component_code) do nothing;
comment on table public.school_assessments is 'CBT capability inside existing Phenom Best LMS, scoped to an existing school tenant.';
