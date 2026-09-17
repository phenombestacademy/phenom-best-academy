-- Phenom Best Academy V5.1 — school privacy, result locking/publication, class/subject scope and ephemeral community media
create extension if not exists pgcrypto;

alter table public.school_classes add column if not exists class_teacher_id uuid references auth.users(id) on delete set null;
alter table public.student_school_records add column if not exists height_cm numeric(6,2);
alter table public.student_school_records add column if not exists weight_kg numeric(6,2);
alter table public.student_school_records add column if not exists psychomotor jsonb not null default '{}'::jsonb;
alter table public.student_school_records add column if not exists performance_information text;

create table if not exists public.student_sensitive_records (
  id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade, blood_group text, genotype text, allergies text,
  parent_full_name text, parent_phone text, parent_email text, address text, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(school_id,student_id)
);
create table if not exists public.school_sensitive_access (
  id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade,
  class_id uuid not null references public.school_classes(id) on delete cascade, enabled boolean not null default false,
  enabled_by uuid references auth.users(id) on delete set null, enabled_at timestamptz, unique(school_id,class_id)
);

create table if not exists public.community_ephemeral_shares (
  id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id) on delete cascade, kind text not null check(kind in ('image','document','video','audio')),
  file_name text, mime_type text, created_at timestamptz not null default now(), expires_at timestamptz not null default (now()+interval '15 minutes')
);
-- This table is signalling metadata only. It intentionally has no file/blob column and is automatically expired.
create index if not exists community_ephemeral_shares_expiry_idx on public.community_ephemeral_shares(expires_at);

alter table public.student_sensitive_records enable row level security;
alter table public.school_sensitive_access enable row level security;
alter table public.community_ephemeral_shares enable row level security;

drop policy if exists "sensitive records restricted" on public.student_sensitive_records;
create policy "sensitive records restricted" on public.student_sensitive_records for all to authenticated
using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or exists(
  select 1 from public.school_sensitive_access a join public.school_classes c on c.id=a.class_id
  join public.class_members cm on cm.class_id=c.id and cm.user_id=auth.uid() and cm.role='teacher'
  where a.school_id=student_sensitive_records.school_id and a.enabled and cm.user_id=auth.uid()
))
with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));

drop policy if exists "sensitive access school admin" on public.school_sensitive_access;
create policy "sensitive access school admin" on public.school_sensitive_access for all to authenticated
using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']))
with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));

drop policy if exists "ephemeral shares members" on public.community_ephemeral_shares;
create policy "ephemeral shares members" on public.community_ephemeral_shares for select to authenticated
using (exists(select 1 from public.conversation_members m where m.conversation_id=community_ephemeral_shares.conversation_id and m.user_id=auth.uid()) or public.is_super_admin());
create policy "ephemeral shares insert member" on public.community_ephemeral_shares for insert to authenticated
with check (sender_id=auth.uid() and exists(select 1 from public.conversation_members m where m.conversation_id=community_ephemeral_shares.conversation_id and m.user_id=auth.uid()));

create or replace function public.is_class_teacher_for(p_class uuid) returns boolean
language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.school_classes c where c.id=p_class and c.class_teacher_id=auth.uid());
$$;
create or replace function public.is_subject_teacher_for(p_class uuid,p_subject uuid) returns boolean
language sql stable security definer set search_path=public as $$
 select exists(select 1 from public.class_subjects cs where cs.class_id=p_class and cs.subject_id=p_subject and cs.teacher_id=auth.uid() and cs.active);
$$;
create or replace function public.can_view_school_student_profile(p_school uuid,p_class uuid,p_student uuid) returns boolean
language sql stable security definer set search_path=public as $$
 select public.is_super_admin() or public.is_school_member(p_school,array['school_admin'])
 or exists(select 1 from public.class_members cm where cm.class_id=p_class and cm.user_id=auth.uid() and cm.role='teacher')
 or (p_student=auth.uid());
