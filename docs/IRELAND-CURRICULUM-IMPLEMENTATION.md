# Ireland Curriculum Implementation

Ireland is represented in the Phenom curriculum architecture as `ireland-primary`.

## Current live coverage

- 17 levels/pathways: Junior Infants through Sixth Class; Junior Cycle Years 1-3; Transition Year; Senior Cycle Years 5-6; LCA; LCVP; post-school pathways.
- 13 initial subject mappings plus the existing subject catalogue records.
- 1,555 curriculum/domain reconciliation anchors.
- 21,770 resource-pack records across the 14 supported Phenom resource types.
- 4,665 queued content jobs: topic reconciliation, full resource packs and resource expansion.
- 1,555 queued IQA reviews.
- 17 framework components covering primary, Junior Cycle, Senior Cycle programmes, phased Senior Cycle redevelopment, state examinations and post-school pathways.
- 1,555 official-reconciliation requirement mappings.
- 1,573 canonical Library records, with super-admin-only editing policy.
- Official provenance/external-resource links are registered for NCCA, the State Examinations Commission and the Department of Education.

## Official transition coverage

The implementation preserves the current/redeveloped distinction for Ireland's curriculum. Senior Cycle subject redevelopment is represented as phased 2025-2029 implementation rather than overwriting the existing qualification layer.

Official-source reconciliation is required before generated material is treated as curriculum-authoritative. Restricted examination/specification material is represented through provenance links and metadata rather than copied without permission.

## Production rule

Queued content is processed by the central Phenom AI workflow and then subjected to IQA. A queued or draft resource is not described as human-readable complete until generation and quality review have actually passed.

## Canonical Library rule

The Library is the canonical resource location. Teachers may use/select resources but do not edit canonical resources; super-admin controls canonical resource editing.
