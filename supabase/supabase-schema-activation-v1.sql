-- Phenom Best Academy — production activation v1
-- Run AFTER supabase-schema.sql, supabase-schema-platform.sql and supabase-schema-school-results.sql.
-- This migration connects the onboarding choice to the profile, safely creates a school owner,
-- and keeps school creation inside a server-side security boundary.

alter table public.profiles
  add column if not exists account_category text not null default 'individual'
    check (account_category in ('individual','school')),
  add column if not exists onboarding_role text not null default 'individual'
    check (onboarding_role in ('individual','school_admin','teacher','student','parent'));

create index if not exists profiles_account_category_idx on public.profiles(account_category);
create index if not exists profiles_onboarding_role_idx on public.profiles(onboarding_role);

create or replace function public.set_my_onboarding_choice(
  p_account_category text,
  p_onboarding_role text
)
returns public.profiles
language plpgsql
security definer
set search_path = public
as $$
declare
  result public.profiles;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if p_account_category not in ('individual','school') then
    raise exception 'Invalid account category';
  end if;

  if p_account_category='individual' and p_onboarding_role <> 'individual' then
    raise exception 'Individual accounts must use the individual role';
  end if;

  if p_account_category='school' and p_onboarding_role not in ('school_admin','teacher','student','parent') then
    raise exception 'Invalid school onboarding role';
  end if;

  update public.profiles
  set account_category=p_account_category,
      onboarding_role=p_onboarding_role,
      updated_at=now()
  where id=auth.uid()
  returning * into result;

  if result.id is null then
    raise exception 'Profile does not exist';
  end if;

  return result;
end;
$$;
revoke all on function public.set_my_onboarding_choice(text,text) from public;
grant execute on function public.set_my_onboarding_choice(text,text) to authenticated;

create or replace function public.create_school_for_current_user(
  p_name text,
  p_logo_url text default null,
  p_primary_color text default null,
  p_country text default null,
  p_currency text default null
)
returns public.schools
language plpgsql
security definer
set search_path = public
as $$
declare
  school_row public.schools;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if trim(coalesce(p_name,''))='' then
    raise exception 'School name is required';
  end if;

  if not exists (
    select 1 from public.profiles
    where id=auth.uid()
      and account_category='school'
      and onboarding_role='school_admin'
  ) then
    raise exception 'Choose School → School Administrator on your account before creating a school';
  end if;

  insert into public.schools(name,logo_url,primary_color,country,currency)
  values(trim(p_name),nullif(trim(p_logo_url),''),nullif(trim(p_primary_color),''),nullif(trim(p_country),''),nullif(trim(p_currency),''))
  returning * into school_row;

  insert into public.school_members(school_id,user_id,role,status)
  values(school_row.id,auth.uid(),'school_admin','active')
  on conflict (school_id,user_id) do update
  set role='school_admin', status='active';

  update public.profiles
  set onboarding_role='school_admin', updated_at=now()
  where id=auth.uid();

  return school_row;
end;
$$;
revoke all on function public.create_school_for_current_user(text,text,text,text,text) from public;
grant execute on function public.create_school_for_current_user(text,text,text,text,text) to authenticated;

-- Existing role protection remains authoritative: ordinary users cannot promote themselves.
-- Admin pages must still enforce the role in the UI and all sensitive database tables must remain RLS-protected.

-- Re-running this migration is safe: replace policies created by this migration first.
drop policy if exists "Authorised staff read all media" on public.media_items;
drop policy if exists "Authorised staff insert media" on public.media_items;
drop policy if exists "Authorised staff update media" on public.media_items;
drop policy if exists "Authorised staff delete media" on public.media_items;
drop policy if exists "Authorised staff upload media files" on storage.objects;
drop policy if exists "Authorised staff update media files" on storage.objects;
drop policy if exists "Authorised staff delete media files" on storage.objects;

-- Tighten the CMS policies that were intentionally permissive in the Level 2 foundation.
-- Only authorised Academy staff/admin roles may manage unpublished media and upload files.
drop policy if exists "Authenticated admins can read all media" on public.media_items;
drop policy if exists "Authenticated admins can insert media" on public.media_items;
drop policy if exists "Authenticated admins can update media" on public.media_items;
drop policy if exists "Authenticated admins can delete media" on public.media_items;

create policy "Authorised staff read all media"
on public.media_items for select to authenticated
using (public.is_staff());

create policy "Authorised staff insert media"
on public.media_items for insert to authenticated
with check (public.is_staff());

create policy "Authorised staff update media"
on public.media_items for update to authenticated
using (public.is_staff()) with check (public.is_staff());

create policy "Authorised staff delete media"
on public.media_items for delete to authenticated
using (public.is_staff());

