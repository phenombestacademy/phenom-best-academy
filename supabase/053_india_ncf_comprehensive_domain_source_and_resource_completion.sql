-- India NCF-SE 2023 comprehensive domain/source/resource expansion.
-- Production application: india_ncf_comprehensive_domain_source_and_resource_completion_v3
-- This file records the reproducible expansion logic; official source content is
-- reconciled by the curriculum workers before resources are approved.

do $$
declare
  l record;
  d record;
  s record;
  t_id uuid;
  jt text;
  rt record;
begin
  for l in select id,level_code from lms_curriculum_levels
           where curriculum_id='india-ncf-cbse' order by sequence_no loop
    for s in select * from (values
      ('Languages','cfe44b57-286e-4453-9a2c-dc73a000a386'::uuid),
      ('Mathematics','6a2e859f-6bb3-407f-8ac7-2feddafb235e'::uuid),
      ('Science','2d60d870-8422-400c-bddc-fa7967eaee10'::uuid),
      ('Social Science','b13e47bf-37ac-4ba6-a88f-4ed8031650a6'::uuid),
      ('Art Education','69cd9fa7-2b99-49e6-bcd8-33c9e092a656'::uuid),
      ('Physical Education','0489d0e6-b2d7-431c-a1f6-cb002f55c404'::uuid),
      ('Vocational Education','45dda120-ee27-40cf-b855-3757e4d5bc4f'::uuid),
      ('Computational Thinking and AI','96691579-24cb-4593-8c55-6f34283bda29'::uuid)
    ) x(name,id) loop
      for d in select * from (values
        ('01','Foundations, concepts and knowledge building'),
        ('02','Inquiry, reasoning and problem solving'),
        ('03','Application, communication and representation'),
        ('04','Assessment, reflection and progression')
      ) x(code,title) loop
        insert into lms_curriculum_topics
          (curriculum_id,level_id,subject_id,topic_title,topic_code,
           learning_outcomes,assessment_expectations,official_source,
           source_reference,source_version,source_status,ai_generation_policy,
           active,metadata)
        select 'india-ncf-cbse',l.id,s.id,
          s.name||' — '||d.title,
          'INDIA-NCF-DOMAIN-'||l.level_code||'-'||d.code||'-'||regexp_replace(upper(s.name),'[^A-Z0-9]+','-','g'),
          '[]'::jsonb,'[]'::jsonb,'Ministry of Education / NCERT',
          'NCF-SE 2023 domain reconciliation','NCF-SE 2023; 2026-27',
          'pending_reconciliation','official_reconciliation_required',true,
          jsonb_build_object('node_kind','domain_reconciliation','requires_source_reconciliation',true)
        where not exists (
          select 1 from lms_curriculum_topics z
          where z.curriculum_id='india-ncf-cbse'
            and z.topic_code='INDIA-NCF-DOMAIN-'||l.level_code||'-'||d.code||'-'||regexp_replace(upper(s.name),'[^A-Z0-9]+','-','g')
        )
        returning id into t_id;

        if t_id is not null then
          for jt in select unnest(array['topic_reconciliation','full_resource_pack','resource_expansion']) loop
            insert into lms_curriculum_content_jobs
              (curriculum_id,topic_id,job_type,status,priority,metadata)
            values
              ('india-ncf-cbse',t_id,jt,'queued',
               case jt when 'topic_reconciliation' then 100 when 'full_resource_pack' then 90 else 80 end,
               jsonb_build_object('requires_official_reconciliation',true,'provenance_required',true));
          end loop;

          insert into lms_curriculum_quality_reviews
            (curriculum_id,topic_id,reviewer_role,status,metadata)
          values
            ('india-ncf-cbse',t_id,'iqa_worker','queued',
             jsonb_build_object('requires_full_resource_pack',true,'requires_official_reconciliation',true));

          insert into lms_curriculum_requirement_mappings
            (curriculum_id,topic_id,mapping_type,official_source_url,source_version,
             official_reference,requirement_text,mapping_status,verification_status,metadata)
          values
            ('india-ncf-cbse',t_id,'national_framework_alignment',
             'https://www.education.gov.in/sites/upload_files/mhrd/files/ncf_2023.pdf',
             'NCF-SE 2023','NCF-SE 2023 curricular and pedagogical structure',
             'Reconcile against the current official syllabus/textbook/board source before publication.',
             'pending','pending',jsonb_build_object('source_required',true));

          for rt in select * from (values
            (1,'lesson','Lesson'),(2,'study_note','Study Note'),
            (3,'worked_example','Worked Example'),(4,'practice','Practice Set'),
            (5,'assessment','Assessment'),(6,'answers','Answers'),
            (7,'marking_guide','Marking Guide'),(8,'revision','Revision Guide'),
            (9,'teacher_guide','Teacher Guide'),(10,'activities','Activities'),
            (11,'audio_script','Audio Script'),(12,'video_script','Video Script'),
            (13,'downloadable','Downloadable Resource'),(14,'workbook','Workbook')
          ) x(n,resource_type,label) loop
            insert into lms_curriculum_resource_packs
              (topic_id,pack_code,resource_type,title,content,locale,support_locale,
               sequence_no,status,curriculum_alignment,brand_metadata)
            values
              (t_id,'INDIA-NCF-DOMAIN-'||l.level_code||'-'||d.code||'-'||regexp_replace(upper(s.name),'[^A-Z0-9]+','-','g')||'-'||rt.n,
               rt.resource_type,s.name||' — '||d.title||' — '||rt.label,'',
               'en-IN','en-IN',rt.n,'draft',
               jsonb_build_object('curriculum_id','india-ncf-cbse','source_status','pending_reconciliation'),
               jsonb_build_object('brand','Phenom Best Academy','canonical_library_owner','super_admin'))
            on conflict do nothing;
          end loop;

          insert into lms_curriculum_library_items
            (curriculum_id,topic_id,title,item_type,source_class,access_class,
             licence_status,storage_status,public_status,qc_status,metadata)
          values
            ('india-ncf-cbse',t_id,s.name||' — '||d.title||' — Canonical Library Collection',
             'collection','phenom_authored','internal','pending','not_stored','private','pending',
             jsonb_build_object('canonical',true,'editable_by','super_admin_only','teacher_access','view_select_use'))
          on conflict do nothing;
        end if;
        t_id := null;
      end loop;
    end loop;
  end loop;
