# CBT implementation status — live-schema reconciliation required

**Status: NOT production-complete. Do not merge or apply the proposed migration 032 as written.**

## Verified connected environment

- Supabase project: `Phenom Best Academy` (`hajrdejlamuiqjjhdnsv`), status `ACTIVE_HEALTHY`, PostgreSQL 17.
- The live database already has the established CBT model: `school_cbt_exams`, `school_cbt_exam_questions`, `school_cbt_exam_questions_student`, `school_cbt_exam_assignments`, `school_cbt_exam_attempts`, and `school_cbt_attempts`.
- Existing CBT security migrations are recorded: `school_cbt_tenant_workspace_and_retention`, `school_cbt_student_question_trigger_security`, `school_cbt_private_media_bucket`, and `school_cbt_super_admin_media_visibility`.
- Existing tenant sources include `schools`, `school_members`, `school_classes`, `school_subjects`, `class_members`, `student_school_records`, and `school_result_components`.
- Existing entitlement/billing sources include `subscriptions`, `subscription_plans`, `subscription_features`, `subscription_feature_grants`, and `subscription_tool_entitlements`. `school_has_premium_lms_access(uuid)` currently checks for a non-free active/trial subscription, so it is not sufficient by itself to prove a CBT-only entitlement without checking feature-level grants.

## Why the original proposed migration must not be applied

The proposed `032_school_cbt_assessment_suite.sql` introduces a second assessment data model (`school_assessments`, `school_assessment_questions`, and related tables) alongside the live `school_cbt_*` model. Its assumed functions and policies also need to be validated against the live definitions. Applying it would create parallel sources of truth and the current `/school-cbt` route would read those new tables rather than the established CBT records. The migration has **not** been applied to the connected Supabase project.

## Existing capabilities confirmed

- RLS is enabled on the established `school_cbt_*` tables.
- Exam question authoring is supported by `school_cbt_exam_questions`; a student-safe question view exists.
- Assignments and attempts already have tenant/student scoping policies.
- Private CBT media has its own schema/policies.
- Existing school result components and trait/assessment tables should be reused for report generation rather than duplicated.

These checks are schema/policy inspection only. They are not a substitute for adversarial end-to-end tests as authenticated users in two separate schools.

## Required implementation path

1. **Question Bank:** build author/edit/import/export against the established CBT question model; validate question type, options, marks, topic tags and correct answers server-side.
2. **Scheduling:** use existing exam start/end, status, duration, one-attempt/redo and assignment records; enforce transitions and scheduling in server-side RPCs, not just UI state.
3. **Student CBT:** retrieve only the student-safe question projection; start attempts via an authorised server-side function; autosave answers through a scoped RPC; enforce server-side deadlines and attempt limits.
4. **Automatic marking:** grade objective items on the server; retain manual-marking status for essays/short answers; never return answer keys to the browser.
5. **Teacher review:** permit only the assigned teacher and authorised school administrators to mark; record every correction with actor, timestamp, before/after values and reason.
6. **Approved results:** separate marking from approval/publication; block student/parent visibility until the existing release controls permit it.
7. **Report sheets:** reuse the school's result components, grading configuration, attendance, student record and trait-assessment tables. General Performance Sheet and Official School Report Sheet must use only the relevant school/class/student/session/term/subject and components explicitly configured to contribute.
8. **Subscription entitlements:** connect CBT-only plans to the existing feature-level subscription grant/entitlement system. Do not infer CBT access from a generic premium subscription and do not grant other LMS modules.
9. **Verification:** run typecheck, lint, build, automated tests and role-based RLS tests. Test anon, student, teacher assigned to subject, unassigned teacher, school admin, parent and super admin, including cross-school access.

## Live validation findings and limitations

- Supabase security advisor returned existing findings outside this feature, including seven SECURITY DEFINER functions executable by `anon` and the `pg_net` extension in `public`. These need separate review; they are not automatically caused by this PR.
- The Vercel “Ready” notification confirms a deployment was produced, not that the CBT workflows or permissions pass functional/security tests.
- No live schema changes have been applied by this reconciliation pass.
- No claim is made that the end-to-end workflow, full test suite or production release is complete.

## Release gate

Keep this PR in draft until the duplicate-model migration and route are replaced with an implementation against the live `school_cbt_*` tables, entitlement checks are feature-specific, and automated tests pass. Never use real student records or photographs as test fixtures; use synthetic data.
