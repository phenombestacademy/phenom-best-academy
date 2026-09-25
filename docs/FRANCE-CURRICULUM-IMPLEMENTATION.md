# France — National Curriculum Implementation

Status: implemented foundation and full production handoff in Supabase; production remains source-grounded and queued where physical content is not yet stored.

## Scope
- Current 2026–2027 national programme framework.
- École maternelle, école élémentaire, collège, lycée général/technologique and lycée professionnel.
- Cycles 1–4, socle commun, national assessment/examination layer, LVE/LVR, digital/EMI and interdisciplinary/STEM layers.
- Programme changes are versioned by effective school year.

## Live Supabase checkpoint
- Curriculum: `france-national`
- Levels/pathways: 23 (4 existing stage umbrellas + 19 class/pathway levels)
- Curriculum anchors/topics: 36
- Official source records: 11
- Framework components: 10
- Acquisition records: 19
- Official external resources in stock: 9
- Curriculum asset records: 796
- Physically stored/published scheme-of-work files: 4
- Remaining scheme-of-work asset records queued: 36
- Queued content-production jobs: 864
- Completed/generated/stored/published curriculum assets: 4

## Resource pipeline
For each existing curriculum anchor, the pipeline covers:
scheme of work, lesson plan, study note, teaching material, educational resource, practice set, assessment, revision guide, teacher guide, worked examples, audio/video scripts, download pack, interactive activity, simulation/virtual-lab where pedagogically appropriate, differentiated resource, extension/challenge, answer/feedback, IQA review, original exam questions and mark schemes.

## Source integrity
Official programme and framework links are catalogued from the French Ministry of National Education / éduscol. Copyrighted official documents are referenced as official external resources rather than represented as locally stored copies unless actually stored.

## Completeness rule
The 36 initial topic records have been reconciled to source-grounded curriculum anchors. The current database deliberately does not mark queued resources as physically generated. Detailed official topic/subtopic extraction remains tied to the authoritative programme corpus; derived learning resources remain queued behind that source layer rather than being fabricated.

## 2026–2027 versioning
The implementation records the current 2026–2027 rollout, including phased changes to French/mathematics in cycle 4 and current LVE/LVR implementation.

Official references:
- https://www.education.gouv.fr/programmes-scolaires-41483
- https://eduscol.education.gouv.fr/4332/niveaux
- https://eduscol.education.gouv.fr/4341/enseigner-au-cycle-1
- https://eduscol.education.gouv.fr/4347/enseigner-au-cycle-2
- https://eduscol.education.gouv.fr/4356/enseigner-au-cycle-3
- https://eduscol.education.gouv.fr/4362/enseigner-au-cycle-4
- https://eduscol.education.gouv.fr/4494/langues-vivantes-etrangeres-et-regionales
- https://eduscol.education.gouv.fr/7087/rentree-2026-2027

Security advisor findings observed during this checkpoint are pre-existing platform-level findings; no new RLS/security changes were introduced by this curriculum data population.
