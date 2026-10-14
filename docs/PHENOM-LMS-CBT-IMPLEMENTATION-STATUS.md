# CBT implementation status

This commit adds the database foundation and initial school-scoped UI route for the CBT capability inside the existing Phenom Best LMS.

## Included in this commit
- Additive tenant-scoped assessment schema linked to existing school, class, subject and user records.
- Configurable session, term, duration, lifecycle status and report-contribution flag.
- Question records with topic and learning-objective tags.
- Attempt and response records, with manual-marking status for non-objective questions.
- Server-side PostgreSQL scoring RPC for objective question types.
- Audit records, configurable school grading bands and CA/report component rules.
- Initial `/school-cbt` route for school-scoped listing and draft creation.

## Still required before production completion
- Full question authoring/import/export UI.
- Student exam-taking interface, timer enforcement and autosave.
- Teacher manual marking, approval and correction workflow.
- General Performance Sheet and Official School Report Sheet rendering.
- Integration of CBT-only plans with the existing subscription entitlement service.
- Live Supabase migration execution, automated tests and verified production build.

Do not represent the feature as fully deployed until the remaining work is implemented and verified in the actual connected environment.
