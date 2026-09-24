-- Ensure the student question projection trigger is kept outside the exposed API schema.
create schema if not exists private;
create or replace function private.sync_school_cbt_student_question()
returns trigger language plpgsql security definer set search_path=public,pg_temp as $$
begin
  if tg_op='DELETE' then delete from public.school_cbt_exam_questions_student where id=old.id; return old; end if;
  insert into public.school_cbt_exam_questions_student(id,exam_id,position,question_text,options,image_url,media,marks)
  values(new.id,new.exam_id,new.position,new.question_text,new.options,new.image_url,coalesce(new.media,'[]'::jsonb),new.marks)
  on conflict(id) do update set exam_id=excluded.exam_id,position=excluded.position,question_text=excluded.question_text,options=excluded.options,image_url=excluded.image_url,media=excluded.media,marks=excluded.marks;
  return new;
end; $$;
revoke all on function private.sync_school_cbt_student_question() from public,anon,authenticated;
drop trigger if exists trg_sync_school_cbt_student_question on public.school_cbt_exam_questions;
create trigger trg_sync_school_cbt_student_question after insert or update or delete on public.school_cbt_exam_questions
for each row execute function private.sync_school_cbt_student_question();
drop function if exists public.sync_school_cbt_student_question();