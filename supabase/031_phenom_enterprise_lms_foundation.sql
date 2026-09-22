-- Phenom Best LMS Foundation v6.0
-- Non-destructive expansion: preserves existing programmes, school LMS tables and RLS.
-- Adds standards-ready LMS capabilities and normalized global subject/curriculum coverage.

create table if not exists public.lms_courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text not null default '',
  description text not null default '',
  level text,
  language_code text not null default 'en-GB',
  subject_id uuid,
  curriculum_id text references public.curriculum_catalogue(id) on delete set null,
  instructor_id uuid references auth.users(id) on delete set null,
  status text not null default 'draft' check(status in ('draft','review','approved','published','archived')),
  visibility text not null default 'public' check(visibility in ('public','private','cohort','organisation')),
  price_minor bigint not null default 0,
  currency text not null default 'NGN',
  certificate_enabled boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lms_course_modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  title text not null,
  description text not null default '',
  position integer not null default 1,
  created_at timestamptz not null default now(),
  unique(course_id,position)
);

create table if not exists public.lms_activities (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  module_id uuid references public.lms_course_modules(id) on delete cascade,
  title text not null,
  activity_type text not null check(activity_type in ('lesson','video','audio','reading','resource','quiz','assignment','exam','scorm','live','survey','discussion','external')),
  position integer not null default 1,
  body text,
  resource_url text,
  config jsonb not null default '{}'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lms_enrolments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  learner_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active' check(status in ('invited','active','completed','suspended','withdrawn','expired')),
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  expires_at timestamptz,
  source text not null default 'academy',
  metadata jsonb not null default '{}'::jsonb,
  unique(course_id,learner_id)
);

create table if not exists public.lms_activity_progress (
  id uuid primary key default gen_random_uuid(),
  enrolment_id uuid not null references public.lms_enrolments(id) on delete cascade,
  activity_id uuid not null references public.lms_activities(id) on delete cascade,
  status text not null default 'not_started' check(status in ('not_started','in_progress','completed','failed','passed')),
  progress_percent numeric(5,2) not null default 0 check(progress_percent between 0 and 100),
  score numeric(7,2),
  time_seconds bigint not null default 0,
  attempts integer not null default 0,
  first_started_at timestamptz,
  completed_at timestamptz,
  last_activity_at timestamptz not null default now(),
  state jsonb not null default '{}'::jsonb,
  unique(enrolment_id,activity_id)
);

create table if not exists public.lms_prerequisites (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  prerequisite_course_id uuid references public.lms_courses(id) on delete cascade,
  prerequisite_activity_id uuid references public.lms_activities(id) on delete cascade,
  rule_group integer not null default 1,
  operator text not null default 'AND' check(operator in ('AND','OR')),
  minimum_score numeric(7,2),
  require_completion boolean not null default true,
  created_at timestamptz not null default now(),
  check(prerequisite_course_id is not null or prerequisite_activity_id is not null),
  check(prerequisite_course_id is null or prerequisite_course_id <> course_id)
);

create table if not exists public.lms_drip_rules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  activity_id uuid not null references public.lms_activities(id) on delete cascade,
  release_type text not null check(release_type in ('immediate','after_enrolment','after_activity','fixed_date','weekly','cohort')),
  delay_seconds bigint,
  source_activity_id uuid references public.lms_activities(id) on delete set null,
  release_at timestamptz,
  weekday smallint check(weekday between 0 and 6),
  release_hour smallint check(release_hour between 0 and 23),
  timezone text not null default 'Africa/Lagos',
  enabled boolean not null default true,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.lms_scorm_packages (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references public.lms_courses(id) on delete cascade,
  activity_id uuid references public.lms_activities(id) on delete cascade,
  title text not null,
  version text not null check(version in ('1.2','2004')),
  package_path text not null,
  launch_path text,
  manifest jsonb not null default '{}'::jsonb,
  checksum text,
  status text not null default 'uploaded' check(status in ('uploaded','validated','published','failed','archived')),
  created_at timestamptz not null default now(),
  unique(activity_id)
);

