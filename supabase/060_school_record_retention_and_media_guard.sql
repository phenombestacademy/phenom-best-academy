-- Phenom Best LMS: permanent school operational-record retention and protected school media
-- School-generated operational records remain available to authorised users across the life of the school.
-- Deletion is deliberately disabled for historical/financial/student records; result deletion remains the
-- existing Super Admin-only exceptional operation with its audit trail.

drop policy if exists "school lifecycle history admin update" on public.student_school_status_history;
drop policy if exists "school lifecycle history admin delete" on public.student_school_status_history;
revoke update, delete on public.student_school_status_history from anon, authenticated;

drop policy if exists "student_class_history_manage" on public.student_class_history;
drop policy if exists "student_class_history_select" on public.student_class_history;
create policy "student_class_history_select" on public.student_class_history
  for select to authenticated
  using (
    public.is_super_admin()
    or public.is_school_admin_for(school_id)
    or student_id = auth.uid()
    or exists (
      select 1 from public.parent_links pl
      where pl.parent_id = auth.uid()
        and pl.child_id = student_class_history.student_id
        and pl.status = 'approved'
    )
  );
create policy "student_class_history_insert" on public.student_class_history
  for insert to authenticated
  with check (public.is_super_admin() or public.is_school_admin_for(school_id));
revoke update, delete on public.student_class_history from anon, authenticated;
grant select, insert on public.student_class_history to authenticated;

drop policy if exists "payroll admin" on public.payroll_runs;
create policy "payroll select retained records" on public.payroll_runs for select to authenticated
  using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "payroll insert retained records" on public.payroll_runs for insert to authenticated
  with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "payroll update retained records" on public.payroll_runs for update to authenticated
  using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']))
  with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
revoke delete on public.payroll_runs from anon, authenticated;
grant select, insert, update on public.payroll_runs to authenticated;

drop policy if exists "school staff admin" on public.staff_records;
create policy "staff records scoped read" on public.staff_records for select to authenticated
  using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or staff_user_id = auth.uid());
create policy "staff records admin insert" on public.staff_records for insert to authenticated
  with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "staff records admin update" on public.staff_records for update to authenticated
  using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']))
  with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
revoke delete on public.staff_records from anon, authenticated;
grant select, insert, update on public.staff_records to authenticated;

drop policy if exists "staff pay structures authorised" on public.staff_pay_structures;
create policy "staff pay structures read" on public.staff_pay_structures for select to authenticated
  using (public.is_super_admin() or exists (
    select 1 from public.staff_records sr
    where sr.id=staff_pay_structures.staff_record_id
      and (sr.staff_user_id=auth.uid() or public.is_school_member(sr.school_id,array['school_admin']))
  ));
create policy "staff pay structures admin insert" on public.staff_pay_structures for insert to authenticated
  with check (public.is_super_admin() or exists (
    select 1 from public.staff_records sr
    where sr.id=staff_pay_structures.staff_record_id
      and public.is_school_member(sr.school_id,array['school_admin'])
  ));
create policy "staff pay structures admin update" on public.staff_pay_structures for update to authenticated
  using (public.is_super_admin() or exists (
    select 1 from public.staff_records sr
    where sr.id=staff_pay_structures.staff_record_id
      and public.is_school_member(sr.school_id,array['school_admin'])
  ))
  with check (public.is_super_admin() or exists (
    select 1 from public.staff_records sr
    where sr.id=staff_pay_structures.staff_record_id
      and public.is_school_member(sr.school_id,array['school_admin'])
  ));
revoke delete on public.staff_pay_structures from anon, authenticated;
grant select, insert, update on public.staff_pay_structures to authenticated;

drop policy if exists "fee adjustments authorised" on public.student_fee_adjustments;
create policy "fee adjustments scoped read" on public.student_fee_adjustments for select to authenticated
  using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or student_id=auth.uid() or public.is_parent_of(student_id));
create policy "fee adjustments admin insert" on public.student_fee_adjustments for insert to authenticated
  with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "fee adjustments admin update" on public.student_fee_adjustments for update to authenticated
  using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']))
  with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
revoke delete on public.student_fee_adjustments from anon, authenticated;

drop policy if exists "fee payments admin delete" on public.school_fee_payments;
revoke delete on public.school_fee_payments from anon, authenticated;

drop policy if exists "guardian admin delete" on public.student_guardians;
drop policy if exists "emergency admin delete" on public.student_emergency_profiles;
drop policy if exists "growth admin delete" on public.student_growth_records;
drop policy if exists "sensitive records admin delete" on public.student_sensitive_records;
drop policy if exists "trait assessments admin delete" on public.student_trait_assessments;
revoke delete on public.student_guardians from anon, authenticated;
revoke delete on public.student_emergency_profiles from anon, authenticated;
revoke delete on public.student_growth_records from anon, authenticated;
revoke delete on public.student_sensitive_records from anon, authenticated;
revoke delete on public.student_trait_assessments from anon, authenticated;
revoke delete on public.student_school_records from anon, authenticated;

drop policy if exists "School admins can delete school media" on storage.objects;

comment on table public.student_school_records is 'Permanent school admission/current-status record. No client-role deletion; lifecycle changes are retained separately in student_school_status_history.';
comment on table public.student_school_status_history is 'Permanent immutable student lifecycle history.';
comment on table public.student_class_history is 'Permanent class/promotion history; old class records are retained when a learner moves class.';
comment on table public.student_result_entries is 'School result records. Existing policy permits exceptional permanent deletion only to the single Phenom Best LMS Super Admin.';
