# SQL Function and Trigger Porting Review

Read-only extraction of public function definitions and trigger metadata from Supabase project `hajrdejlamuiqjjhdnsv`, 11 October 2026. Function bodies were inspected in memory for compatibility markers and common secret patterns; no secret-like literal was detected by that basic scan. Full bodies are intentionally not duplicated into this report.

## Function counts by language and privilege mode

- Total public SQL functions: 67
- `SECURITY DEFINER` functions: 65
- PL/pgSQL functions: 40
- SQL-language functions: 27
- Other languages: 0

## Compatibility marker counts

| Marker | Functions containing marker |
|---|---:|
| Auth identity | 30 |
| Security definer | 65 |
| Row locks/queue claims | 4 |
| JSONB-specific | 9 |
| Array-specific | 5 |
| UUID generation | 0 |
| Dynamic SQL | 1 |
| External/network | 0 |
| Clock/cron | 0 |
| Role/privilege checks | 50 |

These markers are search aids, not a complete semantic analysis. For example, a function can enforce authorization without calling `auth.uid()`, and a security-definer function may rely on carefully constrained search paths and explicit checks.

## Function-by-function register

| Function | Arguments | Language | SECURITY DEFINER | Review markers |
|---|---|---|---|---|
| `activate_school_membership_for_current_user` | `` | sql | true | Auth identity, Security definer, Role/privilege checks |
| `assignment_student_is_target` | `p_task_id uuid, p_student_id uuid` | sql | true | Security definer, Role/privilege checks |
| `audit_student_school_status` | `` | plpgsql | true | Auth identity, Security definer, Role/privilege checks |
| `bind_premium_grants_to_profile` | `` | plpgsql | true | Security definer |
| `calculate_student_subject_term` | `p_session uuid, p_term integer, p_class uuid, p_student uuid, p_subject uuid` | plpgsql | true | Security definer, Role/privilege checks |
| `can_manage_attendance` | `p_school uuid, p_class uuid, p_student uuid` | sql | true | Security definer, Role/privilege checks |
| `can_manage_result_entry` | `p_school uuid, p_class uuid, p_subject uuid, p_student uuid` | sql | true | Security definer, Role/privilege checks |
| `can_view_attendance` | `p_school uuid, p_class uuid, p_student uuid` | sql | true | Auth identity, Security definer, Role/privilege checks |
| `can_view_published_result` | `p_school uuid, p_class uuid, p_student uuid, p_session uuid, p_term integer` | sql | true | Auth identity, Security definer, Role/privilege checks |
| `claim_cloudflare_resource_packs` | `p_limit integer` | plpgsql | true | Security definer, Row locks/queue claims |
| `claim_curriculum_asset_jobs` | `p_limit integer` | plpgsql | true | Security definer, Row locks/queue claims |
| `claim_curriculum_content_jobs` | `p_limit integer` | plpgsql | true | Security definer, Row locks/queue claims |
| `create_friend_conversation` | `` | plpgsql | true | Security definer |
| `create_school_assignment_from_lms_quiz` | `p_school_id uuid, p_class_id uuid, p_subject_id uuid, p_teacher_id uuid, p_quiz_id uuid, p_title text, p_instructions text, p_due_at timestamp with time zone, p_question_count integer, p_randomise boolean, p_all_students boolean, p_include_students uuid[], p_exclude_students uuid[]` | plpgsql | true | Auth identity, Security definer, Array-specific, Dynamic SQL, Role/privilege checks |
| `create_school_for_current_user` | `p_name text, p_logo_url text, p_primary_color text, p_country text, p_currency text` | plpgsql | true | Auth identity, Security definer, Role/privilege checks |
| `create_school_for_current_user_v2` | `p_name text, p_logo_url text, p_primary_color text, p_country text, p_currency text, p_curricula text[], p_state_or_region text` | plpgsql | true | Auth identity, Security definer, Array-specific, Role/privilege checks |
| `enforce_single_super_admin` | `` | plpgsql | true | Security definer, Role/privilege checks |
| `enqueue_missing_curriculum_assets` | `p_curriculum_id text, p_limit integer` | plpgsql | true | Security definer |
| `generate_phenom_user_id` | `` | plpgsql | true | Security definer |
| `get_classmates` | `p_class uuid` | sql | true | Auth identity, Security definer |
| `get_my_phenom_user_id` | `` | sql | true | Auth identity, Security definer |
| `get_student_assignment_items` | `p_task_id uuid` | sql | true | Auth identity, Security definer, JSONB-specific, Role/privilege checks |
| `get_teacher_assignment_items` | `p_task_id uuid` | sql | true | Auth identity, Security definer, JSONB-specific, Role/privilege checks |
| `grade_school_assignment_submission` | `p_submission_id uuid` | plpgsql | true | Security definer, Row locks/queue claims, JSONB-specific, Role/privilege checks |
| `handle_new_user` | `` | plpgsql | true | Security definer, JSONB-specific, Role/privilege checks |
| `has_premium_access` | `p_service_code text, p_user_id uuid` | sql | true | Auth identity, Security definer, JSONB-specific, Array-specific, Role/privilege checks |
| `is_admin` | `` | sql | true | Auth identity, Security definer, Role/privilege checks |
| `is_assigned_teacher_for_subject_name` | `p_class uuid, p_subject_name text` | sql | true | Auth identity, Security definer, Role/privilege checks |
| `is_class_teacher_for` | `p_class uuid` | sql | true | Auth identity, Security definer, Role/privilege checks |
| `is_parent_of` | `child uuid` | sql | true | Auth identity, Security definer, Role/privilege checks |
| `is_school_admin_for` | `p_school uuid` | sql | true | Auth identity, Security definer, Role/privilege checks |
| `is_school_member` | `p_school uuid, p_roles text[]` | sql | true | Auth identity, Security definer, Array-specific, Role/privilege checks |
| `is_staff` | `` | sql | true | Auth identity, Security definer, Role/privilege checks |
| `is_subject_teacher_for` | `p_class uuid, p_subject uuid` | sql | true | Auth identity, Security definer, Role/privilege checks |
| `is_super_admin` | `` | sql | true | Auth identity, Security definer, Role/privilege checks |
| `is_teacher_for` | `p_school uuid` | sql | true | Auth identity, Security definer, Role/privilege checks |
| `is_teacher_for_subject_in_school` | `p_school uuid, p_subject_name text` | sql | true | Auth identity, Security definer, Role/privilege checks |
| `list_school_lms_assessment_sources` | `p_school_id uuid, p_subject text, p_topic text, p_level integer` | sql | true | Auth identity, Security definer, Role/privilege checks |
| `lookup_auth_email_by_phenom_user_id` | `p_phenom_user_id text` | sql | true | Security definer |
| `lookup_phenom_profile` | `p_email text, p_user_id text` | sql | false | JSONB-specific |
| `mark_message_assignment_retained` | `p_message_id uuid` | plpgsql | true | Security definer |
| `notify_assignment_result` | `` | plpgsql | true | Security definer, Role/privilege checks |
| `prevent_assignment_score_tampering` | `` | plpgsql | true | Security definer, Role/privilege checks |
| `prevent_result_mutation` | `` | plpgsql | true | Security definer, Role/privilege checks |
| `promote_student` | `p_school_id uuid, p_student_id uuid, p_new_class_id uuid, p_action text, p_session_id uuid, p_term_no integer, p_reason text` | plpgsql | true | Auth identity, Security definer, Role/privilege checks |
| `protect_profile_privileged_fields` | `` | plpgsql | true | Security definer, Role/privilege checks |
| `purge_expired_ephemeral_communications` | `` | plpgsql | true | Security definer |
| `queue_result_release_notifications` | `` | plpgsql | true | Security definer, Role/privilege checks |
| `refresh_student_term_summary` | `` | plpgsql | true | Security definer, Role/privilege checks |
| `regrade_assignment_task` | `p_task_id uuid` | plpgsql | true | Security definer, Role/privilege checks |
| `require_result_deletion_audit` | `` | plpgsql | true | Auth identity, Security definer, Role/privilege checks |
| `school_has_premium_lms_access` | `p_school_id uuid` | sql | true | Security definer, Role/privilege checks |
| `set_my_onboarding_choice` | `p_account_category text, p_onboarding_role text` | plpgsql | true | Auth identity, Security definer, Role/privilege checks |
| `set_school_curricula` | `p_school_id uuid, p_curricula text[], p_state_or_region text` | plpgsql | true | Security definer, Array-specific, Role/privilege checks |
| `submit_school_assignment` | `p_task_id uuid, p_answers jsonb` | plpgsql | true | Auth identity, Security definer, JSONB-specific, Role/privilege checks |
| `subscribe_email` | `p_email text` | plpgsql | true | Security definer |
| `super_admin_delete_result_entry` | `p_result_entry_id uuid, p_reason text` | plpgsql | true | Auth identity, Security definer, Role/privilege checks |
| `sync_curriculum_asset_to_library` | `` | plpgsql | true | Security definer, JSONB-specific |
| `touch_school_cbt_exam_updated_at` | `` | plpgsql | false | Role/privilege checks |
| `trg_regrade_assignment_after_item_change` | `` | plpgsql | true | Security definer |
| `update_school_assignment_item` | `p_item_id uuid, p_question_text text, p_options jsonb, p_correct_answer text, p_explanation text, p_marks numeric` | plpgsql | true | Auth identity, Security definer, JSONB-specific, Role/privilege checks |
| `validate_class_member_assignment` | `` | plpgsql | true | Security definer, Role/privilege checks |
| `validate_class_subject_assignment` | `` | plpgsql | true | Security definer, Role/privilege checks |
| `validate_school_class_assignment` | `` | plpgsql | true | Security definer, Role/privilege checks |
| `validate_student_attendance` | `` | plpgsql | true | Security definer, Role/privilege checks |
| `validate_student_result_entry` | `` | plpgsql | true | Security definer, Role/privilege checks |
| `verify_lms_certificate` | `p_code text` | sql | true | Security definer |

