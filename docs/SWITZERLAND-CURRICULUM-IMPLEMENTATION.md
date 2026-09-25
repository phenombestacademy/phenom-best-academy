# Switzerland Curriculum Implementation

## Status
Switzerland is implemented as complementary Swiss curriculum layers without deleting or replacing previously completed curriculum records.

## Verified database checkpoint
- `switzerland`: 322 curriculum anchors
- `switzerland-education`: 780 curriculum anchors
- Total Swiss topic anchors: 1,102
- Scheme-of-work resource packs: 1,102 published
- Scheme-of-work assets: 1,102 stored
- Existing production queues retained: 10,955 jobs
- No existing curriculum records deleted

## Authoritative architecture
EDK identifies three linguistic-region compulsory-school curricula: Lehrplan 21 in German-speaking Switzerland, Plan d'études romand (PER) in French-speaking Switzerland, and Piano di studio in Ticino. Upper-secondary academic and specialised schools use cantonal curricula based on EDK framework curricula, while SBFI issues or approves vocational framework curricula.

## Stock and production
The 1,102 topic anchors now have database-backed scheme-of-work resource packs and stored scheme assets. The detailed production queue remains intact for lessons/materials, study notes, practice, assessment, answers/mark schemes, revision, teacher guides, worked examples, worksheets/downloads, audio/video, interactive activities, simulations/virtual laboratories where appropriate, differentiation/extension, examination resources, provenance and IQA.

## Integrity
Previously completed curricula are not deleted. Existing queued jobs are not deleted or falsely converted into completed assets. Queue status remains distinct from physical stored/published assets. Teachers cannot edit the stored scheme assets; super-admin remains the editorial authority.

## Official source links
- EDK curriculum index: https://edk.ch/en/education-system-ch/compulsory/curricula
- Lehrplan 21: https://www.lehrplan21.ch/
- Plan d'études romand: https://www.plandetudes.ch/
- Piano di studio Ticino: https://www4.ti.ch/decs/ds/edu/piano-di-studio
