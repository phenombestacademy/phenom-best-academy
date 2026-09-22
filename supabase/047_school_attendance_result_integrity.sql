-- 047: make attendance upserts deterministic and validate school assessment integrity.

alter table public.student_attendance
  drop constraint if exists student_attendance_school_id_student_id_attendance_date_key;

create unique index if not exists student_attendance_school_student_date_checkpoint_key
on public.student_attendance (school_id, student_id, attendance_date, checkpoint);

create or replace function public.validate_student_attendance()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
begin
  if new.term_no is not null and new.term_no not between 1 and 3 then
    raise exception 'Attendance term must be 1, 2 or 3.';
  end if;
  if new.checkpoint is not null and new.checkpoint not in ('arrival','departure') then
    raise exception 'Attendance checkpoint must be arrival or departure.';
  end if;
  if new.status not in ('present','absent','late','half','excused') then
    raise exception 'Invalid attendance status.';
  end if;
  if new.class_id is not null and not exists (
    select 1 from public.school_classes c
    where c.id=new.class_id and c.school_id=new.school_id
  ) then
    raise exception 'Attendance class does not belong to the selected school.';
  end if;
  if new.class_id is not null and not exists (
    select 1 from public.class_members cm
    where cm.class_id=new.class_id and cm.user_id=new.student_id and cm.role='student'
  ) then
    raise exception 'Attendance student is not enrolled in the selected class.';
  end if;
  if new.session_id is not null and not exists (
    select 1 from public.school_academic_sessions s
    where s.id=new.session_id and s.school_id=new.school_id
  ) then
    raise exception 'Attendance session does not belong to the selected school.';
  end if;
  new.recorded_at=coalesce(new.recorded_at,now());
  new.updated_at=now();
  return new;
end;
$$;

drop trigger if exists trg_validate_student_attendance on public.student_attendance;
create trigger trg_validate_student_attendance
before insert or update on public.student_attendance
for each row execute function public.validate_student_attendance();

create or replace function public.validate_student_result_entry()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
declare
  component_school uuid;
  component_term integer;
  component_max numeric;
begin
  if new.term_no not between 1 and 3 then
    raise exception 'Result term must be 1, 2 or 3.';
  end if;

  select c.school_id,c.term_no,c.max_score
  into component_school,component_term,component_max
  from public.school_result_components c
  where c.id=new.component_id and c.active;

  if component_school is null then
    raise exception 'Result component is missing or inactive.';
  end if;
  if component_school<>new.school_id then
    raise exception 'Result component does not belong to the selected school.';
  end if;
  if component_term<>new.term_no then
    raise exception 'Result component does not belong to the selected term.';
  end if;
  if new.score<0 or new.score>component_max then
    raise exception 'Result score must be between 0 and the component maximum.';
  end if;
  if not exists (
    select 1 from public.school_academic_sessions s
    where s.id=new.session_id and s.school_id=new.school_id
  ) then
    raise exception 'Result session does not belong to the selected school.';
  end if;
  if not exists (
    select 1 from public.school_classes c
    where c.id=new.class_id and c.school_id=new.school_id
  ) then
    raise exception 'Result class does not belong to the selected school.';
  end if;
  if not exists (
    select 1 from public.class_members cm
    where cm.class_id=new.class_id and cm.user_id=new.student_id and cm.role='student'
  ) then
    raise exception 'Result student is not enrolled in the selected class.';
  end if;
  if not exists (
    select 1 from public.school_subjects ss
    where ss.id=new.subject_id and ss.school_id=new.school_id
  ) then
    raise exception 'Result subject does not belong to the selected school.';
  end if;
  new.updated_at=now();
  return new;
end;
$$;

drop trigger if exists trg_validate_student_result_entry on public.student_result_entries;
create trigger trg_validate_student_result_entry
before insert or update on public.student_result_entries
for each row execute function public.validate_student_result_entry();
