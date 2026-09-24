# South Africa Curriculum Implementation

## Scope
Phenom Best LMS now has a South Africa curriculum implementation baseline for the National Curriculum Statement (NCS) Grades R–12 and CAPS, with early-childhood context, Grade R, Foundation Phase, Intermediate Phase, Senior Phase, FET, NSC/Matric and post-school/university pathway preparation.

## Canonical source model
- National source authority: South African Department of Basic Education (DBE).
- Quality assurance authority: Umalusi for NSC assessment quality assurance.
- Official CAPS, assessment-policy and NSC examination resources are retained as provenance/link records.
- Restricted examination papers are not copied into Phenom merely because they are publicly linked; the Library stores official metadata/links and Phenom-original preparation materials separately.
- Province-specific variants are represented as versioned/provenance metadata rather than duplicated national content.

## Implemented database layers
- Curriculum catalogue: `south-africa`.
- 16 pathway levels: Birth-to-Four/ECD context, Grade R, Grades 1–12, NSC/Matric and post-school/university pathway.
- 59 South Africa subject records mapped through the global subject catalogue.
- 650 curriculum/subject/level reconciliation anchors.
- 9,100 resource-pack records covering lesson, study note, worked example, practice, assessment, answers, marking guide, revision, teacher guide, activities/assignments, audio script, video script, downloadable resource and workbook.
- 650 canonical Library collections with Super Admin edit / teacher view access semantics.
- 1,300 queued content jobs: topic reconciliation and full resource-pack generation.
- 8 official source/provenance records and 4 NSC/examination external-resource records.

## Resource completion rule
The database baseline is **not** equivalent to declaring every South African curriculum topic and every resource fully authored. The reconciliation anchors and queued jobs are intentionally visible so the content-generation/QA pipeline can extract the detailed official topic/subtopic structure from each applicable CAPS document and then generate Phenom-original resources. A resource must not be marked completed/published until source reconciliation and quality review pass.

## Required resource layers
For each reconciled topic, the production target is:
- annual/programme teaching plan and sequence
- lesson and lesson sequence
- teacher guide
- learner notes/material
- examples and worked examples where applicable
- activities and practical assignments
- SBA/formal assessment
- answers and marking guide/rubric
- revision
- NSC examination preparation where applicable
- audio/video scripts where appropriate
- downloadable/workbook resources
- progression, prerequisites, differentiation and inclusion metadata
- provenance, licence, version and QA status

## NSC and examination handling
The NSC layer includes official examination-guideline and past-paper archive links/metadata. Phenom-generated examination preparation is original content. Official examination documents remain distinguished by source authority and licensing.

## Province/version/licensing
National CAPS is the canonical baseline. Provincial department implementations can be attached as versioned overrides or source-specific records without duplicating the national curriculum. Current and historical versions must remain distinguishable.

## Singapore
Singapore's implementation follows the same universal completion standard. The database baseline currently retains its level/topic/resource/library structure and queued resource-production model. Singapore official sources are distinguished from Phenom-authored resources, and historical qualifications plus the 2027 SEC transition remain versioned.

## Integrity rule
Do not delete authoritative historical versions. Do not create duplicate canonical resources when an existing record can be reused. Teachers may consume/select canonical resources; Super Admin remains the canonical editor.
