-- CBT media must not use the public Academy media bucket.
insert into storage.buckets (id,name,public)
values ('school-cbt-media','school-cbt-media',false)
on conflict (id) do update set public=false;

alter table public.school_cbt_exam_media
  alter column storage_bucket set default 'school-cbt-media';

update public.school_cbt_exam_media
set storage_bucket='school-cbt-media'
where storage_bucket='media';

drop policy if exists "School members can read CBT media" on storage.objects;
drop policy if exists "School teachers can upload CBT media" on storage.objects;
drop policy if exists "School teachers can update CBT media" on storage.objects;
drop policy if exists "School admins and super admin delete CBT media" on storage.objects;