-- Durable, school-scoped teacher-authored CBT workspace.
alter table public.school_cbt_exams
  add column if not exists instructions text,
  add column if not exists created_by uuid references auth.users(id),
  add column if not exists updated_at timestamptz not null default now();

alter table public.school_cbt_exam_questions
  add column if not exists media jsonb not null default '[]'::jsonb,
  add column if not exists resource_notes text;

update public.school_cbt_exams
set created_by=coalesce(created_by,teacher_id),
    updated_at=coalesce(updated_at,created_at)
where created_by is null;

create table if not exists public.school_cbt_exam_assignments (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.school_cbt_exams(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  assigned_by uuid not null references auth.users(id),
  assigned_at timestamptz not null default now(),
  unique(exam_id,student_id)
);

create table if not exists public.school_cbt_exam_attempts (
  id uuid primary key default gen_random_uuid(),
  exam_id uuid not null references public.school_cbt_exams(id) on delete cascade,
  assignment_id uuid not null references public.school_cbt_exam_assignments(id) on delete cascade,
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  attempt_no integer not null default 1,
  answers jsonb not null default '{}'::jsonb,
  score numeric,
  correct_count integer,
  total_marks numeric,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  status text not null default 'in_progress' check(status in ('in_progress','submitted','graded','abandoned'))
);

create table if not exists public.school_cbt_exam_media (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  exam_id uuid not null references public.school_cbt_exams(id) on delete cascade,
  question_id uuid references public.school_cbt_exam_questions(id) on delete cascade,
  uploaded_by uuid not null references auth.users(id) on delete cascade,
  storage_bucket text not null default 'media',
  storage_path text not null unique,
  media_type text not null check(media_type in ('image','video','audio')),
  mime_type text,
  file_size bigint,
  created_at timestamptz not null default now()
);

create table if not exists public.school_cbt_question_resources (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  exam_id uuid not null references public.school_cbt_exams(id) on delete cascade,
  question_id uuid not null references public.school_cbt_exam_questions(id) on delete cascade,
  library_item_id uuid not null references public.lms_curriculum_library_items(id) on delete restrict,
  relation_type text not null default 'supporting_resource',
  created_at timestamptz not null default now(),
  unique(question_id,library_item_id)
);

create table if not exists public.school_cbt_exam_questions_student (
  id uuid primary key references public.school_cbt_exam_questions(id) on delete cascade,
  exam_id uuid not null references public.school_cbt_exams(id) on delete cascade,
  position integer not null,
  question_text text not null,
  options jsonb,
  image_url text,
  media jsonb not null default '[]'::jsonb,
  marks numeric not null default 1
);

create index if not exists school_cbt_exam_assignments_student_idx on public.school_cbt_exam_assignments(school_id,student_id,assigned_at desc);
create index if not exists school_cbt_exam_attempts_student_idx on public.school_cbt_exam_attempts(school_id,student_id,started_at desc);
create index if not exists school_cbt_exam_media_scope_idx on public.school_cbt_exam_media(school_id,exam_id,question_id);
create index if not exists school_cbt_question_resources_scope_idx on public.school_cbt_question_resources(school_id,exam_id,question_id);

create schema if not exists private;
create or replace function private.sync_school_cbt_student_question()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if tg_op='DELETE' then delete from public.school_cbt_exam_questions_student where id=old.id; return old; end if;
  insert into public.school_cbt_exam_questions_student(id,exam_id,position,question_text,options,image_url,media,marks)
  values(new.id,new.exam_id,new.position,new.question_text,new.options,new.image_url,coalesce(new.media,'[]'::jsonb),new.marks)
  on conflict(id) do update set exam_id=excluded.exam_id,position=excluded.position,question_text=excluded.question_text,
    options=excluded.options,image_url=excluded.image_url,media=excluded.media,marks=excluded.marks;
  return new;
end; $$;
revoke all on function private.sync_school_cbt_student_question() from public,anon,authenticated;
drop trigger if exists trg_sync_school_cbt_student_question on public.school_cbt_exam_questions;
create trigger trg_sync_school_cbt_student_question after insert or update or delete on public.school_cbt_exam_questions
for each row execute function private.sync_school_cbt_student_question();

alter table public.school_cbt_exam_questions_student enable row level security;
revoke all on table public.school_cbt_exam_questions_student from anon,authenticated;
grant select on table public.school_cbt_exam_questions_student to authenticated;
create policy "cbt student questions assigned only" on public.school_cbt_exam_questions_student for select to authenticated
using(exists(select 1 from public.school_cbt_exam_assignments a where a.exam_id=school_cbt_exam_questions_student.exam_id and a.student_id=auth.uid()) or is_super_admin());

drop policy if exists "cbt exams scoped" on public.school_cbt_exams;
create policy "cbt exams teacher/admin manage" on public.school_cbt_exams for all to authenticated
using(is_super_admin() or is_school_member(school_id,array['school_admin']::text[]) or (teacher_id=auth.uid() and is_assigned_teacher_for_subject_name(class_id,subject)))
with check(is_super_admin() or is_school_member(school_id,array['school_admin']::text[]) or (teacher_id=auth.uid() and is_assigned_teacher_for_subject_name(class_id,subject)));
create policy "cbt exams assigned students read" on public.school_cbt_exams for select to authenticated
using(exists(select 1 from public.school_cbt_exam_assignments a where a.exam_id=school_cbt_exams.id and a.student_id=auth.uid() and a.school_id=school_cbt_exams.school_id));

drop policy if exists "cbt questions teacher manage" on public.school_cbt_exam_questions;
create policy "cbt questions teacher/admin manage" on public.school_cbt_exam_questions for all to authenticated
using(exists(select 1 from public.school_cbt_exams e where e.id=school_cbt_exam_questions.exam_id and (is_super_admin() or is_school_member(e.school_id,array['school_admin']::text[]) or e.teacher_id=auth.uid())))
with check(exists(select 1 from public.school_cbt_exams e where e.id=school_cbt_exam_questions.exam_id and (is_super_admin() or is_school_member(e.school_id,array['school_admin']::text[]) or e.teacher_id=auth.uid())));

alter table public.school_cbt_exam_assignments enable row level security;
revoke all on table public.school_cbt_exam_assignments from anon,authenticated;
grant select,insert,update,delete on table public.school_cbt_exam_assignments to authenticated;
create policy "cbt assignments staff manage" on public.school_cbt_exam_assignments for all to authenticated
using(is_super_admin() or is_school_member(school_id,array['school_admin']::text[]) or assigned_by=auth.uid())
with check(is_super_admin() or is_school_member(school_id,array['school_admin']::text[]) or assigned_by=auth.uid());
create policy "cbt assignments students read own" on public.school_cbt_exam_assignments for select to authenticated using(student_id=auth.uid());

alter table public.school_cbt_exam_attempts enable row level security;
revoke all on table public.school_cbt_exam_attempts from anon,authenticated;
grant select,insert,update on table public.school_cbt_exam_attempts to authenticated;
create policy "cbt attempts read authorised" on public.school_cbt_exam_attempts for select to authenticated
using(student_id=auth.uid() or is_super_admin() or is_school_member(school_id,array['school_admin']::text[]) or exists(select 1 from public.school_cbt_exams e where e.id=school_cbt_exam_attempts.exam_id and e.teacher_id=auth.uid()));
create policy "cbt attempts student create own" on public.school_cbt_exam_attempts for insert to authenticated with check(student_id=auth.uid());
create policy "cbt attempts student update own" on public.school_cbt_exam_attempts for update to authenticated using(student_id=auth.uid()) with check(student_id=auth.uid());

alter table public.school_cbt_exam_media enable row level security;
revoke all on table public.school_cbt_exam_media from anon,authenticated;
grant select,insert,update,delete on table public.school_cbt_exam_media to authenticated;
create policy "cbt media school scoped" on public.school_cbt_exam_media for all to authenticated
using(is_super_admin() or is_school_member(school_id,array['school_admin','teacher']::text[]) or uploaded_by=auth.uid())
with check(is_super_admin() or is_school_member(school_id,array['school_admin','teacher']::text[]) or uploaded_by=auth.uid());

alter table public.school_cbt_question_resources enable row level security;
revoke all on table public.school_cbt_question_resources from anon,authenticated;
grant select,insert,update,delete on table public.school_cbt_question_resources to authenticated;
create policy "cbt resource links school scoped" on public.school_cbt_question_resources for all to authenticated
using(is_super_admin() or is_school_member(school_id,array['school_admin','teacher']::text[]))
with check(is_super_admin() or is_school_member(school_id,array['school_admin','teacher']::text[]));

drop policy if exists "Public can read media files" on storage.objects;
create policy "Public can read non-CBT media files" on storage.objects for select to public
using(bucket_id='media' and not(split_part(name,'/',1)='schools' and split_part(name,'/',3)='cbt'));
create policy "School members can read CBT media" on storage.objects for select to authenticated
using(bucket_id='media' and split_part(name,'/',1)='schools' and split_part(name,'/',3)='cbt' and is_school_member((nullif(split_part(name,'/',2),''))::uuid,array['school_admin','teacher','student']::text[]));
create policy "School teachers can upload CBT media" on storage.objects for insert to authenticated
with check(bucket_id='media' and split_part(name,'/',1)='schools' and split_part(name,'/',3)='cbt' and is_school_member((nullif(split_part(name,'/',2),''))::uuid,array['school_admin','teacher']::text[]));
create policy "School teachers can update CBT media" on storage.objects for update to authenticated
using(bucket_id='media' and split_part(name,'/',1)='schools' and split_part(name,'/',3)='cbt' and is_school_member((nullif(split_part(name,'/',2),''))::uuid,array['school_admin','teacher']::text[]))
with check(bucket_id='media' and split_part(name,'/',1)='schools' and split_part(name,'/',3)='cbt' and is_school_member((nullif(split_part(name,'/',2),''))::uuid,array['school_admin','teacher']::text[]));
create policy "School admins and super admin delete CBT media" on storage.objects for delete to authenticated
using(bucket_id='media' and split_part(name,'/',1)='schools' and split_part(name,'/',3)='cbt' and (is_super_admin() or is_school_member((nullif(split_part(name,'/',2),''))::uuid,array['school_admin']::text[])));

create or replace function public.touch_school_cbt_exam_updated_at()
returns trigger language plpgsql security invoker set search_path=public as $$ begin new.updated_at=now(); return new; end; $$;
drop trigger if exists trg_touch_school_cbt_exam_updated_at on public.school_cbt_exams;
create trigger trg_touch_school_cbt_exam_updated_at before update on public.school_cbt_exams for each row execute function public.touch_school_cbt_exam_updated_at();