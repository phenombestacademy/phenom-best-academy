-- 049: harden Phenom Best LMS school administration, assessment, finance and safeguarding access.

create or replace function public.is_school_admin_for(p_school uuid)
returns boolean language sql stable security definer set search_path=public
as $$
  select public.is_super_admin()
    or exists (
      select 1 from public.school_members m
      where m.school_id=p_school and m.user_id=auth.uid()
        and m.role='school_admin' and m.status='active'
    )
$$;

drop policy if exists "sessions tenant" on public.school_academic_sessions;
create policy "sessions read scoped" on public.school_academic_sessions for select to authenticated using (public.is_super_admin() or public.is_school_member(school_id));
create policy "sessions admin insert" on public.school_academic_sessions for insert to authenticated with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "sessions admin update" on public.school_academic_sessions for update to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "sessions admin delete" on public.school_academic_sessions for delete to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));

drop policy if exists "fee payments tenant" on public.school_fee_payments;
create policy "fee payments scoped read" on public.school_fee_payments for select to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or student_id=auth.uid() or public.is_parent_of(student_id));
create policy "fee payments admin insert" on public.school_fee_payments for insert to authenticated with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "fee payments admin update" on public.school_fee_payments for update to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "fee payments admin delete" on public.school_fee_payments for delete to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));

drop policy if exists "assignment submissions strict" on public.school_assignment_submissions;
create policy "assignment submissions scoped read" on public.school_assignment_submissions for select to authenticated using (student_id=auth.uid() or exists(select 1 from public.school_assignment_tasks t where t.id=task_id and (public.is_super_admin() or public.is_school_member(t.school_id,array['school_admin']) or t.teacher_id=auth.uid())));
create policy "assignment submissions student insert" on public.school_assignment_submissions for insert to authenticated with check (student_id=auth.uid() and exists(select 1 from public.school_assignment_tasks t where t.id=task_id and exists(select 1 from public.class_members cm where cm.class_id=t.class_id and cm.user_id=auth.uid() and cm.role='student')));
create policy "assignment submissions teacher update" on public.school_assignment_submissions for update to authenticated using (public.is_super_admin() or exists(select 1 from public.school_assignment_tasks t where t.id=task_id and (public.is_school_member(t.school_id,array['school_admin']) or t.teacher_id=auth.uid()))) with check (public.is_super_admin() or exists(select 1 from public.school_assignment_tasks t where t.id=task_id and (public.is_school_member(t.school_id,array['school_admin']) or t.teacher_id=auth.uid())));
create policy "assignment submissions admin delete" on public.school_assignment_submissions for delete to authenticated using (public.is_super_admin() or exists(select 1 from public.school_assignment_tasks t where t.id=task_id and public.is_school_member(t.school_id,array['school_admin'])));

drop policy if exists "cbt attempts student teacher" on public.school_cbt_attempts;
create policy "cbt attempts scoped read" on public.school_cbt_attempts for select to authenticated using (student_id=auth.uid() or exists(select 1 from public.school_cbt_exams e where e.id=exam_id and (public.is_super_admin() or public.is_school_member(e.school_id,array['school_admin']) or e.teacher_id=auth.uid())));
create policy "cbt attempts student insert" on public.school_cbt_attempts for insert to authenticated with check (student_id=auth.uid() and exists(select 1 from public.school_cbt_exams e where e.id=exam_id and e.status in ('draft','scheduled','active') and exists(select 1 from public.class_members cm where cm.class_id=e.class_id and cm.user_id=auth.uid() and cm.role='student')));
create policy "cbt attempts student update" on public.school_cbt_attempts for update to authenticated using (student_id=auth.uid() and submitted_at is null) with check (student_id=auth.uid() and submitted_at is null);
create policy "cbt attempts teacher update" on public.school_cbt_attempts for update to authenticated using (public.is_super_admin() or exists(select 1 from public.school_cbt_exams e where e.id=exam_id and (public.is_school_member(e.school_id,array['school_admin']) or e.teacher_id=auth.uid()))) with check (public.is_super_admin() or exists(select 1 from public.school_cbt_exams e where e.id=exam_id and (public.is_school_member(e.school_id,array['school_admin']) or e.teacher_id=auth.uid())));
create policy "cbt attempts admin delete" on public.school_cbt_attempts for delete to authenticated using (public.is_super_admin() or exists(select 1 from public.school_cbt_exams e where e.id=exam_id and public.is_school_member(e.school_id,array['school_admin'])));

