-- ============================================================
-- Phenom Best Academy — school assessment, results & organisation upgrade
-- Run AFTER supabase-schema-platform.sql
-- ============================================================

-- School branding and structure
alter table public.schools
  add column if not exists category text not null default 'school',
  add column if not exists logo_alt_text text,
  add column if not exists accent_color text,
  add column if not exists secondary_color text,
  add column if not exists report_card_title text,
  add column if not exists active_session text;

-- School-wide configurable assessment/result components.
create table if not exists public.school_result_components (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  code text not null,
  component_type text not null check (component_type in ('ca','test','midterm','exam','custom')),
  max_score numeric(8,2) not null default 100 check (max_score > 0),
  weight numeric(8,2) not null default 0 check (weight >= 0),
  sequence_no integer not null default 1,
  term_no integer not null default 1 check (term_no between 1 and 3),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (school_id, code, term_no)
);

create table if not exists public.school_academic_sessions (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  starts_on date,
  ends_on date,
  active boolean not null default false,
  created_at timestamptz not null default now(),
  unique (school_id, name)
);

create table if not exists public.school_terms (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.school_academic_sessions(id) on delete cascade,
  term_no integer not null check (term_no between 1 and 3),
  name text not null,
  starts_on date,
  ends_on date,
  entry_open boolean not null default true,
  results_published boolean not null default false,
  created_at timestamptz not null default now(),
  unique (session_id, term_no)
);

create table if not exists public.school_subjects (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  name text not null,
  code text,
  active boolean not null default true,
  sequence_no integer not null default 1,
  created_at timestamptz not null default now(),
  unique (school_id, name)
);

create table if not exists public.class_subjects (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references public.school_classes(id) on delete cascade,
  subject_id uuid not null references public.school_subjects(id) on delete cascade,
  teacher_id uuid references auth.users(id) on delete set null,
  active boolean not null default true,
  unique (class_id, subject_id)
);

