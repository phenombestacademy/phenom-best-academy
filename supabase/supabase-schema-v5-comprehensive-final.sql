-- Phenom Best Academy V5 Comprehensive Final migration.
-- Run the existing base/platform/school schema first, then run the new additions
-- below (the repository also contains the source schema files for reference).

-- CMS editable blocks
create table if not exists public.cms_content_blocks (
  id uuid primary key default gen_random_uuid(), page_key text not null, block_key text not null,
  title text, body text, icon_name text, image_url text, href text, sort_order integer not null default 0,
  published boolean not null default true, updated_by uuid references auth.users(id) on delete set null,
  updated_at timestamptz not null default now(), unique(page_key,block_key)
);
alter table public.cms_content_blocks enable row level security;
drop policy if exists "cms blocks public read" on public.cms_content_blocks;
drop policy if exists "cms blocks super admin" on public.cms_content_blocks;
create policy "cms blocks public read" on public.cms_content_blocks for select using(published=true or public.is_super_admin());
create policy "cms blocks super admin" on public.cms_content_blocks for all using(public.is_super_admin()) with check(public.is_super_admin());

-- Single Super Admin invariant
create or replace function public.enforce_single_super_admin() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.role='super_admin' and (tg_op='INSERT' or (tg_op='UPDATE' and old.role is distinct from 'super_admin')) then
    if exists(select 1 from public.profiles where role='super_admin' and id<>new.id) then
      raise exception 'A Super Admin already exists. The designated Super Admin cannot be duplicated.';
    end if;
  end if;
  return new;
end; $$;
drop trigger if exists trg_single_super_admin on public.profiles;
create trigger trg_single_super_admin before insert or update of role on public.profiles for each row execute function public.enforce_single_super_admin();

-- School assignment/LMS, calendar and announcements
create table if not exists public.school_assignment_tasks (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade,
 teacher_id uuid not null references auth.users(id) on delete cascade, class_id uuid not null references public.school_classes(id) on delete cascade,
 subject_id uuid references public.school_subjects(id) on delete set null, level_label text, topic text not null, title text not null,
 instructions text, due_at timestamptz, status text not null default 'draft' check(status in ('draft','published','closed')), created_at timestamptz not null default now()
);
create table if not exists public.school_assignment_submissions (
 id uuid primary key default gen_random_uuid(), task_id uuid not null references public.school_assignment_tasks(id) on delete cascade,
 student_id uuid not null references auth.users(id) on delete cascade, answer_text text, attachment_urls jsonb not null default '[]'::jsonb,
 score numeric(8,2), teacher_feedback text, submitted_at timestamptz, graded_at timestamptz, unique(task_id,student_id)
);
create table if not exists public.school_calendar_events (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade,
 title text not null, description text, event_type text not null default 'academic', starts_at timestamptz not null, ends_at timestamptz,
 location text, created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now()
);
create table if not exists public.school_announcements (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade,
 title text not null, body text not null, published boolean not null default false, starts_at timestamptz, ends_at timestamptz,
 created_by uuid references auth.users(id) on delete set null, created_at timestamptz not null default now()
);

create table if not exists public.academic_subject_catalog (
 id uuid primary key default gen_random_uuid(), stage text not null, domain text not null, name text not null,
 aliases text[] not null default '{}', exam_tags text[] not null default '{}', active boolean not null default true, unique(stage,name)
);
-- The complete seed is stored in supabase-schema-school-results.sql in the repository.

create or replace function public.is_school_admin_for(p_school uuid) returns boolean language sql stable security definer set search_path=public as $$
 select public.is_staff() or exists(select 1 from public.school_members m where m.school_id=p_school and m.user_id=auth.uid() and m.role='school_admin') $$;
create or replace function public.is_teacher_for(p_school uuid) returns boolean language sql stable security definer set search_path=public as $$
 select public.is_staff() or exists(select 1 from public.school_members m where m.school_id=p_school and m.user_id=auth.uid() and m.role in ('school_admin','teacher')) $$;
alter table public.school_assignment_tasks enable row level security;
alter table public.school_assignment_submissions enable row level security;
alter table public.school_calendar_events enable row level security;
alter table public.school_announcements enable row level security;
alter table public.academic_subject_catalog enable row level security;
drop policy if exists "school admins manage assignment tasks" on public.school_assignment_tasks;
drop policy if exists "assignment students access" on public.school_assignment_submissions;
drop policy if exists "school admins manage calendar" on public.school_calendar_events;
drop policy if exists "school admins manage announcements" on public.school_announcements;
drop policy if exists "catalog readable" on public.academic_subject_catalog;
drop policy if exists "catalog staff manage" on public.academic_subject_catalog;
create policy "school admins manage assignment tasks" on public.school_assignment_tasks for all using(public.is_school_admin_for(school_id) or public.is_teacher_for(school_id)) with check(public.is_school_admin_for(school_id) or public.is_teacher_for(school_id));
create policy "assignment students access" on public.school_assignment_submissions for all using(exists(select 1 from public.school_assignment_tasks t where t.id=task_id and (public.is_school_admin_for(t.school_id) or t.teacher_id=auth.uid() or student_id=auth.uid()))) with check(exists(select 1 from public.school_assignment_tasks t where t.id=task_id and (public.is_school_admin_for(t.school_id) or t.teacher_id=auth.uid() or student_id=auth.uid())));
create policy "school admins manage calendar" on public.school_calendar_events for all using(public.is_school_admin_for(school_id)) with check(public.is_school_admin_for(school_id));
create policy "school admins manage announcements" on public.school_announcements for all using(public.is_school_admin_for(school_id)) with check(public.is_school_admin_for(school_id));
create policy "catalog readable" on public.academic_subject_catalog for select using(true);
create policy "catalog staff manage" on public.academic_subject_catalog for all using(public.is_staff()) with check(public.is_staff());
