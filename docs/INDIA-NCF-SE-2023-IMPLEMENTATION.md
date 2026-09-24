# India — National Curriculum Framework for School Education (NCF-SE 2023)

## Scope
Phenom LMS represents India's National Curriculum Framework for School Education 2023 as a national framework layer, not as a claim that one syllabus applies identically across every state or board.

The architecture uses the NCF-SE 2023 four-stage structure:
- Foundational Stage — 3 years preschool/early childhood + Grades 1–2
- Preparatory Stage — Grades 3–5
- Middle Stage — Grades 6–8
- Secondary Stage — Grades 9–12

The implementation keeps national framework content separate from board/state implementations. CBSE, NIOS, CISCE and state/UT boards must remain versioned alignment/pathway layers rather than being silently treated as the national syllabus.

## Current official source layer
The live source registry now includes the Ministry of Education NCF-SE 2023, NCF Foundational Stage 2022, NCERT Class I–XII textbook/publication portal, CBSE Academic 2026–27 curriculum, CBSE 2026–27 sample question papers/marking schemes, CBSE Skill Education 2026–27, National Testing Agency (JEE Main/NEET-UG/CUET-UG), and NIOS secondary/senior-secondary pathway sources.

Official-source URLs are retained as provenance links. Restricted official exam/textbook content is not copied into Phenom unless the rights permit it.

## Curriculum architecture
The live curriculum baseline now contains:
- 4 NCF-SE stages
- 160 curriculum/domain reconciliation nodes
- 8 core national curricular subject areas represented across all 4 stages
- 54 framework components
- 160 requirement mappings
- 13 verified source records
- 5 external official resource records retained from the previous implementation

The additional 128 domain nodes are deliberately labelled reconciliation nodes. They are not fabricated official syllabus chapters. They provide a complete processing grid for official source reconciliation before publication.

## Planning, teaching and assessment
The framework layer now explicitly covers:
- annual academic planning
- term-by-term scheme of work
- teacher guides and lesson support
- diagnostic/baseline assessment
- formative and ongoing assessment
- periodic/unit assessment
- mid-term/half-yearly assessment
- pre-board/mock assessment
- final/annual/board examination preparation
- question banks and item banks
- revision and remediation
- university/tertiary preparation
- JEE Main/Advanced, NEET-UG and CUET-UG pathways
- NIOS secondary/senior-secondary pathway
- career and transition support
- curriculum reconciliation and IQA

CBSE's current 2026–27 academic material explicitly provides current curriculum/scheme-of-study material, sample question papers and marking schemes, and skill-education resources. NTA's current 2026 portal provides current JEE Main, NEET-UG and CUET-UG examination information. NIOS maintains separate secondary/senior-secondary pathways and examination resources.

## Content pipeline
For every curriculum node:
Official source reconciliation → topic/learning-outcome alignment → 14-resource pack → planning/teacher/assessment expansion → canonical Phenom Library → IQA → approval.

The live queue currently contains:
- 160 topic-reconciliation jobs
- 160 full-resource-pack jobs
- 160 resource-expansion jobs
- 480 queued content jobs in total
- 160 queued IQA reviews
- 2,240 draft resource-pack records (14 per node)
- 196 canonical Library records for the India curriculum layer

Queued/draft records are not treated as completed human-readable curriculum content.

## Quality and rights
A node is not considered complete merely because a database record exists. It must have official provenance, reconciled curriculum content, human-readable resources, assessment/examination support, Library placement and a passed IQA review.

Official textbooks, question papers and other restricted material remain provenance-controlled. Phenom-generated resources are original support materials and must not be presented as official NCERT/CBSE/NIOS material.

## Current completion state
The India framework and source architecture have been substantially expanded and committed to the database. The content-generation and IQA queue is now populated for the expanded grid.

**India is not yet marked fully complete.** The remaining completion work is the actual official topic-by-topic reconciliation, human-readable resource generation and IQA approval. This is intentionally left queued rather than falsely labelled complete.
