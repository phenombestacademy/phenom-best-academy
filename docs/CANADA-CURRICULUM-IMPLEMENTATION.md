# Canada Curriculum Implementation — Pan-Canadian + 13 Jurisdictions

Status: **FOUNDATION IMPLEMENTED / DETAILED CONTENT INGESTION QUEUED**

Canada is not represented as a single national K–12 syllabus. Education is the responsibility of 10 provinces and 3 territories, with CMEC providing pan-Canadian coordination and resources. Jurisdiction-specific curricula, assessment, graduation and pathway requirements remain distinguishable.

## Implemented now

- Canada curriculum catalogue already active.
- 98 level/pathway records in the LMS layer, covering pan-Canadian and jurisdictional early learning, kindergarten, elementary, middle/junior, secondary, postsecondary and adult/VET pathways.
- 105 subject-stage mappings using the global subject catalogue.
- 14 verified official source records: CMEC plus Alberta, British Columbia, Manitoba, New Brunswick, Newfoundland and Labrador, Nova Scotia, Nunavut, Northwest Territories, Ontario, Prince Edward Island, Quebec, Saskatchewan and Yukon.
- 30 framework components covering governance, curriculum architecture, assessment, graduation, VET, postsecondary pathways, Indigenous education, official/minority languages and pan-Canadian competencies.
- 42 acquisition records created for official curriculum/framework, syllabus/programme and assessment documentation.
- 14 source-level ingestion runs queued for detailed extraction.

## Queued next

The queued ingestion must extract, reconcile and verify the jurisdiction-specific:

1. level/year/grade structures;
2. subjects, strands and courses;
3. learning outcomes, expectations and competencies;
4. schemes/programmes of study;
5. assessment, grading and examination requirements;
6. graduation credentials and prerequisites;
7. Indigenous, French/minority-language and jurisdiction-specific requirements;
8. teacher/support resources and official downloadable materials;
9. topic/subtopic hierarchy and provenance.

After verified topics exist, the full Phenom resource subtree is to be produced without treating queued work as completed: lesson, study note, worked example, practice, assessment, revision, teacher guide, worksheet/download, audio/video script, interactive activity, simulation/virtual lab where pedagogically appropriate, differentiation/extension, original examination questions with answers/marking, provenance and IQA.

## Integrity rule

Existing material is preserved. Nothing is deleted merely because another version or jurisdictional source is added. No resource is labelled generated/in stock until it actually exists and passes the relevant IQA gate.

## Current database checkpoint

- Topics: 0
- Resource packs: 0
- Detailed content jobs: not yet created because they require verified topic IDs.
- Queued source ingestion: 14

This is intentional: the foundation is implemented now, while detailed extraction and downstream production continue through the queue.

## Official baseline

CMEC states that Canada has no federal department of education or integrated national education system; education is the responsibility of the 13 provinces and territories. CMEC's current Student Transfer Guide also provides jurisdiction-by-jurisdiction secondary curriculum and pathway information.

Official source: https://www.cmec.ca/680/Overview.html
