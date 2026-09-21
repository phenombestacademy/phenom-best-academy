# Phenom LMS V6 Enterprise Expansion

This is a **non-destructive expansion** of the existing Phenom Best Academy LMS. Existing programme structures, school LMS tables, RLS policies, routes and Tool Hub functionality remain in place.

## Standards and capabilities being added

1. Full course authoring foundation
2. Sophisticated prerequisites
3. Drip/scheduled learning
4. SCORM 1.2 / 2004 package and attempt foundation
5. xAPI/LRS statement and event foundation
6. LTI 1.3 / LTI Advantage configuration foundation: Deep Linking, Names & Role Provisioning and Assignment & Grade Services
7. Integrated live teaching/session and attendance foundation
8. Course discussion/forum foundation
9. Enterprise learning-event analytics foundation
10. Competency tracking
11. Instructor profiles and marketplace foundation
12. Course reviews/offers
13. Gradebook interoperability foundation
14. Normalized global subject catalogue and curriculum-subject mapping

## Public provider/engine privacy

Provider, model, routing-engine and credential details remain server-side. Public UI should use **Phenom Best Core** and neutral status messages such as **Loading, please wait…**. Never place provider API keys, model identifiers, LTI private keys or SCORM/xAPI credentials in client-side code.

## Global curriculum principle

The existing `curriculum_catalogue` remains authoritative. The new `global_subject_catalogue` and `curriculum_subject_catalogue` normalize all subjects already declared by the package's curriculum catalogue, while adding the Tool Hub academic domains:

- Mathematics
- Statistics
- Physics
- Chemistry
- Business Mathematics
- English Literacy

This is deliberately extensible: new national, regional, international and institutional curricula can be added without redesigning the LMS schema.

## Activation order

1. Apply `031_phenom_enterprise_lms_foundation.sql` after the existing migrations.
2. Test the existing RLS helper functions and all existing school LMS policies.
3. Build server/Edge Functions for SCORM package validation/launch, xAPI ingestion and LTI 1.3 OIDC/token flows.
4. Build Course Studio, learner progress dashboard, instructor dashboard, live classroom UI, forum UI and marketplace UI against the new tables.
5. Add automated tests for tenant isolation, learner isolation, teacher scope, gradebook privacy and admin-only standards credentials.
6. Add curriculum/subject authoring so each curriculum can carry its own stage, subject, standards/outcomes and approved-source provenance.
7. Only then enable production integrations and commercial marketplace payouts.

## Important

This migration is a foundation, not a claim that every enterprise feature is already production-ready. SCORM, xAPI and LTI require secure server-side protocol implementations and conformance testing before production certification claims are made.
