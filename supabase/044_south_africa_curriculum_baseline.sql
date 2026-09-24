-- South Africa NCS/CAPS baseline.
-- Additive and idempotent. Official source text is not copied; provenance links are retained.
insert into curriculum_catalogue
(id,name,description,country_codes,stages,subjects,official_source,notes,active)
values
('south-africa','South Africa National Curriculum & Qualifications',
 'South African National Curriculum Statement Grades R–12, CAPS, assessment, NSC and school-to-university pathway.',
 ARRAY['ZA']::text[],
 ARRAY['early_years','foundation_phase','intermediate_phase','senior_phase','fet','post_secondary','pre_university']::text[],
 ARRAY[]::text[],
 'South African Department of Basic Education / Umalusi',
 'National baseline; preserve historical/current versions and provenance/licensing.',
 true)
on conflict (id) do update set name=excluded.name,description=excluded.description,country_codes=excluded.country_codes,stages=excluded.stages,subjects=excluded.subjects,official_source=excluded.official_source,notes=excluded.notes,active=true;

with levels(stage,level_code,display_name,sequence_no) as (
 values
 ('early_years','B-4','Birth to Four / Early Childhood Development',1),
 ('foundation_phase','R','Grade R',2),('foundation_phase','G1','Grade 1',3),('foundation_phase','G2','Grade 2',4),('foundation_phase','G3','Grade 3',5),
 ('intermediate_phase','G4','Grade 4',6),('intermediate_phase','G5','Grade 5',7),('intermediate_phase','G6','Grade 6',8),
 ('senior_phase','G7','Grade 7',9),('senior_phase','G8','Grade 8',10),('senior_phase','G9','Grade 9',11),
 ('fet','G10','Grade 10',12),('fet','G11','Grade 11',13),('fet','G12','Grade 12',14),('fet','NSC','National Senior Certificate / Matric',15),
 ('post_secondary','HE-PATH','Post-school and university preparation / pathways',16)
)
insert into lms_curriculum_levels(curriculum_id,stage,level_code,display_name,sequence_no,active)
select 'south-africa',stage,level_code,display_name,sequence_no,true from levels l
where not exists(select 1 from lms_curriculum_levels x where x.curriculum_id='south-africa' and x.level_code=l.level_code);

insert into lms_curriculum_sources
(curriculum_id,source_title,source_type,issuing_body,official_url,source_version,verification_status,extraction_method,document_scope,notes,active)
select * from (values
('south-africa','National Curriculum Statement Grades R–12 / CAPS','policy','South African Department of Basic Education','https://www.education.gov.za/Curriculum/NCSGradesR12/CAPS/tabid/420/Default.aspx','Current official web index 2026','verified','official-web','National curriculum and CAPS framework','Individual subject CAPS documents must be versioned separately.',true),
('south-africa','CAPS Foundation Phase','curriculum','South African Department of Basic Education','https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements%28CAPS%29/CAPSFoundation.aspx','Current official web index 2026','verified','official-web','Grades R–3','Foundation Phase subjects and language variants.',true),
('south-africa','CAPS Intermediate Phase','curriculum','South African Department of Basic Education','https://www.education.gov.za/Curriculum/CurriculumAssessmentPolicyStatements%28CAPS%29/CAPSIntermediate.aspx','Current official web index 2026','verified','official-web','Grades 4–6','Intermediate Phase subjects and language variants.',true),
('south-africa','CAPS Senior Phase','curriculum','South African Department of Basic Education','https://www.education.gov.za/Curriculum/NCSGradesR12/CAPSSenior/tabid/573/Default.aspx','Current official web index 2026','verified','official-web','Grades 7–9','Senior Phase subjects, amendments and SA Sign Language.',true),
('south-africa','CAPS Further Education and Training','curriculum','South African Department of Basic Education','https://www.education.gov.za/Curriculum/NCSGradesR12/CAPSFET/tabid/570/Default.aspx','Current official web index 2026','verified','official-web','Grades 10–12','FET subjects, languages, technical and specialist subjects.',true),
('south-africa','Grade 12 NSC Examination Guidelines','assessment','South African Department of Basic Education','https://www.education.gov.za/2021Grade12ExamGuidelines.aspx','Current official guidance index','verified','official-web','Grade 12 external NSC examinations','Exam preparation scope; not a substitute for CAPS.',true),
('south-africa','National Protocol for Assessment / programme and promotion requirements','assessment_policy','South African Department of Basic Education','https://www.education.gov.za/DoentsLibrary/Policies/tabid/390/Default.aspx','Current policy index 2026','verified','official-web','Grades R–12 assessment and promotion','Assessment policy source; preserve version history.',true),
('south-africa','NSC assessment quality assurance','quality_assurance','Umalusi','https://www.umalusi.org.za/','Current regulatory framework','verified','official-web','NSC quality assurance and standardisation','Umalusi quality-assurance provenance.',true)
) v(curriculum_id,source_title,source_type,issuing_body,official_url,source_version,verification_status,extraction_method,document_scope,notes,active)
where not exists(select 1 from lms_curriculum_sources s where s.curriculum_id=v.curriculum_id and s.source_title=v.source_title);

