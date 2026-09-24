-- Nigeria examination pathway terminology correction
-- Applied to Supabase on 2026-09-24.
-- Corrects the private-candidate senior examination labels:
-- WAEC GCE and NECO GCE / SSCE External.
-- No current NECO JCE pathway is represented.

UPDATE lms_curriculum_topics
SET topic_code = 'NG-GCE-WAEC',
    topic_title = 'WAEC GCE — private candidates'
WHERE topic_code = 'NG-JCE-WAEC-LEGACY';

UPDATE lms_curriculum_topics
SET topic_code = 'NG-GCE-NECO',
    topic_title = 'NECO GCE / Senior School Certificate Examination (External) — private candidates'
WHERE topic_code = 'NG-JCE-NECO-LEGACY';