create table if not exists public.lms_scorm_attempts (
  id uuid primary key default gen_random_uuid(),
  package_id uuid not null references public.lms_scorm_packages(id) on delete cascade,
  learner_id uuid not null references auth.users(id) on delete cascade,
  attempt_number integer not null,
  lesson_status text,
  completion_status text,
  success_status text,
  score_raw numeric(10,4),
  score_min numeric(10,4),
  score_max numeric(10,4),
  total_time_seconds bigint not null default 0,
  suspend_data text,
  cmi_state jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  last_activity_at timestamptz not null default now(),
  completed_at timestamptz,
  unique(package_id,learner_id,attempt_number)
);

create table if not exists public.lms_xapi_statements (
  id uuid primary key default gen_random_uuid(),
  learner_id uuid references auth.users(id) on delete set null,
  course_id uuid references public.lms_courses(id) on delete set null,
  activity_id uuid references public.lms_activities(id) on delete set null,
  statement_id uuid not null unique default gen_random_uuid(),
  actor jsonb not null,
  verb jsonb not null,
  object jsonb not null,
  result jsonb,
  context jsonb,
  authority jsonb,
  stored_at timestamptz not null default now()
);

create table if not exists public.lms_live_sessions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  activity_id uuid references public.lms_activities(id) on delete cascade,
  instructor_id uuid references auth.users(id) on delete set null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  timezone text not null default 'Africa/Lagos',
  meeting_provider text,
  meeting_url text,
  recording_url text,
  status text not null default 'scheduled' check(status in ('draft','scheduled','live','completed','cancelled')),
  recurrence jsonb not null default '{}'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  check(ends_at > starts_at)
);

create table if not exists public.lms_live_attendance (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.lms_live_sessions(id) on delete cascade,
  learner_id uuid not null references auth.users(id) on delete cascade,
  joined_at timestamptz,
  left_at timestamptz,
  attendance_seconds bigint not null default 0,
  status text not null default 'registered' check(status in ('registered','present','late','absent','excused')),
  unique(session_id,learner_id)
);