end $$;

insert into lms_curriculum_sources
(curriculum_id,source_title,source_type,issuing_body,official_url,source_version,
 verification_status,retrieved_at,extraction_method,document_scope,notes,active)
select v.curriculum_id,v.source_title,v.source_type,v.issuing_body,v.official_url,
       v.source_version,'verified',now(),'official_portal_review',v.document_scope,v.notes,true
from (values
('india-ncf-cbse','National Curriculum Framework for School Education 2023','framework','Ministry of Education, Government of India','https://www.education.gov.in/sites/upload_files/mhrd/files/ncf_2023.pdf','NCF-SE 2023','ages 3-18 / 5+3+3+4','Primary national framework; state/UT and board layers remain distinct.'),
('india-ncf-cbse','NCERT Textbooks and Publications Classes I-XII','textbook_portal','NCERT','https://ncert.nic.in/textbook.php?cesa1=1-12','current 2026','Classes I-XII','Official textbook portal; restricted content remains provenance-controlled.'),
('india-ncf-cbse','CBSE Academic Curriculum 2026-27','board_curriculum','CBSE','https://cbseacademic.nic.in/','2026-27','Secondary and Senior Secondary','Current board-specific curriculum layer.'),
('india-ncf-cbse','CBSE 2026-27 Sample Question Papers and Marking Schemes','assessment','CBSE','https://cbseacademic.nic.in/SQP_CLASSXII_2026-27.html','2026-27','Classes X and XII','Official assessment reference; do not copy restricted papers without rights.'),
('india-ncf-cbse','CBSE Skill Education 2026-27','vocational_curriculum','CBSE','https://cbseacademic.nic.in/skill-education.html','2026-27','Classes VI-XII','Current skill subject/module layer.'),
('india-ncf-cbse','National Testing Agency','entrance_examinations','NTA','https://nta.ac.in/','2026','JEE Main, NEET-UG, CUET-UG and other national examinations','Current official entrance-exam source.'),
('india-ncf-cbse','National Institute of Open Schooling','open_schooling','NIOS','https://www.nios.ac.in/','2026','Secondary and Senior Secondary','Separate open-school pathway and assessment provenance.')
) v(curriculum_id,source_title,source_type,issuing_body,official_url,source_version,document_scope,notes)
where not exists (
  select 1 from lms_curriculum_sources x
  where x.curriculum_id=v.curriculum_id and x.source_title=v.source_title
);