drop policy if exists "Authenticated admins can upload media files" on storage.objects;
drop policy if exists "Authenticated admins can update media files" on storage.objects;
drop policy if exists "Authenticated admins can delete media files" on storage.objects;

create policy "Authorised staff upload media files"
on storage.objects for insert to authenticated
with check (bucket_id='media' and public.is_staff());

create policy "Authorised staff update media files"
on storage.objects for update to authenticated
using (bucket_id='media' and public.is_staff())
with check (bucket_id='media' and public.is_staff());

create policy "Authorised staff delete media files"
on storage.objects for delete to authenticated
using (bucket_id='media' and public.is_staff());


-- -----------------------------------------------------------------------------
-- SUPER ADMIN SECURITY HARDENING
-- Only the designated Super Admin may have role=super_admin.
-- Ordinary authenticated users may never create or promote an account to an
-- administrative role. Delegated staff/admin accounts, if later created by the
-- Super Admin, do not receive Super Admin privileges.
-- -----------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path=public
as $$
  select exists(
    select 1 from public.profiles
    where id=auth.uid() and role='super_admin'
  );
$$;

create or replace function public.is_super_admin()
returns boolean
language sql stable security definer set search_path=public
as $$
  select exists(
    select 1 from public.profiles
    where id=auth.uid() and role='super_admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path=public
as $$
  select exists(
    select 1 from public.profiles
    where id=auth.uid() and role in ('staff','admin','super_admin')
  );
$$;

-- Prevent the browser/authenticated role from changing privileged identity
-- fields. The authenticated user may still update ordinary profile fields.
create or replace function public.protect_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path=public
as $$
begin
  if coalesce(auth.role(),'') = 'authenticated' then
    if tg_op = 'INSERT' then
      new.role := 'user';
    elsif tg_op = 'UPDATE' then
      new.id := old.id;
      new.role := old.role;
      new.email := old.email;
      new.created_at := old.created_at;
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.protect_profile_privileged_fields() from public;

 drop trigger if exists protect_profile_privileged_fields on public.profiles;
create trigger protect_profile_privileged_fields
before insert or update on public.profiles
for each row execute function public.protect_profile_privileged_fields();

-- Make the profile policies explicit: users may create/read their own profile,
-- but role elevation is controlled by the trigger above and Super Admin RLS.
drop policy if exists "profiles self read" on public.profiles;
drop policy if exists "profiles self update" on public.profiles;
drop policy if exists "profiles insert self" on public.profiles;
create policy "profiles self read"
on public.profiles for select to authenticated
using (id=auth.uid() or public.is_staff());

create policy "profiles self update"
on public.profiles for update to authenticated
using (id=auth.uid() or public.is_admin())
with check (id=auth.uid() or public.is_admin());

create policy "profiles insert self"
on public.profiles for insert to authenticated
with check (id=auth.uid());

-- The Super Admin bootstrap is intentionally a Supabase SQL Editor action,
-- not a public web action. After the owner's Google account has signed in once,
-- run the following one-time command with the owner's exact Google email:
--
-- update public.profiles
-- set role='super_admin', updated_at=now()
-- where lower(email)=lower('YOUR_OWNER_EMAIL@example.com');
--
-- Do NOT expose this command in the public website and do NOT let ordinary
-- users choose 'super_admin' during onboarding.

drop policy if exists "learning quizzes read privacy aware" on public.learning_quizzes;
drop policy if exists "quiz questions read privacy aware" on public.quiz_questions;

-- Learning activation: self-directed practice can be read by its creator while
-- school-assigned questions remain tenant/assignment controlled.
drop policy if exists "quiz questions read assigned" on public.quiz_questions;
create policy "quiz questions read privacy aware"
on public.quiz_questions for select to authenticated
using (
  exists (
    select 1 from public.learning_quizzes q
    where q.id=quiz_id
      and (
        (q.learning_mode='self_directed' and q.created_by=auth.uid())
        or public.is_staff()
        or public.is_admin()
        or exists (
          select 1 from public.quiz_assignments qa
          where qa.quiz_id=q.id
            and (qa.student_id=auth.uid() or qa.teacher_id=auth.uid())
        )
      )
  )
);

-- A learner may read the metadata for a self-directed quiz they created.
drop policy if exists "learning quizzes read own" on public.learning_quizzes;
create policy "learning quizzes read privacy aware"
on public.learning_quizzes for select to authenticated
using (
  created_by=auth.uid()
  or public.is_staff()
  or public.is_admin()
  or public.is_school_member(school_id, array['school_admin'])
  or exists (
    select 1 from public.quiz_assignments qa
    where qa.quiz_id=id and (qa.student_id=auth.uid() or qa.teacher_id=auth.uid())
  )
);
