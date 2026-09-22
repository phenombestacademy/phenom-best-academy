-- Phenom Best LMS school people, progression and controlled result deletion
create table if not exists public.school_member_invites (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade,
 email text not null, full_name text not null default '', requested_role text not null check (requested_role in ('school_admin','teacher','student','parent')),
 status text not null default 'pending' check (status in ('pending','sent','accepted','cancelled','expired')),
 invited_by uuid references auth.users(id), invited_user_id uuid references auth.users(id), invite_token text, sent_at timestamptz, accepted_at timestamptz,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now(), unique(school_id,email,requested_role)
);
create index if not exists school_member_invites_school_idx on public.school_member_invites(school_id,status);
create table if not exists public.student_class_history (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade,
 student_id uuid not null references auth.users(id) on delete cascade, class_id uuid not null references public.school_classes(id) on delete restrict,
 previous_class_id uuid references public.school_classes(id) on delete restrict, session_id uuid, term_no integer,
 action text not null check (action in ('admission','promotion','double_promotion','transfer_in','transfer_out','readmission','graduation','withdrawal')),
 effective_on date not null default current_date, reason text, recorded_by uuid references auth.users(id), created_at timestamptz not null default now()
);
create index if not exists student_class_history_lookup_idx on public.student_class_history(school_id,student_id,effective_on desc);
create table if not exists public.result_deletion_audit (
 id uuid primary key default gen_random_uuid(), school_id uuid not null references public.schools(id) on delete cascade,
 result_entry_id uuid not null, deleted_by uuid not null references auth.users(id), reason text not null, deleted_at timestamptz not null default now()
);
alter table public.school_member_invites enable row level security;
alter table public.student_class_history enable row level security;
alter table public.result_deletion_audit enable row level security;
drop policy if exists school_member_invites_select on public.school_member_invites;
drop policy if exists school_member_invites_manage on public.school_member_invites;
create policy school_member_invites_select on public.school_member_invites for select to authenticated using (public.is_super_admin() or public.is_school_admin_for(school_id));
create policy school_member_invites_manage on public.school_member_invites for all to authenticated using (public.is_super_admin() or public.is_school_admin_for(school_id)) with check (public.is_super_admin() or public.is_school_admin_for(school_id));
drop policy if exists student_class_history_select on public.student_class_history;
drop policy if exists student_class_history_manage on public.student_class_history;
create policy student_class_history_select on public.student_class_history for select to authenticated using (public.is_super_admin() or public.is_school_admin_for(school_id) or student_id=auth.uid() or exists(select 1 from public.parent_links pl where pl.parent_id=auth.uid() and pl.child_id=student_class_history.student_id and pl.status='approved'));
create policy student_class_history_manage on public.student_class_history for all to authenticated using (public.is_super_admin() or public.is_school_admin_for(school_id)) with check (public.is_super_admin() or public.is_school_admin_for(school_id));
drop policy if exists result_deletion_audit_select on public.result_deletion_audit;
create policy result_deletion_audit_select on public.result_deletion_audit for select to authenticated using (public.is_super_admin() or public.is_school_admin_for(school_id));
create or replace function public.promote_student(p_school_id uuid,p_student_id uuid,p_new_class_id uuid,p_action text default 'promotion',p_session_id uuid default null,p_term_no integer default null,p_reason text default null)
returns void language plpgsql security definer set search_path=public as $$
declare v_actor uuid:=auth.uid(); v_old_class uuid;
begin
 if not(public.is_super_admin() or public.is_school_admin_for(p_school_id)) then raise exception 'Only the school administrator or Phenom Best LMS Super Admin can promote a student'; end if;
 if p_action not in ('promotion','double_promotion','readmission','transfer_in','graduation') then raise exception 'Unsupported student progression action'; end if;
 if not exists(select 1 from public.school_members where school_id=p_school_id and user_id=p_student_id and role='student' and status='active') then raise exception 'Student is not an active member of this school'; end if;
 if not exists(select 1 from public.school_classes where id=p_new_class_id and school_id=p_school_id) then raise exception 'New class does not belong to this school'; end if;
 select cm.class_id into v_old_class from public.class_members cm join public.school_classes sc on sc.id=cm.class_id and sc.school_id=p_school_id where cm.user_id=p_student_id and cm.role='student' order by cm.created_at desc limit 1;
 insert into public.student_class_history(school_id,student_id,class_id,previous_class_id,session_id,term_no,action,effective_on,reason,recorded_by) values(p_school_id,p_student_id,p_new_class_id,v_old_class,p_session_id,p_term_no,p_action,current_date,p_reason,v_actor);
 delete from public.class_members where user_id=p_student_id and role='student' and class_id in(select id from public.school_classes where school_id=p_school_id);
 insert into public.class_members(class_id,user_id,role) values(p_new_class_id,p_student_id,'student') on conflict(class_id,user_id) do nothing;
 if p_action='readmission' then update public.school_members set status='active' where school_id=p_school_id and user_id=p_student_id and role='student'; end if;
end; $$;
revoke execute on function public.promote_student(uuid,uuid,uuid,text,uuid,integer,text) from public,anon;
grant execute on function public.promote_student(uuid,uuid,uuid,text,uuid,integer,text) to authenticated;
create or replace function public.super_admin_delete_result_entry(p_result_entry_id uuid,p_reason text)
returns void language plpgsql security definer set search_path=public as $$
declare v_school_id uuid;
begin
 if not public.is_super_admin() then raise exception 'Only the Phenom Best LMS Super Admin can permanently delete an existing result'; end if;
 if length(trim(coalesce(p_reason,'')))<10 then raise exception 'A documented reason of at least 10 characters is required'; end if;
 select school_id into v_school_id from public.student_result_entries where id=p_result_entry_id;
 if v_school_id is null then raise exception 'Result entry not found'; end if;
 insert into public.result_deletion_audit(school_id,result_entry_id,deleted_by,reason) values(v_school_id,p_result_entry_id,auth.uid(),trim(p_reason));
 delete from public.student_result_entries where id=p_result_entry_id;
end; $$;
revoke execute on function public.super_admin_delete_result_entry(uuid,text) from public,anon;
grant execute on function public.super_admin_delete_result_entry(uuid,text) to authenticated;
