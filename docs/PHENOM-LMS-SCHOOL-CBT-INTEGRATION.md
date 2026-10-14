# Phenom Best LMS — School CBT Integration

## Non-negotiable data boundary
CBT is a separately subscribable capability inside the existing Phenom Best LMS. It must reuse existing school, user, class, subject, teacher assignment, student record, attendance, result and subscription records. Do not create a second school/assessment/student database.

## Verified live schema
The connected Supabase project already contains:
- `school_cbt_exams`
- `school_cbt_exam_questions` (staff-managed question bank, including answer keys)
- `school_cbt_exam_questions_student` (student-safe question projection)
- `school_cbt_exam_assignments`
- `school_cbt_exam_attempts` and `school_cbt_attempts`
- `school_cbt_exam_media` and `school_cbt_question_resources`
- `school_members`, `school_classes`, `school_subjects`, `class_subjects`, `class_members`
- `student_school_records`, `school_result_components`, `school_assessment_traits`
- existing subscription and feature-entitlement tables

Recorded migrations already establish CBT tenant scoping, student question security, private media and media visibility. The duplicate-table migration `032_school_cbt_assessment_suite.sql` was removed from this PR because it would create a parallel source of truth.

## UI delivered in this branch
`/school-cbt` now reads and creates exams in `school_cbt_exams` and supports staff question creation/editing, CSV import/export, question-template download, and draft/scheduled/active/closed status controls. It reuses the school's existing classes and subjects and does not write to `school_assessments`.

## Important limitation
The UI layer is not the security boundary. Direct client status changes do not replace server-side schedule, duration, attempt-limit, assignment, submission, grading, approval or entitlement enforcement. The route still requires type-check/build verification and authenticated role testing. Do not use it for live exams until those checks pass.

## Remaining end-to-end release gates
1. Add/verify server-side RPCs for authorised start, answer autosave, timed submission and attempt-limit enforcement on existing attempt tables.
2. Ensure all student question reads use `school_cbt_exam_questions_student`; never return `correct_answer` to students.
3. Complete objective marking server-side, essay/short-answer manual marking, teacher review, result approval and audited correction.
4. Build General Performance Sheet and Official School Report Sheet from existing approved grading/result/attendance/student/trait records. Do not infer affective or psychomotor ratings from CBT.
5. Check CBT feature-specific subscription entitlements using the existing feature-grant system. A generic premium-subscription check is not enough for a CBT-only plan.
6. Run `npm run typecheck`, `npm run lint`, `npm run build`, plus role/RLS tests with synthetic data across at least two schools.
7. Only after verification, update the implementation status and take the PR out of draft.

## Safety and rollout
No migration has been applied to live Supabase by this PR. Use synthetic students in tests; never use student photographs or identifiable student data as test fixtures. A Vercel Ready deployment confirms deployment creation only, not security or end-to-end correctness.
