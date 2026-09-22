-- 046: tighten school attendance/results access and preserve the intended administration hierarchy.

drop policy if exists "attendance manage authorised" on public.student_attendance;
drop policy if exists "attendance read authorised" on public.student_attendance;
drop policy if exists "attendance insert class teacher only" on public.student_attendance;
drop policy if exists "attendance update class teacher only" on public.student_attendance;
drop policy if exists "attendance delete super admin" on public.student_attendance;

create policy "attendance scoped read"
on public.student_attendance for select to authenticated
using (public.can_view_attendance(school_id, class_id, student_id));

create policy "attendance class teacher insert"
on public.student_attendance for insert to authenticated
with check (public.can_manage_attendance(school_id, class_id, student_id));

create policy "attendance class teacher update"
on public.student_attendance for update to authenticated
using (public.can_manage_attendance(school_id, class_id, student_id))
with check (public.can_manage_attendance(school_id, class_id, student_id));

create policy "attendance super admin delete"
on public.student_attendance for delete to authenticated
using (public.is_super_admin());

create policy "attendance super admin update"
on public.student_attendance for update to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

drop policy if exists "result entries authorised" on public.student_result_entries;
drop policy if exists "result entries scoped read" on public.student_result_entries;
drop policy if exists "result entries subject insert" on public.student_result_entries;

create policy "result entries scoped read"
on public.student_result_entries for select to authenticated
using (
  public.is_super_admin()
  or public.is_school_member(school_id,array['school_admin'])
  or public.is_subject_teacher_for(class_id,subject_id)
  or (
    public.is_class_teacher_for(class_id)
    and exists (
      select 1 from public.school_result_components c
      where c.id=student_result_entries.component_id
        and c.component_type in ('midterm','exam')
    )
  )
  or public.can_view_published_result(school_id,class_id,student_id,session_id,term_no)
);

create policy "result entries subject teacher insert"
on public.student_result_entries for insert to authenticated
with check (public.can_manage_result_entry(school_id,class_id,subject_id,student_id));

create policy "result entries super admin update"
on public.student_result_entries for update to authenticated
using (public.is_super_admin())
with check (public.is_super_admin());

create policy "result entries super admin delete"
on public.student_result_entries for delete to authenticated
using (public.is_super_admin());

drop policy if exists "result publications scoped read" on public.school_result_publications;
create policy "result publications scoped read"
on public.school_result_publications for select to authenticated
using (
  public.is_super_admin()
  or public.is_school_member(school_id,array['school_admin'])
  or public.is_class_teacher_for(class_id)
  or (
    published
    and (
      student_id=auth.uid()
      or exists (
        select 1 from public.parent_links pl
        where pl.parent_id=auth.uid()
          and pl.child_id=school_result_publications.student_id
          and pl.status='active'
      )
    )
  )
);
