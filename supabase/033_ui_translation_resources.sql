-- 033: back-room translation resources and provider-neutral generation state.
create table if not exists public.ui_translation_resources (
  locale text not null,
  resource_key text not null,
  source_text text not null,
  translated_text text not null,
  source_version text not null default 'v1',
  quality_score numeric(5,2),
  status text not null default 'reviewed' check (status in ('draft','reviewed','published','stale')),
  provider_trace jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key(locale, resource_key, source_version)
);
alter table public.ui_translation_resources enable row level security;
drop policy if exists ui_translation_resources_public_read on public.ui_translation_resources;
create policy ui_translation_resources_public_read on public.ui_translation_resources for select to anon, authenticated using (status='published');
drop policy if exists ui_translation_resources_super_admin on public.ui_translation_resources;
create policy ui_translation_resources_super_admin on public.ui_translation_resources for all to authenticated using (public.is_super_admin()) with check (public.is_super_admin());
create index if not exists ui_translation_resources_locale_idx on public.ui_translation_resources(locale,status);
comment on table public.ui_translation_resources is 'Pre-translated Phenom interface resources. Provider details remain back-room metadata and are never exposed by the public UI.';
comment on column public.profiles.preferred_locale is 'Persistent interface language. Explicit user selection takes precedence over browser/device detection and location.';
comment on column public.profiles.learning_locale is 'Target language being studied. Independent from the platform interface language.';
comment on column public.profiles.support_locale is 'Familiar language used to explain/support target-language learning. Normally follows preferred_locale.';
