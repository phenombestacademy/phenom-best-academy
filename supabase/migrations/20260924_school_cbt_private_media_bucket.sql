-- CBT media is school-owned retained media, not public Academy media.
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

create policy "School members can read private CBT media"
on storage.objects for select to authenticated
using (
  bucket_id='school-cbt-media'
  and split_part(name,'/',1)='schools'
  and split_part(name,'/',3)='cbt'
  and is_school_member((nullif(split_part(name,'/',2),''))::uuid,array['school_admin','teacher','student']::text[])
);

create policy "School teachers can upload private CBT media"
on storage.objects for insert to authenticated
with check (
  bucket_id='school-cbt-media'
  and split_part(name,'/',1)='schools'
  and split_part(name,'/',3)='cbt'
  and is_school_member((nullif(split_part(name,'/',2),''))::uuid,array['school_admin','teacher']::text[])
);

create policy "School teachers can update private CBT media"
on storage.objects for update to authenticated
using (
  bucket_id='school-cbt-media'
  and split_part(name,'/',1)='schools'
  and split_part(name,'/',3)='cbt'
  and is_school_member((nullif(split_part(name,'/',2),''))::uuid,array['school_admin','teacher']::text[])
)
with check (
  bucket_id='school-cbt-media'
  and split_part(name,'/',1)='schools'
  and split_part(name,'/',3)='cbt'
  and is_school_member((nullif(split_part(name,'/',2),''))::uuid,array['school_admin','teacher']::text[])
);

create policy "School admins and super admin delete private CBT media"
on storage.objects for delete to authenticated
using (
  bucket_id='school-cbt-media'
  and split_part(name,'/',1)='schools'
  and split_part(name,'/',3)='cbt'
  and (is_super_admin() or is_school_member((nullif(split_part(name,'/',2),''))::uuid,array['school_admin']::text[]))
);