insert into curriculum_subject_catalogue(curriculum_id,subject_id,stage,country_code,source_note,active)
select 'south-africa',g.id,'all','ZA','DBE official CAPS phase/FET subject index; phase applicability is versioned in topic metadata.',true
from global_subject_catalogue g
where g.slug in (
'afrikaans','english','isindebele','isixhosa','isizulu','sepedi','sesotho','setswana','siswati','tshivenda','itsonga','south-african-sign-language',
'french','mandarin','life-skills','natural-sciences-and-technology','social-sciences','coding-and-robotics','creative-arts','economic-and-management-sciences',
'technology','natural-sciences','accounting','agricultural-management-practices','agricultural-sciences','agricultural-technology','business-studies',
'civil-technology','computer-applications-technology','consumer-studies','dance-studies','design-studies','dramatic-arts','economics','electrical-technology',
'engineering-graphics-and-design','equine-studies','geography','hospitality-studies','information-technology','life-orientation','life-sciences',
'marine-sciences','maritime-economics','mathematical-literacy','mathematics','mechanical-technology','music','nautical-science','physical-sciences',
'religion-studies','sport-and-exercise-science','technical-mathematics','technical-sciences','technical-civil-technology','technical-electrical-technology',
'technical-mechanical-technology','tourism','visual-arts'
)
and not exists(select 1 from curriculum_subject_catalogue c where c.curriculum_id='south-africa' and c.subject_id=g.id);

-- Detailed CAPS extraction is represented by reconciliation anchors until each official subject document is parsed.
with applicable as (
 select l.id level_id,l.level_code,g.id subject_id,g.name subject_name
 from lms_curriculum_levels l cross join global_subject_catalogue g
 where g.active and (
   (l.level_code in ('R','G1','G2','G3') and g.slug in ('afrikaans','english','isindebele','isixhosa','isizulu','sepedi','sesotho','setswana','siswati','tshivenda','itsonga','south-african-sign-language','mathematics','life-skills'))
   or (l.level_code in ('G4','G5','G6') and g.slug in ('afrikaans','english','isindebele','isixhosa','isizulu','sepedi','sesotho','setswana','siswati','tshivenda','itsonga','south-african-sign-language','french','mandarin','mathematics','life-skills','natural-sciences-and-technology','social-sciences','coding-and-robotics'))
   or (l.level_code in ('G7','G8','G9') and g.slug in ('afrikaans','english','isindebele','isixhosa','isizulu','sepedi','sesotho','setswana','siswati','tshivenda','itsonga','south-african-sign-language','french','mandarin','mathematics','natural-sciences','social-sciences','life-orientation','creative-arts','technology','economic-and-management-sciences','coding-and-robotics'))
   or (l.level_code in ('G10','G11','G12') and g.slug in ('afrikaans','english','isindebele','isixhosa','isizulu','sepedi','sesotho','setswana','siswati','tshivenda','itsonga','south-african-sign-language','french','mandarin','accounting','agricultural-management-practices','agricultural-sciences','agricultural-technology','business-studies','civil-technology','computer-applications-technology','consumer-studies','dance-studies','design-studies','dramatic-arts','economics','electrical-technology','engineering-graphics-and-design','equine-studies','geography','hospitality-studies','information-technology','life-orientation','life-sciences','marine-sciences','maritime-economics','mathematical-literacy','mathematics','mechanical-technology','music','nautical-science','physical-sciences','religion-studies','sport-and-exercise-science','technical-mathematics','technical-sciences','technical-civil-technology','technical-electrical-technology','technical-mechanical-technology','tourism','visual-arts'))
 )
)
insert into lms_curriculum_topics
(curriculum_id,level_id,subject_id,topic_title,topic_code,learning_outcomes,assessment_expectations,official_source,source_reference,source_version,source_status,ai_generation_policy,active,metadata)
select 'south-africa',level_id,subject_id,subject_name||' — CAPS curriculum content and assessment framework',
'ZA-'||level_code||'-'||upper(replace(subject_name,' ','-')),
jsonb_build_array('Reconcile official CAPS knowledge, skills, progression and learning outcomes for this level and subject.'),
jsonb_build_array('Align school-based assessment and, where applicable, external NSC assessment to official requirements.'),
'South African Department of Basic Education','Official CAPS phase/FET index and applicable subject CAPS document',
'Current official index 2026','verified-source-index',
'Use official source as authority; Phenom may author original resources but must not present them as official text.',true,
jsonb_build_object('implementation_role','reconciliation_anchor','needs_detailed_topic_extraction',true)
from applicable
where not exists(select 1 from lms_curriculum_topics t where t.curriculum_id='south-africa' and t.level_id=applicable.level_id and t.subject_id=applicable.subject_id);

