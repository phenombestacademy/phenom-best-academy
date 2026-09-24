# United States / American Curriculum Implementation

## Completion and canonicalisation record

**Status:** Baseline confirmed in Supabase; GitHub implementation record committed.

The Phenom LMS stores the United States curriculum as a jurisdiction-aware architecture rather than pretending that the United States has one federally mandated K–12 curriculum.

### Canonical curriculum layers

1. **United States / American Education Curriculum** (usa-american)
   - PreK through Grade 12 plus postsecondary pathway representation.
   - Subject/domain architecture includes English Language Arts, Mathematics, Science, Social Studies, History, Civics, Economics, World Languages, Computer Science, Arts, Music, Physical Education and Health, and Career and Technical Education.
   - State/jurisdiction standards remain separately verifiable overlays.

2. **United States — Common Core / State-Standards-Aligned** (us-common-core)
   - Common Core/state-standards-aligned layer.
   - Common Core is represented as an alignment layer, not as a claim that it governs every US jurisdiction.

## Live Supabase verification

As of the implementation audit:

| Curriculum | Levels | Topics | Resource packs | Reconciliation jobs | Resource-generation jobs | Sources |
|---|---:|---:|---:|---:|---:|---:|
| United States / American Education Curriculum | 14 | 1,228 | 4,452 | 1,228 | 1,228 | 16 |
| United States — Common Core / State-Standards-Aligned | 3 | 24 | 0 | 24 | 24 | 1 |

The 4,452 existing resource-pack records are Phenom resource-pack records and must not be represented as completed official-source materials merely because the records exist.

## Important correction completed

An earlier queue audit found that 636 US-topic jobs had been labelled with the South Africa curriculum identifier even though their topics belonged to the US curriculum. The completion migration corrected those job identifiers and then reconciled the full US topic set.

The live queue now has exactly one reconciliation job and one full-resource-pack job per US topic:

- usa-american: 1,228 + 1,228 queued jobs.
- us-common-core: 24 + 24 queued jobs.

No duplicate jobs are intentionally created by the completion migration.

## Resource and rights rules

- Official curriculum material remains source/provenance/version/rights controlled.
- Phenom-authored lessons, notes, practice, assessments, revision guides and other resources are clearly distinguished from official source material.
- State-specific standards must be verified against the relevant state or jurisdiction before being marked authoritative.
- Restricted exam papers and other copyrighted materials are represented through permitted metadata/external-resource links unless rights to store the actual material are established.
- Teachers use canonical Library resources; canonical resource editing remains a Super Admin function.

## Completion gate

The US curriculum is **implemented and committed as a canonical baseline/queue**, but queued content-generation work is not falsely marked as completed. A worker must actually process the queue and QA the resulting resources before the corresponding resources can be marked complete.

This keeps the same universal Phenom curriculum completion standard used for the other curriculum implementations.
