-- Phenom Best Academy | Tertiary, ND/HND and distance-affiliation architecture
-- Migration name: 042_tertiary_nd_global_qualification_and_distance_affiliation_architecture
-- Production schema/data was applied through Supabase. This file records the governing architecture.
-- Authority rule: prebuild the learning architecture and resources; do not represent admission,
-- accreditation, licensing or external awards as belonging to Phenom Best Academy unless verified.

create table if not exists public.lms_tertiary_programme_catalogue (
  id uuid primary key default gen_random_uuid(),
  country_code text not null,
  sector text not null,
  qualification_level text not null,
  programme_name text not null,
  programme_family text,
  official_source text,
  source_version text,
  delivery_status text not null default 'prebuilt_reference',
  authority_policy_code text not null default 'ACADEMY-APPROVED',
  awarding_body_rule text not null default 'external_awarding_body_required',
  practical_requirement text not null default 'to_be_assessed',
  duration_months integer,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(country_code, qualification_level, programme_name)
);

create table if not exists public.lms_qualification_frameworks (
  id uuid primary key default gen_random_uuid(),
  country_code text not null,
  framework_name text not null,
  issuing_or_coordinating_body text,
  framework_source text,
  qualification_sequence jsonb not null default '[]'::jsonb,
  notes text,
  active boolean not null default true,
  unique(country_code, framework_name)
);

create table if not exists public.lms_assessment_pathways (
  id uuid primary key default gen_random_uuid(),
  pathway_code text unique not null,
  pathway_name text not null,
  stage_scope text not null,
  awarding_body text,
  official_source text,
  delivery_model text not null default 'prepare_and_route',
  exam_or_assessment_requirement text,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.lms_distance_affiliation_rules (
  id uuid primary key default gen_random_uuid(),
  rule_code text unique not null,
  title text not null,
  platform_role text not null,
  admission_owner text not null,
  student_record_owner text not null,
  academic_approval_owner text not null,
  credential_award_owner text not null,
  student_portal_rule text not null,
  centre_rule text not null,
  physical_activity_rule text not null,
  curriculum_prebuild_rule text not null,
  public_disclosure_rule text not null,
  active boolean not null default true
);

-- Seed/reference data is maintained in the production catalogue. The authoritative
-- Nigerian ND source used for the initial catalogue is NBTE's January 2026
-- Brochure of Approved Curricula and Course Specifications.
