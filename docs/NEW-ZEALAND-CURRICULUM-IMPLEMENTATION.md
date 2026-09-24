# New Zealand Curriculum — Phenom LMS Implementation

## Status

New Zealand is implemented as the `new-zealand-nzc` curriculum.

The implementation covers:

- Years 0–3
- Years 4–6
- Years 7–8
- Years 9–10
- Years 11–13
- Te Mātaiaho / New Zealand Curriculum framework
- Te Marautanga o Aotearoa pathway and its nine wāhanga ako
- current NCEA and transition arrangements
- Foundational Award (2028)
- NZCE (2029)
- NZACE (2030)
- University Entrance and tertiary progression
- New Zealand Scholarship
- term planning, schemes of work, weekly sequencing and assessment-window support
- canonical Library collections
- official-source provenance and external links
- 14-resource Phenom content packs
- content-worker generation and IQA workflow

## Official source state — 24 September 2026

The Ministry of Education states that the fully updated Years 0–10 New Zealand Curriculum learning areas and framework are available for schools and kura to start using in 2027. It also states that the fully updated Tau 0–10 Te Marautanga o Aotearoa is planned for release on 25 September 2026.

The published implementation timeline is retained in the LMS rather than inferred:

- 2026: Years 0–10 English, Mathematics and Statistics, Te Reo Rangatira, Te Pāngarau.
- 2027: Years 0–8 Science, Social Sciences, Te Pūtaiao and Te Pūmanawa Tangata; Years 9–10 all learning areas/wāhanga ako.
- 2028: Year 11 updated content; Foundational Award; NCEA Level 1 removed.
- 2029: Year 12 updated content; NZCE.
- 2030: Year 13 updated content; NZACE.

The final Years 11–13 curriculum is still being published during 2026. Therefore the LMS must not fabricate unreleased Phase 5 subject content. Versioned transition records are used until the official material is available.

## Content-production rule

A curriculum anchor is not treated as a completed human-ready resource merely because its database record, resource-pack rows or jobs exist.

Each topic is routed through:

1. official-source reconciliation;
2. Phenom content generation;
3. resource-pack population;
4. canonical Library linkage;
5. independent IQA;
6. approval only after the required quality checks pass.

The standard Phenom pack contains:

1. lesson
2. study note
3. worked example
4. practice
5. assessment
6. answers
7. marking guide
8. revision
9. teacher guide
10. activities
11. audio script
12. video script
13. downloadable
14. workbook

## Rights and provenance

Official curriculum pages, qualification rules and external resources are retained as provenance/link records where copying or local storage is not appropriate. Phenom-authored learning resources are kept distinct from official source material.

## Canonical Library

Every New Zealand curriculum topic has a canonical Library collection record. Teachers can use the collection through the LMS, while canonical source/resource editing remains governed by the existing Library permissions and QA workflow.

## Future-proofing

The implementation deliberately preserves current NCEA alongside the new qualification system. Future official releases should be added as new versioned source records and reconciled into the relevant topics rather than silently overwriting the historical/current state.

## Official sources

- National Curriculum Years 0–10 — NZC and TMoA
- The New Zealand Curriculum | Te Mātaiaho
- Senior secondary qualifications replacing NCEA
- Assessment and Examination for NCEA and New Zealand Scholarship Rules 2026
- University Entrance
- New Zealand Scholarship
- Teaching resources to support the updated NZC
- Curriculum Roadshow — Secondary videos and Q&A
