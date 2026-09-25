# Switzerland Curriculum Implementation

## Status
The Switzerland curriculum layer is implemented in Supabase with official EDK provenance, the three linguistic-region curriculum frameworks, upper-secondary pathways, 322 curriculum anchors, official external-link stock and detailed production queued.

## Verified database checkpoint
- Curriculum: `switzerland`
- Education/pathway levels: 14
- Subject-stage mappings: 23
- Curriculum anchors: 322
- Official source records: 6
- Framework components: 10
- Official external resources in stock: 6
- Acquisition records: 186
- Queued production jobs: 35

## Authoritative architecture
Switzerland is not represented as one uniform national syllabus. EDK states that cantons are responsible for compulsory education and that curricula are organised by linguistic region: Lehrplan 21 for German-speaking and multilingual cantons, Plan d’études romand (PER) for French-speaking Switzerland, and Piano di studio for Ticino. Cantons also determine teaching materials and lesson allocations.

The national education goals/HarmoS framework and the 2024 Framework Curriculum for Gymnasial Maturity Schools are retained as separate national-level references, with cantonal implementation preserved.

## Stock layer
The six verified official source records are catalogued as external-link stock. This means the authoritative source is available in the LMS provenance/resource layer; it does **not** claim that every source has been downloaded into local file storage.

## Production subtree
The remaining detailed production is explicitly queued and must produce actual assets before completion is recorded:

1. authoritative topic/subtopic extraction and reconciliation
2. scheme of work
3. lesson plans/materials
4. study notes
5. practice sets
6. assessments
7. revision guides
8. teacher guides
9. worked examples
10. student worksheets/downloads
11. audio scripts
12. video scripts
13. interactive activities
14. simulations where pedagogically appropriate
15. virtual laboratories where pedagogically appropriate
16. differentiated/extension resources
17. original examination questions
18. answers and marking guidance
19. provenance/requirement mapping
20. IQA and final completion audit

## Integrity rule
Framework anchors are not substitutes for authoritative detailed topic lists. No Swiss topic, subtopic, scheme, lesson, examination resource or other production asset is to be marked complete merely because it has been queued. Completion requires the actual asset plus source/provenance and IQA checks.

## Official sources
- EDK curriculum index: https://edk.ch/en/education-system-ch/compulsory/curricula
- Lehrplan 21: https://www.lehrplan21.ch/
- Plan d’études romand: https://www.plandetudes.ch/
- Piano di studio Ticino: https://www4.ti.ch/decs/ds/edu/piano-di-studio
- EDK baccalaureate curriculum: https://edk.ch/en/education-system-ch/post-compulsory/upper-secondary/baccalaureate/curriculum-and-subjects
- SERI vocational education: https://www.sbfi.admin.ch/sbfi/en/home/education/v-p.html
