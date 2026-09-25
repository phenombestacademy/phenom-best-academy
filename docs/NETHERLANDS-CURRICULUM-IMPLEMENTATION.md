# Netherlands Curriculum Implementation

## 2026 baseline

The Netherlands curriculum is represented as `netherlands` in the Phenom curriculum architecture.

Coverage includes:

- Early years
- Primary Groups 1–8
- Lower secondary
- VMBO Years 1–4 and its learning pathways/profiles
- HAVO Years 1–5
- VWO Years 1–6
- MBO Levels 1–4
- BOL and BBL vocational pathways
- HBO/university progression pathway
- Primary and secondary kerndoelen
- VMBO/HAVO/VWO examination-programme layer
- MBO qualification-dossier structure
- Official SLO and Government of the Netherlands provenance

## Current database baseline

- 32 levels/pathways
- 150 subject-stage mappings
- 686 curriculum/domain reconciliation anchors
- 2,058 queued AI content jobs (topic reconciliation, full resource pack, resource expansion)
- 686 queued IQA reviews
- 9 framework/pathway components
- 686 official requirement mappings
- 686 canonical Library records
- 4 official external provenance resources

## Accuracy rule

The database does not pretend that a generic AI-generated topic is an official Dutch syllabus topic. Each anchor must be reconciled against the relevant SLO kerndoelen, examination programme or MBO qualification dossier before generated content becomes curriculum-authoritative.

The 2026 curriculum reform is preserved as a transition layer. SLO reports that new primary and lower-secondary kerndoelen and updated examination programmes are being introduced in phases; the implementation therefore keeps current and forthcoming requirements distinguishable.

## Production

Queued jobs are routed through the central Phenom AI architecture and then through IQA. Canonical Library records are super-admin controlled; teachers do not edit canonical resources.

## Official sources

- SLO curriculum and kerndoelen: https://www.slo.nl/thema/meer/actualisatie-kerndoelen-examenprogramma/
- SLO secondary kerndoelen: https://www.slo.nl/@25214/kerndoelen-voortgezet-onderwijs/
- Government secondary education: https://www.government.nl/themes/education/secondary-education
- Government MBO: https://www.government.nl/themes/education/secondary-vocational-education-mbo-and-tertiary-higher-education
- Government MBO qualification structure: https://www.rijksoverheid.nl/themas/onderwijs/middelbaar-beroepsonderwijs/beroepsgericht-mbo
