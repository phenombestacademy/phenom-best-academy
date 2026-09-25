# South Africa Curriculum Implementation

## Scope
Phenom Best LMS now has a South Africa curriculum implementation baseline for the National Curriculum Statement (NCS) Grades R–12 and CAPS, covering the Foundation, Intermediate, Senior and FET phases, Grade 12 NSC/Matric and associated assessment/resource pathways.

## Canonical source model
- National source authority: South African Department of Basic Education (DBE).
- Quality-assurance authority: Umalusi for NSC assessment quality assurance.
- Official CAPS, assessment-policy, LTSM and NSC examination resources are retained as provenance/link records.
- Official examination papers are not copied into Phenom merely because they are publicly linked; official metadata/links remain distinguished from Phenom-original preparation materials.
- Province-specific implementations remain versioned/provenance layers rather than duplicated national curriculum records.

## Current database baseline
Verified directly in Supabase after the current implementation pass:
- Curriculum catalogue: `south-africa`.
- 16 pathway/level records.
- 59 subject mappings.
- 650 curriculum topic/reconciliation records.
- 14 framework components.
- 6 acquisition records.
- 11 official external-resource records, including immediately accessible DBE/official links.
- 9,100 resource-pack records.
- 0 generated/stored asset files currently recorded for South Africa.
- 3,250 queued content-production jobs.

## Queued production coverage
The current 3,250-job queue covers:
- topic reconciliation
- full resource-pack production
- resource expansion
- assessment generation
- original examination-question generation

Queued means **not yet generated**. It must not be displayed as completed content.

## Required resource layers
For each reconciled topic, the production target remains:
- annual/programme teaching plan and sequence
- lesson and lesson sequence
- teacher guide
- learner study notes/materials
- examples and worked examples where applicable
- activities, practicals and assignments
- formative/SBA/formal assessment
- answers and marking guides/rubrics
- revision resources
- NSC examination preparation where applicable
- audio/video scripts where appropriate
- downloadable/workbook resources
- prerequisites and progression
- differentiation and inclusion
- extension/challenge
- provenance, licence, source version and QA status
- simulations/interactive learning resources where pedagogically appropriate

## Immediate-stock rule
Official DBE material that can be safely exposed as an authoritative external library resource is registered immediately. Current external resources include:
- NCS Grades R–12 / CAPS
- CAPS Foundation Phase
- CAPS Intermediate Phase
- CAPS Senior Phase
- CAPS FET Phase
- National Protocol / programme and promotion policy resources
- DBE LTSM and digital curriculum resources
- Grade 12 NSC examination guidelines
- Grade 12 past-paper archive metadata/link
- SBA resources
- NSC assessment quality-assurance resource

These records are marked as external-link stock unless an actual local file has been retrieved and stored. No local-file claim is made merely because an official URL exists.

## Assessment and examinations
The implementation explicitly distinguishes:
- classroom/formative assessment
- School-Based Assessment (SBA)
- Practical Assessment Tasks (PAT) where applicable
- Grade 12 NSC examination preparation
- official examination guidance and archives
- Phenom-original examination questions and marking schemes

Official source documents remain provenance-controlled; Phenom-generated questions are original curriculum-aligned content.

## Integrity and access
- Do not delete authoritative historical versions.
- Do not duplicate an existing canonical resource.
- Teachers consume/select canonical resources; Super Admin remains the canonical editor.
- A topic/resource is only marked generated/stored/published after the actual material exists and passes the applicable verification/IQA stage.
- Singapore remains separately queued/background work; this South Africa pass does not overwrite it.