create table if not exists public.lms_discussions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  activity_id uuid references public.lms_activities(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  pinned boolean not null default false,
  locked boolean not null default false,
  resolved boolean not null default false,
  moderated boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lms_discussion_replies (
  id uuid primary key default gen_random_uuid(),
  discussion_id uuid not null references public.lms_discussions(id) on delete cascade,
  author_id uuid not null references auth.users(id) on delete cascade,
  body text not null,
  moderated boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.lms_learning_events (
  id bigint generated always as identity primary key,
  learner_id uuid references auth.users(id) on delete set null,
  course_id uuid references public.lms_courses(id) on delete set null,
  activity_id uuid references public.lms_activities(id) on delete set null,
  event_type text not null,
  occurred_at timestamptz not null default now(),
  duration_seconds bigint,
  score numeric(7,2),
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.lms_competencies (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  description text not null default '',
  framework text,
  level text,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.lms_course_competencies (
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  competency_id uuid not null references public.lms_competencies(id) on delete cascade,
  required boolean not null default true,
  primary key(course_id,competency_id)
);

create table if not exists public.lms_learner_competencies (
  learner_id uuid not null references auth.users(id) on delete cascade,
  competency_id uuid not null references public.lms_competencies(id) on delete cascade,
  level text,
  score numeric(7,2),
  achieved_at timestamptz,
  evidence jsonb not null default '{}'::jsonb,
  primary key(learner_id,competency_id)
);

create table if not exists public.lms_instructor_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  biography text not null default '',
  expertise text[] not null default '{}',
  qualifications text[] not null default '{}',
  languages text[] not null default '{}',
  verified boolean not null default false,
  marketplace_enabled boolean not null default false,
  rating numeric(4,2),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.lms_course_reviews (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  learner_id uuid not null references auth.users(id) on delete cascade,
  rating smallint not null check(rating between 1 and 5),
  review text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now(),
  unique(course_id,learner_id)
);

create table if not exists public.lms_marketplace_offers (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  instructor_id uuid not null references auth.users(id) on delete cascade,
  offer_type text not null default 'course' check(offer_type in ('course','bundle','subscription')),
  price_minor bigint not null default 0,
  currency text not null default 'NGN',
  commission_percent numeric(5,2) not null default 20 check(commission_percent between 0 and 100),
  status text not null default 'pending_review' check(status in ('draft','pending_review','approved','published','suspended','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lms_lti_platforms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  issuer text not null unique,
  client_id text not null,
  deployment_id text,
  jwks_url text,
  authorization_url text,
  token_url text,
  active boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.lms_lti_tools (
  id uuid primary key default gen_random_uuid(),
  platform_id uuid references public.lms_lti_platforms(id) on delete cascade,
  name text not null,
  tool_url text not null,
  deep_linking_enabled boolean not null default false,
  nrps_enabled boolean not null default false,
  ags_enabled boolean not null default false,
  public_key text,
  private_key_secret_ref text,
  active boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.lms_gradebook_entries (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.lms_courses(id) on delete cascade,
  activity_id uuid references public.lms_activities(id) on delete set null,
  learner_id uuid not null references auth.users(id) on delete cascade,
  source text not null default 'phenom',
  external_line_item_id text,
  score numeric(10,2),
  maximum_score numeric(10,2),
  feedback text,
  graded_at timestamptz,
  unique(course_id,activity_id,learner_id,source)
);

-- Normalized subject catalogue: the existing curriculum arrays remain authoritative and are not removed.
create table if not exists public.global_subject_catalogue (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  category text not null default 'academic',
  description text not null default '',
  tool_hub_enabled boolean not null default false,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.curriculum_subject_catalogue (
  curriculum_id text not null references public.curriculum_catalogue(id) on delete cascade,
  subject_id uuid not null references public.global_subject_catalogue(id) on delete cascade,
  stage text,
  country_code text,
  source_note text,
  active boolean not null default true,
  primary key(curriculum_id,subject_id,stage)
);

create index if not exists lms_courses_subject_idx on public.lms_courses(subject_id);
create index if not exists lms_courses_curriculum_idx on public.lms_courses(curriculum_id);
create index if not exists lms_enrolments_learner_idx on public.lms_enrolments(learner_id);
create index if not exists lms_progress_enrolment_idx on public.lms_activity_progress(enrolment_id);
create index if not exists lms_xapi_learner_idx on public.lms_xapi_statements(learner_id,stored_at desc);
create index if not exists lms_events_learner_idx on public.lms_learning_events(learner_id,occurred_at desc);
create index if not exists lms_events_course_idx on public.lms_learning_events(course_id,occurred_at desc);
create index if not exists lms_discussions_course_idx on public.lms_discussions(course_id,created_at desc);
create index if not exists lms_sessions_course_idx on public.lms_live_sessions(course_id,starts_at);

-- Public-facing LMS labels never expose the underlying provider, model, engine or routing implementation.
create or replace function public.phenom_public_core_label()
returns text language sql immutable as $$ select 'Phenom Best Core'::text $$;

-- Seed the Tool Hub academic domains and English Literacy without replacing existing curriculum subjects.
insert into public.global_subject_catalogue(name,slug,category,tool_hub_enabled)
values
('Mathematics','mathematics','academic',true),
('Statistics','statistics','academic',true),
('Physics','physics','academic',true),
('Chemistry','chemistry','academic',true),
('Business Mathematics','business-mathematics','academic',true),
('English Literacy','english-literacy','literacy',true)
on conflict(name) do update set tool_hub_enabled=true,active=true,updated_at=now();

-- Import every subject already declared in the package's curriculum catalogue.
insert into public.global_subject_catalogue(name,slug,category)
select distinct trim(s) as name,
       regexp_replace(lower(trim(s)), '[^a-z0-9]+', '-', 'g') as slug,
       case when lower(trim(s)) like '%language%' or lower(trim(s)) like '%english%' or lower(trim(s)) like '%literacy%' then 'language' else 'academic' end
from public.curriculum_catalogue c
cross join lateral unnest(c.subjects) s
where trim(s) <> ''
on conflict(name) do update set active=true,updated_at=now();

insert into public.curriculum_subject_catalogue(curriculum_id,subject_id,stage,country_code,source_note)
select c.id, s.id, st.stage, cc.country_code, c.notes
from public.curriculum_catalogue c
cross join lateral unnest(c.stages) st(stage)
cross join lateral unnest(c.country_codes) cc(country_code)
cross join lateral unnest(c.subjects) cs(subject_name)
join public.global_subject_catalogue s on s.name=trim(cs.subject_name)
on conflict(curriculum_id,subject_id,stage) do update set country_code=excluded.country_code,source_note=excluded.source_note,active=true;

-- RLS: deny-by-default for the new Phenom Best LMS tables. Existing helper functions are reused.
alter table public.lms_courses enable row level security;
alter table public.lms_course_modules enable row level security;
alter table public.lms_activities enable row level security;
alter table public.lms_enrolments enable row level security;
alter table public.lms_activity_progress enable row level security;
alter table public.lms_prerequisites enable row level security;
alter table public.lms_drip_rules enable row level security;
alter table public.lms_scorm_packages enable row level security;
alter table public.lms_scorm_attempts enable row level security;
alter table public.lms_xapi_statements enable row level security;
alter table public.lms_live_sessions enable row level security;
alter table public.lms_live_attendance enable row level security;
alter table public.lms_discussions enable row level security;
alter table public.lms_discussion_replies enable row level security;
alter table public.lms_learning_events enable row level security;
alter table public.lms_competencies enable row level security;
alter table public.lms_course_competencies enable row level security;
alter table public.lms_learner_competencies enable row level security;
alter table public.lms_instructor_profiles enable row level security;
alter table public.lms_course_reviews enable row level security;
alter table public.lms_marketplace_offers enable row level security;
alter table public.lms_lti_platforms enable row level security;
alter table public.lms_lti_tools enable row level security;
alter table public.lms_gradebook_entries enable row level security;
alter table public.global_subject_catalogue enable row level security;
alter table public.curriculum_subject_catalogue enable row level security;

-- Catalogue is public-read; management is Super Admin only.
create policy global_subject_catalogue_read on public.global_subject_catalogue for select using(active=true or public.is_super_admin());
create policy global_subject_catalogue_admin on public.global_subject_catalogue for all using(public.is_super_admin()) with check(public.is_super_admin());
create policy curriculum_subject_catalogue_read on public.curriculum_subject_catalogue for select using(active=true or public.is_super_admin());
create policy curriculum_subject_catalogue_admin on public.curriculum_subject_catalogue for all using(public.is_super_admin()) with check(public.is_super_admin());

-- Learners can only read their own enrolments/progress; instructors/admins are scoped by ownership/approval.
create policy lms_enrolments_self_read on public.lms_enrolments for select to authenticated using(learner_id=auth.uid() or public.is_super_admin());
create policy lms_progress_self_all on public.lms_activity_progress for all to authenticated using(exists(select 1 from public.lms_enrolments e where e.id=enrolment_id and e.learner_id=auth.uid()) or public.is_super_admin()) with check(exists(select 1 from public.lms_enrolments e where e.id=enrolment_id and e.learner_id=auth.uid()) or public.is_super_admin());
create policy lms_course_public_read on public.lms_courses for select to authenticated using(status='published' or instructor_id=auth.uid() or public.is_super_admin());
create policy lms_course_admin_write on public.lms_courses for all to authenticated using(instructor_id=auth.uid() or public.is_super_admin()) with check(instructor_id=auth.uid() or public.is_super_admin());
create policy lms_course_modules_read on public.lms_course_modules for select to authenticated using(exists(select 1 from public.lms_courses c where c.id=course_id and (c.status='published' or c.instructor_id=auth.uid() or public.is_super_admin())));
create policy lms_course_modules_manage on public.lms_course_modules for all to authenticated using(exists(select 1 from public.lms_courses c where c.id=course_id and (c.instructor_id=auth.uid() or public.is_super_admin()))) with check(exists(select 1 from public.lms_courses c where c.id=course_id and (c.instructor_id=auth.uid() or public.is_super_admin())));
create policy lms_activities_read on public.lms_activities for select to authenticated using(exists(select 1 from public.lms_courses c where c.id=course_id and (c.status='published' or c.instructor_id=auth.uid() or public.is_super_admin())));
create policy lms_activities_manage on public.lms_activities for all to authenticated using(exists(select 1 from public.lms_courses c where c.id=course_id and (c.instructor_id=auth.uid() or public.is_super_admin()))) with check(exists(select 1 from public.lms_courses c where c.id=course_id and (c.instructor_id=auth.uid() or public.is_super_admin())));

-- SCORM/xAPI/event storage is never public-write. Ingestion should be done by authenticated server/Edge Functions.
create policy lms_xapi_admin_read on public.lms_xapi_statements for select to authenticated using(learner_id=auth.uid() or public.is_super_admin());
create policy lms_events_admin_read on public.lms_learning_events for select to authenticated using(learner_id=auth.uid() or public.is_super_admin());
create policy lms_scorm_attempts_self_read on public.lms_scorm_attempts for select to authenticated using(learner_id=auth.uid() or public.is_super_admin());

create policy lms_discussions_read on public.lms_discussions for select to authenticated using(exists(select 1 from public.lms_enrolments e where e.course_id=course_id and e.learner_id=auth.uid()) or author_id=auth.uid() or public.is_super_admin());
create policy lms_discussions_create on public.lms_discussions for insert to authenticated with check(author_id=auth.uid() and exists(select 1 from public.lms_enrolments e where e.course_id=course_id and e.learner_id=auth.uid()));
create policy lms_discussions_update on public.lms_discussions for update to authenticated using(author_id=auth.uid() or public.is_super_admin()) with check(author_id=auth.uid() or public.is_super_admin());
create policy lms_replies_read on public.lms_discussion_replies for select to authenticated using(exists(select 1 from public.lms_discussions d join public.lms_enrolments e on e.course_id=d.course_id where d.id=discussion_id and e.learner_id=auth.uid()) or author_id=auth.uid() or public.is_super_admin());
create policy lms_replies_create on public.lms_discussion_replies for insert to authenticated with check(author_id=auth.uid() and exists(select 1 from public.lms_discussions d join public.lms_enrolments e on e.course_id=d.course_id where d.id=discussion_id and e.learner_id=auth.uid()));

create policy lms_instructor_profile_read on public.lms_instructor_profiles for select using(verified=true or user_id=auth.uid() or public.is_super_admin());
create policy lms_instructor_profile_manage on public.lms_instructor_profiles for all to authenticated using(user_id=auth.uid() or public.is_super_admin()) with check(user_id=auth.uid() or public.is_super_admin());
create policy lms_reviews_read on public.lms_course_reviews for select using(published=true or learner_id=auth.uid() or public.is_super_admin());
create policy lms_reviews_manage on public.lms_course_reviews for all to authenticated using(learner_id=auth.uid() or public.is_super_admin()) with check(learner_id=auth.uid() or public.is_super_admin());
create policy lms_marketplace_admin on public.lms_marketplace_offers for all to authenticated using(instructor_id=auth.uid() or public.is_super_admin()) with check(instructor_id=auth.uid() or public.is_super_admin());

-- Standards configuration is private; only Super Admin may access LTI credentials and tool registration.
create policy lms_lti_platforms_admin on public.lms_lti_platforms for all to authenticated using(public.is_super_admin()) with check(public.is_super_admin());
create policy lms_lti_tools_admin on public.lms_lti_tools for all to authenticated using(public.is_super_admin()) with check(public.is_super_admin());
create policy lms_gradebook_self_or_admin on public.lms_gradebook_entries for select to authenticated using(learner_id=auth.uid() or public.is_super_admin());

comment on table public.lms_scorm_packages is 'SCORM 1.2/2004 package registry. Package validation/launch should be performed server-side.';
comment on table public.lms_xapi_statements is 'xAPI statement/LRS foundation. Public clients must not be given provider or engine credentials.';
comment on table public.lms_lti_tools is 'LTI 1.3 / LTI Advantage configuration for Deep Linking, NRPS and AGS.';
comment on table public.lms_learning_events is 'Enterprise analytics event stream used for learner, course, cohort and assessment analytics.';
comment on table public.global_subject_catalogue is 'Normalized global subject catalogue. Curriculum-specific mappings preserve the existing curriculum catalogue and provenance.';
