-- Phenom Best Academy — Level 2 CMS foundation
-- Run this in a new Supabase project's SQL editor.

create table if not exists public.media_items (
  id text primary key,
  title text not null,
  description text not null default '',
  kind text not null check (kind in ('picture','video','song','sound','resource','learning','news','link')),
  source text not null check (source in ('upload','external')),
  url text not null,
  thumbnail_url text,
  download_url text,
  published boolean not null default false,
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.media_items enable row level security;

create policy "Public can read published media"
on public.media_items for select
using (published = true);

create policy "Authenticated admins can read all media"
on public.media_items for select to authenticated
using (true);

create policy "Authenticated admins can insert media"
on public.media_items for insert to authenticated
with check (true);

create policy "Authenticated admins can update media"
on public.media_items for update to authenticated
using (true) with check (true);

create policy "Authenticated admins can delete media"
on public.media_items for delete to authenticated
using (true);

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Public can read media files"
on storage.objects for select
using (bucket_id = 'media');

create policy "Authenticated admins can upload media files"
on storage.objects for insert to authenticated
with check (bucket_id = 'media');

create policy "Authenticated admins can update media files"
on storage.objects for update to authenticated
using (bucket_id = 'media') with check (bucket_id = 'media');

create policy "Authenticated admins can delete media files"
on storage.objects for delete to authenticated
using (bucket_id = 'media');