$$;
create or replace function public.can_manage_school_student_profile(p_school uuid,p_class uuid) returns boolean
language sql stable security definer set search_path=public as $$
 select public.is_super_admin() or public.is_school_member(p_school,array['school_admin']) or public.is_class_teacher_for(p_class);
$$;

-- Only class teacher + Super Admin can enter/edit attendance. School admin can view only.
create or replace function public.can_manage_attendance(p_school uuid,p_class uuid,p_student uuid) returns boolean
language sql stable security definer set search_path=public as $$
 select public.is_super_admin() or (public.is_class_teacher_for(p_class) and exists(select 1 from public.school_classes c where c.id=p_class and c.school_id=p_school)
 and exists(select 1 from public.class_members s where s.class_id=p_class and s.user_id=p_student and s.role='student'));
$$;
create or replace function public.can_view_attendance(p_school uuid,p_class uuid,p_student uuid) returns boolean
language sql stable security definer set search_path=public as $$
 select public.is_super_admin() or public.is_school_member(p_school,array['school_admin'])
 or public.is_class_teacher_for(p_class) or exists(select 1 from public.class_members cm where cm.class_id=p_class and cm.user_id=auth.uid() and cm.role='teacher')
 or p_student=auth.uid() or exists(select 1 from public.parent_links pl where pl.parent_id=auth.uid() and pl.child_id=p_student and pl.status='active');
$$;

-- Result publication state is the gate for student/parent visibility.
create or replace function public.can_view_published_result(p_school uuid,p_class uuid,p_student uuid,p_session uuid,p_term integer) returns boolean
language sql stable security definer set search_path=public as $$
 select public.is_super_admin() or public.is_school_member(p_school,array['school_admin']) or public.is_class_teacher_for(p_class)
 or (p_student=auth.uid() or exists(select 1 from public.parent_links pl where pl.parent_id=auth.uid() and pl.child_id=p_student and pl.status='active'))
 and exists(select 1 from public.school_result_publications rp where rp.school_id=p_school and rp.class_id=p_class and rp.student_id=p_student and rp.session_id=p_session and rp.term_no=p_term and rp.published=true);
$$;

-- Teacher result entry is strictly subject-assignment based. No teacher can edit another teacher's subject.
create or replace function public.can_manage_result_entry(p_school uuid,p_class uuid,p_subject uuid,p_student uuid) returns boolean
language sql stable security definer set search_path=public as $$
 select public.is_super_admin() or public.is_subject_teacher_for(p_class,p_subject) and exists(select 1 from public.class_members cm where cm.class_id=p_class and cm.user_id=p_student and cm.role='student')
 or public.is_school_member(p_school,array['school_admin']) and false;
$$;

-- Result rows become immutable after insertion. Super Admin is the correction path.
create or replace function public.prevent_result_mutation() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if public.is_super_admin() then return coalesce(new,old); end if;
 if tg_op in ('UPDATE','DELETE') then raise exception 'Result entries are locked after entry. Contact the Academy Super Admin for corrections.'; end if;
 return new;
end; $$;
drop trigger if exists trg_result_immutable on public.student_result_entries;
create trigger trg_result_immutable before update or delete on public.student_result_entries for each row execute function public.prevent_result_mutation();

-- Recalculate the derived total/percentage whenever a score is inserted.
create or replace function public.refresh_student_term_summary() returns trigger language plpgsql security definer set search_path=public as $$
declare x record;
begin
 select * into x from public.calculate_student_subject_term(new.session_id,new.term_no,new.class_id,new.student_id,new.subject_id);
 insert into public.student_term_summaries(school_id,session_id,term_no,class_id,student_id,subject_id,ca_total,test_total,midterm_total,exam_total,term_total,term_percentage,generated_at)
 values(new.school_id,new.session_id,new.term_no,new.class_id,new.student_id,new.subject_id,x.ca_total,x.test_total,x.midterm_total,x.exam_total,x.term_total,x.term_percentage,now())
 on conflict(session_id,term_no,class_id,student_id,subject_id) do update set ca_total=excluded.ca_total,test_total=excluded.test_total,midterm_total=excluded.midterm_total,exam_total=excluded.exam_total,term_total=excluded.term_total,term_percentage=excluded.term_percentage,generated_at=now();
 return new;
