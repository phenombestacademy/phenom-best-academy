drop policy if exists "School members can read private CBT media" on storage.objects;
create policy "School members and super admin can read private CBT media"
on storage.objects for select to authenticated
using (
  bucket_id='school-cbt-media'
  and split_part(name,'/',1)='schools'
  and split_part(name,'/',3)='cbt'
  and (is_super_admin() or is_school_member((nullif(split_part(name,'/',2),''))::uuid,array['school_admin','teacher','student']::text[]))
);