insert into lms_curriculum_resource_packs
(topic_id,pack_code,resource_type,title,content,locale,support_locale,sequence_no,status,curriculum_alignment,brand_metadata)
select t.id,'ZA-'||replace(t.topic_code,' ','-')||'-'||rt.code,rt.resource_type,rt.label||' — '||t.topic_title,
'Generation placeholder: create a human-readable Phenom original resource aligned to the reconciled official CAPS requirements. Do not copy restricted official text. Complete only after source reconciliation and QA.',
'en-ZA','en-ZA',rt.seq,'draft',
jsonb_build_object('curriculum','south-africa','topic_id',t.id,'requires_source_reconciliation',true),
jsonb_build_object('owner','Phenom Best Academy','access','super_admin_edit_teacher_view','provenance','phenom_original')
from lms_curriculum_topics t
cross join (values
('lesson','lesson','Lesson',1),('study_note','study_note','Learner Study Notes',2),('worked_example','worked_example','Worked Examples',3),
('practice','practice','Practice Activities',4),('assessment','assessment','Formal Assessment',5),('answers','answers','Answer Key',6),
('marking_guide','marking_guide','Marking Guide / Rubric',7),('revision','revision','Revision Material',8),('teacher_guide','teacher_guide','Teacher Guide',9),
('activities','activities','Practical Activities and Assignments',10),('audio_script','audio_script','Audio Script',11),('video_script','video_script','Video Script',12),
('downloadable','downloadable','Downloadable Resource',13),('workbook','workbook','Workbook',14)
) rt(code,resource_type,label,seq)
where t.curriculum_id='south-africa'
and not exists(select 1 from lms_curriculum_resource_packs p where p.topic_id=t.id and p.resource_type=rt.resource_type);

insert into lms_curriculum_library_items
(curriculum_id,topic_id,title,item_type,source_class,access_class,licence_status,storage_status,public_status,qc_status,metadata)
select t.curriculum_id,t.id,'South Africa canonical curriculum collection — '||t.topic_title,'resource_pack_collection','phenom_original','super_admin_edit_teacher_view','Phenom original','database_canonical','internal','pending',
jsonb_build_object('canonical',true,'official_source_indexed',true,'province_overrides_supported',true)
from lms_curriculum_topics t
where t.curriculum_id='south-africa'
and not exists(select 1 from lms_curriculum_library_items l where l.topic_id=t.id and l.curriculum_id='south-africa');

insert into lms_curriculum_content_jobs(curriculum_id,topic_id,job_type,status,priority,metadata)
select t.curriculum_id,t.id,'topic_reconciliation','queued',100,
jsonb_build_object('scope','extract and reconcile official CAPS topic/subtopic/content/learning outcomes/assessment requirements','do_not_copy_restricted_text',true)
from lms_curriculum_topics t
where t.curriculum_id='south-africa'
and not exists(select 1 from lms_curriculum_content_jobs j where j.topic_id=t.id and j.job_type='topic_reconciliation');

insert into lms_curriculum_content_jobs(curriculum_id,topic_id,job_type,status,priority,metadata)
select t.curriculum_id,t.id,'full_resource_pack','queued',90,
jsonb_build_object('resources',ARRAY['lesson','study_note','worked_example','practice','assessment','answers','marking_guide','revision','teacher_guide','activities','audio_script','video_script','downloadable','workbook'],'provenance','phenom_original')
from lms_curriculum_topics t
where t.curriculum_id='south-africa'
and not exists(select 1 from lms_curriculum_content_jobs j where j.topic_id=t.id and j.job_type='full_resource_pack');
