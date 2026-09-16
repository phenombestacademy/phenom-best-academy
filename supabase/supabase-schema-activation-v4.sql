-- Phenom Best Academy V4 activation layer
-- Run AFTER the existing base schemas and activation-v1 SQL.
create extension if not exists pgcrypto;

create table if not exists public.site_settings (
  id integer primary key default 1 check (id=1),
  background text not null default '#f4efe6',
  surface text not null default '#fbf8f2',
  accent text not null default '#c94b16',
  accent2 text not null default '#1a4a8c',
  text text not null default '#152238',
  muted text not null default '#4c5d73',
  animation text not null default 'refined' check(animation in ('refined','minimal','off')),
  logo_url text not null default '/brand/logo-full-clear.png',
  background_mode text not null default 'solid' check(background_mode in ('solid','gradient','image','pattern')),
  background_image_url text,
  gradient_start text not null default '#f4efe6',
  gradient_end text not null default '#fbf8f2',
  gradient_angle integer not null default 135,
  pattern text not null default 'none',
  font_scale numeric(4,3) not null default 1,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
drop policy if exists "public can read site settings" on public.site_settings;
drop policy if exists "super admin writes site settings" on public.site_settings;
create policy "public can read site settings" on public.site_settings for select using (true);
create policy "super admin writes site settings" on public.site_settings for all using (public.is_super_admin()) with check (public.is_super_admin());
insert into public.site_settings(id) values(1) on conflict(id) do nothing;

create table if not exists public.site_announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  link_url text,
  published boolean not null default false,
  floating boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.site_announcements enable row level security;
drop policy if exists "public reads active announcements" on public.site_announcements;
drop policy if exists "super admin manages announcements" on public.site_announcements;
create policy "public reads active announcements" on public.site_announcements for select using (published=true and (starts_at is null or starts_at<=now()) and (ends_at is null or ends_at>=now()));
create policy "super admin manages announcements" on public.site_announcements for all using (public.is_super_admin()) with check (public.is_super_admin());

create table if not exists public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  active boolean not null default true,
  marketing_opt_in boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.email_subscribers enable row level security;
drop policy if exists "public can subscribe email" on public.email_subscribers;
drop policy if exists "super admin reads subscribers" on public.email_subscribers;
drop policy if exists "super admin updates subscribers" on public.email_subscribers;
create policy "public can subscribe email" on public.email_subscribers for insert with check (active=true);
create policy "super admin reads subscribers" on public.email_subscribers for select using (public.is_super_admin());
create policy "super admin updates subscribers" on public.email_subscribers for all using (public.is_super_admin()) with check (public.is_super_admin());

create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  link_url text,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.user_notifications enable row level security;
drop policy if exists "user reads own notifications" on public.user_notifications;
drop policy if exists "user marks own notifications" on public.user_notifications;
drop policy if exists "super admin creates notifications" on public.user_notifications;
create policy "user reads own notifications" on public.user_notifications for select using (user_id=auth.uid());
create policy "user marks own notifications" on public.user_notifications for update using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy "super admin creates notifications" on public.user_notifications for all using (public.is_super_admin()) with check (public.is_super_admin());

-- Payment provider readiness. Secrets remain in Supabase Edge Function secrets, never in the browser.
create table if not exists public.payment_provider_settings (
  id uuid primary key default gen_random_uuid(),
  provider text not null unique check(provider in ('flutterwave','paystack','stripe','interswitch','direct')),
  enabled boolean not null default false,
  public_label text not null,
  public_note text,
  direct_bank_name text,
  direct_account_name text,
  direct_account_number text,
  direct_instructions text,
  updated_at timestamptz not null default now()
);
alter table public.payment_provider_settings enable row level security;
drop policy if exists "public reads enabled payment methods" on public.payment_provider_settings;
drop policy if exists "super admin manages payment methods" on public.payment_provider_settings;
create policy "public reads enabled payment methods" on public.payment_provider_settings for select using (enabled=true);
create policy "super admin manages payment methods" on public.payment_provider_settings for all using (public.is_super_admin()) with check (public.is_super_admin());
insert into public.payment_provider_settings(provider,public_label,public_note) values
('flutterwave','Flutterwave','Cards, bank transfer, bank account, USSD and supported local methods.'),
('paystack','Paystack','Cards, international cards, transfer, bank and USSD where enabled.'),
('stripe','Stripe','International card and supported payment methods.'),
('interswitch','Interswitch','Card, transfer, USSD, wallet and Google Pay where enabled.'),
('direct','Direct bank transfer','Transfer from your bank or mobile banking app to the Academy account.')
on conflict(provider) do nothing;

-- Safer CMS RLS: only Super Admin can write media from the browser.
drop policy if exists "Authenticated admins can read all media" on public.media_items;
drop policy if exists "Authenticated admins can insert media" on public.media_items;
drop policy if exists "Authenticated admins can update media" on public.media_items;
drop policy if exists "Authenticated admins can delete media" on public.media_items;
create policy "Staff can read all media" on public.media_items for select to authenticated using (public.is_staff());
create policy "Super admin inserts media" on public.media_items for insert to authenticated with check (public.is_super_admin());
create policy "Super admin updates media" on public.media_items for update to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create policy "Super admin deletes media" on public.media_items for delete to authenticated using (public.is_super_admin());

-- Keep the storage bucket, but prevent ordinary authenticated users from uploading through the public browser.
drop policy if exists "Authenticated admins can upload media files" on storage.objects;
drop policy if exists "Authenticated admins can update media files" on storage.objects;
drop policy if exists "Authenticated admins can delete media files" on storage.objects;
create policy "Super admin uploads media files" on storage.objects for insert to authenticated with check (bucket_id='media' and public.is_super_admin());
create policy "Super admin updates media files" on storage.objects for update to authenticated using (bucket_id='media' and public.is_super_admin()) with check (bucket_id='media' and public.is_super_admin());
create policy "Super admin deletes media files" on storage.objects for delete to authenticated using (bucket_id='media' and public.is_super_admin());

-- One-time optional seed: use the owner's already-authenticated profile in SQL Editor, never from the public sign-up form.
-- update public.profiles set role='super_admin', updated_at=now() where lower(email)=lower('OWNER_EMAIL_HERE');
