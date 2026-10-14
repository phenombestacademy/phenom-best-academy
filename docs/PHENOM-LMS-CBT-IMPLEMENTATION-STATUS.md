# CBT implementation status — existing LMS schema

**Current state: partial implementation; not production-complete. Keep PR #3 in draft.**

## Live schema inspection
The connected Supabase project `hajrdejlamuiqjjhdnsv` is healthy and already has the existing CBT tables `school_cbt_exams`, `school_cbt_exam_questions`, `school_cbt_exam_questions_student`, `school_cbt_exam_assignments`, `school_cbt_exam_attempts`, and `school_cbt_attempts`, plus school membership/class/subject records, student records, result components, trait records and subscription feature tables. Prior migrations already establish tenant scope, student-safe question access and private media.

## Changes now made on this branch
- Removed the proposed `supabase/032_school_cbt_assessment_suite.sql` because it introduced a parallel assessment data model.
- Reworked `src/routes/school-cbt.tsx` to read/write the existing `school_cbt_exams` and `school_cbt_exam_questions` tables.
- Added question creation/editing, CSV import/export and a downloadable CSV template.
- Reused existing school classes and subjects; removed session/term inputs that the current exam table does not persist.
- Updated integration documentation to distinguish delivered UI from the server-side controls still required.

## Work still required before production
1. **Partially implemented in `supabase/033_school_cbt_secure_lifecycle.sql`:** authenticated server-side publish/assignment, start/resume, autosave, deadline checks, objective scoring, attempt limits, result visibility and a CBT-specific entitlement predicate. The migration is committed to the feature branch but has not been applied to the live database.
2. **Implemented in the student UI:** the candidate view reads `school_cbt_exam_questions_student`, autosaves answers, shows a timer and requests server-side submission. Verify this through automated tests before production.
3. **Still required:** teacher marking/review/approval and audited score corrections; persist CBT scores into `student_result_entries` only after the school configures a valid result component and approves the scores.
4. **Still required:** connect General Performance Sheet and Official School Report Sheet to existing approved result, grading, attendance, student and trait records. Do not create duplicate report tables.
5. **Entitlement configuration still required:** the predicate recognises explicit CBT feature codes in plan features, feature grants or tool entitlements. The actual commercial plan/feature code must be configured before any school can rely on access.
6. **Still required:** automated tests for two-school isolation, role permissions, answer-key secrecy, scheduling, timers, autosave, scoring, approval, reports and entitlement boundaries.
7. **Build verification pending:** a quality workflow was added. The first run failed during Node setup because the repository has no lockfile and npm caching was enabled; the workflow was corrected to use `npm install`, but a successful typecheck/lint/build result has not yet been observed.

## Deployment and safety
- The duplicate migration was removed from this branch; no live Supabase schema changes were applied by this work.
- GitHub Actions did not return a workflow run for the checked commit, so checks are not verified.
- The Vercel Ready status means a deployment was created; it does not certify workflows or security.
- Use synthetic test students only. Keep student photos and identifiable records out of development fixtures.
- Do not merge this PR or use the route for live examinations until server-side enforcement, entitlement checks, automated tests and build checks pass.
