-- Phenom Best Academy | Curriculum resource packs and content jobs
create table if not exists public.lms_curriculum_resource_packs (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.lms_curriculum_topics(id) on delete cascade,
  pack_code text not null,
  resource_type text not null,
  title text not null,
  content text not null,
  locale text not null default 'en-NG',
  support_locale text not null default 'en-NG',
  sequence_no integer not null,
  status text not null default 'ready',
  curriculum_alignment jsonb not null default '{}'::jsonb,
  brand_metadata jsonb not null default '{"brand":"Phenom Best Academy","engine":"Phenom Best Core"}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(topic_id,resource_type,locale)
);

create table if not exists public.lms_curriculum_content_jobs (
  id uuid primary key default gen_random_uuid(),
  curriculum_id text,
  topic_id uuid references public.lms_curriculum_topics(id) on delete cascade,
  job_type text not null,
  status text not null default 'queued',
  priority integer not null default 50,
  requested_at timestamptz not null default now(),
  completed_at timestamptz,
  error_message text,
  metadata jsonb not null default '{}'::jsonb
);

-- RLS: public learners can read only published resource packs.
-- Super administrators manage packs and content jobs.
