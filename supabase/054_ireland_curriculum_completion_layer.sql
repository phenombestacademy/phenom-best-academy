-- Ireland curriculum completion layer.
-- Run after the Ireland baseline/topic/resource queue migrations.
-- Official-source detail remains a reconciliation requirement; do not fabricate syllabus chapters.

INSERT INTO lms_curriculum_framework_components
(curriculum_id,component_code,component_type,title,stage,statutory_status,official_source,official_url,source_version,description,metadata,active)
VALUES
('ireland-primary','IE-JC-FRAMEWORK','framework','Framework for Junior Cycle 2015','Junior Cycle','national framework','NCCA','https://ncca.ie/en/junior-cycle/framework-for-junior-cycle/','2026','Eight principles, 24 statements of learning and key skills.','{}',true),
('ireland-primary','IE-PRIMARY-FRAMEWORK','framework','Redeveloped Primary School Curriculum Framework','Primary','national framework','NCCA','https://ncca.ie/en/primary/primary-curriculum-framework-and-curriculum-areas/','2026','Primary framework and five curriculum areas.','{}',true),
('ireland-primary','IE-PRIMARY-ASSESSMENT','assessment','Primary Assessment Guidance 2026','Primary','national guidance','NCCA','https://ncca.ie/en/primary/primary-developments/ongoing-primary-developments/assessment/','2026','Ongoing inclusive assessment supporting teaching and learning.','{}',true),
('ireland-primary','IE-JC-SUBJECTS','curriculum','Junior Cycle Subjects and Short Courses','Junior Cycle','state curriculum','NCCA','https://ncca.ie/en/junior-cycle/subjects-and-short-courses/','2026','Subjects and short courses.','{}',true),
('ireland-primary','IE-JC-ASSESSMENT','assessment','Junior Cycle Assessment and Reporting','Junior Cycle','national framework','NCCA','https://ncca.ie/en/junior-cycle/assessment-and-reporting/','2026','Classroom based assessment, SLAR and reporting.','{}',true),
('ireland-primary','IE-SC-PROGRAMMES','programme','Senior Cycle Programmes','Senior Cycle','national programme','NCCA','https://ncca.ie/en/senior-cycle/senior-cycle-programmes/','2026','TY, LCE, LCA, LCVP and Level 1/2 learning programmes.','{}',true),
('ireland-primary','IE-SC-REDEVELOPMENT','curriculum','Senior Cycle Subject Redevelopment 2025-2029','Senior Cycle','phased national curriculum development','NCCA','https://ncca.ie/en/senior-cycle/senior-cycle-redevelopment/schedule-of-senior-cycle-subjects-for-redevelopment/','2026','Phased subject redevelopment through 2029.','{}',true),
('ireland-primary','IE-SC-2025','transition','Senior Cycle Tranche 1','Senior Cycle','phased implementation','NCCA','https://ncca.ie/en/senior-cycle/senior-cycle-redevelopment/schedule-of-senior-cycle-subjects-for-redevelopment/','2026','2025 tranche.','{}',true),
('ireland-primary','IE-SC-2026','transition','Senior Cycle Tranche 2','Senior Cycle','phased implementation','NCCA','https://ncca.ie/en/senior-cycle/senior-cycle-redevelopment/schedule-of-senior-cycle-subjects-for-redevelopment/','2026','2026 tranche, including postponed introductions where applicable.','{}',true),
('ireland-primary','IE-SC-2027','transition','Senior Cycle Tranche 3','Senior Cycle','phased implementation','NCCA','https://ncca.ie/en/senior-cycle/senior-cycle-redevelopment/schedule-of-senior-cycle-subjects-for-redevelopment/','2026','2027 tranche.','{}',true),
('ireland-primary','IE-SC-2028','transition','Senior Cycle Tranche 4','Senior Cycle','phased implementation','NCCA','https://ncca.ie/en/senior-cycle/senior-cycle-redevelopment/schedule-of-senior-cycle-subjects-for-redevelopment/','2026','2028 tranche.','{}',true),
('ireland-primary','IE-SC-2029','transition','Senior Cycle Tranche 5','Senior Cycle','phased implementation','NCCA','https://ncca.ie/en/senior-cycle/senior-cycle-redevelopment/schedule-of-senior-cycle-subjects-for-redevelopment/','2026','2029 tranche.','{}',true),
('ireland-primary','IE-LCA','programme','Leaving Certificate Applied','Senior Cycle','national programme','NCCA','https://ncca.ie/en/senior-cycle/senior-cycle-programmes/','2026','Two-year programme.','{}',true),
('ireland-primary','IE-LCVP','programme','Leaving Certificate Vocational Programme','Senior Cycle','national programme','NCCA','https://ncca.ie/en/senior-cycle/senior-cycle-programmes/','2026','Vocationally focused Leaving Certificate programme.','{}',true),
('ireland-primary','IE-TY','programme','Transition Year','Senior Cycle','optional programme','NCCA','https://ncca.ie/en/senior-cycle/senior-cycle-programmes/','2026','Optional one-year programme after Junior Cycle.','{}',true),
('ireland-primary','IE-EXAMS','assessment','State Examinations','Senior Cycle','state assessment','State Examinations Commission','https://www.examinations.ie/','2026','Official state examination administration.','{}',true),
('ireland-primary','IE-TERTIARY','pathway','Further and Higher Education Pathways','Post-school','pathway','Department of Education','https://www.gov.ie/en/department-of-education/','2026','Post-school progression and pathways.','{}',true)
ON CONFLICT (curriculum_id,component_code) DO NOTHING;

