-- Super Admin retains full platform-level correction/deletion control for attendance.
drop policy if exists "attendance delete super admin" on public.student_attendance;
create policy "attendance delete super admin" on public.student_attendance for delete to authenticated using(public.is_super_admin());
