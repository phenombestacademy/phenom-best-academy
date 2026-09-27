-- Phenom Account Centre profile fields and avatar storage.
alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists middle_name text;
alter table public.profiles add column if not exists surname text;
alter table public.profiles add column if not exists phone text;
alter table public.profiles add column if not exists date_of_birth date;
alter table public.profiles add column if not exists gender text;
alter table public.profiles add column if not exists country text;
alter table public.profiles add column if not exists state_region text;
alter table public.profiles add column if not exists city text;
alter table public.profiles add column if not exists address text;

create index if not exists profiles_email_lower_idx on public.profiles (lower(email));

insert into storage.buckets (id, name, public)
values ('profile-avatars', 'profile-avatars', true)
on conflict (id) do update set public = true;

create policy "Profile avatars are publicly readable"
on storage.objects for select
using (bucket_id = 'profile-avatars');

create policy "Users upload their own profile avatar"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users update their own profile avatar"
on storage.objects for update to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users delete their own profile avatar"
on storage.objects for delete to authenticated
using (
  bucket_id = 'profile-avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);
