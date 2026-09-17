-- Class teachers may see final assessment components for their class, while subject entry remains private to the assigned subject teacher.
drop policy if exists "result entries scoped read" on public.student_result_entries;
create policy "result entries scoped read" on public.student_result_entries for select to authenticated
using(
 public.is_super_admin()
 or public.is_school_member(school_id,array['school_admin'])
 or public.is_subject_teacher_for(class_id,subject_id)
 or (public.is_class_teacher_for(class_id) and exists(select 1 from public.school_result_components c where c.id=component_id and c.component_type in ('midterm','exam')))
 or public.can_view_published_result(school_id,class_id,student_id,session_id,term_no)
);