INSERT INTO lms_curriculum_requirement_mappings
(curriculum_id,topic_id,mapping_type,official_source_url,source_version,official_reference,requirement_text,mapping_status,verification_status,metadata)
SELECT t.curriculum_id,t.id,'official_reconciliation_anchor','https://ncca.ie/en/','2026','NCCA / Curriculum Online',
'Official Irish syllabus or specification must be reconciled at subject, level and topic detail before AI content is treated as curriculum-authoritative.',
'queued','pending','{"requires_official_reconciliation":true}'
FROM lms_curriculum_topics t
WHERE t.curriculum_id='ireland-primary'
AND NOT EXISTS (SELECT 1 FROM lms_curriculum_requirement_mappings m WHERE m.topic_id=t.id);

INSERT INTO lms_curriculum_library_items
(curriculum_id,topic_id,title,item_type,source_class,access_class,licence_status,storage_status,public_status,qc_status,metadata)
SELECT t.curriculum_id,t.id,t.topic_title,'curriculum_collection','official_provenance','super_admin_edit_teacher_view',
'provenance_link_only','reference_only','private','queued','{"canonical":true,"edit_policy":"super_admin_only"}'
FROM lms_curriculum_topics t
WHERE t.curriculum_id='ireland-primary'
AND NOT EXISTS (SELECT 1 FROM lms_curriculum_library_items l WHERE l.topic_id=t.id AND l.item_type='curriculum_collection');

INSERT INTO lms_curriculum_external_resources
(curriculum_id,resource_type,title,official_url,source_authority,access_class,licence_status,retrieval_status,storage_status,source_version,metadata)
VALUES
('ireland-primary','official_curriculum','NCCA Primary Curriculum Framework','https://ncca.ie/en/primary/primary-curriculum-framework-and-curriculum-areas/','NCCA','public_reference','official_link_only','verified','reference_only','2026','{"provenance":true}'),
('ireland-primary','official_curriculum','NCCA Junior Cycle Subjects and Short Courses','https://ncca.ie/en/junior-cycle/subjects-and-short-courses/','NCCA','public_reference','official_link_only','verified','reference_only','2026','{"provenance":true}'),
('ireland-primary','official_curriculum','NCCA Senior Cycle Subject Redevelopment Schedule','https://ncca.ie/en/senior-cycle/senior-cycle-redevelopment/schedule-of-senior-cycle-subjects-for-redevelopment/','NCCA','public_reference','official_link_only','verified','reference_only','2026','{"provenance":true}'),
('ireland-primary','official_assessment','State Examinations Commission','https://www.examinations.ie/','State Examinations Commission','public_reference','official_link_only','verified','reference_only','2026','{"provenance":true}'),
('ireland-primary','official_policy','Department of Education','https://www.gov.ie/en/department-of-education/','Government of Ireland','public_reference','official_link_only','verified','reference_only','2026','{"provenance":true}')
ON CONFLICT DO NOTHING;
