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
1. Implement or verify server-side authorised exam start, answer autosave, timed submission and attempt-limit enforcement against the existing attempt tables.
2. Confirm the student interface reads only `school_cbt_exam_questions_student`; never expose `correct_answer` to student clients.
3. Complete server-side objective marking, manual marking, teacher review, approval/publication and auditable correction.
4. Generate the General Performance Sheet and Official School Report Sheet from existing approved school result/grading/attendance/student/trait records.
5. Enforce a CBT-specific feature entitlement using the existing subscription feature-grant system; a generic premium-subscription predicate is not sufficient for CBT-only plans.
6. Add and run automated tests for two-school isolation, role permissions, answer-key secrecy, scheduling, timers, autosave, scoring, approval, reports and entitlement boundaries.
7. Run `npm run typecheck`, `npm run lint`, and `npm run build` in the project environment and fix all failures.

## Deployment and safety
- The duplicate migration was removed from this branch; no live Supabase schema changes were applied by this work.
- GitHub Actions did not return a workflow run for the checked commit, so checks are not verified.
- The Vercel Ready status means a deployment was created; it does not certify workflows or security.
- Use synthetic test students only. Keep student photos and identifiable records out of development fixtures.
- Do not merge this PR or use the route for live examinations until server-side enforcement, entitlement checks, automated tests and build checks pass.
