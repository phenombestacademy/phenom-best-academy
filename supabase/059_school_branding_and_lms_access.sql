-- Phenom Best LMS: school branding, media permissions and LMS free/premium access tiers
alter table public.schools
 add column if not exists legal_name text,
 add column if not exists address text,
 add column if not exists phone text,
 add column if not exists email text,
 add column if not exists website text,
 add column if not exists motto text,
 add column if not exists report_header text;

update public.schools set legal_name=coalesce(legal_name,name),report_header=coalesce(report_header,name) where legal_name is null or report_header is null;

drop policy if exists "School admins can upload school media" on storage.objects;
create policy "School admins can upload school media" on storage.objects for insert to authenticated with check (bucket_id='media' and split_part(name,'/',1)='schools' and public.is_school_admin_for(nullif(split_part(name,'/',2),'')::uuid));
drop policy if exists "School admins can update school media" on storage.objects;
create policy "School admins can update school media" on storage.objects for update to authenticated using (bucket_id='media' and split_part(name,'/',1)='schools' and public.is_school_admin_for(nullif(split_part(name,'/',2),'')::uuid)) with check (bucket_id='media' and split_part(name,'/',1)='schools' and public.is_school_admin_for(nullif(split_part(name,'/',2),'')::uuid));
drop policy if exists "School admins can delete school media" on storage.objects;
create policy "School admins can delete school media" on storage.objects for delete to authenticated using (bucket_id='media' and split_part(name,'/',1)='schools' and public.is_school_admin_for(nullif(split_part(name,'/',2),'')::uuid));

alter table public.lms_programmes add column if not exists access_tier text not null default 'free' check (access_tier in ('free','premium'));
alter table public.lms_lessons add column if not exists access_tier text not null default 'free' check (access_tier in ('free','premium'));

create or replace function public.school_has_premium_lms_access(p_school_id uuid)
returns boolean language sql security definer set search_path=public as $$
 select exists(select 1 from public.subscriptions s where s.school_id=p_school_id and s.status in ('active','trial') and coalesce(s.ends_at,now()+interval '100 years')>now() and s.plan_code not in ('free','school_free'));
$$;
revoke execute on function public.school_has_premium_lms_access(uuid) from public,anon;
grant execute on function public.school_has_premium_lms_access(uuid) to authenticated;