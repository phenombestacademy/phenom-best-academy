-- 052: enforce school/class/teacher identity consistency.

create or replace function public.validate_school_class_assignment()
returns trigger language plpgsql security definer set search_path=public
as $$
begin
  if new.class_teacher_id is not null and not exists (select 1 from public.school_members m where m.school_id=new.school_id and m.user_id=new.class_teacher_id and m.role='teacher' and m.status='active') then
    raise exception 'Class teacher must be an active teacher in the same school.';
  end if;
  return new;
end;
$$;
drop trigger if exists trg_validate_school_class_assignment on public.school_classes;
create trigger trg_validate_school_class_assignment before insert or update of school_id,class_teacher_id on public.school_classes for each row execute function public.validate_school_class_assignment();

create or replace function public.validate_class_subject_assignment()
returns trigger language plpgsql security definer set search_path=public
as $$
declare class_school uuid; subject_school uuid;
begin
  select school_id into class_school from public.school_classes where id=new.class_id;
  select school_id into subject_school from public.school_subjects where id=new.subject_id;
  if class_school is null or subject_school is null or class_school<>subject_school then raise exception 'Class and subject must belong to the same school.'; end if;
  if new.teacher_id is not null and not exists (select 1 from public.school_members m where m.school_id=class_school and m.user_id=new.teacher_id and m.role='teacher' and m.status='active') then
    raise exception 'Subject teacher must be an active teacher in the same school.';
  end if;
  return new;
end;
$$;
drop trigger if exists trg_validate_class_subject_assignment on public.class_subjects;
create trigger trg_validate_class_subject_assignment before insert or update of class_id,subject_id,teacher_id on public.class_subjects for each row execute function public.validate_class_subject_assignment();

create or replace function public.validate_class_member_assignment()
returns trigger language plpgsql security definer set search_path=public
as $$
declare class_school uuid;
begin
  select school_id into class_school from public.school_classes where id=new.class_id;
  if class_school is null then raise exception 'Class does not exist.'; end if;
  if not exists (select 1 from public.school_members m where m.school_id=class_school and m.user_id=new.user_id and m.role=new.role and m.status='active') then
    raise exception 'Class member must be an active school member with the matching teacher/student role.';
  end if;
  return new;
end;
$$;
drop trigger if exists trg_validate_class_member_assignment on public.class_members;
create trigger trg_validate_class_member_assignment before insert or update of class_id,user_id,role on public.class_members for each row execute function public.validate_class_member_assignment();

revoke all on function public.validate_school_class_assignment() from public,anon,authenticated;
revoke all on function public.validate_class_subject_assignment() from public,anon,authenticated;
revoke all on function public.validate_class_member_assignment() from public,anon,authenticated;