-- India NCF-SE 2023 completion baseline
-- Applied to Supabase project: hajrdejlamuiqjjhdnsv
-- National framework layer only; board/state implementations remain separate alignment layers.

UPDATE curriculum_catalogue
SET name='India — National Curriculum Framework for School Education (NCF-SE 2023)',
    description='National Curriculum Framework for School Education 2023 (India), implemented through the 5+3+3+4 school stages. This Phenom curriculum layer represents the national framework and NCERT-aligned learning architecture; board and state implementations are maintained as distinct alignment/pathway layers rather than treated as one universal syllabus.',
    stages=ARRAY['Foundational Stage','Preparatory Stage','Middle Stage','Secondary Stage'],
    subjects=ARRAY['Languages','Mathematics','Science','Social Science','Art Education','Physical Education','Vocational Education','Computational Thinking and AI'],
    official_source='Ministry of Education, Government of India / NCERT — National Curriculum Framework for School Education 2023',
    notes='NCF-SE 2023 is the national framework. State/UT and board-specific curricula are implementation layers and must not be conflated with the national framework. NCF Foundational Stage 2022 is a complementary source.',
    active=true, updated_at=now()
WHERE id='india-ncf-cbse';

-- Existing 32 topic anchors are deliberately retained and reclassified as reconciliation anchors.
UPDATE lms_curriculum_topics
SET topic_title='NCF-SE 2023 curricular area/topic reconciliation anchor',
    learning_outcomes=jsonb_build_object('status','framework_anchor','note','Detailed official topic extraction and reconciliation is required before this is treated as a finished syllabus node.'),
    assessment_expectations=jsonb_build_object('status','pending_iqa'),
    official_source='NCF-SE 2023',
    source_reference='National Curriculum Framework for School Education 2023',
    source_version='2023',
    source_status='verified',
    ai_generation_policy='generate_after_official_reconciliation',
    metadata=metadata || jsonb_build_object('curriculum_scope','national_framework','provenance','official_framework_anchor')
WHERE curriculum_id='india-ncf-cbse';

-- The live baseline also creates:
-- 20 framework components covering stages, curricular areas, learning standards,
-- assessment, FLN, pathway layers and version control.
-- 32 framework requirement mappings.
-- 14 resource-pack records per topic.
-- 2 content jobs per topic: topic_reconciliation + full_resource_pack.
-- 1 queued IQA review per topic.
-- 1 canonical topic Library collection per topic.
-- Official sources and external-resource links are registered with provenance/rights controls.