create table if not exists public.student_school_records (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  admission_number text,
  gender text,
  date_of_birth date,
  parent_full_name text,
  parent_phone text,
  parent_email text,
  address text,
  status text not null default 'active' check (status in ('active','inactive','graduated','withdrawn')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (school_id, student_id),
  unique (school_id, admission_number)
);

-- Configurable result entries. One row is one student's score for one subject/component/term.
create table if not exists public.student_result_entries (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  session_id uuid not null references public.school_academic_sessions(id) on delete cascade,
  term_no integer not null check (term_no between 1 and 3),
  class_id uuid not null references public.school_classes(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references public.school_subjects(id) on delete cascade,
  component_id uuid not null references public.school_result_components(id) on delete cascade,
  score numeric(8,2) not null default 0 check (score >= 0),
  teacher_comment text,
  entered_by uuid references auth.users(id) on delete set null,
  entered_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  locked boolean not null default false,
  unique (session_id, term_no, class_id, student_id, subject_id, component_id)
);

-- Optional generated/derived subject and class summaries. These are snapshots, not the source of truth.
create table if not exists public.student_term_summaries (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  session_id uuid not null references public.school_academic_sessions(id) on delete cascade,
  term_no integer not null check (term_no between 1 and 3),
  class_id uuid not null references public.school_classes(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references public.school_subjects(id) on delete cascade,
  ca_total numeric(8,2),
  test_total numeric(8,2),
  midterm_total numeric(8,2),
  exam_total numeric(8,2),
  term_total numeric(8,2),
  term_percentage numeric(8,2),
  first_term_brought_forward numeric(8,2),
  cumulative_percentage numeric(8,2),
  class_average numeric(8,2),
  performance_note text,
  generated_at timestamptz not null default now(),
  unique (session_id, term_no, class_id, student_id, subject_id)
);

-- Teacher-authored questions/exams, alongside Academy-generated question sets.
create table if not exists public.teacher_question_banks (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  teacher_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  subject text not null,
  topic text not null,
  level_label text,
  language text not null default 'English',
  instructions text,
  status text not null default 'draft' check (status in ('draft','published','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.teacher_question_items (
  id uuid primary key default gen_random_uuid(),
  bank_id uuid not null references public.teacher_question_banks(id) on delete cascade,
  position integer not null,
  question_text text not null,
  options jsonb,
  correct_answer text,
  explanation text,
  image_url text,
  marks numeric(8,2) not null default 1 check (marks > 0),
  unique (bank_id, position)
);

-- School CBT exams can be authored by teachers or built from generated questions.
create table if not exists public.school_cbt_exams (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  class_id uuid not null references public.school_classes(id) on delete cascade,
  teacher_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  subject text not null,
  topic text,
  question_count integer not null default 10 check (question_count between 1 and 200),
  duration_minutes integer,
  starts_at timestamptz,
  ends_at timestamptz,
  one_attempt boolean not null default true,
  allow_redo boolean not null default true,
  results_visible_to_students boolean not null default false,
  status text not null default 'draft' check (status in ('draft','scheduled','open','closed','archived')),
  created_at timestamptz not null default now()
);

create table if not exists public.school_cbt_exam_questions (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.school_cbt_exams(id) on delete cascade,
  position integer not null,
  question_text text not null,
  options jsonb,
  correct_answer text,
  explanation text,
  image_url text,
  marks numeric(8,2) not null default 1 check (marks > 0),
  unique (exam_id, position)
);

create table if not exists public.school_cbt_attempts (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.school_cbt_exams(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  attempt_no integer not null,
  answers jsonb not null default '{}'::jsonb,
  score numeric(8,2),
  correct_count integer,
  feedback jsonb not null default '{}'::jsonb,
  started_at timestamptz,
  submitted_at timestamptz,
  unique (exam_id, student_id, attempt_no)
);

-- Premium download/screenshot entitlement is tied to an active subscription/feature.
create table if not exists public.subscription_features (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.subscription_feature_grants (
  id uuid primary key default gen_random_uuid(),
  subscription_id uuid not null references public.subscriptions(id) on delete cascade,
  feature_id uuid not null references public.subscription_features(id) on delete cascade,
  enabled boolean not null default true,
  unique (subscription_id, feature_id)
);

insert into public.subscription_features(code,name,description) values
('premium_screenshot','Premium screenshots','Allow screenshots of branded learning work where device/platform controls permit.'),
('premium_pdf_download','Premium PDF download','Allow authorised learning work/results to be downloaded as PDF.'),
('school_results_export','School result export','Allow authorised school users to export/print result sheets and report cards.')
on conflict (code) do nothing;

-- General organisations so companies, NGOs, churches and other groups can have a controlled space.
create table if not exists public.organisations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  organisation_type text not null default 'organisation',
  logo_url text,
  primary_color text,
  country text,
  currency text,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.organisation_members (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid not null references public.organisations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member' check (role in ('owner','admin','staff','member','learner')),
  status text not null default 'active' check (status in ('active','invited','suspended')),
  created_at timestamptz not null default now(),
  unique (organisation_id,user_id)
);

-- Enforce that result entry users belong to the same school/class and that teacher entry is limited to assigned class subjects.
create or replace function public.can_manage_result_entry(
  p_school uuid,
  p_class uuid,
  p_subject uuid,
  p_student uuid
) returns boolean
language sql stable security definer set search_path=public as $$
  select public.is_staff()
  or public.is_admin()
  or public.is_school_member(p_school, array['school_admin'])
  or exists (
    select 1
    from public.class_subjects cs
    join public.class_members cm on cm.class_id=cs.class_id and cm.user_id=auth.uid() and cm.role='teacher'
    where cs.class_id=p_class and cs.subject_id=p_subject and cs.teacher_id=auth.uid()
      and exists (select 1 from public.class_members s where s.class_id=p_class and s.user_id=p_student and s.role='student')
  );
$$;

create or replace function public.can_view_result_entry(
  p_school uuid,
  p_class uuid,
  p_student uuid
) returns boolean
language sql stable security definer set search_path=public as $$
  select p_student=auth.uid()
  or public.is_school_member(p_school, array['school_admin'])
  or public.is_staff()
  or public.is_admin()
  or exists (
    select 1 from public.class_members cm
    where cm.class_id=p_class and cm.user_id=auth.uid() and cm.role='teacher'
      and exists (select 1 from public.class_members s where s.class_id=p_class and s.user_id=p_student and s.role='student')
  );
$$;

-- Self-directed learning privacy boundary: Academy staff do NOT automatically see individual results
-- for work a learner chose independently. Teacher/school-assigned work remains visible to its authorised school.
alter table public.learning_quizzes add column if not exists learning_mode text not null default 'teacher_assigned'
  check (learning_mode in ('self_directed','teacher_assigned','school_exam','academy_assigned'));
alter table public.quiz_assignments add column if not exists assignment_mode text not null default 'teacher_assigned'
  check (assignment_mode in ('self_directed','teacher_assigned','school_exam','academy_assigned'));

create or replace function public.can_view_quiz_attempt(p_quiz uuid, p_student uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select p_student=auth.uid()
  or public.is_school_member((select school_id from public.learning_quizzes where id=p_quiz), array['school_admin'])
  or public.is_admin() and (select learning_mode from public.learning_quizzes where id=p_quiz) <> 'self_directed'
  or public.is_staff() and (select learning_mode from public.learning_quizzes where id=p_quiz) <> 'self_directed'
  or exists (
    select 1 from public.quiz_assignments qa
    where qa.quiz_id=p_quiz and qa.teacher_id=auth.uid()
      and qa.assignment_mode <> 'self_directed'
      and (qa.student_id=p_student or exists(select 1 from public.class_members cm where cm.class_id=qa.class_id and cm.user_id=p_student and cm.role='student'))
  );
$$;

-- Replace the broad quiz-attempt policy with the privacy-aware rule.
drop policy if exists "quiz attempts read authorised" on public.quiz_attempts;
create policy "quiz attempts read privacy aware" on public.quiz_attempts for select to authenticated
using (public.can_view_quiz_attempt(quiz_id, student_id));

-- Result RLS
alter table public.school_result_components enable row level security;
alter table public.school_academic_sessions enable row level security;
alter table public.school_terms enable row level security;
alter table public.school_subjects enable row level security;
alter table public.class_subjects enable row level security;
alter table public.student_school_records enable row level security;
alter table public.student_result_entries enable row level security;
alter table public.student_term_summaries enable row level security;
alter table public.teacher_question_banks enable row level security;
alter table public.teacher_question_items enable row level security;
alter table public.school_cbt_exams enable row level security;
alter table public.school_cbt_exam_questions enable row level security;
alter table public.school_cbt_attempts enable row level security;
alter table public.subscription_features enable row level security;
alter table public.subscription_feature_grants enable row level security;
alter table public.organisations enable row level security;
alter table public.organisation_members enable row level security;

create policy "result components authorised" on public.school_result_components for all to authenticated
using (public.is_school_member(school_id) or public.is_staff() or public.is_admin())
with check (public.is_school_member(school_id) or public.is_staff() or public.is_admin());
create policy "sessions authorised" on public.school_academic_sessions for all to authenticated
using (public.is_school_member(school_id) or public.is_staff() or public.is_admin())
with check (public.is_school_member(school_id) or public.is_staff() or public.is_admin());
create policy "terms authorised" on public.school_terms for all to authenticated
using (exists(select 1 from public.school_academic_sessions s where s.id=session_id and (public.is_school_member(s.school_id) or public.is_staff() or public.is_admin())))
with check (exists(select 1 from public.school_academic_sessions s where s.id=session_id and (public.is_school_member(s.school_id) or public.is_staff() or public.is_admin())));
create policy "subjects authorised" on public.school_subjects for all to authenticated
using (public.is_school_member(school_id) or public.is_staff() or public.is_admin())
with check (public.is_school_member(school_id) or public.is_staff() or public.is_admin());
create policy "class subjects authorised" on public.class_subjects for all to authenticated
using (exists(select 1 from public.school_classes c where c.id=class_id and (public.is_school_member(c.school_id) or public.is_staff() or public.is_admin())))
with check (exists(select 1 from public.school_classes c where c.id=class_id and (public.is_school_member(c.school_id) or public.is_staff() or public.is_admin())));
create policy "student records authorised" on public.student_school_records for all to authenticated
using (student_id=auth.uid() or public.is_school_member(school_id) or public.is_staff() or public.is_admin())
with check (public.is_school_member(school_id) or public.is_staff() or public.is_admin());
create policy "result entries view authorised" on public.student_result_entries for select to authenticated
using (public.can_view_result_entry(school_id,class_id,student_id));
create policy "result entries manage authorised" on public.student_result_entries for insert to authenticated
with check (public.can_manage_result_entry(school_id,class_id,subject_id,student_id));
create policy "result entries update authorised" on public.student_result_entries for update to authenticated
using (public.can_manage_result_entry(school_id,class_id,subject_id,student_id))
with check (public.can_manage_result_entry(school_id,class_id,subject_id,student_id));
create policy "result summaries authorised" on public.student_term_summaries for select to authenticated
using (public.can_view_result_entry(school_id,class_id,student_id));
create policy "result summaries manage" on public.student_term_summaries for all to authenticated
using (public.is_school_member(school_id) or public.is_staff() or public.is_admin())
with check (public.is_school_member(school_id) or public.is_staff() or public.is_admin());

create policy "question banks authorised" on public.teacher_question_banks for all to authenticated
using (teacher_id=auth.uid() or public.is_school_member(school_id,array['school_admin']) or public.is_staff() or public.is_admin())
with check (teacher_id=auth.uid() or public.is_school_member(school_id,array['school_admin']) or public.is_staff() or public.is_admin());
create policy "question items authorised" on public.teacher_question_items for all to authenticated
using (exists(select 1 from public.teacher_question_banks b where b.id=bank_id and (b.teacher_id=auth.uid() or public.is_school_member(b.school_id,array['school_admin']) or public.is_staff() or public.is_admin())))
with check (exists(select 1 from public.teacher_question_banks b where b.id=bank_id and (b.teacher_id=auth.uid() or public.is_school_member(b.school_id,array['school_admin']) or public.is_staff() or public.is_admin())));

create policy "cbt exams authorised" on public.school_cbt_exams for all to authenticated
using (teacher_id=auth.uid() or public.is_school_member(school_id,array['school_admin']) or public.is_staff() or public.is_admin())
with check (teacher_id=auth.uid() or public.is_school_member(school_id,array['school_admin']) or public.is_staff() or public.is_admin());
create policy "cbt questions authorised" on public.school_cbt_exam_questions for select to authenticated
using (exists(select 1 from public.school_cbt_exams e where e.id=exam_id and (e.teacher_id=auth.uid() or public.is_school_member(e.school_id,array['school_admin']) or public.is_staff() or public.is_admin())));
create policy "cbt attempts student teacher school" on public.school_cbt_attempts for select to authenticated
using (student_id=auth.uid() or exists(select 1 from public.school_cbt_exams e where e.id=exam_id and (e.teacher_id=auth.uid() or public.is_school_member(e.school_id,array['school_admin']) or public.is_staff() or public.is_admin())));

create policy "subscription features public read" on public.subscription_features for select to authenticated using (true);
create policy "subscription feature grants own or staff" on public.subscription_feature_grants for select to authenticated
using (exists(select 1 from public.subscriptions s where s.id=subscription_id and (s.user_id=auth.uid() or public.is_staff())));

create policy "organisations members read" on public.organisations for select to authenticated
using (exists(select 1 from public.organisation_members m where m.organisation_id=id and m.user_id=auth.uid()) or public.is_staff() or public.is_admin());
create policy "organisation members own" on public.organisation_members for select to authenticated
using (user_id=auth.uid() or exists(select 1 from public.organisation_members m where m.organisation_id=organisation_id and m.user_id=auth.uid() and m.role in ('owner','admin')) or public.is_staff() or public.is_admin());

create index if not exists result_entries_school_class_idx on public.student_result_entries(school_id,class_id);
create index if not exists result_entries_student_idx on public.student_result_entries(student_id);
create index if not exists student_records_school_idx on public.student_school_records(school_id);
create index if not exists class_subjects_teacher_idx on public.class_subjects(teacher_id);
create index if not exists cbt_attempts_student_idx on public.school_cbt_attempts(student_id);

-- Result aggregation helper. This respects the school's configurable component max scores.
create or replace function public.calculate_student_subject_term(
  p_session uuid,
  p_term integer,
  p_class uuid,
  p_student uuid,
  p_subject uuid
) returns table(
  ca_total numeric,
  test_total numeric,
  midterm_total numeric,
  exam_total numeric,
  term_total numeric,
  term_percentage numeric
) language sql stable security definer set search_path=public as $$
  with x as (
    select c.component_type, sum(e.score) score, sum(c.max_score) max_score
    from public.student_result_entries e
    join public.school_result_components c on c.id=e.component_id
    where e.session_id=p_session and e.term_no=p_term and e.class_id=p_class
      and e.student_id=p_student and e.subject_id=p_subject and c.active
    group by c.component_type
  ), t as (
    select
      coalesce((select score from x where component_type='ca'),0) as ca,
      coalesce((select score from x where component_type='test'),0) as test,
      coalesce((select score from x where component_type='midterm'),0) as midterm,
      coalesce((select score from x where component_type='exam'),0) as exam,
      coalesce((select sum(score) from x),0) as total,
      coalesce((select sum(max_score) from x),0) as max_total
  )
  select ca,test,midterm,exam,total,case when max_total=0 then 0 else round((total/max_total)*100,2) end
  from t;
$$;

revoke all on function public.calculate_student_subject_term(uuid,integer,uuid,uuid,uuid) from public;
grant execute on function public.calculate_student_subject_term(uuid,integer,uuid,uuid,uuid) to authenticated;

-- Branded learning metadata: every generated/authored question set can carry Academy branding.
alter table public.learning_quizzes add column if not exists brand_name text not null default 'Phenom Best Academy';
alter table public.learning_quizzes add column if not exists brand_logo_url text not null default '/brand/mark-clear.png';
alter table public.learning_quizzes add column if not exists watermark_text text not null default 'Phenom Best Academy';
alter table public.school_cbt_exams add column if not exists brand_name text not null default 'Phenom Best Academy';
alter table public.school_cbt_exams add column if not exists brand_logo_url text not null default '/brand/mark-clear.png';
alter table public.school_cbt_exams add column if not exists watermark_text text not null default 'Phenom Best Academy';

alter table public.schools add column if not exists teacher_signature_url text;
alter table public.schools add column if not exists head_signature_url text;
alter table public.schools add column if not exists report_footer text;

create table if not exists public.school_result_publications (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  session_id uuid not null references public.school_academic_sessions(id) on delete cascade,
  term_no integer not null check (term_no between 1 and 3),
  class_id uuid not null references public.school_classes(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  published_by uuid references auth.users(id) on delete set null,
  published_at timestamptz not null default now(),
  published boolean not null default false,
  download_enabled boolean not null default false,
  unique (session_id,term_no,class_id,student_id)
);

alter table public.school_result_publications enable row level security;
create policy "result publications authorised" on public.school_result_publications for select to authenticated
using (student_id=auth.uid() or public.is_school_member(school_id) or public.is_staff() or public.is_admin());
create policy "result publications manage" on public.school_result_publications for all to authenticated
using (public.is_school_member(school_id,array['school_admin']) or public.is_staff() or public.is_admin())
with check (public.is_school_member(school_id,array['school_admin']) or public.is_staff() or public.is_admin());

-- Optional school defaults; schools may replace these with their own component structure.
create or replace function public.seed_default_school_result_components(p_school uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  insert into public.school_result_components(school_id,name,code,component_type,max_score,weight,sequence_no,term_no)
  values
    (p_school,'First CA','CA1','ca',20,20,1,1),
    (p_school,'Second CA','CA2','ca',20,20,2,1),
    (p_school,'Midterm Test','MIDTERM','midterm',20,20,3,1),
    (p_school,'Third CA','CA3','ca',20,20,4,1),
    (p_school,'Final Examination','EXAM','exam',100,40,5,1),
    (p_school,'First CA','CA1','ca',20,20,1,2),
    (p_school,'Second CA','CA2','ca',20,20,2,2),
    (p_school,'Midterm Test','MIDTERM','midterm',20,20,3,2),
    (p_school,'Final Examination','EXAM','exam',100,40,4,2),
    (p_school,'First CA','CA1','ca',20,20,1,3),
    (p_school,'Second CA','CA2','ca',20,20,2,3),
    (p_school,'Final Examination','EXAM','exam',100,60,3,3)
  on conflict (school_id,code,term_no) do nothing;
end; $$;
revoke all on function public.seed_default_school_result_components(uuid) from public;
grant execute on function public.seed_default_school_result_components(uuid) to authenticated;

create index if not exists result_publications_student_idx on public.school_result_publications(student_id);

-- Subscription catalogue and tenant-aware premium plans.
alter table public.subscriptions add column if not exists school_id uuid references public.schools(id) on delete cascade;
alter table public.subscriptions add column if not exists organisation_id uuid references public.organisations(id) on delete cascade;
alter table public.subscriptions add column if not exists currency text default 'NGN';
alter table public.subscriptions add column if not exists amount numeric(14,2);

create table if not exists public.subscription_plans (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  audience text not null default 'individual',
  description text,
  price numeric(14,2) not null default 0,
  currency text not null default 'NGN',
  billing_period text not null default 'one_time' check (billing_period in ('one_time','monthly','termly','annual','custom')),
  features jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.subscription_plans(code,name,audience,description,price,currency,billing_period,features) values
('individual-premium','Individual Premium','individual','Expanded learning tools, premium learning work and authorised downloads.',0,'NGN','monthly','["premium_screenshot","premium_pdf_download"]'::jsonb),
('school-full-premium','School Full Platform Premium','school','Full school learning, assessment, CBT, result management, report-card and school database environment.',0,'NGN','annual','["premium_screenshot","premium_pdf_download","school_results_export"]'::jsonb),
('organisation-premium','Organisation Premium','organisation','Controlled learning, training and assessment environment for companies, NGOs, churches and other organisations.',0,'NGN','annual','["premium_screenshot","premium_pdf_download"]'::jsonb)
on conflict (code) do nothing;

alter table public.subscription_plans enable row level security;
create policy "subscription plans active read" on public.subscription_plans for select to anon, authenticated using (active=true or public.is_staff() or public.is_admin());
create policy "subscription plans staff manage" on public.subscription_plans for all to authenticated using (public.is_staff() or public.is_admin()) with check (public.is_staff() or public.is_admin());

create index if not exists subscriptions_school_idx on public.subscriptions(school_id);
create index if not exists subscriptions_org_idx on public.subscriptions(organisation_id);

-- ============================================================
-- v3: configurable report comments, master result templates and attendance
-- ============================================================

-- A school's master component setup applies across its classes and future academic sessions.
alter table public.school_result_components
  add column if not exists applies_to_all_classes boolean not null default true,
  add column if not exists applies_to_future_sessions boolean not null default true;

-- Keep the original generated report comment, while allowing the teacher to override it.
create table if not exists public.student_result_comments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  session_id uuid not null references public.school_academic_sessions(id) on delete cascade,
  term_no integer not null check (term_no between 1 and 3),
  class_id uuid not null references public.school_classes(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  subject_id uuid not null references public.school_subjects(id) on delete cascade,
  generated_comment text not null default '',
  teacher_comment text,
  final_comment text,
  generated_context jsonb not null default '{}'::jsonb,
  generated_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, term_no, class_id, student_id, subject_id)
);

-- Class-level anonymous performance statistics: no student names are stored in this summary.
create table if not exists public.class_performance_summaries (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  session_id uuid not null references public.school_academic_sessions(id) on delete cascade,
  term_no integer not null check (term_no between 1 and 3),
  class_id uuid not null references public.school_classes(id) on delete cascade,
  subject_id uuid references public.school_subjects(id) on delete set null,
  class_average numeric(8,2),
  class_lowest_score numeric(8,2),
  class_highest_score numeric(8,2),
  cumulative_average numeric(8,2),
  student_count integer,
  generated_at timestamptz not null default now(),
  unique (session_id, term_no, class_id, subject_id)
);

-- Attendance settings are controlled by each school.
create table if not exists public.school_attendance_settings (
  school_id uuid primary key references public.schools(id) on delete cascade,
  school_resumption_time time not null default '08:00',
  half_day_cutoff_time time not null default '10:00',
  school_closing_time time not null default '15:00',
  use_daily_attendance boolean not null default true,
  use_two_check_attendance boolean not null default true,
  use_arrival_time_classification boolean not null default true,
  allow_teacher_manual_override boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per child per attendance checkpoint. Two checkpoints can represent a full school day;
-- one completed checkpoint represents half attendance. The school may disable daily attendance.
create table if not exists public.student_attendance (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  session_id uuid not null references public.school_academic_sessions(id) on delete cascade,
  term_no integer not null check (term_no between 1 and 3),
  class_id uuid not null references public.school_classes(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  attendance_date date not null,
  checkpoint text not null check (checkpoint in ('arrival','departure')),
  status text not null default 'open' check (status in ('open','present','half','absent','excused')),
  recorded_at timestamptz,
  recorded_by uuid references auth.users(id) on delete set null,
  arrival_time time,
  note text,
  manual_override boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (class_id, student_id, attendance_date, checkpoint)
);

-- Prevent an attendance row from being created for a student outside the selected class/school.
create or replace function public.can_manage_attendance(
  p_school uuid, p_class uuid, p_student uuid
) returns boolean
language sql stable security definer set search_path=public as $$
  select public.is_staff() or public.is_admin()
  or public.is_school_member(p_school, array['school_admin'])
  or exists (
    select 1 from public.class_members cm
    join public.school_classes c on c.id=cm.class_id
    where cm.class_id=p_class and cm.user_id=auth.uid() and cm.role='teacher'
      and c.school_id=p_school
      and exists (select 1 from public.class_members s where s.class_id=p_class and s.user_id=p_student and s.role='student')
  );
$$;

create or replace function public.can_view_attendance(
  p_school uuid, p_class uuid, p_student uuid
) returns boolean
language sql stable security definer set search_path=public as $$
  select p_student=auth.uid()
  or public.is_staff() or public.is_admin()
  or public.is_school_member(p_school, array['school_admin'])
  or exists (
    select 1 from public.class_members cm
    where cm.class_id=p_class and cm.user_id=auth.uid() and cm.role='teacher'
      and exists (select 1 from public.class_members s where s.class_id=p_class and s.user_id=p_student and s.role='student')
  )
  or exists (
    select 1 from public.parent_links pl
    where pl.parent_id=auth.uid() and pl.child_id=p_student and pl.status='active'
  );
$$;

alter table public.student_result_comments enable row level security;
alter table public.class_performance_summaries enable row level security;
alter table public.school_attendance_settings enable row level security;
alter table public.student_attendance enable row level security;

create policy "result comments authorised" on public.student_result_comments for all to authenticated
using (public.can_view_result_entry(school_id,class_id,student_id))
with check (public.is_school_member(school_id) or public.is_staff() or public.is_admin());

create policy "class performance summaries authorised" on public.class_performance_summaries for select to authenticated
using (public.is_school_member(school_id) or public.is_staff() or public.is_admin());
create policy "class performance summaries manage" on public.class_performance_summaries for all to authenticated
using (public.is_school_member(school_id,array['school_admin']) or public.is_staff() or public.is_admin())
with check (public.is_school_member(school_id,array['school_admin']) or public.is_staff() or public.is_admin());

create policy "attendance settings authorised" on public.school_attendance_settings for all to authenticated
using (public.is_school_member(school_id,array['school_admin']) or public.is_staff() or public.is_admin())
with check (public.is_school_member(school_id,array['school_admin']) or public.is_staff() or public.is_admin());

create policy "attendance read authorised" on public.student_attendance for select to authenticated
using (public.can_view_attendance(school_id,class_id,student_id));
create policy "attendance insert authorised" on public.student_attendance for insert to authenticated
with check (public.can_manage_attendance(school_id,class_id,student_id));
create policy "attendance update authorised" on public.student_attendance for update to authenticated
using (public.can_manage_attendance(school_id,class_id,student_id))
with check (public.can_manage_attendance(school_id,class_id,student_id));

-- Automatically close an untouched checkpoint as absent at/after school closing time when a server-side job
-- invokes this function. The teacher can still correct an entry when the school's policy allows it.
create or replace function public.close_open_attendance_for_day(p_school uuid, p_date date)
returns integer
language plpgsql security definer set search_path=public as $$
declare affected integer;
begin
  update public.student_attendance a
     set status='absent', updated_at=now()
   where a.school_id=p_school and a.attendance_date=p_date and a.status='open';
  get diagnostics affected = row_count;
  return affected;
end; $$;

-- Tighten result-comment and class-statistic visibility to the same class/subject boundaries.
drop policy if exists "result comments authorised" on public.student_result_comments;
create policy "result comments read authorised" on public.student_result_comments for select to authenticated
using (public.can_view_result_entry(school_id,class_id,student_id));
create policy "result comments manage authorised" on public.student_result_comments for insert to authenticated
with check (public.can_manage_result_entry(school_id,class_id,subject_id,student_id));
create policy "result comments update authorised" on public.student_result_comments for update to authenticated
using (public.can_manage_result_entry(school_id,class_id,subject_id,student_id))
with check (public.can_manage_result_entry(school_id,class_id,subject_id,student_id));

drop policy if exists "class performance summaries authorised" on public.class_performance_summaries;
create or replace function public.can_view_class_performance(p_school uuid, p_class uuid)
returns boolean language sql stable security definer set search_path=public as $$
  select public.is_staff() or public.is_admin()
  or public.is_school_member(p_school, array['school_admin'])
  or exists (
    select 1 from public.class_members cm
    join public.school_classes c on c.id=cm.class_id
    where cm.class_id=p_class and cm.user_id=auth.uid() and cm.role='teacher' and c.school_id=p_school
  );
$$;
create policy "class performance summaries authorised" on public.class_performance_summaries for select to authenticated
using (public.can_view_class_performance(school_id,class_id));

drop policy if exists "attendance read authorised" on public.student_attendance;
create policy "attendance read authorised" on public.student_attendance for select to authenticated
using (public.can_view_attendance(school_id,class_id,student_id));

-- Attendance checkpoint score: present = 1, half/late checkpoint = 0.5, absent/open = 0.
alter table public.student_attendance
  add column if not exists attendance_points numeric(4,2) generated always as (
    case status when 'present' then 1.0 when 'half' then 0.5 when 'excused' then 1.0 else 0.0 end
  ) stored;

-- Convenience daily/term summaries. These return no unrelated student names when used for class analytics.
create or replace view public.student_daily_attendance_summary as
select school_id, session_id, term_no, class_id, student_id, attendance_date,
       round(sum(attendance_points),2) as attendance_points,
       count(*) filter (where status in ('present','half','excused')) as checkpoints_completed,
       count(*) as checkpoints_expected
from public.student_attendance
group by school_id, session_id, term_no, class_id, student_id, attendance_date;

-- Server-side result-comment generation hook. It can use current scores plus prior-term context;
-- the teacher's edited comment remains authoritative for the final report.

-- ============================================================
-- Final school/organisation administration extension
-- Optional data fields are controlled by each tenant's settings.
-- Sensitive health/identity data must remain protected by RLS and should
-- receive additional encryption/access review before production launch.
-- ============================================================

create table if not exists public.school_profile_fields (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  category text not null check (category in ('student','staff','guardian','attendance','growth','finance','report','id_card')),
  field_code text not null,
  field_label text not null,
  enabled boolean not null default false,
  required boolean not null default false,
  sequence_no integer not null default 1,
  unique (school_id, category, field_code)
);

create table if not exists public.student_growth_records (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  session_id uuid not null references public.school_academic_sessions(id) on delete cascade,
  term_no integer not null check (term_no between 1 and 3),
  student_id uuid not null references auth.users(id) on delete cascade,
  stage text not null check (stage in ('term_start','midterm','term_close')),
  height_cm numeric(6,2),
  weight_kg numeric(6,2),
  note text,
  recorded_by uuid references auth.users(id) on delete set null,
  recorded_at timestamptz not null default now(),
  unique(session_id,term_no,student_id,stage)
);

create table if not exists public.student_guardians (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  full_name text not null,
  relationship text not null,
  phone text,
  email text,
  address text,
  authorised_to_collect boolean not null default false,
  emergency_contact boolean not null default false,
  consent_status text not null default 'pending' check(consent_status in ('pending','granted','declined','revoked')),
  consent_text text,
  consent_signed_at timestamptz,
  consent_recorded_by uuid references auth.users(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_emergency_profiles (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  blood_group text,
  genotype text,
  known_ailments text,
  allergies text,
  medications text,
  emergency_notes text,
  updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique(school_id,student_id)
);

create table if not exists public.staff_records (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references public.organisations(id) on delete cascade,
  school_id uuid references public.schools(id) on delete cascade,
  staff_user_id uuid not null references auth.users(id) on delete cascade,
  staff_id text,
  staff_category text not null default 'other' check(staff_category in ('teaching','non_teaching','management','contract','other')),
  position text,
  department text,
  phone text,
  email text,
  address text,
  date_of_birth date,
  gender text,
  employment_status text not null default 'active' check(employment_status in ('active','on_leave','suspended','inactive','exited')),
  joined_on date,
  exited_on date,
  emergency_contact_name text,
  emergency_contact_phone text,
  blood_group text,
  genotype text,
  known_ailments text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check ((organisation_id is not null) or (school_id is not null))
);

create unique index if not exists staff_records_school_user_idx on public.staff_records(school_id,staff_user_id) where school_id is not null;
create unique index if not exists staff_records_org_user_idx on public.staff_records(organisation_id,staff_user_id) where organisation_id is not null;

create table if not exists public.staff_pay_structures (
  id uuid primary key default gen_random_uuid(),
  staff_record_id uuid not null references public.staff_records(id) on delete cascade,
  currency text not null default 'NGN',
  basic_salary numeric(14,2) not null default 0,
  allowances jsonb not null default '[]'::jsonb,
  recurring_deductions jsonb not null default '[]'::jsonb,
  effective_from date not null default current_date,
  effective_to date,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.payroll_runs (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references public.organisations(id) on delete cascade,
  school_id uuid references public.schools(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  status text not null default 'draft' check(status in ('draft','review','approved','processed','closed')),
  payment_method text not null default 'manual' check(payment_method in ('manual','integrated')),
  approved_by uuid references auth.users(id) on delete set null,
  processed_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check ((organisation_id is not null) or (school_id is not null))
);

create table if not exists public.payroll_items (
  id uuid primary key default gen_random_uuid(),
  payroll_run_id uuid not null references public.payroll_runs(id) on delete cascade,
  staff_record_id uuid not null references public.staff_records(id) on delete cascade,
  basic_salary numeric(14,2) not null default 0,
  allowances jsonb not null default '[]'::jsonb,
  deductions jsonb not null default '[]'::jsonb,
  gross_pay numeric(14,2) not null default 0,
  total_deductions numeric(14,2) not null default 0,
  net_pay numeric(14,2) not null default 0,
  payment_status text not null default 'pending' check(payment_status in ('pending','paid','failed','cancelled')),
  paid_at timestamptz,
  payment_reference text,
  payslip_number text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.organisation_financial_accounts (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references public.organisations(id) on delete cascade,
  school_id uuid references public.schools(id) on delete cascade,
  account_name text not null,
  currency text not null default 'NGN',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  check ((organisation_id is not null) or (school_id is not null))
);

create table if not exists public.organisation_financial_entries (
  id uuid primary key default gen_random_uuid(),
  organisation_id uuid references public.organisations(id) on delete cascade,
  school_id uuid references public.schools(id) on delete cascade,
  account_id uuid not null references public.organisation_financial_accounts(id) on delete cascade,
  entry_type text not null check(entry_type in ('income','expense','transfer','adjustment')),
  category text not null,
  description text,
  amount numeric(14,2) not null check(amount >= 0),
  currency text not null default 'NGN',
  transaction_date date not null default current_date,
  external_payment_reference text,
  entered_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  check ((organisation_id is not null) or (school_id is not null))
);

create table if not exists public.school_fee_schedules (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  session_id uuid not null references public.school_academic_sessions(id) on delete cascade,
  term_no integer not null check(term_no between 1 and 3),
  class_id uuid references public.school_classes(id) on delete set null,
  fee_name text not null default 'School Fees',
  standard_amount numeric(14,2) not null default 0,
  currency text not null default 'NGN',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.student_fee_adjustments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  session_id uuid not null references public.school_academic_sessions(id) on delete cascade,
  term_no integer not null check(term_no between 1 and 3),
  fee_name text not null,
  adjustment_type text not null check(adjustment_type in ('discount','waiver','surcharge','custom')),
  amount numeric(14,2) not null check(amount >= 0),
  reason text,
  approved_by uuid references auth.users(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.school_fee_payments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  session_id uuid references public.school_academic_sessions(id) on delete set null,
  term_no integer check(term_no between 1 and 3),
  payer_name text,
  payer_phone text,
  payment_date date not null default current_date,
  amount_received numeric(14,2) not null check(amount_received > 0),
  payment_method text,
  external_reference text,
  confirmation_status text not null default 'confirmed' check(confirmation_status in ('pending','confirmed','reversed')),
  entered_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.school_fee_payment_allocations (
  id uuid primary key default gen_random_uuid(),
  payment_id uuid not null references public.school_fee_payments(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  fee_name text not null,
  amount_allocated numeric(14,2) not null check(amount_allocated > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.school_receipts (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  payment_id uuid not null references public.school_fee_payments(id) on delete cascade,
  student_id uuid references auth.users(id) on delete set null,
  receipt_number text not null,
  receipt_title text not null default 'Official Receipt',
  organisation_name text,
  logo_url text,
  amount numeric(14,2) not null,
  currency text not null default 'NGN',
  purpose text not null,
  issued_at timestamptz not null default now(),
  unique(school_id,receipt_number)
);

create table if not exists public.school_elections (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  title text not null,
  description text,
  opens_at timestamptz,
  closes_at timestamptz,
  voter_scope text not null default 'students' check(voter_scope in ('students','class','custom')),
  status text not null default 'draft' check(status in ('draft','scheduled','open','closed','published')),
  results_visible boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.school_election_positions (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references public.school_elections(id) on delete cascade,
  position_name text not null,
  max_choices integer not null default 1 check(max_choices >= 1),
  sequence_no integer not null default 1,
  unique(election_id,position_name)
);

create table if not exists public.school_election_candidates (
  id uuid primary key default gen_random_uuid(),
  position_id uuid not null references public.school_election_positions(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  candidate_name text not null,
  candidate_number text,
  manifesto text,
  photo_url text,
  active boolean not null default true,
  unique(position_id,student_id)
);

create table if not exists public.school_election_voters (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references public.school_elections(id) on delete cascade,
  voter_id uuid not null references auth.users(id) on delete cascade,
  voter_email text,
  verification_email text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  unique(election_id,voter_id)
);

create table if not exists public.school_election_votes (
  id uuid primary key default gen_random_uuid(),
  election_id uuid not null references public.school_elections(id) on delete cascade,
  position_id uuid not null references public.school_election_positions(id) on delete cascade,
  candidate_id uuid not null references public.school_election_candidates(id) on delete cascade,
  voter_id uuid not null references auth.users(id) on delete cascade,
  cast_at timestamptz not null default now(),
  unique(election_id,position_id,voter_id)
);

create table if not exists public.school_id_card_templates (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  title text not null default 'Student Identity Card',
  card_width_mm numeric(8,2) not null default 85.60,
  card_height_mm numeric(8,2) not null default 53.98,
  front_config jsonb not null default '{}'::jsonb,
  back_config jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.person_signatures (
  id uuid primary key default gen_random_uuid(),
  school_id uuid references public.schools(id) on delete cascade,
  organisation_id uuid references public.organisations(id) on delete cascade,
  person_id uuid references auth.users(id) on delete cascade,
  signature_image_url text not null,
  transparent_background boolean not null default true,
  processed_width_px integer,
  processed_height_px integer,
  created_at timestamptz not null default now(),
  check ((school_id is not null) or (organisation_id is not null))
);

create table if not exists public.school_assessment_traits (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  group_name text not null check(group_name in ('academic_development','psychomotor','personal_development','behavioural_traits','physical_growth','attendance','custom')),
  trait_name text not null,
  active boolean not null default true,
  sequence_no integer not null default 1,
  unique(school_id,group_name,trait_name)
);

create table if not exists public.school_assessment_scales (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  scale_value integer not null check(scale_value between 1 and 5),
  label text not null,
  meaning text,
  unique(school_id,scale_value)
);

create table if not exists public.student_trait_assessments (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  session_id uuid not null references public.school_academic_sessions(id) on delete cascade,
  term_no integer not null check(term_no between 1 and 3),
  class_id uuid not null references public.school_classes(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  trait_id uuid not null references public.school_assessment_traits(id) on delete cascade,
  scale_value integer not null check(scale_value between 1 and 5),
  note text,
  entered_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(session_id,term_no,student_id,trait_id)
);

-- Default assessment categories and 1–5 interpretation. Schools can edit/remove these.
-- Values are intentionally descriptive rather than prescriptive; the school may replace them.
create or replace function public.seed_default_assessment_scale(p_school uuid)
returns void language plpgsql security definer set search_path=public as $$
begin
  insert into public.school_assessment_scales(school_id,scale_value,label,meaning) values
    (p_school,1,'Needs significant improvement','Requires focused support and development.'),
    (p_school,2,'Developing','Shows emerging ability and needs further support.'),
    (p_school,3,'Satisfactory','Meets the expected standard.'),
    (p_school,4,'Very good','Performs strongly and consistently.'),
    (p_school,5,'Excellent','Demonstrates an outstanding level of performance.')
  on conflict (school_id,scale_value) do nothing;

  insert into public.school_assessment_traits(school_id,group_name,trait_name,sequence_no) values
    (p_school,'academic_development','Academic development',1),
    (p_school,'psychomotor','Psychomotor development',2),
    (p_school,'personal_development','Personal development',3),
    (p_school,'behavioural_traits','Behavioural traits',4),
    (p_school,'physical_growth','Physical growth',5),
    (p_school,'attendance','Attendance',6),
    (p_school,'custom','Neatness and grooming',7),
    (p_school,'custom','Punctuality',8),
    (p_school,'custom','Participation',9)
  on conflict (school_id,group_name,trait_name) do nothing;
end;
$$;

-- Optional report components: attendance, growth and trait analysis can be switched on/off.
insert into public.school_profile_fields(school_id,category,field_code,field_label,enabled,required,sequence_no)
select s.id,'student','height_weight','Height and weight tracking',false,false,1 from public.schools s
on conflict do nothing;

insert into public.school_profile_fields(school_id,category,field_code,field_label,enabled,required,sequence_no)
select s.id,'student','emergency_health','Emergency health information',false,false,2 from public.schools s
on conflict do nothing;

insert into public.school_profile_fields(school_id,category,field_code,field_label,enabled,required,sequence_no)
select s.id,'student','guardian_consent','Guardian/authorised collection and consent record',true,false,3 from public.schools s
on conflict do nothing;

-- Report-card paper size defaults: A4 portrait. Receipts: A5 (half-A4) by default.
alter table public.school_receipts add column if not exists paper_size text not null default 'A5';
alter table public.school_id_card_templates add column if not exists paper_size text not null default 'ID-1';

-- Record explicit Super Admin school-entry events for troubleshooting/support.
create table if not exists public.super_admin_access_logs (
  id bigint generated by default as identity primary key,
  super_admin_id uuid not null references auth.users(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  access_reason text,
  started_at timestamptz not null default now(),
  ended_at timestamptz,
  actions_summary jsonb not null default '{}'::jsonb
);

alter table public.school_profile_fields enable row level security;
alter table public.student_growth_records enable row level security;
alter table public.student_guardians enable row level security;
alter table public.student_emergency_profiles enable row level security;
alter table public.staff_records enable row level security;
alter table public.staff_pay_structures enable row level security;
alter table public.payroll_runs enable row level security;
alter table public.payroll_items enable row level security;
alter table public.organisation_financial_accounts enable row level security;
alter table public.organisation_financial_entries enable row level security;
alter table public.school_fee_schedules enable row level security;
alter table public.student_fee_adjustments enable row level security;
alter table public.school_fee_payments enable row level security;
alter table public.school_fee_payment_allocations enable row level security;
alter table public.school_receipts enable row level security;
alter table public.school_elections enable row level security;
alter table public.school_election_positions enable row level security;
alter table public.school_election_candidates enable row level security;
alter table public.school_election_voters enable row level security;
alter table public.school_election_votes enable row level security;
alter table public.school_id_card_templates enable row level security;
alter table public.person_signatures enable row level security;
alter table public.school_assessment_traits enable row level security;
alter table public.school_assessment_scales enable row level security;
alter table public.student_trait_assessments enable row level security;
alter table public.super_admin_access_logs enable row level security;

-- Tenant-aware policies. Super Admin can support a school; ordinary Academy staff do not automatically gain school-result access.
create policy "school profile fields tenant read" on public.school_profile_fields for select to authenticated using (public.is_super_admin() or public.is_admin() or public.is_school_member(school_id,array['school_admin','teacher','student','parent']));
create policy "school profile fields tenant manage" on public.school_profile_fields for all to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));

create policy "growth authorised" on public.student_growth_records for all to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin','teacher']) or student_id=auth.uid() or public.is_parent_of(student_id)) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin','teacher']));
create policy "guardian authorised" on public.student_guardians for all to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or student_id=auth.uid() or public.is_parent_of(student_id)) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or student_id=auth.uid());
create policy "emergency health authorised" on public.student_emergency_profiles for select to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or student_id=auth.uid() or public.is_parent_of(student_id));
create policy "emergency health manage" on public.student_emergency_profiles for all to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));

create policy "staff records tenant" on public.staff_records for all to authenticated using (public.is_super_admin() or (school_id is not null and public.is_school_member(school_id,array['school_admin'])) or (organisation_id is not null and exists(select 1 from public.organisation_members om where om.organisation_id=staff_records.organisation_id and om.user_id=auth.uid() and om.role in ('owner','admin')) ) or staff_user_id=auth.uid()) with check (public.is_super_admin() or (school_id is not null and public.is_school_member(school_id,array['school_admin'])) or (organisation_id is not null and exists(select 1 from public.organisation_members om where om.organisation_id=staff_records.organisation_id and om.user_id=auth.uid() and om.role in ('owner','admin'))));
create policy "pay structures authorised" on public.staff_pay_structures for all to authenticated using (public.is_super_admin() or exists(select 1 from public.staff_records sr where sr.id=staff_record_id and (sr.staff_user_id=auth.uid() or (sr.school_id is not null and public.is_school_member(sr.school_id,array['school_admin'])) or (sr.organisation_id is not null and exists(select 1 from public.organisation_members om where om.organisation_id=sr.organisation_id and om.user_id=auth.uid() and om.role in ('owner','admin')))))) with check (public.is_super_admin() or exists(select 1 from public.staff_records sr where sr.id=staff_record_id and (sr.school_id is not null and public.is_school_member(sr.school_id,array['school_admin'])) or (sr.organisation_id is not null and exists(select 1 from public.organisation_members om where om.organisation_id=sr.organisation_id and om.user_id=auth.uid() and om.role in ('owner','admin')))));

create policy "payroll run authorised" on public.payroll_runs for all to authenticated using (public.is_super_admin() or (school_id is not null and public.is_school_member(school_id,array['school_admin'])) or (organisation_id is not null and exists(select 1 from public.organisation_members om where om.organisation_id=payroll_runs.organisation_id and om.user_id=auth.uid() and om.role in ('owner','admin')))) with check (public.is_super_admin() or (school_id is not null and public.is_school_member(school_id,array['school_admin'])) or (organisation_id is not null and exists(select 1 from public.organisation_members om where om.organisation_id=payroll_runs.organisation_id and om.user_id=auth.uid() and om.role in ('owner','admin'))));
create policy "payroll items authorised" on public.payroll_items for select to authenticated using (public.is_super_admin() or exists(select 1 from public.payroll_runs pr where pr.id=payroll_run_id and ((pr.school_id is not null and public.is_school_member(pr.school_id,array['school_admin'])) or (pr.organisation_id is not null and exists(select 1 from public.organisation_members om where om.organisation_id=pr.organisation_id and om.user_id=auth.uid() and om.role in ('owner','admin'))))) or exists(select 1 from public.staff_records sr where sr.id=staff_record_id and sr.staff_user_id=auth.uid()));

create policy "financial accounts authorised" on public.organisation_financial_accounts for all to authenticated using (public.is_super_admin() or (school_id is not null and public.is_school_member(school_id,array['school_admin'])) or (organisation_id is not null and exists(select 1 from public.organisation_members om where om.organisation_id=organisation_financial_accounts.organisation_id and om.user_id=auth.uid() and om.role in ('owner','admin')))) with check (public.is_super_admin() or (school_id is not null and public.is_school_member(school_id,array['school_admin'])) or (organisation_id is not null and exists(select 1 from public.organisation_members om where om.organisation_id=organisation_financial_accounts.organisation_id and om.user_id=auth.uid() and om.role in ('owner','admin'))));
create policy "financial entries authorised" on public.organisation_financial_entries for all to authenticated using (public.is_super_admin() or (school_id is not null and public.is_school_member(school_id,array['school_admin'])) or (organisation_id is not null and exists(select 1 from public.organisation_members om where om.organisation_id=organisation_financial_entries.organisation_id and om.user_id=auth.uid() and om.role in ('owner','admin')))) with check (public.is_super_admin() or (school_id is not null and public.is_school_member(school_id,array['school_admin'])) or (organisation_id is not null and exists(select 1 from public.organisation_members om where om.organisation_id=organisation_financial_entries.organisation_id and om.user_id=auth.uid() and om.role in ('owner','admin'))));

create policy "fees authorised" on public.school_fee_schedules for all to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "fee adjustments authorised" on public.student_fee_adjustments for all to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "fee payments authorised" on public.school_fee_payments for all to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "fee allocations authorised" on public.school_fee_payment_allocations for all to authenticated using (public.is_super_admin() or exists(select 1 from public.school_fee_payments p where p.id=payment_id and public.is_school_member(p.school_id,array['school_admin']))) with check (public.is_super_admin() or exists(select 1 from public.school_fee_payments p where p.id=payment_id and public.is_school_member(p.school_id,array['school_admin'])));
create policy "receipts authorised" on public.school_receipts for select to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin','teacher','student','parent']) and (student_id is null or student_id=auth.uid() or public.is_parent_of(student_id)));
create policy "receipts create" on public.school_receipts for insert to authenticated with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));

create policy "election admin" on public.school_elections for all to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "election positions admin" on public.school_election_positions for all to authenticated using (public.is_super_admin() or exists(select 1 from public.school_elections e where e.id=election_id and public.is_school_member(e.school_id,array['school_admin']))) with check (public.is_super_admin() or exists(select 1 from public.school_elections e where e.id=election_id and public.is_school_member(e.school_id,array['school_admin'])));
create policy "election candidates read" on public.school_election_candidates for select to authenticated using (public.is_super_admin() or exists(select 1 from public.school_election_positions ep join public.school_elections e on e.id=ep.election_id where ep.id=position_id and (public.is_school_member(e.school_id,array['school_admin','teacher','student']) or e.results_visible=true)));
create policy "election candidates admin" on public.school_election_candidates for all to authenticated using (public.is_super_admin() or exists(select 1 from public.school_election_positions ep join public.school_elections e on e.id=ep.election_id where ep.id=position_id and public.is_school_member(e.school_id,array['school_admin']))) with check (public.is_super_admin() or exists(select 1 from public.school_election_positions ep join public.school_elections e on e.id=ep.election_id where ep.id=position_id and public.is_school_member(e.school_id,array['school_admin'])));
create policy "election voters own" on public.school_election_voters for select to authenticated using (voter_id=auth.uid() or public.is_super_admin() or exists(select 1 from public.school_elections e where e.id=election_id and public.is_school_member(e.school_id,array['school_admin'])));
create policy "election votes own insert" on public.school_election_votes for insert to authenticated with check (voter_id=auth.uid() and exists(select 1 from public.school_election_voters v where v.election_id=school_election_votes.election_id and v.voter_id=auth.uid() and v.verified_at is not null));
create policy "election results admin" on public.school_election_votes for select to authenticated using (public.is_super_admin() or exists(select 1 from public.school_elections e where e.id=election_id and (public.is_school_member(e.school_id,array['school_admin']) or e.results_visible=true)));

create policy "id card templates admin" on public.school_id_card_templates for all to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "signatures authorised" on public.person_signatures for all to authenticated using (public.is_super_admin() or person_id=auth.uid() or (school_id is not null and public.is_school_member(school_id,array['school_admin']))) with check (public.is_super_admin() or person_id=auth.uid() or (school_id is not null and public.is_school_member(school_id,array['school_admin'])));

create policy "traits admin" on public.school_assessment_traits for all to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "scales admin" on public.school_assessment_scales for all to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "trait assessments authorised" on public.student_trait_assessments for all to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin','teacher']) or student_id=auth.uid() or public.is_parent_of(student_id)) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin','teacher']));
create policy "super admin access logs" on public.super_admin_access_logs for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());

-- Prevent duplicate votes even under retries/race conditions.
create unique index if not exists election_vote_candidate_idx on public.school_election_votes(election_id,position_id,voter_id);

-- Financial helper: compare confirmed allocated fees with approved payable amount.
create or replace view public.student_fee_balances as
select
  a.school_id,
  a.student_id,
  a.session_id,
  a.term_no,
  a.fee_name,
  greatest(0, sum(a.standard_amount) - coalesce(sum(adj.adjustment_amount),0) - coalesce(sum(pay.paid_amount),0)) as balance
from (
  select f.school_id, f.session_id, f.term_no, f.fee_name, f.standard_amount, cm.user_id as student_id
  from public.school_fee_schedules f
  join public.class_members cm on cm.class_id=f.class_id and cm.role='student'
) a
left join lateral (
  select coalesce(sum(case when adjustment_type in ('discount','waiver') then amount else -amount end),0) adjustment_amount
  from public.student_fee_adjustments x
  where x.school_id=a.school_id and x.student_id=a.student_id and x.session_id=a.session_id and x.term_no=a.term_no and x.fee_name=a.fee_name and x.active
) adj on true
left join lateral (
  select coalesce(sum(pa.amount_allocated),0) paid_amount
  from public.school_fee_payment_allocations pa
  join public.school_fee_payments p on p.id=pa.payment_id
  where pa.student_id=a.student_id and pa.fee_name=a.fee_name and p.school_id=a.school_id and p.session_id=a.session_id and p.term_no=a.term_no and p.confirmation_status='confirmed'
) pay on true
group by a.school_id,a.student_id,a.session_id,a.term_no,a.fee_name;

