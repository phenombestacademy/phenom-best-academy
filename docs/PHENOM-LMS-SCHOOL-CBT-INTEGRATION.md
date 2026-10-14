# Phenom Best LMS — School CBT Subscription Integration

## Product boundary
CBT is a separately subscribable capability inside the existing Phenom Best LMS. It is not a detached application, second school tenant, duplicate student database or replacement for Continuous Learning or school administration.

## Existing capabilities reused
- Existing schools, school_members, school_classes, school_subjects, class_subjects and class_members remain the tenant, identity, class, subject and teacher-assignment source of truth.
- Existing student records, attendance, results and result-publication controls remain authoritative.
- Continuous Learning owns programmes, lessons and learning resources.
- Existing administrative LMS areas continue to own admissions, student/staff records, payroll, receipts, fees and other operations.

## Migration and security
Apply `supabase/032_school_cbt_assessment_suite.sql` after existing migrations. It adds assessment authoring metadata, attempts, responses, audit events, school-specific grading bands and configurable report components. It does not replace existing core school tables. RLS scopes data to school membership and assigned teachers. Question answer keys are not readable by students; objective marking occurs through a PostgreSQL RPC. Short-answer and essay items remain pending manual marking.

## Initial route
`/school-cbt` provides a school-scoped assessment list and draft creation/scheduling controls. The route requires authenticated school membership and the migration to be applied.

## Subscription model
CBT-only plans must be enforced by the existing LMS entitlement/billing source of truth. They must not grant unrelated Continuous Learning, payroll or administrative access. This initial route does not bypass entitlements or create new billing records.

## Production checklist
1. Back up Supabase and apply the migration in staging.
2. Verify `is_super_admin`, `is_school_member` and `is_teacher_for_subject_in_school` against actual roles.
3. Test two schools, admins, assigned/unassigned teachers, students and parents.
4. Verify answer keys never appear in student browser payloads and direct response writes are denied.
5. Run `npm run typecheck`, `npm run lint` and `npm run build`.
6. Complete question authoring, student test-taking/autosave, manual marking/approval, report rendering and entitlement integration before declaring production complete.
