# Switzerland Curriculum Implementation

## Status

The Switzerland curriculum layer is staged in Supabase for authoritative ingestion and full resource production. It must not be represented as one uniform syllabus.

## Authoritative architecture

- EDK national education goals and HarmoS framework
- Lehrplan 21 — German-speaking and multilingual cantons
- Plan d'études romand (PER) — French-speaking Switzerland
- Piano di studio — Canton Ticino / Italian-speaking Switzerland
- Cantonal curriculum and school-structure sources
- SERI/SBFI vocational and upper-secondary frameworks where applicable

## Existing database foundation

- Curriculum ID: `switzerland`
- Country: CH
- Education/pathway levels: 14
- Subject mappings: 23
- Authoritative sources: 6
- Framework components: 10
- Acquisition records: 168
- Detailed topics: 0 at this checkpoint; authoritative topic ingestion is queued
- Resource packs: 0 at this checkpoint; generation is queued
- Generated assets: 0 at this checkpoint; generation is queued

## Required production subtree

For each verified curriculum topic/subtopic, the production pipeline covers:

1. scheme of work
2. lesson
3. study note
4. practice set
5. assessment
6. revision guide
7. teacher guide
8. worked example
9. student worksheet/download
10. audio script
11. video script
12. interactive activity
13. simulation where pedagogically appropriate
14. virtual laboratory where pedagogically appropriate
15. differentiated/extension resources
16. original examination questions
17. answers and marking guidance
18. provenance and requirement mapping
19. IQA/quality review
20. final completion audit

## Queue

All missing production layers remain queued in `lms_curriculum_content_jobs`, including authoritative topic ingestion, regional curriculum ingestion, topic/subtopic extraction, acquisition expansion/reconciliation, resource-pack generation, lessons, schemes of work, study notes, practice, assessments, revision, teacher guides, worked examples, worksheets, audio/video, interactive activities, simulations, virtual labs, original examination questions, answer/mark schemes, provenance mapping and final IQA.

## Integrity rule

No Swiss topic, subtopic, resource or examination claim is to be marked completed unless it is supported by the appropriate authoritative source and recorded in the curriculum library. Queued work is explicitly distinct from completed/stored material.
