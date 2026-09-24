-- Phenom LMS: single canonical Library asset reused across curricula/topics.
-- Applied to Supabase project hajrdejlamuiqjjhdnsv on 2026-09-24.

create table if not exists public.lms_curriculum_library_topic_links (
  id uuid primary key default gen_random_uuid(),
  library_item_id uuid not null references public.lms_curriculum_library_items(id) on delete cascade,
  topic_id uuid not null references public.lms_curriculum_topics(id) on delete cascade,
  relation_type text not null default 'curriculum_alignment',
  alignment_status text not null default 'pending',
  alignment_score numeric(5,4),
  alignment_basis text,
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lms_curriculum_library_topic_links_relation_ck
    check (relation_type in ('origin','curriculum_alignment','shared_objective','shared_skill','supporting_resource')),
  constraint lms_curriculum_library_topic_links_status_ck
    check (alignment_status in ('pending','candidate','verified','rejected')),
  constraint lms_curriculum_library_topic_links_score_ck
    check (alignment_score is null or (alignment_score >= 0 and alignment_score <= 1)),
  constraint lms_curriculum_library_topic_links_unique
    unique (library_item_id, topic_id)
);

create index if not exists lms_curriculum_library_topic_links_topic_idx
  on public.lms_curriculum_library_topic_links(topic_id);
create index if not exists lms_curriculum_library_topic_links_library_idx
  on public.lms_curriculum_library_topic_links(library_item_id);
create index if not exists lms_curriculum_library_topic_links_verified_idx
  on public.lms_curriculum_library_topic_links(alignment_status, topic_id);

alter table public.lms_curriculum_library_topic_links enable row level security;

drop policy if exists "authenticated users can view library topic links"
  on public.lms_curriculum_library_topic_links;
create policy "authenticated users can view library topic links"
  on public.lms_curriculum_library_topic_links
  for select to authenticated using (true);

drop policy if exists "super admins manage library topic links"
  on public.lms_curriculum_library_topic_links;
create policy "super admins manage library topic links"
  on public.lms_curriculum_library_topic_links
  for all to authenticated
  using (is_super_admin())
  with check (is_super_admin());

insert into public.lms_curriculum_library_topic_links
  (library_item_id, topic_id, relation_type, alignment_status, alignment_basis)
select li.id, li.topic_id, 'origin', 'verified',
       'Existing library item topic association; migrated as the canonical origin link.'
from public.lms_curriculum_library_items li
where li.topic_id is not null
on conflict (library_item_id, topic_id) do nothing;

update public.lms_curriculum_assets a
set status='published',
    generated_at=coalesce(a.generated_at, rp.created_at),
    updated_at=now()
from public.lms_curriculum_resource_packs rp
where rp.id=a.resource_pack_id
  and rp.status='published'
  and exists (select 1 from public.lms_curriculum_library_items li where li.asset_id=a.id)
  and a.status='planned';

update public.lms_curriculum_library_items li
set metadata = jsonb_set(
  coalesce(li.metadata,'{}'::jsonb),
  '{storage_model}',
  '"single_canonical_asset_reused_across_curricula"'::jsonb,
  true
),
updated_at=now()
where li.curriculum_id='cambridge';

create or replace view public.lms_curriculum_library_access
with (security_invoker=true)
as
select
  li.id as library_item_id,
  li.title,
  li.item_type,
  li.source_class,
  li.access_class,
  li.licence_status,
  li.storage_status,
  li.public_status,
  li.qc_status,
  li.asset_id,
  li.external_resource_id,
  ltl.topic_id,
  ltl.relation_type,
  ltl.alignment_status,
  ltl.alignment_score,
  ltl.alignment_basis,
  t.curriculum_id as linked_curriculum_id,
  t.topic_title as linked_topic_title,
  t.topic_code as linked_topic_code
from public.lms_curriculum_library_items li
join public.lms_curriculum_library_topic_links ltl on ltl.library_item_id=li.id
join public.lms_curriculum_topics t on t.id=ltl.topic_id
where ltl.alignment_status in ('origin','verified','candidate')
  and t.active=true;
