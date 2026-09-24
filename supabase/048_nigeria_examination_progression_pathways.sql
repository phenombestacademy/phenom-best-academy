-- Nigeria examination and progression pathway layer
-- Applied to Supabase on 2026-09-24.
-- Official exam content remains link/provenance-only where rights are not established.

insert into global_subject_catalogue(name,slug,category,active)
values ('Nigeria Examination & Progression Pathways','nigeria-examination-progression-pathways','assessment',true)
on conflict (slug) do nothing;

insert into curriculum_subject_catalogue(curriculum_id,subject_id,stage,country_code,source_note,active)
select 'nigeria-nerdc',id,'all','NG',
       'National examination, admission and progression pathway layer; official sources and historical distinctions preserved.',true
from global_subject_catalogue
where slug='nigeria-examination-progression-pathways'
and not exists (
  select 1 from curriculum_subject_catalogue
  where curriculum_id='nigeria-nerdc' and subject_id=global_subject_catalogue.id
);

-- Pathway records are maintained in lms_curriculum_topics with codes:
-- NG-NCEE-NECO, NG-NCEE-NABTEB, NG-BECE-STATE, NG-BECE-NECO,
-- NG-JCE-WAEC-LEGACY, NG-JCE-NECO-LEGACY, NG-WASSCE-SCHOOL,
-- NG-NECO-SSCE-INTERNAL, NG-NECO-SSCE-EXTERNAL, NG-NABTEB-NBC,
-- NG-NABTEB-NTC, NG-NABTEB-NVQ, NG-JAMB-UTME, NG-JAMB-DE,
-- NG-POST-UTME, NG-CAPS, NG-IBASS, NG-TERTIARY-PATHWAY.
-- Each pathway has the standard 14-resource Phenom pack and two content jobs:
-- topic_reconciliation and full_resource_pack.

-- Current official distinctions:
-- UBE/UBEC states that the old Common Entrance route into JSS was discontinued,
-- while current NCEE pathways still exist for designated admissions, including
-- NECO NCEE and NABTEB technical-college NCEE.
-- JCE labels above are explicitly historical/legacy and must not be presented
-- as current national examination names without current official evidence.

-- Official links/provenance are stored in lms_curriculum_external_resources.