## Trigger-to-function mapping

| Table | Trigger | Event | Timing | Trigger statement |
|---|---|---|---|---|
| `class_members` | `trg_validate_class_member_assignment` | INSERT | BEFORE | `EXECUTE FUNCTION validate_class_member_assignment()` |
| `class_members` | `trg_validate_class_member_assignment` | UPDATE | BEFORE | `EXECUTE FUNCTION validate_class_member_assignment()` |
| `class_subjects` | `trg_validate_class_subject_assignment` | UPDATE | BEFORE | `EXECUTE FUNCTION validate_class_subject_assignment()` |
| `class_subjects` | `trg_validate_class_subject_assignment` | INSERT | BEFORE | `EXECUTE FUNCTION validate_class_subject_assignment()` |
| `courses` | `courses_updated_at_lms` | UPDATE | BEFORE | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `friend_requests` | `trg_friend_conversation` | INSERT | AFTER | `EXECUTE FUNCTION create_friend_conversation()` |
| `friend_requests` | `trg_friend_conversation` | UPDATE | AFTER | `EXECUTE FUNCTION create_friend_conversation()` |
| `lms_course_reviews` | `lms_reviews_updated_at` | UPDATE | BEFORE | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `lms_course_sections` | `lms_sections_updated_at` | UPDATE | BEFORE | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `lms_curriculum_assets` | `trg_sync_curriculum_asset_to_library` | INSERT | AFTER | `EXECUTE FUNCTION sync_curriculum_asset_to_library()` |
| `lms_curriculum_assets` | `trg_sync_curriculum_asset_to_library` | UPDATE | AFTER | `EXECUTE FUNCTION sync_curriculum_asset_to_library()` |
| `lms_discussion_posts` | `lms_posts_updated_at` | UPDATE | BEFORE | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `lms_discussion_threads` | `lms_threads_updated_at` | UPDATE | BEFORE | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `lms_learning_paths` | `lms_paths_updated_at` | UPDATE | BEFORE | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `lms_lessons` | `lms_lessons_updated_at` | UPDATE | BEFORE | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `lms_notes` | `lms_notes_updated_at` | UPDATE | BEFORE | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `lms_rubrics` | `lms_rubrics_updated_at` | UPDATE | BEFORE | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `profiles` | `protect_profile_privileged_fields` | UPDATE | BEFORE | `EXECUTE FUNCTION protect_profile_privileged_fields()` |
| `profiles` | `protect_profile_privileged_fields` | INSERT | BEFORE | `EXECUTE FUNCTION protect_profile_privileged_fields()` |
| `profiles` | `trg_bind_premium_grants` | UPDATE | AFTER | `EXECUTE FUNCTION bind_premium_grants_to_profile()` |
| `profiles` | `trg_bind_premium_grants` | INSERT | AFTER | `EXECUTE FUNCTION bind_premium_grants_to_profile()` |
| `profiles` | `trg_single_super_admin` | INSERT | BEFORE | `EXECUTE FUNCTION enforce_single_super_admin()` |
| `profiles` | `trg_single_super_admin` | UPDATE | BEFORE | `EXECUTE FUNCTION enforce_single_super_admin()` |
| `school_assignment_items` | `trg_regrade_assignment_after_item_change` | UPDATE | AFTER | `EXECUTE FUNCTION trg_regrade_assignment_after_item_change()` |
| `school_assignment_items` | `trg_regrade_assignment_after_item_change` | INSERT | AFTER | `EXECUTE FUNCTION trg_regrade_assignment_after_item_change()` |
| `school_assignment_submissions` | `trg_notify_assignment_result` | UPDATE | AFTER | `EXECUTE FUNCTION notify_assignment_result()` |
| `school_assignment_submissions` | `trg_notify_assignment_result` | INSERT | AFTER | `EXECUTE FUNCTION notify_assignment_result()` |
| `school_assignment_submissions` | `trg_prevent_assignment_score_tampering` | UPDATE | BEFORE | `EXECUTE FUNCTION prevent_assignment_score_tampering()` |
| `school_cbt_exam_questions` | `trg_sync_school_cbt_student_question` | DELETE | AFTER | `EXECUTE FUNCTION private.sync_school_cbt_student_question()` |
| `school_cbt_exam_questions` | `trg_sync_school_cbt_student_question` | INSERT | AFTER | `EXECUTE FUNCTION private.sync_school_cbt_student_question()` |
| `school_cbt_exam_questions` | `trg_sync_school_cbt_student_question` | UPDATE | AFTER | `EXECUTE FUNCTION private.sync_school_cbt_student_question()` |
| `school_cbt_exams` | `trg_touch_school_cbt_exam_updated_at` | UPDATE | BEFORE | `EXECUTE FUNCTION touch_school_cbt_exam_updated_at()` |
| `school_classes` | `trg_validate_school_class_assignment` | INSERT | BEFORE | `EXECUTE FUNCTION validate_school_class_assignment()` |
| `school_classes` | `trg_validate_school_class_assignment` | UPDATE | BEFORE | `EXECUTE FUNCTION validate_school_class_assignment()` |
| `school_result_publications` | `trg_queue_result_release_notifications` | UPDATE | AFTER | `EXECUTE FUNCTION queue_result_release_notifications()` |
| `school_result_publications` | `trg_queue_result_release_notifications` | INSERT | AFTER | `EXECUTE FUNCTION queue_result_release_notifications()` |
| `student_attendance` | `trg_validate_student_attendance` | UPDATE | BEFORE | `EXECUTE FUNCTION validate_student_attendance()` |
| `student_attendance` | `trg_validate_student_attendance` | INSERT | BEFORE | `EXECUTE FUNCTION validate_student_attendance()` |
| `student_result_entries` | `trg_refresh_student_term_summary` | UPDATE | AFTER | `EXECUTE FUNCTION refresh_student_term_summary()` |
| `student_result_entries` | `trg_refresh_student_term_summary` | INSERT | AFTER | `EXECUTE FUNCTION refresh_student_term_summary()` |
| `student_result_entries` | `trg_require_result_deletion_audit` | DELETE | BEFORE | `EXECUTE FUNCTION require_result_deletion_audit()` |
| `student_result_entries` | `trg_result_immutable` | DELETE | BEFORE | `EXECUTE FUNCTION prevent_result_mutation()` |
| `student_result_entries` | `trg_result_immutable` | UPDATE | BEFORE | `EXECUTE FUNCTION prevent_result_mutation()` |
| `student_result_entries` | `trg_validate_student_result_entry` | UPDATE | BEFORE | `EXECUTE FUNCTION validate_student_result_entry()` |
| `student_result_entries` | `trg_validate_student_result_entry` | INSERT | BEFORE | `EXECUTE FUNCTION validate_student_result_entry()` |
| `student_school_records` | `trg_audit_student_school_status` | INSERT | BEFORE | `EXECUTE FUNCTION audit_student_school_status()` |
| `student_school_records` | `trg_audit_student_school_status` | UPDATE | BEFORE | `EXECUTE FUNCTION audit_student_school_status()` |

