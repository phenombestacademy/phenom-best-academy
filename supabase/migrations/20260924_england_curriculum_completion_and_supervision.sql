create table if not exists public.lms_curriculum_quality_reviews (
  id uuid primary key default gen_random_uuid(),
  curriculum_id text not null references public.curriculum_catalogue(id),
  topic_id uuid not null references public.lms_curriculum_topics(id) on delete cascade,
  reviewer_role text not null default 'curriculum_supervisor',
  status text not null default 'pending',
  curriculum_verified boolean not null default false,
  lesson_verified boolean not null default false,
  study_note_verified boolean not null default false,
  practice_verified boolean not null default false,
  assessment_verified boolean not null default false,
  revision_verified boolean not null default false,
  teacher_guide_verified boolean not null default false,
  worked_example_verified boolean not null default false,
  audio_script_verified boolean not null default false,
  video_script_verified boolean not null default false,
  downloadable_verified boolean not null default false,
  notes text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(curriculum_id, topic_id)
);

alter table public.lms_curriculum_quality_reviews enable row level security;
grant select on public.lms_curriculum_quality_reviews to authenticated;
grant select, insert, update, delete on public.lms_curriculum_quality_reviews to service_role;

create policy lms_curriculum_quality_reviews_authenticated_select
on public.lms_curriculum_quality_reviews
for select to authenticated using (true);

create policy lms_curriculum_quality_reviews_service_all
on public.lms_curriculum_quality_reviews
for all to service_role using (true) with check (true);

insert into public.lms_curriculum_levels (curriculum_id, stage, level_code, display_name, sequence_no, active)
select 'england-national', x.stage, x.level_code, x.display_name, x.sequence_no, true
from (values
  ('Key Stage 1','year-1-england-national','Year 1',11),
  ('Key Stage 1','year-2-england-national','Year 2',12),
  ('Key Stage 2','year-3-england-national','Year 3',13),
  ('Key Stage 2','year-4-england-national','Year 4',14),
  ('Key Stage 2','year-5-england-national','Year 5',15),
  ('Key Stage 2','year-6-england-national','Year 6',16),
  ('Key Stage 3','year-7-england-national','Year 7',17),
  ('Key Stage 3','year-8-england-national','Year 8',18),
  ('Key Stage 3','year-9-england-national','Year 9',19),
  ('Key Stage 4','year-10-england-national','Year 10',20),
  ('Key Stage 4','year-11-england-national','Year 11',21)
) as x(stage,level_code,display_name,sequence_no)
where not exists (select 1 from public.lms_curriculum_levels l where l.curriculum_id='england-national' and l.level_code=x.level_code);

insert into public.global_subject_catalogue (name, slug, category, active)
select x.name, x.slug, 'early_years', true
from (values
  ('Communication and Language','communication-and-language'),
  ('Personal, Social and Emotional Development','personal-social-and-emotional-development'),
  ('Physical Development','physical-development'),
  ('Literacy','literacy'),
  ('Understanding the World','understanding-the-world'),
  ('Expressive Arts and Design','expressive-arts-and-design')
) as x(name,slug)
where not exists (select 1 from public.global_subject_catalogue g where g.slug=x.slug);

insert into public.curriculum_subject_catalogue (curriculum_id, subject_id, stage, country_code, source_note, active)
select 'england-national', g.id, 'Early Years Foundation Stage', 'GB',
       'EYFS statutory framework: seven areas of learning and development; Phenom maps the areas as early-years curriculum domains.', true
from public.global_subject_catalogue g
where g.slug in ('communication-and-language','personal-social-and-emotional-development','physical-development','literacy','understanding-the-world','expressive-arts-and-design')
and not exists (select 1 from public.curriculum_subject_catalogue c where c.curriculum_id='england-national' and c.subject_id=g.id and c.stage='Early Years Foundation Stage');

