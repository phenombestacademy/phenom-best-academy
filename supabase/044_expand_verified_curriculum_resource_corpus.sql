-- 044: expand the first verified curriculum corpus with additional Academy-created resources
-- and establish a controlled production queue for further expansion.

insert into lms_curriculum_resource_packs
(topic_id, pack_code, resource_type, title, content, locale, support_locale, sequence_no, status, curriculum_alignment, brand_metadata)
select t.id,'PACK-' || replace(t.id::text,'-','') || '-worked-example','worked_example','Worked example guide: ' || t.topic_title,
'# Worked example guide: ' || t.topic_title || E'\n\nThis is an Academy-created learning resource aligned to the verified curriculum record. It is not presented as material issued by the curriculum authority.' || E'\n\nLearning outcome\n' || coalesce(t.learning_outcomes::text,'See the verified curriculum record.') || E'\n\nApplication sequence\n1. Identify what the task is asking.\n2. Select the relevant concept, rule or process from the lesson.\n3. Work through the task one step at a time.\n4. Check the result against the stated learning outcome.\n5. Explain the reasoning in your own words.',
'en-NG','en-NG',6,'published',jsonb_build_object('curriculum_id',t.curriculum_id,'topic',t.topic_title,'source_status',t.source_status,'official_source',t.official_source,'source_reference',t.source_reference,'source_version',t.source_version),jsonb_build_object('brand','Phenom Best Academy','engine','Phenom Best Core')
from lms_curriculum_topics t where t.source_status='verified' on conflict do nothing;

insert into lms_curriculum_resource_packs
(topic_id, pack_code, resource_type, title, content, locale, support_locale, sequence_no, status, curriculum_alignment, brand_metadata)
select t.id,'PACK-' || replace(t.id::text,'-','') || '-teacher-guide','teacher_guide','Teacher guide: ' || t.topic_title,
'# Teacher guide: ' || t.topic_title || E'\n\nAcademy-created teaching support aligned to the verified curriculum record.' || E'\n\nLearning outcome\n' || coalesce(t.learning_outcomes::text,'See the verified curriculum record.') || E'\n\nSuggested delivery\n• Activate prior knowledge.\n• Introduce the key concept using clear examples.\n• Model the thinking or process.\n• Give guided practice.\n• Check understanding before independent work.\n• Use the assessment expectation to review progress.\n\nTeacher note\nAdapt examples, pace and support to learner age, context and need without changing the verified curriculum alignment.',
'en-NG','en-NG',7,'published',jsonb_build_object('curriculum_id',t.curriculum_id,'topic',t.topic_title,'source_status',t.source_status,'official_source',t.official_source,'source_reference',t.source_reference,'source_version',t.source_version),jsonb_build_object('brand','Phenom Best Academy','engine','Phenom Best Core')
from lms_curriculum_topics t where t.source_status='verified' on conflict do nothing;

insert into lms_curriculum_resource_packs
(topic_id, pack_code, resource_type, title, content, locale, support_locale, sequence_no, status, curriculum_alignment, brand_metadata)
select t.id,'PACK-' || replace(t.id::text,'-','') || '-audio-script','audio_script','Audio lesson script: ' || t.topic_title,
'# Audio lesson script: ' || t.topic_title || E'\n\nAcademy-created script aligned to the verified curriculum record.' || E'\n\nOpening\nWelcome to this Phenom Best Academy learning session.' || E'\n\nLearning focus\nToday we are learning about ' || t.topic_title || E'.\n\nKey outcome\n' || coalesce(t.learning_outcomes::text,'The learner should understand and apply the verified learning focus.') || E'\n\nGuided reflection\nPause and explain the main idea in your own words. Give one relevant example from your learning context.' || E'\n\nClose\nReview the key idea, complete the practice activity and use the assessment to check your progress.',
'en-NG','en-NG',8,'published',jsonb_build_object('curriculum_id',t.curriculum_id,'topic',t.topic_title,'source_status',t.source_status,'official_source',t.official_source,'source_reference',t.source_reference,'source_version',t.source_version),jsonb_build_object('brand','Phenom Best Academy','engine','Phenom Best Core')
from lms_curriculum_topics t where t.source_status='verified' on conflict do nothing;

insert into lms_curriculum_resource_packs
(topic_id, pack_code, resource_type, title, content, locale, support_locale, sequence_no, status, curriculum_alignment, brand_metadata)
select t.id,'PACK-' || replace(t.id::text,'-','') || '-video-script','video_script','Video lesson script: ' || t.topic_title,
'# Video lesson script: ' || t.topic_title || E'\n\nAcademy-created instructional script aligned to the verified curriculum record.' || E'\n\nScene 1 — Learning goal\nDisplay the topic title and introduce the verified learning outcome.' || E'\n\nScene 2 — Explanation\nPresent the key concept in clear, age-appropriate language and connect it to a familiar context.' || E'\n\nScene 3 — Guided application\nModel a relevant task and make the reasoning visible step by step.' || E'\n\nScene 4 — Learner task\nAsk the learner to apply the idea independently.' || E'\n\nScene 5 — Checkpoint\nReturn to the learning outcome and ask the learner to explain what has been learned.',
'en-NG','en-NG',9,'published',jsonb_build_object('curriculum_id',t.curriculum_id,'topic',t.topic_title,'source_status',t.source_status,'official_source',t.official_source,'source_reference',t.source_reference,'source_version',t.source_version),jsonb_build_object('brand','Phenom Best Academy','engine','Phenom Best Core')
from lms_curriculum_topics t where t.source_status='verified' on conflict do nothing;

insert into lms_curriculum_resource_packs
(topic_id, pack_code, resource_type, title, content, locale, support_locale, sequence_no, status, curriculum_alignment, brand_metadata)
select t.id,'PACK-' || replace(t.id::text,'-','') || '-downloadable','downloadable','Downloadable learner sheet: ' || t.topic_title,
'# Learner study sheet: ' || t.topic_title || E'\n\nAcademy-created resource aligned to the verified curriculum record.' || E'\n\nLearning outcome\n' || coalesce(t.learning_outcomes::text,'See the verified curriculum record.') || E'\n\nMy key idea\n__________________________________________________\n\nImportant vocabulary / terms\n__________________________________________________\n\nWhat I can explain\n__________________________________________________\n\nWhat I can apply\n__________________________________________________\n\nMy question\n__________________________________________________\n\nSelf-check\n☐ I can explain the main idea.\n☐ I can apply it to a relevant task.\n☐ I can identify what I still need to practise.',
'en-NG','en-NG',10,'published',jsonb_build_object('curriculum_id',t.curriculum_id,'topic',t.topic_title,'source_status',t.source_status,'official_source',t.official_source,'source_reference',t.source_reference,'source_version',t.source_version),jsonb_build_object('brand','Phenom Best Academy','engine','Phenom Best Core')
from lms_curriculum_topics t where t.source_status='verified' on conflict do nothing;

insert into lms_curriculum_content_jobs
(curriculum_id, topic_id, job_type, status, priority, metadata)
select t.curriculum_id,t.id,'resource_expansion','queued',case when t.curriculum_id='nigeria-nerdc' then 1 else 2 end,
jsonb_build_object('scope','expand_verified_corpus','source_status',t.source_status,'resource_types',jsonb_build_array('worked_example','teacher_guide','audio_script','video_script','downloadable'))
from lms_curriculum_topics t where t.source_status='verified' limit 40 on conflict do nothing;