end; $$;
drop trigger if exists trg_refresh_student_term_summary on public.student_result_entries;
create trigger trg_refresh_student_term_summary after insert on public.student_result_entries for each row execute function public.refresh_student_term_summary();

-- Drop legacy broad result/attendance policies before installing the stricter rules.
drop policy if exists "result entries view authorised" on public.student_result_entries;
drop policy if exists "result entries manage authorised" on public.student_result_entries;
drop policy if exists "result entries update authorised" on public.student_result_entries;
drop policy if exists "result summaries authorised" on public.student_term_summaries;
drop policy if exists "result summaries manage" on public.student_term_summaries;
drop policy if exists "result publications authorised" on public.school_result_publications;
drop policy if exists "result publications manage" on public.school_result_publications;
drop policy if exists "student records authorised" on public.student_school_records;
drop policy if exists "attendance read authorised" on public.student_attendance;
drop policy if exists "attendance insert authorised" on public.student_attendance;
drop policy if exists "attendance update authorised" on public.student_attendance;

create policy "student records scoped" on public.student_school_records for select to authenticated
using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or id is not null and exists(select 1 from public.class_members cm join public.school_classes c on c.id=cm.class_id where cm.user_id=student_school_records.student_id and cm.role='student' and public.can_view_school_student_profile(c.school_id,c.id,student_school_records.student_id)));
create policy "student records class teacher admin manage" on public.student_school_records for insert to authenticated
with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or exists(select 1 from public.school_classes c where c.school_id=school_id and public.is_class_teacher_for(c.id)));
create policy "student records class teacher admin update" on public.student_school_records for update to authenticated
using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or exists(select 1 from public.school_classes c where c.school_id=school_id and public.is_class_teacher_for(c.id)))
with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or exists(select 1 from public.school_classes c where c.school_id=school_id and public.is_class_teacher_for(c.id)));

create policy "result entries scoped read" on public.student_result_entries for select to authenticated
using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or public.is_subject_teacher_for(class_id,subject_id) or public.is_class_teacher_for(class_id) or public.can_view_published_result(school_id,class_id,student_id,session_id,term_no));
create policy "result entries subject insert" on public.student_result_entries for insert to authenticated
with check (public.can_manage_result_entry(school_id,class_id,subject_id,student_id));
create policy "result summaries scoped read" on public.student_term_summaries for select to authenticated
using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or public.is_class_teacher_for(class_id) or public.is_subject_teacher_for(class_id,subject_id) or public.can_view_published_result(school_id,class_id,student_id,session_id,term_no));

create policy "result publications scoped read" on public.school_result_publications for select to authenticated
using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or public.is_class_teacher_for(class_id) or (published and (student_id=auth.uid() or exists(select 1 from public.parent_links pl where pl.parent_id=auth.uid() and pl.child_id=student_id))));
create policy "result publications admin publish" on public.school_result_publications for all to authenticated
using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']))
with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));

-- Teacher assignment privacy: only the assigned teacher can manage the subject; school admin and Super Admin oversee.
drop policy if exists "class subjects authorised" on public.class_subjects;
create policy "class subjects strict" on public.class_subjects for all to authenticated
using (public.is_super_admin() or public.is_school_member((select school_id from public.school_classes c where c.id=class_id),array['school_admin']) or teacher_id=auth.uid())
with check (public.is_super_admin() or public.is_school_member((select school_id from public.school_classes c where c.id=class_id),array['school_admin']) or teacher_id=auth.uid());

-- Expire signalling metadata automatically when touched; no media is stored in this table.
create or replace function public.cleanup_ephemeral_share_metadata() returns integer language plpgsql security definer set search_path=public as $$
declare n integer; begin delete from public.community_ephemeral_shares where expires_at<now(); get diagnostics n=row_count; return n; end; $$;
revoke all on function public.cleanup_ephemeral_share_metadata() from public; grant execute on function public.cleanup_ephemeral_share_metadata() to authenticated;