insert into public.lms_curriculum_quality_reviews (curriculum_id, topic_id, status, metadata)
select t.curriculum_id, t.id,
       case when count(r.id) >= 10 then 'verified_existing' else 'pending_completion' end,
       jsonb_build_object(
         'expected_resource_types', jsonb_build_array('lesson','study_note','practice','assessment','revision','teacher_guide','worked_example','audio_script','video_script','downloadable'),
         'resource_count', count(r.id), 'preserve_existing', true,
         'review_basis', 'Compare official curriculum requirement against verified Phenom content; fill gaps without overwriting verified resources.'
       )
from public.lms_curriculum_topics t
left join public.lms_curriculum_resource_packs r on r.topic_id=t.id and r.status='published'
where t.curriculum_id='england-national'
group by t.curriculum_id,t.id
on conflict (curriculum_id, topic_id) do update set
  metadata=excluded.metadata,
  status=case when (excluded.metadata->>'resource_count')::int >= 10 then 'verified_existing' else 'pending_completion' end,
  updated_at=now();

insert into public.lms_curriculum_content_jobs (curriculum_id, topic_id, job_type, status, priority, requested_at, metadata)
select t.curriculum_id, t.id, 'resource_expansion', 'queued', 90, now(),
       jsonb_build_object('reason','England completion pass','preserve_verified',true,'supervisor_review_required',true)
from public.lms_curriculum_topics t
join public.lms_curriculum_quality_reviews q on q.topic_id=t.id and q.curriculum_id=t.curriculum_id
where t.curriculum_id='england-national' and q.status='pending_completion'
  and not exists (select 1 from public.lms_curriculum_content_jobs j where j.topic_id=t.id and j.job_type='resource_expansion' and j.status in ('queued','running'));

insert into public.lms_curriculum_sources (curriculum_id, source_title, source_type, issuing_body, official_url, source_version, publication_date, retrieved_at, verification_status, extraction_method, document_scope, notes, active)
select 'england-national','Early years foundation stage (EYFS) statutory framework','statutory_guidance','Department for Education','https://www.gov.uk/government/publications/early-years-foundation-stage-framework--2','Effective from 1 September 2026','2026-09-01',now(),'verified','official_web_source','EYFS birth to 5','Current statutory EYFS framework for England; provider-specific versions apply.',true
where not exists (select 1 from public.lms_curriculum_sources s where s.curriculum_id='england-national' and s.official_url='https://www.gov.uk/government/publications/early-years-foundation-stage-framework--2');

insert into public.lms_curriculum_sources (curriculum_id, source_title, source_type, issuing_body, official_url, source_version, retrieved_at, verification_status, extraction_method, document_scope, notes, active)
select 'england-national','The national curriculum: Overview','statutory_guidance','Department for Education','https://www.gov.uk/national-curriculum','Current online overview',now(),'verified','official_web_source','EYFS through KS4 overview and assessment information','Official overview of England national curriculum stages and assessment.',true
where not exists (select 1 from public.lms_curriculum_sources s where s.curriculum_id='england-national' and s.official_url='https://www.gov.uk/national-curriculum');

insert into public.lms_curriculum_sources (curriculum_id, source_title, source_type, issuing_body, official_url, source_version, retrieved_at, verification_status, extraction_method, document_scope, notes, active)
select 'england-national','National curriculum in England: framework for key stages 1 to 4','statutory_guidance','Department for Education','https://www.gov.uk/government/publications/national-curriculum-in-england-framework-for-key-stages-1-to-4','Current statutory framework',now(),'verified','official_web_source','KS1 to KS4 statutory curriculum framework, aims, inclusion, programmes of study and attainment targets','Official statutory national curriculum framework. Phenom resources must preserve source attribution and distinguish statutory requirements from non-statutory/example content.',true
where not exists (select 1 from public.lms_curriculum_sources s where s.curriculum_id='england-national' and s.official_url='https://www.gov.uk/government/publications/national-curriculum-in-england-framework-for-key-stages-1-to-4');
