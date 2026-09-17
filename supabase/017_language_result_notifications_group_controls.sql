-- V5.2: multilingual UI defaults, group-share restrictions and result-release notification queue
create table if not exists public.conversation_member_restrictions(
 id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.conversations(id) on delete cascade,
 user_id uuid not null references auth.users(id) on delete cascade, restricted_by uuid not null references auth.users(id) on delete cascade,
 reason text, created_at timestamptz not null default now(), unique(conversation_id,user_id)
);
alter table public.conversation_member_restrictions enable row level security;
create policy "conversation restrictions moderators" on public.conversation_member_restrictions for all to authenticated
using(public.is_super_admin() or restricted_by=auth.uid() or exists(select 1 from public.conversation_members m where m.conversation_id=conversation_member_restrictions.conversation_id and m.user_id=auth.uid() and m.role in ('owner','moderator')))
with check(public.is_super_admin() or restricted_by=auth.uid());

create table if not exists public.result_release_notifications(
 id uuid primary key default gen_random_uuid(), publication_id uuid not null references public.school_result_publications(id) on delete cascade,
 recipient_id uuid not null references auth.users(id) on delete cascade, recipient_type text not null check(recipient_type in ('student','parent')),
 email text not null, status text not null default 'queued' check(status in ('queued','sent','failed')), sent_at timestamptz, error_message text,
 created_at timestamptz not null default now(), unique(publication_id,recipient_id)
);
alter table public.result_release_notifications enable row level security;
create policy "result release own read" on public.result_release_notifications for select to authenticated using(recipient_id=auth.uid() or public.is_super_admin());

create or replace function public.queue_result_release_notifications() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if new.published=true and (tg_op='INSERT' or old.published is distinct from true) then
  insert into public.result_release_notifications(publication_id,recipient_id,recipient_type,email)
  select new.id,new.student_id,'student',coalesce(u.email,'') from auth.users u where u.id=new.student_id
  on conflict do nothing;
  insert into public.result_release_notifications(publication_id,recipient_id,recipient_type,email)
  select new.id,pl.parent_id,'parent',coalesce(u.email,'') from public.parent_links pl join auth.users u on u.id=pl.parent_id
  where pl.child_id=new.student_id and pl.status='active' on conflict do nothing;
 end if;
 return new;
end; $$;
drop trigger if exists trg_queue_result_release_notifications on public.school_result_publications;
create trigger trg_queue_result_release_notifications after insert or update of published on public.school_result_publications for each row execute function public.queue_result_release_notifications();

-- Restrict sensitive guardian/emergency records to school admin/Super Admin, with optional class-teacher access controlled by school_sensitive_access.
drop policy if exists "growth authorised" on public.student_growth_records;
drop policy if exists "guardian authorised" on public.student_guardians;
drop policy if exists "emergency health authorised" on public.student_emergency_profiles;
drop policy if exists "emergency health manage" on public.student_emergency_profiles;
create policy "growth scoped" on public.student_growth_records for all to authenticated using(public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or exists(select 1 from public.school_classes c join public.class_members cm on cm.class_id=c.id and cm.user_id=auth.uid() and cm.role='teacher' where c.school_id=student_growth_records.school_id and public.is_class_teacher_for(c.id))) with check(public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or exists(select 1 from public.school_classes c where c.school_id=school_id and public.is_class_teacher_for(c.id)));
create policy "guardian scoped" on public.student_guardians for all to authenticated using(public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or exists(select 1 from public.school_sensitive_access a join public.class_members cm on cm.class_id=a.class_id and cm.user_id=auth.uid() and cm.role='teacher' where a.school_id=student_guardians.school_id and a.enabled)) with check(public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "emergency scoped" on public.student_emergency_profiles for all to authenticated using(public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or exists(select 1 from public.school_sensitive_access a join public.class_members cm on cm.class_id=a.class_id and cm.user_id=auth.uid() and cm.role='teacher' where a.school_id=student_emergency_profiles.school_id and a.enabled)) with check(public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));

create index if not exists result_release_notifications_status_idx on public.result_release_notifications(status,created_at);
create index if not exists conversation_member_restrictions_conversation_idx on public.conversation_member_restrictions(conversation_id);
