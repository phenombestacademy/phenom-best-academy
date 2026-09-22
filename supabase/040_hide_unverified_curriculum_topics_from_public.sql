-- 040: never expose unverified curriculum placeholders to learners
drop policy if exists lms_curriculum_topics_public_read on public.lms_curriculum_topics;
create policy lms_curriculum_topics_public_read on public.lms_curriculum_topics
for select to anon, authenticated
using (active=true and source_status in ('verified','imported'));

drop policy if exists lms_curriculum_topics_super_admin on public.lms_curriculum_topics;
create policy lms_curriculum_topics_super_admin on public.lms_curriculum_topics
for all to authenticated
using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='super_admin'))
with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='super_admin'));
