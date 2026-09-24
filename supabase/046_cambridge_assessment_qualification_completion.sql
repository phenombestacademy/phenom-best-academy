-- Cambridge assessment and qualification completion
-- Reconciles Cambridge assessment/qualification coverage and resource queues.
begin;

insert into global_subject_catalogue (id,name,slug,category,active)
select gen_random_uuid(),'Cambridge Assessment & Qualifications','cambridge-assessment-qualifications','Assessment',true
where not exists (select 1 from global_subject_catalogue where slug='cambridge-assessment-qualifications');

with s as (select id subject_id from global_subject_catalogue where slug='cambridge-assessment-qualifications' limit 1),
lv as (select id,display_name from lms_curriculum_levels where curriculum_id='cambridge'),
wanted(stage_name,code,title,source_ref,metadata) as (
 values
 ('Cambridge Primary','CP-CHECKPOINT','Cambridge Primary Checkpoint','Cambridge Primary Checkpoint','{"assessment_type":"external checkpoint"}'),
 ('Cambridge Primary','CP-PROGRESSION','Cambridge Primary Progression Tests','Cambridge Primary assessment','{"assessment_type":"school-based progression assessment"}'),
 ('Cambridge Lower Secondary','CLS-CHECKPOINT','Cambridge Lower Secondary Checkpoint','Cambridge Lower Secondary Checkpoint','{"assessment_type":"external checkpoint"}'),
 ('Cambridge Lower Secondary','CLS-PROGRESSION','Cambridge Lower Secondary Progression Tests','Cambridge Lower Secondary assessment','{"assessment_type":"school-based progression assessment"}'),
 ('Cambridge Upper Secondary','IGCSE-EXAM','Cambridge IGCSE examination pathway','Cambridge IGCSE qualification','{"qualification":"Cambridge IGCSE"}'),
 ('Cambridge Upper Secondary','OLEVEL-EXAM','Cambridge O Level examination pathway','Cambridge O Level qualification','{"qualification":"Cambridge O Level"}'),
 ('Cambridge Upper Secondary','ICE-DIPLOMA','Cambridge ICE — International Certificate of Education','Cambridge ICE','{"qualification":"Cambridge ICE"}'),
 ('Cambridge Advanced','AS-EXAM','Cambridge International AS Level examination pathway','Cambridge International AS Level','{"qualification":"Cambridge International AS Level"}'),
 ('Cambridge Advanced','ALEVEL-EXAM','Cambridge International A Level examination pathway','Cambridge International A Level','{"qualification":"Cambridge International A Level"}'),
 ('Cambridge Advanced','AICE-DIPLOMA','Cambridge AICE Diploma','Cambridge AICE','{"qualification":"Cambridge AICE Diploma"}'),
 ('Cambridge Advanced','IPQ','Cambridge International Project Qualification (IPQ)','Cambridge IPQ','{"qualification":"Cambridge IPQ"}')
)
insert into lms_curriculum_topics
(curriculum_id,level_id,subject_id,topic_title,topic_code,learning_outcomes,assessment_expectations,official_source,source_reference,source_version,source_status,ai_generation_policy,active,metadata)
select 'cambridge',lv.id,s.subject_id,w.title,w.code,
'["Recognise the qualification or assessment purpose, pathway position and progression relationship."]'::jsonb,
'["Use official requirements as the authoritative reference; do not reproduce restricted examination content."]'::jsonb,
'Cambridge International Education',w.source_ref,'2026','verified_framework','phenom_original_only',true,w.metadata::jsonb
from wanted w join lv on lv.display_name=w.stage_name cross join s
where not exists(select 1 from lms_curriculum_topics t where t.curriculum_id='cambridge' and t.topic_code=w.code);

insert into lms_curriculum_content_jobs(curriculum_id,topic_id,job_type,status,priority,metadata)
select 'cambridge',t.id,'topic_reconciliation','queued',100,'{"source":"Cambridge completion audit","provenance":"Phenom"}'
from lms_curriculum_topics t where t.curriculum_id='cambridge'
and not exists(select 1 from lms_curriculum_content_jobs j where j.topic_id=t.id and j.job_type='topic_reconciliation');

