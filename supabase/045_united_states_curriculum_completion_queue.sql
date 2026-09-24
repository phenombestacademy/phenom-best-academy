-- United States / American curriculum completion queue
-- Idempotent reconciliation and resource-generation queue for the canonical
-- US curriculum records already held in Supabase.
begin;

update lms_curriculum_content_jobs j
set curriculum_id = l.curriculum_id
from lms_curriculum_topics t
join lms_curriculum_levels l on l.id=t.level_id
where j.topic_id=t.id
  and l.curriculum_id in ('usa-american','us-common-core')
  and j.curriculum_id <> l.curriculum_id;

insert into lms_curriculum_content_jobs
  (curriculum_id, topic_id, job_type, status, priority, metadata)
select l.curriculum_id, t.id, 'topic_reconciliation', 'queued', 100,
       jsonb_build_object('source','US curriculum completion audit','provenance','Phenom')
from lms_curriculum_topics t
join lms_curriculum_levels l on l.id=t.level_id
where l.curriculum_id in ('usa-american','us-common-core')
  and not exists (
    select 1 from lms_curriculum_content_jobs j
    where j.topic_id=t.id and j.job_type='topic_reconciliation'
  );

insert into lms_curriculum_content_jobs
  (curriculum_id, topic_id, job_type, status, priority, metadata)
select l.curriculum_id, t.id, 'full_resource_pack', 'queued', 90,
       jsonb_build_object('source','US curriculum completion audit','provenance','Phenom')
from lms_curriculum_topics t
join lms_curriculum_levels l on l.id=t.level_id
where l.curriculum_id in ('usa-american','us-common-core')
  and not exists (
    select 1 from lms_curriculum_content_jobs j
    where j.topic_id=t.id and j.job_type='full_resource_pack'
  );

commit;