drop policy if exists "emergency authorised" on public.student_emergency_profiles;
drop policy if exists "emergency scoped" on public.student_emergency_profiles;
create policy "emergency scoped read" on public.student_emergency_profiles for select to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or student_id=auth.uid() or public.is_parent_of(student_id) or exists(select 1 from public.school_sensitive_access a join public.class_members cm on cm.class_id=a.class_id where a.school_id=student_emergency_profiles.school_id and a.enabled and cm.user_id=auth.uid() and cm.role='teacher'));
create policy "emergency admin insert" on public.student_emergency_profiles for insert to authenticated with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "emergency admin update" on public.student_emergency_profiles for update to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "emergency admin delete" on public.student_emergency_profiles for delete to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));

drop policy if exists "guardian scoped" on public.student_guardians;
create policy "guardian scoped read" on public.student_guardians for select to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or public.is_parent_of(student_id) or exists(select 1 from public.school_sensitive_access a join public.class_members cm on cm.class_id=a.class_id where a.school_id=student_guardians.school_id and a.enabled and cm.user_id=auth.uid() and cm.role='teacher'));
create policy "guardian admin insert" on public.student_guardians for insert to authenticated with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "guardian admin update" on public.student_guardians for update to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "guardian admin delete" on public.student_guardians for delete to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));

drop policy if exists "sensitive records restricted" on public.student_sensitive_records;
create policy "sensitive records scoped read" on public.student_sensitive_records for select to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or student_id=auth.uid() or public.is_parent_of(student_id) or exists(select 1 from public.school_sensitive_access a join public.class_members cm on cm.class_id=a.class_id where a.school_id=student_sensitive_records.school_id and a.enabled and cm.user_id=auth.uid() and cm.role='teacher'));
create policy "sensitive records admin insert" on public.student_sensitive_records for insert to authenticated with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "sensitive records admin update" on public.student_sensitive_records for update to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "sensitive records admin delete" on public.student_sensitive_records for delete to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));

drop policy if exists "growth scoped" on public.student_growth_records;
create policy "growth scoped read" on public.student_growth_records for select to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or student_id=auth.uid() or public.is_parent_of(student_id) or exists(select 1 from public.school_classes c join public.class_members cm on cm.class_id=c.id where c.school_id=student_growth_records.school_id and cm.user_id=auth.uid() and cm.role='teacher' and public.is_class_teacher_for(c.id) and cm.user_id=student_growth_records.student_id));
create policy "growth teacher insert" on public.student_growth_records for insert to authenticated with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or exists(select 1 from public.school_classes c where c.school_id=student_growth_records.school_id and public.is_class_teacher_for(c.id) and exists(select 1 from public.class_members cm where cm.class_id=c.id and cm.user_id=student_growth_records.student_id and cm.role='student')));
create policy "growth admin update" on public.student_growth_records for update to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "growth admin delete" on public.student_growth_records for delete to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));

drop policy if exists "trait assessments authorised" on public.student_trait_assessments;
create policy "trait assessments scoped read" on public.student_trait_assessments for select to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or student_id=auth.uid() or public.is_parent_of(student_id) or assessed_by=auth.uid());
create policy "trait assessments teacher insert" on public.student_trait_assessments for insert to authenticated with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']) or assessed_by=auth.uid());
create policy "trait assessments admin update" on public.student_trait_assessments for update to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin'])) with check (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));
create policy "trait assessments admin delete" on public.student_trait_assessments for delete to authenticated using (public.is_super_admin() or public.is_school_member(school_id,array['school_admin']));

grant execute on function public.is_school_admin_for(uuid) to authenticated;
revoke execute on function public.is_school_admin_for(uuid) from anon;