insert into lms_curriculum_content_jobs(curriculum_id,topic_id,job_type,status,priority,metadata)
select 'cambridge',t.id,'full_resource_pack','queued',90,'{"source":"Cambridge completion audit","provenance":"Phenom"}'
from lms_curriculum_topics t where t.curriculum_id='cambridge'
and not exists(select 1 from lms_curriculum_content_jobs j where j.topic_id=t.id and j.job_type='full_resource_pack');

insert into lms_curriculum_resource_packs
(topic_id,pack_code,resource_type,title,content,locale,support_locale,sequence_no,status,curriculum_alignment,brand_metadata)
select t.id,'CAM-'||coalesce(t.topic_code,replace(lower(t.id::text),'-','')),v.resource_type,
t.topic_title||' — '||initcap(replace(v.resource_type,'_',' ')),
'Phenom resource-pack generation placeholder. Author and QA against the verified Cambridge syllabus/framework before publication.',
'en-GB','en',v.seq,'draft',
jsonb_build_object('curriculum','cambridge','topic_code',t.topic_code,'provenance','Phenom'),
jsonb_build_object('source_class','phenom_original','canonical_library','true')
from lms_curriculum_topics t
cross join (values ('lesson',1),('study_note',2),('worked_example',3),('practice',4),('assessment',5),('answers',6),('marking_guide',7),('revision',8),('teacher_guide',9),('activities',10),('audio_script',11),('video_script',12),('downloadable',13),('workbook',14)) v(resource_type,seq)
where t.curriculum_id='cambridge'
and not exists(select 1 from lms_curriculum_resource_packs r where r.topic_id=t.id and r.resource_type=v.resource_type);

insert into lms_curriculum_external_resources
(curriculum_id,resource_type,title,official_url,source_authority,access_class,licence_status,retrieval_status,storage_status,source_version,metadata)
select 'cambridge','official_assessment_pathway',x.title,x.url,'Cambridge International','public','link_only','verified','external_link','2026',x.metadata::jsonb
from (values
('Cambridge Pathway — programmes and qualifications','https://www.cambridgeinternational.org/programmes-and-qualifications/','{"scope":"Cambridge Pathway"}'),
('Cambridge Primary Checkpoint','https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-primary/assessment/cambridge-checkpoint/','{"assessment":"Primary Checkpoint"}'),
('Cambridge Lower Secondary Checkpoint','https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/assessment/cambridge-checkpoint/','{"assessment":"Lower Secondary Checkpoint"}'),
('Cambridge Lower Secondary assessment and Progression Tests','https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-lower-secondary/assessment/','{"assessment":"Progression Tests and Checkpoint"}'),
('Cambridge IGCSE qualification','https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-igcse/qualification/','{"qualification":"IGCSE"}'),
('Cambridge O Level qualification','https://www.cambridgeinternational.org/programmes-and-qualifications/cambridge-upper-secondary/cambridge-o-level/qualification/','{"qualification":"O Level"}'),
('Cambridge Insight assessments','https://www.cambridgeinternational.org/programmes-and-qualifications/insight-assessments/','{"assessment":"Insight"}'),
('Cambridge exam timetables','https://www.cambridgeinternational.org/exam-administration/cambridge-exams-officers-guide/phase-1-preparation/timetabling-exams/exam-timetables/','{"assessment":"Checkpoint, IGCSE, O Level and International AS & A Level"}'),
('Cambridge recognition and university guidance','https://www.cambridgeinternational.org/programmes-and-qualifications/recognition-and-acceptance/guidance-for-universities/','{"scope":"IGCSE, O Level, AS & A Level, AICE and IPQ"}')
) x(title,url,metadata)
where not exists(select 1 from lms_curriculum_external_resources e where e.curriculum_id='cambridge' and e.official_url=x.url);

commit;