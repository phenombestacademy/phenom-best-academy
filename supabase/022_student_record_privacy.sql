-- Student records contain DOB/growth/psychomotor/performance, so only the student, class teacher, school admin and Super Admin can read them.
drop policy if exists "student records scoped" on public.student_school_records;
create policy "student records class teacher admin student read" on public.student_school_records for select to authenticated
using(public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or student_id=auth.uid() or exists(select 1 from public.school_classes c join public.class_members cm on cm.class_id=c.id and cm.user_id=student_school_records.student_id and cm.role='student' where c.school_id=student_school_records.school_id and public.is_class_teacher_for(c.id)));