## Porting priorities

1. **Authorization helpers:** port and test all role/school/parent/student/teacher checks before exposing replacement API routes. Translate the effective behaviour, not the SQL syntax alone.
2. **Queue-claim functions:** preserve atomic claim semantics, bounded batch size, retry safety and concurrency control. Do not replace `FOR UPDATE SKIP LOCKED` with an uncoordinated select-then-update sequence.
3. **Triggers with side effects:** identify every insert/update/delete side effect and preserve audit/history semantics. Avoid double execution during dual-write.
4. **Identity and generated values:** preserve source IDs during import and prevent new-ID collisions after cutover.
5. **JSONB and arrays:** translate query/update semantics explicitly and add round-trip tests.
6. **Extension/network dependencies:** replace external calls, scheduled jobs and extension behaviour with explicit Worker/Queue/Workflow services; retain authentication, idempotency and retry semantics.
7. **Security-definer safety:** inspect each function's ownership, search_path, grants and caller assumptions. Never make an equivalent endpoint callable by unauthenticated users by default.

## Verification still required

- Extract view definitions and review their access and sensitive-column exposure.
- Map every function to callers in browser code, Edge Functions, triggers, scheduled jobs and other SQL functions.
- Write positive and negative tests for each security-sensitive function.
- Build an execution/dependency graph to determine a safe migration order.
- Compare behaviour against staging data before switching traffic.
