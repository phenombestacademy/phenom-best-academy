-- 051: add auditable student school-lifecycle history for admission, readmission,
-- transfer, withdrawal, graduation and other status changes.

create table if not exists public.student_school_status_history (
  id uuid primary key default gen_random_uuid(),
  school_id uuid not null references public.schools(id) on delete cascade,
  student_id uuid not null references auth.users(id) on delete cascade,
  previous_status text,
  new_status text not null,
  action text not null,
  effective_on date not null default current_date,
  reason text,
  recorded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint student_school_status_history_action_check check (action in ('admission','readmission','status_change','transfer','withdrawal','graduation','suspension','reactivation','archival')),
  constraint student_school_status_history_status_check check (new_status in ('active','suspended','withdrawn','transferred','graduated','archived'))
);

alter table public.student_school_status_history enable row level security;
revoke all on public.student_school_status_history from anon,authenticated;
grant select,insert,update,delete on public.student_school_status_history to authenticated;

create policy "school lifecycle history scoped read" on public.student_school_status_history for select to authenticated
using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or student_id=auth.uid() or public.is_parent_of(student_id));
create policy "school lifecycle history admin insert" on public.student_school_status_history for insert to authenticated
with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "school lifecycle history admin update" on public.student_school_status_history for update to authenticated
using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']))
with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "school lifecycle history admin delete" on public.student_school_status_history for delete to authenticated
using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create index if not exists student_school_status_history_student_date_idx on public.student_school_status_history(school_id,student_id,effective_on desc);

create or replace function public.audit_student_school_status()
returns trigger language plpgsql security definer set search_path=public
as $$
declare action_name text;
begin
  if tg_op='INSERT' then
    if new.status is distinct from 'active' and not public.is_school_admin_for(new.school_id) then
      raise exception 'Only the school administrator or Phenom Best LMS Super Admin may set a non-active admission status.';
    end if;
    action_name:='admission';
    insert into public.student_school_status_history(school_id,student_id,previous_status,new_status,action,effective_on,recorded_by)
    values(new.school_id,new.student_id,null,new.status,action_name,current_date,auth.uid());
    return new;
  end if;
  if new.status is distinct from old.status then
    if not public.is_school_admin_for(new.school_id) then
      raise exception 'Only the school administrator or Phenom Best LMS Super Admin may change a student school status.';
    end if;
    action_name:=case
      when new.status='active' and old.status in ('withdrawn','transferred','suspended','archived') then case when old.status in ('withdrawn','transferred','archived') then 'readmission' else 'reactivation' end
      when new.status='transferred' then 'transfer'
      when new.status='withdrawn' then 'withdrawal'
      when new.status='graduated' then 'graduation'
      when new.status='suspended' then 'suspension'
      when new.status='archived' then 'archival'
      else 'status_change' end;
    insert into public.student_school_status_history(school_id,student_id,previous_status,new_status,action,effective_on,recorded_by)
    values(new.school_id,new.student_id,old.status,new.status,action_name,current_date,auth.uid());
  end if;
  return new;
end;
$$;

drop trigger if exists trg_audit_student_school_status on public.student_school_records;
create trigger trg_audit_student_school_status before insert or update of status on public.student_school_records for each row execute function public.audit_student_school_status();
revoke all on function public.audit_student_school_status() from public,anon,authenticated;