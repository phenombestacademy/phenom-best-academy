-- 037 curriculum ingestion, education domains and programme authority schema
create table if not exists public.lms_curriculum_sources (
 id uuid primary key default gen_random_uuid(), curriculum_id text not null references public.curriculum_catalogue(id) on delete cascade,
 source_title text not null, source_type text not null default 'official_document', issuing_body text not null, official_url text not null,
 source_version text, publication_date date, retrieved_at timestamptz not null default now(),
 verification_status text not null default 'registered' check (verification_status in ('registered','retrieved','parsed','verified','stale','failed')),
 content_hash text, extraction_method text, document_scope text not null default '', notes text not null default '',
 active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create index if not exists idx_lcs_curriculum on public.lms_curriculum_sources(curriculum_id,active);
create table if not exists public.lms_curriculum_ingestion_runs (
 id uuid primary key default gen_random_uuid(), source_id uuid not null references public.lms_curriculum_sources(id) on delete cascade,
 started_at timestamptz not null default now(), completed_at timestamptz,
 status text not null default 'queued' check(status in ('queued','running','completed','partial','failed')),
 extracted_levels integer not null default 0, extracted_subjects integer not null default 0, extracted_topics integer not null default 0,
 extracted_outcomes integer not null default 0, extracted_expectations integer not null default 0, verified_topics integer not null default 0,
 warnings jsonb not null default '[]'::jsonb, metadata jsonb not null default '{}'::jsonb
);
create table if not exists public.lms_education_domains (
 id uuid primary key default gen_random_uuid(), domain_name text not null unique, domain_slug text not null unique,
 description text not null default '', education_stage text not null default 'all', active boolean not null default true, sequence_no integer not null default 0
);
create table if not exists public.lms_programme_authority_policies (
 id uuid primary key default gen_random_uuid(), policy_code text not null unique,
 authority_model text not null check(authority_model in ('academy_direct','academy_licensed_or_approved','affiliated_institution','co_delivered','regulatory_or_government','referral_or_pathway')),
 title text not null, description text not null, approval_required boolean not null default false, awarding_body_required boolean not null default false,
 partner_agreement_required boolean not null default false, regulatory_clearance_required boolean not null default false,
 certificate_issuer_rule text not null default '', public_disclosure_rule text not null default '', active boolean not null default true
);
create table if not exists public.lms_programme_authorities (
 id uuid primary key default gen_random_uuid(), authority_name text not null,
 authority_type text not null, country_code text, official_url text, licence_or_approval_reference text,
 verification_status text not null default 'unverified', active boolean not null default true, metadata jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.lms_programmes add column if not exists authority_policy_code text;
alter table public.lms_programmes add column if not exists authority_model text;
alter table public.lms_programmes add column if not exists awarding_body text;
alter table public.lms_programmes add column if not exists regulatory_body text;
alter table public.lms_programmes add column if not exists accreditation_status text default 'not_applicable';
alter table public.lms_programmes add column if not exists partner_authority_id uuid references public.lms_programme_authorities(id);
alter table public.lms_programmes add column if not exists approval_reference text;
alter table public.lms_programmes add column if not exists public_disclosure text default '';
