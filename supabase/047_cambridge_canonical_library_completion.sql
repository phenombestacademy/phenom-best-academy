begin;
insert into lms_curriculum_library_items
(curriculum_id,topic_id,title,item_type,source_class,access_class,licence_status,storage_status,public_status,qc_status,metadata)
select 'cambridge',r.topic_id,r.title,'resource_'||r.resource_type,'phenom_original','super_admin_edit_teacher_view','internal','database_canonical','internal','pending',
jsonb_build_object('resource_pack_id',r.id,'canonical',true,'provenance','Phenom')
from lms_curriculum_resource_packs r join lms_curriculum_topics t on t.id=r.topic_id
where t.curriculum_id='cambridge'
and not exists(select 1 from lms_curriculum_library_items li where li.curriculum_id='cambridge' and li.topic_id=r.topic_id and li.title=r.title);

insert into lms_curriculum_library_items
(curriculum_id,topic_id,title,item_type,source_class,access_class,licence_status,storage_status,public_status,qc_status,metadata)
select 'cambridge',t.id,t.topic_title,'qualification_assessment_hub','phenom_original','super_admin_edit_teacher_view','internal','database_canonical','internal','pending',
'{"canonical":true,"pathway_record":true,"provenance":"Phenom"}'::jsonb
from lms_curriculum_topics t
where t.curriculum_id='cambridge' and t.topic_code in ('CP-CHECKPOINT','CP-PROGRESSION','CLS-CHECKPOINT','CLS-PROGRESSION','IGCSE-EXAM','OLEVEL-EXAM','ICE-DIPLOMA','AS-EXAM','ALEVEL-EXAM','AICE-DIPLOMA','IPQ')
and not exists(select 1 from lms_curriculum_library_items li where li.topic_id=t.id and li.item_type='qualification_assessment_hub');
commit;