-- Framework components are versioned separately from official syllabus text.
insert into lms_curriculum_framework_components
(curriculum_id,component_code,component_type,title,stage,statutory_status,
 official_source,official_url,source_version,description,metadata,active)
select 'india-ncf-cbse',v.code,v.type,v.title,v.stage,'framework-aligned',
       'Ministry of Education / NCERT / relevant national authority',v.url,v.version,
       v.description,jsonb_build_object('versioned',true),true
from (values
('IND-PLAN-01','planning','Annual academic plan','All stages','https://www.education.gov.in/sites/upload_files/mhrd/files/ncf_2023.pdf','NCF-SE 2023','Annual sequencing and implementation planning.'),
('IND-PLAN-02','planning','Term-by-term scheme of work','All stages','https://www.education.gov.in/sites/upload_files/mhrd/files/ncf_2023.pdf','NCF-SE 2023','Term, unit and weekly sequencing after reconciliation.'),
('IND-TEACH-01','teacher_support','Teacher guide and lesson support','All stages','https://ncert.nic.in/','2026','Teacher-facing pedagogy, differentiation, inclusion and assessment support.'),
('IND-ASSESS-01','assessment','Diagnostic and baseline assessment','All stages','https://ncert.nic.in/','2026','Entry diagnostics and learning-gap identification.'),
('IND-ASSESS-02','assessment','Formative and ongoing assessment','All stages','https://www.education.gov.in/sites/upload_files/mhrd/files/ncf_2023.pdf','NCF-SE 2023','Embedded checks for understanding and feedback.'),
('IND-ASSESS-03','assessment','Periodic and unit assessment','All stages','https://ncert.nic.in/','2026','Unit/periodic assessment.'),
('IND-EXAM-01','examination','Mid-term / half-yearly assessment','Preparatory, Middle, Secondary','https://cbseacademic.nic.in/','2026-27','School-level mid-year assessment layer.'),
('IND-EXAM-02','examination','Pre-board / mock examination','Secondary','https://cbseacademic.nic.in/','2026-27','Pre-board and mock preparation.'),
('IND-EXAM-03','examination','Final / annual / board examination preparation','All stages','https://cbseacademic.nic.in/','2026-27','Final examination preparation, revision and remediation.'),
('IND-EXAM-04','examination','Question bank and item bank','All stages','https://cbseacademic.nic.in/','2026-27','Original Phenom-authored assessment items aligned to verified outcomes.'),
('IND-UNIV-01','progression','University and tertiary preparation','Secondary','https://nta.ac.in/','2026','Academic transition, study skills and entrance preparation.'),
('IND-UNIV-02','progression','JEE Main / Advanced pathway preparation','Secondary','https://nta.ac.in/','2026','Engineering entrance preparation.'),
('IND-UNIV-03','progression','NEET-UG pathway preparation','Secondary','https://nta.ac.in/','2026','Medical entrance preparation.'),
('IND-UNIV-04','progression','CUET-UG pathway preparation','Secondary','https://nta.ac.in/','2026','University entrance preparation.'),
('IND-OPEN-01','progression','NIOS secondary/senior secondary pathway','Secondary','https://www.nios.ac.in/','2026','Open-school pathway with separate provenance.'),
('IND-QA-01','quality','Curriculum reconciliation and IQA','All stages','https://www.education.gov.in/sites/upload_files/mhrd/files/ncf_2023.pdf','NCF-SE 2023','No node is complete until source reconciliation, resources and IQA pass.')
) v(code,type,title,stage,url,version,description)
where not exists (select 1 from lms_curriculum_framework_components x where x.curriculum_id='india-ncf-cbse' and x.component_code=v.code);
