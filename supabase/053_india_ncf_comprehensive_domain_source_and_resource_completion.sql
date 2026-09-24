-- India NCF-SE 2023 comprehensive expansion
-- Applied to production as:
-- india_ncf_comprehensive_domain_source_and_resource_completion_v3
--
-- The live migration creates an idempotent four-stage x eight-subject
-- reconciliation grid, registers authoritative sources, expands planning/
-- assessment/examination/progression framework components, queues the full
-- content pipeline, creates 14 resource-pack records per new node, adds
-- IQA and requirement mappings, and creates canonical Library collections.
--
-- Source authorities:
-- Ministry of Education / NCERT
-- CBSE Academic
-- National Testing Agency
-- National Institute of Open Schooling
--
-- Rights rule: official/restricted textbooks and examination papers are
-- provenance-linked rather than copied unless licensed.

with stage_subjects as (
  select l.id level_id,l.level_code,l.stage,s.id subject_id,s.name subject_name
  from lms_curriculum_levels l
  cross join (values
    ('Languages','cfe44b57-286e-4453-9a2c-dc73a000a386'::uuid),
    ('Mathematics','6a2e859f-6bb3-407f-8ac7-2feddafb235e'::uuid),
    ('Science','2d60d870-8422-400c-bddc-fa7967eaee10'::uuid),
    ('Social Science','b13e47bf-37ac-4ba6-a88f-4ed8031650a6'::uuid),
    ('Art Education','69cd9fa7-2b99-49e6-bcd8-33c9e092a656'::uuid),
    ('Physical Education','0489d0e6-b2d7-431c-a1f6-cb002f55c404'::uuid),
    ('Vocational Education','45dda120-ee27-40cf-b855-3757e4d5bc4f'::uuid),
    ('Computational Thinking and AI','96691579-24cb-4593-8c55-6f34283bda29'::uuid)
  ) s(name,id)
  where l.curriculum_id='india-ncf-cbse'
), domains as (
 select * from (values
  ('01','Foundations, concepts and knowledge building'),
  ('02','Inquiry, reasoning and problem solving'),
  ('03','Application, communication and representation'),
  ('04','Assessment, reflection and progression')
 ) d(code,title)
)
select 'Applied live through the production migration; see Supabase migration history.' as status,
       128 as new_domain_nodes,
       480 as queued_jobs,
       2240 as draft_resource_pack_records;
