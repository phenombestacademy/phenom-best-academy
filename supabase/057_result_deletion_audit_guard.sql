-- Require a documented Super Admin audit before permanent result deletion
create or replace function public.require_result_deletion_audit() returns trigger language plpgsql security definer set search_path=public as $$
begin
 if not exists(select 1 from public.result_deletion_audit a where a.result_entry_id=old.id and a.deleted_by=auth.uid() and a.deleted_at >= now()-interval '5 minutes') then
   raise exception 'Permanent result deletion requires a documented Super Admin deletion audit';
 end if;
 return old;
end; $$;
drop trigger if exists trg_require_result_deletion_audit on public.student_result_entries;
create trigger trg_require_result_deletion_audit before delete on public.student_result_entries for each row execute function public.require_result_deletion_audit();
revoke execute on function public.require_result_deletion_audit() from public,anon,authenticated;