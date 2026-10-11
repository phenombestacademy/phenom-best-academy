# Live Supabase Schema Inventory — Phenom Best Academy

Captured read-only from project `hajrdejlamuiqjjhdnsv` on 11 October 2026 via the connected database SQL interface. This is an inventory snapshot, not a backup, schema dump or completed migration. It contains schema metadata and security policy expressions; review before using it as migration input.

## Summary

- Public base tables: 171
- Columns: 1699
- Declared foreign-key column relationships: 215
- Public RLS policies: 314
- Public functions: 67
- Public triggers (one row per trigger event): 47
- RLS status is included per table below. All PostgreSQL-specific functions, triggers and policy expressions require manual compatibility and authorization review before D1 migration.

Estimated row counts are PostgreSQL planner estimates, not exact counts. Table sizes include indexes and may differ from exported data size.

## Table inventory

| Table | Columns | Primary key | Estimated rows | Table + index size |
|---|---:|---|---:|---:|
| `academic_subject_catalog` | 7 | id | 45 | 81,920 B |
| `academy_private_configuration` | 4 | config_key | 0 | 32,768 B |
| `analytics_events` | 5 | id | 0 | 32,768 B |
| `assignment_submissions` | 8 | id | 0 | 24,576 B |
| `assignment_targets` | 4 | id | 0 | 16,384 B |
| `audit_logs` | 7 | id | 0 | 16,384 B |
| `class_members` | 5 | id | 0 | 24,576 B |
| `class_subjects` | 5 | id | 0 | 16,384 B |
| `cloudflare_migration_manifest` | 9 | source_type, source_id | 0 | 24,576 B |
| `cms_content_blocks` | 12 | id | 0 | 49,152 B |
| `community_ephemeral_shares` | 8 | id | 0 | 16,384 B |
| `conversation_member_restrictions` | 6 | id | 0 | 24,576 B |
| `conversation_members` | 3 | conversation_id, user_id | 0 | 8,192 B |
| `conversations` | 4 | id | 0 | 16,384 B |
| `course_enrolments` | 7 | id | 0 | 24,576 B |
| `courses` | 22 | id | 0 | 40,960 B |
| `curriculum_catalogue` | 10 | id | 0 | 98,304 B |
| `curriculum_subject_catalogue` | 6 | curriculum_id, subject_id, stage | 1,383 | 483,328 B |
| `email_subscribers` | 6 | id | 0 | 49,152 B |
| `friend_requests` | 5 | id | 0 | 16,384 B |
| `global_subject_catalogue` | 7 | id | 497 | 270,336 B |
| `learning_assignments` | 13 | id | 0 | 16,384 B |
| `learning_quizzes` | 16 | id | 0 | 16,384 B |
| `learning_topics` | 7 | id | 0 | 24,576 B |
| `lms_assessment_pathways` | 10 | id | 0 | 49,152 B |
| `lms_badges` | 8 | id | 0 | 24,576 B |
| `lms_bookmarks` | 5 | id | 0 | 24,576 B |
| `lms_canonical_curriculum_registry` | 12 | canonical_order | 0 | 81,920 B |
| `lms_certificates` | 10 | id | 0 | 49,152 B |
| `lms_communication_controls` | 9 | id | 0 | 32,768 B |
| `lms_communication_extraction_jobs` | 7 | id | 0 | 16,384 B |
| `lms_course_instructors` | 5 | id | 0 | 32,768 B |
| `lms_course_prerequisites` | 3 | course_id, prerequisite_course_id | 0 | 8,192 B |
| `lms_course_reviews` | 9 | id | 0 | 32,768 B |
| `lms_course_sections` | 8 | id | 0 | 32,768 B |
| `lms_cpd_professions` | 6 | id | 0 | 49,152 B |
| `lms_cpd_programme_resources` | 8 | id | 0 | 16,384 B |
| `lms_cpd_programmes` | 18 | id | 0 | 24,576 B |
| `lms_cpd_sectors` | 5 | id | 0 | 65,536 B |
| `lms_curriculum_acquisition_items` | 23 | id | 8,406 | 8,347,648 B |
| `lms_curriculum_asset_jobs` | 15 | id | 53,496 | 28,581,888 B |
| `lms_curriculum_asset_permissions` | 10 | id | 0 | 24,576 B |
| `lms_curriculum_assets` | 27 | id | 76,612 | 63,356,928 B |
| `lms_curriculum_content_jobs` | 10 | id | 63,188 | 23,371,776 B |
| `lms_curriculum_external_resources` | 20 | id | 219 | 335,872 B |
| `lms_curriculum_framework_components` | 16 | id | 337 | 335,872 B |
| `lms_curriculum_ingestion_runs` | 13 | id | 0 | 32,768 B |
| `lms_curriculum_levels` | 7 | id | 464 | 196,608 B |
| `lms_curriculum_library_items` | 16 | id | 63,768 | 48,234,496 B |
| `lms_curriculum_library_topic_links` | 11 | id | 52,062 | 20,307,968 B |
| `lms_curriculum_quality_reviews` | 20 | id | 3,203 | 1,327,104 B |
| `lms_curriculum_requirement_mappings` | 13 | id | 5,858 | 4,128,768 B |
| `lms_curriculum_resource_packs` | 14 | id | 141,887 | 151,486,464 B |
| `lms_curriculum_sources` | 17 | id | 174 | 180,224 B |
| `lms_curriculum_topics` | 18 | id | 13,839 | 12,492,800 B |
| `lms_discussion_posts` | 7 | id | 0 | 24,576 B |
| `lms_discussion_threads` | 9 | id | 0 | 24,576 B |
| `lms_distance_affiliation_rules` | 14 | id | 0 | 49,152 B |
| `lms_education_domains` | 7 | id | 0 | 65,536 B |
| `lms_ephemeral_attachments` | 10 | id | 0 | 24,576 B |
| `lms_language_catalogue` | 10 | locale | 216 | 73,728 B |
| `lms_learning_path_courses` | 4 | learning_path_id, course_id | 0 | 16,384 B |
| `lms_learning_paths` | 9 | id | 0 | 24,576 B |
| `lms_lesson_progress` | 9 | id | 0 | 32,768 B |
| `lms_lesson_resources` | 7 | id | 0 | 24,576 B |
| `lms_lessons` | 16 | id | 0 | 40,960 B |
| `lms_live_session_attendees` | 5 | session_id, user_id | 0 | 16,384 B |
| `lms_live_sessions` | 12 | id | 0 | 24,576 B |
| `lms_notes` | 7 | id | 0 | 16,384 B |
| `lms_points_ledger` | 7 | id | 0 | 24,576 B |
| `lms_programme_authorities` | 11 | id | 0 | 24,576 B |
| `lms_programme_authority_policies` | 12 | id | 0 | 49,152 B |
| `lms_programme_enrolment_authority` | 10 | id | 0 | 32,768 B |
| `lms_programme_levels` | 10 | id | 0 | 49,152 B |
| `lms_programme_progression` | 7 | id | 0 | 24,576 B |
| `lms_programme_resources` | 15 | id | 0 | 16,384 B |
| `lms_programme_schedules` | 10 | id | 0 | 24,576 B |
| `lms_programme_topics` | 5 | programme_id, topic_id | 0 | 8,192 B |
| `lms_programme_tracks` | 17 | id | 0 | 49,152 B |
| `lms_programmes` | 30 | id | 0 | 32,768 B |
| `lms_qualification_frameworks` | 8 | id | 0 | 49,152 B |
| `lms_retention_audit` | 6 | id | 0 | 16,384 B |
| `lms_rubric_criteria` | 6 | id | 0 | 24,576 B |
| `lms_rubric_scores` | 8 | id | 0 | 24,576 B |
| `lms_rubrics` | 7 | id | 0 | 16,384 B |
| `lms_tertiary_programme_catalogue` | 17 | id | 131 | 180,224 B |
| `lms_user_badges` | 4 | user_id, badge_id | 0 | 16,384 B |
| `media_items` | 9 | id | 1 | 49,152 B |
| `messages` | 8 | id | 0 | 32,768 B |
| `moderation_reports` | 7 | id | 0 | 16,384 B |
| `parent_learning_notifications` | 10 | id | 0 | 16,384 B |
| `parent_links` | 5 | id | 0 | 24,576 B |
| `payment_orders` | 10 | id | 0 | 24,576 B |
| `payment_provider_settings` | 10 | id | 0 | 49,152 B |
| `payroll_items` | 6 | id | 0 | 8,192 B |
| `payroll_runs` | 7 | id | 0 | 16,384 B |
| `person_signatures` | 6 | id | 0 | 16,384 B |
| `premium_service_grants` | 9 | id | 0 | 40,960 B |
| `profiles` | 26 | id | 2 | 114,688 B |
| `quiz_assignments` | 7 | id | 0 | 16,384 B |
| `quiz_attempts` | 10 | id | 0 | 32,768 B |
| `quiz_questions` | 8 | id | 0 | 24,576 B |
| `result_deletion_audit` | 6 | id | 0 | 24,576 B |
| `result_release_notifications` | 9 | id | 0 | 24,576 B |
| `safety_alerts` | 6 | id | 0 | 16,384 B |
| `school_academic_sessions` | 7 | id | 0 | 24,576 B |
| `school_announcements` | 9 | id | 0 | 16,384 B |
| `school_assessment_scales` | 6 | id | 0 | 24,576 B |
| `school_assessment_traits` | 6 | id | 0 | 16,384 B |
| `school_assignment_items` | 13 | id | 0 | 32,768 B |
| `school_assignment_submissions` | 9 | id | 0 | 24,576 B |
| `school_assignment_targets` | 6 | id | 0 | 32,768 B |
| `school_assignment_tasks` | 18 | id | 0 | 16,384 B |
| `school_attendance_settings` | 7 | id | 0 | 24,576 B |
| `school_calendar_events` | 10 | id | 0 | 16,384 B |
| `school_cbt_attempts` | 10 | id | 0 | 24,576 B |
| `school_cbt_exam_assignments` | 6 | id | 0 | 24,576 B |
| `school_cbt_exam_attempts` | 13 | id | 0 | 24,576 B |
| `school_cbt_exam_media` | 11 | id | 0 | 32,768 B |
| `school_cbt_exam_questions` | 11 | id | 0 | 24,576 B |
| `school_cbt_exam_questions_student` | 8 | id | 0 | 16,384 B |
| `school_cbt_exams` | 19 | id | 0 | 16,384 B |
| `school_cbt_question_resources` | 7 | id | 0 | 32,768 B |
| `school_classes` | 6 | id | 0 | 24,576 B |
| `school_curricula` | 7 | id | 0 | 40,960 B |
| `school_election_candidates` | 4 | id | 0 | 16,384 B |
| `school_election_positions` | 4 | id | 0 | 16,384 B |
| `school_election_voters` | 4 | id | 0 | 16,384 B |
| `school_election_votes` | 6 | id | 0 | 16,384 B |
| `school_elections` | 7 | id | 0 | 16,384 B |
| `school_fee_payments` | 10 | id | 0 | 16,384 B |
| `school_fee_schedules` | 7 | id | 0 | 16,384 B |
| `school_id_card_templates` | 6 | id | 0 | 16,384 B |
| `school_member_invites` | 13 | id | 0 | 32,768 B |
| `school_members` | 6 | id | 0 | 24,576 B |
| `school_profile_fields` | 8 | id | 0 | 24,576 B |
| `school_receipts` | 9 | id | 0 | 24,576 B |
| `school_result_components` | 11 | id | 0 | 24,576 B |
| `school_result_publications` | 10 | id | 0 | 16,384 B |
| `school_sensitive_access` | 6 | id | 0 | 16,384 B |
| `school_subjects` | 7 | id | 0 | 24,576 B |
| `school_terms` | 9 | id | 0 | 24,576 B |
| `schools` | 24 | id | 0 | 16,384 B |
| `service_consents` | 5 | id | 0 | 24,576 B |
| `service_enquiries` | 7 | id | 0 | 16,384 B |
| `site_announcements` | 10 | id | 0 | 24,576 B |
| `site_settings` | 17 | id | 0 | 32,768 B |
| `staff_pay_structures` | 7 | id | 0 | 16,384 B |
| `staff_records` | 8 | id | 0 | 24,576 B |
| `student_attendance` | 17 | id | 0 | 24,576 B |
| `student_class_history` | 12 | id | 0 | 24,576 B |
| `student_emergency_profiles` | 9 | id | 0 | 24,576 B |
| `student_fee_adjustments` | 6 | id | 0 | 16,384 B |
| `student_growth_records` | 9 | id | 0 | 16,384 B |
| `student_guardians` | 11 | id | 0 | 16,384 B |
| `student_result_entries` | 14 | id | 0 | 32,768 B |
| `student_school_records` | 13 | id | 0 | 40,960 B |
| `student_school_status_history` | 10 | id | 0 | 24,576 B |
| `student_sensitive_records` | 13 | id | 0 | 24,576 B |
| `student_term_summaries` | 18 | id | 0 | 24,576 B |
| `student_trait_assessments` | 10 | id | 0 | 16,384 B |
| `subscription_feature_grants` | 4 | id | 0 | 16,384 B |
| `subscription_features` | 5 | id | 0 | 49,152 B |
| `subscription_plans` | 12 | id | 0 | 49,152 B |
| `subscription_tool_entitlements` | 5 | id | 3 | 81,920 B |
| `subscriptions` | 12 | id | 0 | 24,576 B |
| `suggestions` | 6 | id | 0 | 16,384 B |
| `teacher_question_banks` | 12 | id | 0 | 16,384 B |
| `teacher_question_items` | 9 | id | 0 | 24,576 B |
| `ui_translation_resources` | 9 | locale, resource_key, source_version | 0 | 24,576 B |
| `user_notifications` | 7 | id | 0 | 24,576 B |

## Column definitions

| Table | Column | PostgreSQL type | Nullable | Default | Max length |
|---|---|---|---|---|---:|
| `academic_subject_catalog` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `academic_subject_catalog` | `stage` | `text` | NO | — | — |
| `academic_subject_catalog` | `domain` | `text` | NO | — | — |
| `academic_subject_catalog` | `name` | `text` | NO | — | — |
| `academic_subject_catalog` | `aliases` | `ARRAY` | NO | '{}'::text[] | — |
| `academic_subject_catalog` | `exam_tags` | `ARRAY` | NO | '{}'::text[] | — |
| `academic_subject_catalog` | `active` | `boolean` | NO | true | — |
| `academy_private_configuration` | `config_key` | `text` | NO | — | — |
| `academy_private_configuration` | `config_value` | `text` | NO | — | — |
| `academy_private_configuration` | `secret` | `boolean` | NO | true | — |
| `academy_private_configuration` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `analytics_events` | `id` | `bigint` | NO | — | — |
| `analytics_events` | `user_id` | `uuid` | YES | — | — |
| `analytics_events` | `event_name` | `text` | NO | — | — |
| `analytics_events` | `payload` | `jsonb` | NO | '{}'::jsonb | — |
| `analytics_events` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `assignment_submissions` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `assignment_submissions` | `assignment_id` | `uuid` | NO | — | — |
| `assignment_submissions` | `student_id` | `uuid` | NO | — | — |
| `assignment_submissions` | `attempt_no` | `integer` | NO | 1 | — |
| `assignment_submissions` | `answers` | `jsonb` | NO | '{}'::jsonb | — |
| `assignment_submissions` | `score` | `numeric` | YES | — | — |
| `assignment_submissions` | `feedback` | `jsonb` | NO | '{}'::jsonb | — |
| `assignment_submissions` | `submitted_at` | `timestamp with time zone` | YES | — | — |
| `assignment_targets` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `assignment_targets` | `assignment_id` | `uuid` | NO | — | — |
| `assignment_targets` | `student_id` | `uuid` | NO | — | — |
| `assignment_targets` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `audit_logs` | `id` | `bigint` | NO | — | — |
| `audit_logs` | `actor_id` | `uuid` | YES | — | — |
| `audit_logs` | `action` | `text` | NO | — | — |
| `audit_logs` | `target_type` | `text` | YES | — | — |
| `audit_logs` | `target_id` | `text` | YES | — | — |
| `audit_logs` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `audit_logs` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `class_members` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `class_members` | `class_id` | `uuid` | NO | — | — |
| `class_members` | `user_id` | `uuid` | NO | — | — |
| `class_members` | `role` | `text` | NO | — | — |
| `class_members` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `class_subjects` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `class_subjects` | `class_id` | `uuid` | NO | — | — |
| `class_subjects` | `subject_id` | `uuid` | NO | — | — |
| `class_subjects` | `teacher_id` | `uuid` | YES | — | — |
| `class_subjects` | `active` | `boolean` | NO | true | — |
| `cloudflare_migration_manifest` | `source_type` | `text` | NO | — | — |
| `cloudflare_migration_manifest` | `source_id` | `text` | NO | — | — |
| `cloudflare_migration_manifest` | `r2_key` | `text` | NO | — | — |
| `cloudflare_migration_manifest` | `sha256` | `text` | YES | — | — |
| `cloudflare_migration_manifest` | `bytes` | `bigint` | YES | — | — |
| `cloudflare_migration_manifest` | `verified` | `boolean` | NO | false | — |
| `cloudflare_migration_manifest` | `source_deleted` | `boolean` | NO | false | — |
| `cloudflare_migration_manifest` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `cloudflare_migration_manifest` | `verified_at` | `timestamp with time zone` | YES | — | — |
| `cms_content_blocks` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `cms_content_blocks` | `page_key` | `text` | NO | — | — |
| `cms_content_blocks` | `block_key` | `text` | NO | — | — |
| `cms_content_blocks` | `title` | `text` | YES | — | — |
| `cms_content_blocks` | `body` | `text` | YES | — | — |
| `cms_content_blocks` | `icon_name` | `text` | YES | — | — |
| `cms_content_blocks` | `image_url` | `text` | YES | — | — |
| `cms_content_blocks` | `href` | `text` | YES | — | — |
| `cms_content_blocks` | `sort_order` | `integer` | NO | 0 | — |
| `cms_content_blocks` | `published` | `boolean` | NO | true | — |
| `cms_content_blocks` | `updated_by` | `uuid` | YES | — | — |
| `cms_content_blocks` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `community_ephemeral_shares` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `community_ephemeral_shares` | `conversation_id` | `uuid` | NO | — | — |
| `community_ephemeral_shares` | `sender_id` | `uuid` | NO | — | — |
| `community_ephemeral_shares` | `kind` | `text` | NO | — | — |
| `community_ephemeral_shares` | `file_name` | `text` | YES | — | — |
| `community_ephemeral_shares` | `mime_type` | `text` | YES | — | — |
| `community_ephemeral_shares` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `community_ephemeral_shares` | `expires_at` | `timestamp with time zone` | NO | (now() + '00:15:00'::interval) | — |
| `conversation_member_restrictions` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `conversation_member_restrictions` | `conversation_id` | `uuid` | NO | — | — |
| `conversation_member_restrictions` | `user_id` | `uuid` | NO | — | — |
| `conversation_member_restrictions` | `restricted_by` | `uuid` | NO | — | — |
| `conversation_member_restrictions` | `reason` | `text` | YES | — | — |
| `conversation_member_restrictions` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `conversation_members` | `conversation_id` | `uuid` | NO | — | — |
| `conversation_members` | `user_id` | `uuid` | NO | — | — |
| `conversation_members` | `joined_at` | `timestamp with time zone` | NO | now() | — |
| `conversations` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `conversations` | `created_by` | `uuid` | NO | — | — |
| `conversations` | `title` | `text` | YES | — | — |
| `conversations` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `course_enrolments` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `course_enrolments` | `course_id` | `uuid` | NO | — | — |
| `course_enrolments` | `user_id` | `uuid` | NO | — | — |
| `course_enrolments` | `progress` | `numeric` | NO | 0 | — |
| `course_enrolments` | `completed_at` | `timestamp with time zone` | YES | — | — |
| `course_enrolments` | `certificate_issued_at` | `timestamp with time zone` | YES | — | — |
| `course_enrolments` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `courses` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `courses` | `title` | `text` | NO | — | — |
| `courses` | `description` | `text` | YES | — | — |
| `courses` | `duration_label` | `text` | YES | — | — |
| `courses` | `price` | `numeric` | NO | 0 | — |
| `courses` | `currency` | `text` | NO | 'NGN'::text | — |
| `courses` | `certificate_enabled` | `boolean` | NO | false | — |
| `courses` | `certificate_type` | `text` | YES | — | — |
| `courses` | `published` | `boolean` | NO | false | — |
| `courses` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `courses` | `slug` | `text` | YES | — | — |
| `courses` | `short_description` | `text` | YES | — | — |
| `courses` | `thumbnail_url` | `text` | YES | — | — |
| `courses` | `intro_video_url` | `text` | YES | — | — |
| `courses` | `category` | `text` | YES | — | — |
| `courses` | `level_label` | `text` | YES | — | — |
| `courses` | `language` | `text` | NO | 'English'::text | — |
| `courses` | `estimated_hours` | `numeric` | YES | — | — |
| `courses` | `created_by` | `uuid` | YES | — | — |
| `courses` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `courses` | `status` | `text` | NO | 'draft'::text | — |
| `courses` | `featured` | `boolean` | NO | false | — |
| `curriculum_catalogue` | `id` | `text` | NO | — | — |
| `curriculum_catalogue` | `name` | `text` | NO | — | — |
| `curriculum_catalogue` | `description` | `text` | NO | — | — |
| `curriculum_catalogue` | `country_codes` | `ARRAY` | NO | '{}'::text[] | — |
| `curriculum_catalogue` | `stages` | `ARRAY` | NO | '{}'::text[] | — |
| `curriculum_catalogue` | `subjects` | `ARRAY` | NO | '{}'::text[] | — |
| `curriculum_catalogue` | `official_source` | `text` | NO | — | — |
| `curriculum_catalogue` | `notes` | `text` | YES | — | — |
| `curriculum_catalogue` | `active` | `boolean` | NO | true | — |
| `curriculum_catalogue` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `curriculum_subject_catalogue` | `curriculum_id` | `text` | NO | — | — |
| `curriculum_subject_catalogue` | `subject_id` | `uuid` | NO | — | — |
| `curriculum_subject_catalogue` | `stage` | `text` | NO | — | — |
| `curriculum_subject_catalogue` | `country_code` | `text` | YES | — | — |
| `curriculum_subject_catalogue` | `source_note` | `text` | YES | — | — |
| `curriculum_subject_catalogue` | `active` | `boolean` | NO | true | — |
| `email_subscribers` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `email_subscribers` | `email` | `text` | NO | — | — |
| `email_subscribers` | `active` | `boolean` | NO | true | — |
| `email_subscribers` | `marketing_opt_in` | `boolean` | NO | true | — |
| `email_subscribers` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `email_subscribers` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `friend_requests` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `friend_requests` | `requester_id` | `uuid` | NO | — | — |
| `friend_requests` | `recipient_id` | `uuid` | NO | — | — |
| `friend_requests` | `status` | `text` | NO | 'pending'::text | — |
| `friend_requests` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `global_subject_catalogue` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `global_subject_catalogue` | `name` | `text` | NO | — | — |
| `global_subject_catalogue` | `slug` | `text` | NO | — | — |
| `global_subject_catalogue` | `category` | `text` | NO | 'academic'::text | — |
| `global_subject_catalogue` | `active` | `boolean` | NO | true | — |
| `global_subject_catalogue` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `global_subject_catalogue` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `learning_assignments` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `learning_assignments` | `school_id` | `uuid` | NO | — | — |
| `learning_assignments` | `class_id` | `uuid` | YES | — | — |
| `learning_assignments` | `teacher_id` | `uuid` | NO | — | — |
| `learning_assignments` | `subject` | `text` | NO | — | — |
| `learning_assignments` | `topic` | `text` | NO | — | — |
| `learning_assignments` | `title` | `text` | NO | — | — |
| `learning_assignments` | `instructions` | `text` | YES | — | — |
| `learning_assignments` | `language` | `text` | NO | 'English'::text | — |
| `learning_assignments` | `due_at` | `timestamp with time zone` | YES | — | — |
| `learning_assignments` | `source` | `text` | NO | 'teacher'::text | — |
| `learning_assignments` | `status` | `text` | NO | 'published'::text | — |
| `learning_assignments` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `learning_quizzes` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `learning_quizzes` | `school_id` | `uuid` | YES | — | — |
| `learning_quizzes` | `created_by` | `uuid` | YES | — | — |
| `learning_quizzes` | `subject` | `text` | NO | — | — |
| `learning_quizzes` | `topic` | `text` | NO | — | — |
| `learning_quizzes` | `level` | `integer` | NO | 1 | — |
| `learning_quizzes` | `language` | `text` | NO | 'English'::text | — |
| `learning_quizzes` | `question_count` | `integer` | NO | — | — |
| `learning_quizzes` | `duration_minutes` | `integer` | YES | — | — |
| `learning_quizzes` | `generation_source` | `text` | NO | 'academy'::text | — |
| `learning_quizzes` | `status` | `text` | NO | 'ready'::text | — |
| `learning_quizzes` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `learning_quizzes` | `learning_mode` | `text` | NO | 'teacher_assigned'::text | — |
| `learning_quizzes` | `brand_name` | `text` | NO | 'Phenom Best Academy'::text | — |
| `learning_quizzes` | `brand_logo_url` | `text` | NO | '/brand/academy-logo-primary.png'::text | — |
| `learning_quizzes` | `watermark_text` | `text` | NO | 'Phenom Best Academy'::text | — |
| `learning_topics` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `learning_topics` | `subject` | `text` | NO | — | — |
| `learning_topics` | `topic` | `text` | NO | — | — |
| `learning_topics` | `level` | `integer` | YES | — | — |
| `learning_topics` | `language` | `text` | YES | 'English'::text | — |
| `learning_topics` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `learning_topics` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_assessment_pathways` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_assessment_pathways` | `pathway_code` | `text` | NO | — | — |
| `lms_assessment_pathways` | `pathway_name` | `text` | NO | — | — |
| `lms_assessment_pathways` | `stage_scope` | `text` | NO | — | — |
| `lms_assessment_pathways` | `awarding_body` | `text` | YES | — | — |
| `lms_assessment_pathways` | `official_source` | `text` | YES | — | — |
| `lms_assessment_pathways` | `delivery_model` | `text` | NO | 'prepare_and_route'::text | — |
| `lms_assessment_pathways` | `exam_or_assessment_requirement` | `text` | YES | — | — |
| `lms_assessment_pathways` | `active` | `boolean` | NO | true | — |
| `lms_assessment_pathways` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_badges` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_badges` | `code` | `text` | NO | — | — |
| `lms_badges` | `name` | `text` | NO | — | — |
| `lms_badges` | `description` | `text` | YES | — | — |
| `lms_badges` | `icon_url` | `text` | YES | — | — |
| `lms_badges` | `points` | `integer` | NO | 0 | — |
| `lms_badges` | `active` | `boolean` | NO | true | — |
| `lms_badges` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_bookmarks` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_bookmarks` | `lesson_id` | `uuid` | NO | — | — |
| `lms_bookmarks` | `user_id` | `uuid` | NO | — | — |
| `lms_bookmarks` | `note` | `text` | YES | — | — |
| `lms_bookmarks` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_canonical_curriculum_registry` | `canonical_order` | `integer` | NO | — | — |
| `lms_canonical_curriculum_registry` | `curriculum_id` | `text` | NO | — | — |
| `lms_canonical_curriculum_registry` | `canonical_name` | `text` | NO | — | — |
| `lms_canonical_curriculum_registry` | `jurisdiction` | `text` | NO | — | — |
| `lms_canonical_curriculum_registry` | `authority` | `text` | NO | — | — |
| `lms_canonical_curriculum_registry` | `official_source` | `text` | YES | — | — |
| `lms_canonical_curriculum_registry` | `structure_scope` | `text` | NO | — | — |
| `lms_canonical_curriculum_registry` | `required_resource_families` | `jsonb` | NO | '[]'::jsonb | — |
| `lms_canonical_curriculum_registry` | `verification_status` | `text` | NO | 'framework_registered'::text | — |
| `lms_canonical_curriculum_registry` | `active` | `boolean` | NO | true | — |
| `lms_canonical_curriculum_registry` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_canonical_curriculum_registry` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_certificates` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_certificates` | `enrolment_id` | `uuid` | NO | — | — |
| `lms_certificates` | `user_id` | `uuid` | NO | — | — |
| `lms_certificates` | `course_id` | `uuid` | NO | — | — |
| `lms_certificates` | `certificate_number` | `text` | NO | — | — |
| `lms_certificates` | `verification_code` | `text` | NO | — | — |
| `lms_certificates` | `issued_at` | `timestamp with time zone` | NO | now() | — |
| `lms_certificates` | `revoked_at` | `timestamp with time zone` | YES | — | — |
| `lms_certificates` | `final_score` | `numeric` | YES | — | — |
| `lms_certificates` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_communication_controls` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_communication_controls` | `target_user_id` | `uuid` | NO | — | — |
| `lms_communication_controls` | `conversation_id` | `uuid` | YES | — | — |
| `lms_communication_controls` | `scope` | `text` | NO | — | — |
| `lms_communication_controls` | `action` | `text` | NO | 'block'::text | — |
| `lms_communication_controls` | `reason` | `text` | YES | — | — |
| `lms_communication_controls` | `created_by` | `uuid` | NO | — | — |
| `lms_communication_controls` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_communication_controls` | `expires_at` | `timestamp with time zone` | YES | — | — |
| `lms_communication_extraction_jobs` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_communication_extraction_jobs` | `attachment_id` | `uuid` | NO | — | — |
| `lms_communication_extraction_jobs` | `requested_by` | `uuid` | NO | — | — |
| `lms_communication_extraction_jobs` | `extraction_status` | `text` | NO | 'queued'::text | — |
| `lms_communication_extraction_jobs` | `extracted_text` | `text` | YES | — | — |
| `lms_communication_extraction_jobs` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_communication_extraction_jobs` | `completed_at` | `timestamp with time zone` | YES | — | — |
| `lms_course_instructors` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_course_instructors` | `course_id` | `uuid` | NO | — | — |
| `lms_course_instructors` | `user_id` | `uuid` | NO | — | — |
| `lms_course_instructors` | `instructor_role` | `text` | NO | 'instructor'::text | — |
| `lms_course_instructors` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_course_prerequisites` | `course_id` | `uuid` | NO | — | — |
| `lms_course_prerequisites` | `prerequisite_course_id` | `uuid` | NO | — | — |
| `lms_course_prerequisites` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_course_reviews` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_course_reviews` | `course_id` | `uuid` | NO | — | — |
| `lms_course_reviews` | `user_id` | `uuid` | NO | — | — |
| `lms_course_reviews` | `rating` | `smallint` | NO | — | — |
| `lms_course_reviews` | `title` | `text` | YES | — | — |
| `lms_course_reviews` | `body` | `text` | YES | — | — |
| `lms_course_reviews` | `published` | `boolean` | NO | true | — |
| `lms_course_reviews` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_course_reviews` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_course_sections` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_course_sections` | `course_id` | `uuid` | NO | — | — |
| `lms_course_sections` | `title` | `text` | NO | — | — |
| `lms_course_sections` | `description` | `text` | YES | — | — |
| `lms_course_sections` | `position` | `integer` | NO | 1 | — |
| `lms_course_sections` | `published` | `boolean` | NO | false | — |
| `lms_course_sections` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_course_sections` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_cpd_professions` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_cpd_professions` | `sector_id` | `uuid` | YES | — | — |
| `lms_cpd_professions` | `profession_name` | `text` | NO | — | — |
| `lms_cpd_professions` | `profession_slug` | `text` | NO | — | — |
| `lms_cpd_professions` | `regulated` | `boolean` | NO | false | — |
| `lms_cpd_professions` | `active` | `boolean` | NO | true | — |
| `lms_cpd_programme_resources` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_cpd_programme_resources` | `programme_id` | `uuid` | YES | — | — |
| `lms_cpd_programme_resources` | `resource_type` | `text` | NO | — | — |
| `lms_cpd_programme_resources` | `title` | `text` | NO | — | — |
| `lms_cpd_programme_resources` | `sequence_no` | `integer` | NO | 0 | — |
| `lms_cpd_programme_resources` | `generation_status` | `text` | NO | 'planned'::text | — |
| `lms_cpd_programme_resources` | `storage_object_path` | `text` | YES | — | — |
| `lms_cpd_programme_resources` | `brand_metadata` | `jsonb` | NO | '{"brand": "Phenom Best Academy", "watermark": "Phenom Best Academy", "core_label": "Phenom Best Core"}'::jsonb | — |
| `lms_cpd_programmes` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_cpd_programmes` | `profession_id` | `uuid` | YES | — | — |
| `lms_cpd_programmes` | `title` | `text` | NO | — | — |
| `lms_cpd_programmes` | `programme_code` | `text` | NO | — | — |
| `lms_cpd_programmes` | `level` | `text` | YES | — | — |
| `lms_cpd_programmes` | `credential_type` | `text` | NO | 'certificate'::text | — |
| `lms_cpd_programmes` | `duration_weeks` | `integer` | YES | — | — |
| `lms_cpd_programmes` | `duration_hours` | `numeric` | YES | — | — |
| `lms_cpd_programmes` | `delivery_mode` | `text` | NO | 'self_paced'::text | — |
| `lms_cpd_programmes` | `status` | `text` | NO | 'planned'::text | — |
| `lms_cpd_programmes` | `official_body` | `text` | YES | — | — |
| `lms_cpd_programmes` | `official_source` | `text` | YES | — | — |
| `lms_cpd_programmes` | `scope_note` | `text` | NO | ''::text | — |
| `lms_cpd_programmes` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_cpd_programmes` | `duration_months` | `integer` | YES | — | — |
| `lms_cpd_programmes` | `credential_label` | `text` | YES | — | — |
| `lms_cpd_programmes` | `authority_policy_code` | `text` | YES | 'ACADEMY-DIRECT'::text | — |
| `lms_cpd_programmes` | `progression_model` | `text` | YES | 'sequential_levels'::text | — |
| `lms_cpd_sectors` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_cpd_sectors` | `sector_name` | `text` | NO | — | — |
| `lms_cpd_sectors` | `sector_slug` | `text` | NO | — | — |
| `lms_cpd_sectors` | `description` | `text` | NO | ''::text | — |
| `lms_cpd_sectors` | `active` | `boolean` | NO | true | — |
| `lms_curriculum_acquisition_items` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_acquisition_items` | `curriculum_id` | `text` | NO | — | — |
| `lms_curriculum_acquisition_items` | `level_id` | `uuid` | YES | — | — |
| `lms_curriculum_acquisition_items` | `topic_id` | `uuid` | YES | — | — |
| `lms_curriculum_acquisition_items` | `qualification` | `text` | YES | — | — |
| `lms_curriculum_acquisition_items` | `subject_name` | `text` | YES | — | — |
| `lms_curriculum_acquisition_items` | `syllabus_code` | `text` | YES | — | — |
| `lms_curriculum_acquisition_items` | `resource_type` | `text` | NO | — | — |
| `lms_curriculum_acquisition_items` | `title` | `text` | NO | — | — |
| `lms_curriculum_acquisition_items` | `official_url` | `text` | NO | — | — |
| `lms_curriculum_acquisition_items` | `source_authority` | `text` | NO | 'Cambridge International'::text | — |
| `lms_curriculum_acquisition_items` | `access_class` | `text` | NO | 'public_official'::text | — |
| `lms_curriculum_acquisition_items` | `licence_status` | `text` | NO | 'official_link_only'::text | — |
| `lms_curriculum_acquisition_items` | `retrieval_status` | `text` | NO | 'catalogued'::text | — |
| `lms_curriculum_acquisition_items` | `storage_status` | `text` | NO | 'not_stored'::text | — |
| `lms_curriculum_acquisition_items` | `local_asset_id` | `uuid` | YES | — | — |
| `lms_curriculum_acquisition_items` | `source_version` | `text` | YES | — | — |
| `lms_curriculum_acquisition_items` | `publication_date` | `date` | YES | — | — |
| `lms_curriculum_acquisition_items` | `retrieved_at` | `timestamp with time zone` | YES | — | — |
| `lms_curriculum_acquisition_items` | `content_hash` | `text` | YES | — | — |
| `lms_curriculum_acquisition_items` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_curriculum_acquisition_items` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_acquisition_items` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_asset_audit` | `curriculum_id` | `text` | YES | — | — |
| `lms_curriculum_asset_audit` | `asset_records` | `bigint` | YES | — | — |
| `lms_curriculum_asset_audit` | `stored_assets` | `bigint` | YES | — | — |
| `lms_curriculum_asset_audit` | `queued_assets` | `bigint` | YES | — | — |
| `lms_curriculum_asset_audit` | `generating_assets` | `bigint` | YES | — | — |
| `lms_curriculum_asset_audit` | `failed_assets` | `bigint` | YES | — | — |
| `lms_curriculum_asset_audit` | `stored_scheme_of_work` | `bigint` | YES | — | — |
| `lms_curriculum_asset_audit` | `scheme_of_work_required` | `bigint` | YES | — | — |
| `lms_curriculum_asset_jobs` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_asset_jobs` | `asset_id` | `uuid` | NO | — | — |
| `lms_curriculum_asset_jobs` | `trigger_type` | `text` | NO | 'background'::text | — |
| `lms_curriculum_asset_jobs` | `priority` | `integer` | NO | 50 | — |
| `lms_curriculum_asset_jobs` | `status` | `text` | NO | 'queued'::text | — |
| `lms_curriculum_asset_jobs` | `attempts` | `integer` | NO | 0 | — |
| `lms_curriculum_asset_jobs` | `max_attempts` | `integer` | NO | 3 | — |
| `lms_curriculum_asset_jobs` | `requested_by` | `uuid` | YES | — | — |
| `lms_curriculum_asset_jobs` | `requested_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_asset_jobs` | `started_at` | `timestamp with time zone` | YES | — | — |
| `lms_curriculum_asset_jobs` | `completed_at` | `timestamp with time zone` | YES | — | — |
| `lms_curriculum_asset_jobs` | `error_message` | `text` | YES | — | — |
| `lms_curriculum_asset_jobs` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_curriculum_asset_jobs` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_asset_jobs` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_asset_permissions` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_asset_permissions` | `asset_id` | `uuid` | NO | — | — |
| `lms_curriculum_asset_permissions` | `user_id` | `uuid` | YES | — | — |
| `lms_curriculum_asset_permissions` | `school_id` | `uuid` | YES | — | — |
| `lms_curriculum_asset_permissions` | `role_code` | `text` | YES | — | — |
| `lms_curriculum_asset_permissions` | `can_view` | `boolean` | NO | true | — |
| `lms_curriculum_asset_permissions` | `can_download` | `boolean` | NO | false | — |
| `lms_curriculum_asset_permissions` | `can_edit` | `boolean` | NO | false | — |
| `lms_curriculum_asset_permissions` | `expires_at` | `timestamp with time zone` | YES | — | — |
| `lms_curriculum_asset_permissions` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_assets` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_assets` | `curriculum_id` | `text` | NO | — | — |
| `lms_curriculum_assets` | `level_id` | `uuid` | YES | — | — |
| `lms_curriculum_assets` | `topic_id` | `uuid` | YES | — | — |
| `lms_curriculum_assets` | `resource_pack_id` | `uuid` | YES | — | — |
| `lms_curriculum_assets` | `asset_type` | `text` | NO | — | — |
| `lms_curriculum_assets` | `format` | `text` | NO | — | — |
| `lms_curriculum_assets` | `title` | `text` | NO | — | — |
| `lms_curriculum_assets` | `status` | `text` | NO | 'planned'::text | — |
| `lms_curriculum_assets` | `storage_bucket` | `text` | YES | — | — |
| `lms_curriculum_assets` | `storage_path` | `text` | YES | — | — |
| `lms_curriculum_assets` | `mime_type` | `text` | YES | — | — |
| `lms_curriculum_assets` | `file_size` | `bigint` | YES | — | — |
| `lms_curriculum_assets` | `content_hash` | `text` | YES | — | — |
| `lms_curriculum_assets` | `version` | `integer` | NO | 1 | — |
| `lms_curriculum_assets` | `visibility` | `text` | NO | 'restricted'::text | — |
| `lms_curriculum_assets` | `downloadable` | `boolean` | NO | false | — |
| `lms_curriculum_assets` | `viewable` | `boolean` | NO | true | — |
| `lms_curriculum_assets` | `editable` | `boolean` | NO | false | — |
| `lms_curriculum_assets` | `generation_source` | `text` | NO | 'phenom-background-worker'::text | — |
| `lms_curriculum_assets` | `generator_metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_curriculum_assets` | `generated_at` | `timestamp with time zone` | YES | — | — |
| `lms_curriculum_assets` | `stored_at` | `timestamp with time zone` | YES | — | — |
| `lms_curriculum_assets` | `published_at` | `timestamp with time zone` | YES | — | — |
| `lms_curriculum_assets` | `last_error` | `text` | YES | — | — |
| `lms_curriculum_assets` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_assets` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_completion_audit` | `topic_id` | `uuid` | YES | — | — |
| `lms_curriculum_completion_audit` | `curriculum_id` | `text` | YES | — | — |
| `lms_curriculum_completion_audit` | `topic_code` | `text` | YES | — | — |
| `lms_curriculum_completion_audit` | `topic_title` | `text` | YES | — | — |
| `lms_curriculum_completion_audit` | `source_verified` | `boolean` | YES | — | — |
| `lms_curriculum_completion_audit` | `resource_type_count` | `bigint` | YES | — | — |
| `lms_curriculum_completion_audit` | `populated_resource_type_count` | `bigint` | YES | — | — |
| `lms_curriculum_completion_audit` | `qc_recorded` | `boolean` | YES | — | — |
| `lms_curriculum_completion_audit` | `qc_status` | `text` | YES | — | — |
| `lms_curriculum_completion_audit` | `mapping_type_count` | `bigint` | YES | — | — |
| `lms_curriculum_completion_audit` | `verified_mapping_type_count` | `bigint` | YES | — | — |
| `lms_curriculum_completion_audit` | `queued_or_active_jobs` | `bigint` | YES | — | — |
| `lms_curriculum_completion_audit` | `completed_jobs` | `bigint` | YES | — | — |
| `lms_curriculum_completion_audit` | `complete` | `boolean` | YES | — | — |
| `lms_curriculum_content_jobs` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_content_jobs` | `curriculum_id` | `text` | YES | — | — |
| `lms_curriculum_content_jobs` | `topic_id` | `uuid` | YES | — | — |
| `lms_curriculum_content_jobs` | `job_type` | `text` | NO | — | — |
| `lms_curriculum_content_jobs` | `status` | `text` | NO | 'queued'::text | — |
| `lms_curriculum_content_jobs` | `priority` | `integer` | NO | 50 | — |
| `lms_curriculum_content_jobs` | `requested_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_content_jobs` | `completed_at` | `timestamp with time zone` | YES | — | — |
| `lms_curriculum_content_jobs` | `error_message` | `text` | YES | — | — |
| `lms_curriculum_content_jobs` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_curriculum_external_resources` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_external_resources` | `curriculum_id` | `text` | NO | — | — |
| `lms_curriculum_external_resources` | `level_id` | `uuid` | YES | — | — |
| `lms_curriculum_external_resources` | `topic_id` | `uuid` | YES | — | — |
| `lms_curriculum_external_resources` | `resource_type` | `text` | NO | — | — |
| `lms_curriculum_external_resources` | `title` | `text` | NO | — | — |
| `lms_curriculum_external_resources` | `official_url` | `text` | NO | — | — |
| `lms_curriculum_external_resources` | `source_authority` | `text` | NO | 'Cambridge International'::text | — |
| `lms_curriculum_external_resources` | `access_class` | `text` | NO | 'public_official'::text | — |
| `lms_curriculum_external_resources` | `licence_status` | `text` | NO | 'official_link_only'::text | — |
| `lms_curriculum_external_resources` | `retrieval_status` | `text` | NO | 'catalogued'::text | — |
| `lms_curriculum_external_resources` | `storage_status` | `text` | NO | 'not_stored'::text | — |
| `lms_curriculum_external_resources` | `local_asset_id` | `uuid` | YES | — | — |
| `lms_curriculum_external_resources` | `source_version` | `text` | YES | — | — |
| `lms_curriculum_external_resources` | `publication_date` | `date` | YES | — | — |
| `lms_curriculum_external_resources` | `retrieved_at` | `timestamp with time zone` | YES | — | — |
| `lms_curriculum_external_resources` | `content_hash` | `text` | YES | — | — |
| `lms_curriculum_external_resources` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_curriculum_external_resources` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_external_resources` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_framework_components` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_framework_components` | `curriculum_id` | `text` | NO | — | — |
| `lms_curriculum_framework_components` | `component_code` | `text` | NO | — | — |
| `lms_curriculum_framework_components` | `component_type` | `text` | NO | — | — |
| `lms_curriculum_framework_components` | `title` | `text` | NO | — | — |
| `lms_curriculum_framework_components` | `stage` | `text` | YES | — | — |
| `lms_curriculum_framework_components` | `year_group` | `text` | YES | — | — |
| `lms_curriculum_framework_components` | `statutory_status` | `text` | YES | — | — |
| `lms_curriculum_framework_components` | `official_source` | `text` | YES | — | — |
| `lms_curriculum_framework_components` | `official_url` | `text` | YES | — | — |
| `lms_curriculum_framework_components` | `source_version` | `text` | YES | — | — |
| `lms_curriculum_framework_components` | `description` | `text` | YES | — | — |
| `lms_curriculum_framework_components` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_curriculum_framework_components` | `active` | `boolean` | NO | true | — |
| `lms_curriculum_framework_components` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_framework_components` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_ingestion_runs` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_ingestion_runs` | `source_id` | `uuid` | NO | — | — |
| `lms_curriculum_ingestion_runs` | `started_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_ingestion_runs` | `completed_at` | `timestamp with time zone` | YES | — | — |
| `lms_curriculum_ingestion_runs` | `status` | `text` | NO | 'queued'::text | — |
| `lms_curriculum_ingestion_runs` | `extracted_levels` | `integer` | NO | 0 | — |
| `lms_curriculum_ingestion_runs` | `extracted_subjects` | `integer` | NO | 0 | — |
| `lms_curriculum_ingestion_runs` | `extracted_topics` | `integer` | NO | 0 | — |
| `lms_curriculum_ingestion_runs` | `extracted_outcomes` | `integer` | NO | 0 | — |
| `lms_curriculum_ingestion_runs` | `extracted_expectations` | `integer` | NO | 0 | — |
| `lms_curriculum_ingestion_runs` | `verified_topics` | `integer` | NO | 0 | — |
| `lms_curriculum_ingestion_runs` | `warnings` | `jsonb` | NO | '[]'::jsonb | — |
| `lms_curriculum_ingestion_runs` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_curriculum_levels` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_levels` | `curriculum_id` | `text` | NO | — | — |
| `lms_curriculum_levels` | `stage` | `text` | NO | — | — |
| `lms_curriculum_levels` | `level_code` | `text` | NO | — | — |
| `lms_curriculum_levels` | `display_name` | `text` | NO | — | — |
| `lms_curriculum_levels` | `sequence_no` | `integer` | NO | 0 | — |
| `lms_curriculum_levels` | `active` | `boolean` | NO | true | — |
| `lms_curriculum_library_access` | `library_item_id` | `uuid` | YES | — | — |
| `lms_curriculum_library_access` | `title` | `text` | YES | — | — |
| `lms_curriculum_library_access` | `item_type` | `text` | YES | — | — |
| `lms_curriculum_library_access` | `source_class` | `text` | YES | — | — |
| `lms_curriculum_library_access` | `access_class` | `text` | YES | — | — |
| `lms_curriculum_library_access` | `licence_status` | `text` | YES | — | — |
| `lms_curriculum_library_access` | `storage_status` | `text` | YES | — | — |
| `lms_curriculum_library_access` | `public_status` | `text` | YES | — | — |
| `lms_curriculum_library_access` | `qc_status` | `text` | YES | — | — |
| `lms_curriculum_library_access` | `asset_id` | `uuid` | YES | — | — |
| `lms_curriculum_library_access` | `external_resource_id` | `uuid` | YES | — | — |
| `lms_curriculum_library_access` | `topic_id` | `uuid` | YES | — | — |
| `lms_curriculum_library_access` | `relation_type` | `text` | YES | — | — |
| `lms_curriculum_library_access` | `alignment_status` | `text` | YES | — | — |
| `lms_curriculum_library_access` | `alignment_score` | `numeric` | YES | — | — |
| `lms_curriculum_library_access` | `alignment_basis` | `text` | YES | — | — |
| `lms_curriculum_library_access` | `linked_curriculum_id` | `text` | YES | — | — |
| `lms_curriculum_library_access` | `linked_topic_title` | `text` | YES | — | — |
| `lms_curriculum_library_access` | `linked_topic_code` | `text` | YES | — | — |
| `lms_curriculum_library_items` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_library_items` | `curriculum_id` | `text` | NO | — | — |
| `lms_curriculum_library_items` | `topic_id` | `uuid` | YES | — | — |
| `lms_curriculum_library_items` | `asset_id` | `uuid` | YES | — | — |
| `lms_curriculum_library_items` | `external_resource_id` | `uuid` | YES | — | — |
| `lms_curriculum_library_items` | `title` | `text` | NO | — | — |
| `lms_curriculum_library_items` | `item_type` | `text` | NO | — | — |
| `lms_curriculum_library_items` | `source_class` | `text` | NO | 'phenom_authored'::text | — |
| `lms_curriculum_library_items` | `access_class` | `text` | NO | 'internal'::text | — |
| `lms_curriculum_library_items` | `licence_status` | `text` | NO | 'pending'::text | — |
| `lms_curriculum_library_items` | `storage_status` | `text` | NO | 'not_stored'::text | — |
| `lms_curriculum_library_items` | `public_status` | `text` | NO | 'private'::text | — |
| `lms_curriculum_library_items` | `qc_status` | `text` | NO | 'pending'::text | — |
| `lms_curriculum_library_items` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_curriculum_library_items` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_library_items` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_library_topic_links` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_library_topic_links` | `library_item_id` | `uuid` | NO | — | — |
| `lms_curriculum_library_topic_links` | `topic_id` | `uuid` | NO | — | — |
| `lms_curriculum_library_topic_links` | `relation_type` | `text` | NO | 'curriculum_alignment'::text | — |
| `lms_curriculum_library_topic_links` | `alignment_status` | `text` | NO | 'pending'::text | — |
| `lms_curriculum_library_topic_links` | `alignment_score` | `numeric` | YES | — | — |
| `lms_curriculum_library_topic_links` | `alignment_basis` | `text` | YES | — | — |
| `lms_curriculum_library_topic_links` | `verified_by` | `uuid` | YES | — | — |
| `lms_curriculum_library_topic_links` | `verified_at` | `timestamp with time zone` | YES | — | — |
| `lms_curriculum_library_topic_links` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_library_topic_links` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_quality_reviews` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_quality_reviews` | `curriculum_id` | `text` | NO | — | — |
| `lms_curriculum_quality_reviews` | `topic_id` | `uuid` | NO | — | — |
| `lms_curriculum_quality_reviews` | `reviewer_role` | `text` | NO | 'curriculum_supervisor'::text | — |
| `lms_curriculum_quality_reviews` | `status` | `text` | NO | 'pending'::text | — |
| `lms_curriculum_quality_reviews` | `curriculum_verified` | `boolean` | NO | false | — |
| `lms_curriculum_quality_reviews` | `lesson_verified` | `boolean` | NO | false | — |
| `lms_curriculum_quality_reviews` | `study_note_verified` | `boolean` | NO | false | — |
| `lms_curriculum_quality_reviews` | `practice_verified` | `boolean` | NO | false | — |
| `lms_curriculum_quality_reviews` | `assessment_verified` | `boolean` | NO | false | — |
| `lms_curriculum_quality_reviews` | `revision_verified` | `boolean` | NO | false | — |
| `lms_curriculum_quality_reviews` | `teacher_guide_verified` | `boolean` | NO | false | — |
| `lms_curriculum_quality_reviews` | `worked_example_verified` | `boolean` | NO | false | — |
| `lms_curriculum_quality_reviews` | `audio_script_verified` | `boolean` | NO | false | — |
| `lms_curriculum_quality_reviews` | `video_script_verified` | `boolean` | NO | false | — |
| `lms_curriculum_quality_reviews` | `downloadable_verified` | `boolean` | NO | false | — |
| `lms_curriculum_quality_reviews` | `notes` | `text` | YES | — | — |
| `lms_curriculum_quality_reviews` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_curriculum_quality_reviews` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_quality_reviews` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_requirement_mappings` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_requirement_mappings` | `curriculum_id` | `text` | NO | — | — |
| `lms_curriculum_requirement_mappings` | `topic_id` | `uuid` | NO | — | — |
| `lms_curriculum_requirement_mappings` | `mapping_type` | `text` | NO | — | — |
| `lms_curriculum_requirement_mappings` | `official_source_url` | `text` | YES | — | — |
| `lms_curriculum_requirement_mappings` | `source_version` | `text` | YES | — | — |
| `lms_curriculum_requirement_mappings` | `official_reference` | `text` | YES | — | — |
| `lms_curriculum_requirement_mappings` | `requirement_text` | `text` | YES | — | — |
| `lms_curriculum_requirement_mappings` | `mapping_status` | `text` | NO | 'queued'::text | — |
| `lms_curriculum_requirement_mappings` | `verification_status` | `text` | NO | 'pending'::text | — |
| `lms_curriculum_requirement_mappings` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_curriculum_requirement_mappings` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_requirement_mappings` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_resource_packs` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_resource_packs` | `topic_id` | `uuid` | NO | — | — |
| `lms_curriculum_resource_packs` | `pack_code` | `text` | NO | — | — |
| `lms_curriculum_resource_packs` | `resource_type` | `text` | NO | — | — |
| `lms_curriculum_resource_packs` | `title` | `text` | NO | — | — |
| `lms_curriculum_resource_packs` | `content` | `text` | NO | — | — |
| `lms_curriculum_resource_packs` | `locale` | `text` | NO | 'en-NG'::text | — |
| `lms_curriculum_resource_packs` | `support_locale` | `text` | NO | 'en-NG'::text | — |
| `lms_curriculum_resource_packs` | `sequence_no` | `integer` | NO | — | — |
| `lms_curriculum_resource_packs` | `status` | `text` | NO | 'ready'::text | — |
| `lms_curriculum_resource_packs` | `curriculum_alignment` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_curriculum_resource_packs` | `brand_metadata` | `jsonb` | NO | '{"brand": "Phenom Best Academy", "engine": "Phenom Best Core"}'::jsonb | — |
| `lms_curriculum_resource_packs` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_resource_packs` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_sources` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_sources` | `curriculum_id` | `text` | NO | — | — |
| `lms_curriculum_sources` | `source_title` | `text` | NO | — | — |
| `lms_curriculum_sources` | `source_type` | `text` | NO | 'official_document'::text | — |
| `lms_curriculum_sources` | `issuing_body` | `text` | NO | — | — |
| `lms_curriculum_sources` | `official_url` | `text` | NO | — | — |
| `lms_curriculum_sources` | `source_version` | `text` | YES | — | — |
| `lms_curriculum_sources` | `publication_date` | `date` | YES | — | — |
| `lms_curriculum_sources` | `retrieved_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_sources` | `verification_status` | `text` | NO | 'registered'::text | — |
| `lms_curriculum_sources` | `content_hash` | `text` | YES | — | — |
| `lms_curriculum_sources` | `extraction_method` | `text` | YES | — | — |
| `lms_curriculum_sources` | `document_scope` | `text` | NO | ''::text | — |
| `lms_curriculum_sources` | `notes` | `text` | NO | ''::text | — |
| `lms_curriculum_sources` | `active` | `boolean` | NO | true | — |
| `lms_curriculum_sources` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_sources` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_topics` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_curriculum_topics` | `curriculum_id` | `text` | NO | — | — |
| `lms_curriculum_topics` | `level_id` | `uuid` | NO | — | — |
| `lms_curriculum_topics` | `subject_id` | `uuid` | NO | — | — |
| `lms_curriculum_topics` | `parent_topic_id` | `uuid` | YES | — | — |
| `lms_curriculum_topics` | `topic_title` | `text` | NO | — | — |
| `lms_curriculum_topics` | `topic_code` | `text` | YES | — | — |
| `lms_curriculum_topics` | `learning_outcomes` | `jsonb` | NO | '[]'::jsonb | — |
| `lms_curriculum_topics` | `assessment_expectations` | `jsonb` | NO | '[]'::jsonb | — |
| `lms_curriculum_topics` | `official_source` | `text` | YES | — | — |
| `lms_curriculum_topics` | `source_reference` | `text` | YES | — | — |
| `lms_curriculum_topics` | `source_version` | `text` | YES | — | — |
| `lms_curriculum_topics` | `source_status` | `text` | NO | 'source_pending'::text | — |
| `lms_curriculum_topics` | `ai_generation_policy` | `text` | NO | 'curriculum_bound'::text | — |
| `lms_curriculum_topics` | `active` | `boolean` | NO | true | — |
| `lms_curriculum_topics` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_curriculum_topics` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_curriculum_topics` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_discussion_posts` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_discussion_posts` | `thread_id` | `uuid` | NO | — | — |
| `lms_discussion_posts` | `author_id` | `uuid` | NO | — | — |
| `lms_discussion_posts` | `body` | `text` | NO | — | — |
| `lms_discussion_posts` | `parent_post_id` | `uuid` | YES | — | — |
| `lms_discussion_posts` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_discussion_posts` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_discussion_threads` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_discussion_threads` | `course_id` | `uuid` | NO | — | — |
| `lms_discussion_threads` | `lesson_id` | `uuid` | YES | — | — |
| `lms_discussion_threads` | `author_id` | `uuid` | NO | — | — |
| `lms_discussion_threads` | `title` | `text` | NO | — | — |
| `lms_discussion_threads` | `body` | `text` | NO | — | — |
| `lms_discussion_threads` | `status` | `text` | NO | 'open'::text | — |
| `lms_discussion_threads` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_discussion_threads` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_distance_affiliation_rules` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_distance_affiliation_rules` | `rule_code` | `text` | NO | — | — |
| `lms_distance_affiliation_rules` | `title` | `text` | NO | — | — |
| `lms_distance_affiliation_rules` | `platform_role` | `text` | NO | — | — |
| `lms_distance_affiliation_rules` | `admission_owner` | `text` | NO | — | — |
| `lms_distance_affiliation_rules` | `student_record_owner` | `text` | NO | — | — |
| `lms_distance_affiliation_rules` | `academic_approval_owner` | `text` | NO | — | — |
| `lms_distance_affiliation_rules` | `credential_award_owner` | `text` | NO | — | — |
| `lms_distance_affiliation_rules` | `student_portal_rule` | `text` | NO | — | — |
| `lms_distance_affiliation_rules` | `centre_rule` | `text` | NO | — | — |
| `lms_distance_affiliation_rules` | `physical_activity_rule` | `text` | NO | — | — |
| `lms_distance_affiliation_rules` | `curriculum_prebuild_rule` | `text` | NO | — | — |
| `lms_distance_affiliation_rules` | `public_disclosure_rule` | `text` | NO | — | — |
| `lms_distance_affiliation_rules` | `active` | `boolean` | NO | true | — |
| `lms_education_domains` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_education_domains` | `domain_name` | `text` | NO | — | — |
| `lms_education_domains` | `domain_slug` | `text` | NO | — | — |
| `lms_education_domains` | `description` | `text` | NO | ''::text | — |
| `lms_education_domains` | `education_stage` | `text` | NO | 'all'::text | — |
| `lms_education_domains` | `active` | `boolean` | NO | true | — |
| `lms_education_domains` | `sequence_no` | `integer` | NO | 0 | — |
| `lms_ephemeral_attachments` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_ephemeral_attachments` | `conversation_id` | `uuid` | YES | — | — |
| `lms_ephemeral_attachments` | `sender_id` | `uuid` | NO | — | — |
| `lms_ephemeral_attachments` | `storage_bucket` | `text` | NO | — | — |
| `lms_ephemeral_attachments` | `storage_path` | `text` | NO | — | — |
| `lms_ephemeral_attachments` | `media_type` | `text` | NO | — | — |
| `lms_ephemeral_attachments` | `purpose` | `text` | NO | 'communication'::text | — |
| `lms_ephemeral_attachments` | `expires_at` | `timestamp with time zone` | NO | (now() + '7 days'::interval) | — |
| `lms_ephemeral_attachments` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_ephemeral_attachments` | `deleted_at` | `timestamp with time zone` | YES | — | — |
| `lms_language_catalogue` | `locale` | `text` | NO | — | — |
| `lms_language_catalogue` | `language_name` | `text` | NO | — | — |
| `lms_language_catalogue` | `modality` | `text` | NO | 'spoken_written'::text | — |
| `lms_language_catalogue` | `interface_candidate` | `boolean` | NO | true | — |
| `lms_language_catalogue` | `learning_candidate` | `boolean` | NO | true | — |
| `lms_language_catalogue` | `google_cloud_supported` | `boolean` | NO | false | — |
| `lms_language_catalogue` | `azure_translator_supported` | `boolean` | NO | false | — |
| `lms_language_catalogue` | `provider_support_note` | `text` | NO | ''::text | — |
| `lms_language_catalogue` | `active` | `boolean` | NO | true | — |
| `lms_language_catalogue` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_learning_path_courses` | `learning_path_id` | `uuid` | NO | — | — |
| `lms_learning_path_courses` | `course_id` | `uuid` | NO | — | — |
| `lms_learning_path_courses` | `position` | `integer` | NO | — | — |
| `lms_learning_path_courses` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_learning_paths` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_learning_paths` | `title` | `text` | NO | — | — |
| `lms_learning_paths` | `slug` | `text` | YES | — | — |
| `lms_learning_paths` | `description` | `text` | YES | — | — |
| `lms_learning_paths` | `thumbnail_url` | `text` | YES | — | — |
| `lms_learning_paths` | `published` | `boolean` | NO | false | — |
| `lms_learning_paths` | `created_by` | `uuid` | YES | — | — |
| `lms_learning_paths` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_learning_paths` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_lesson_progress` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_lesson_progress` | `lesson_id` | `uuid` | NO | — | — |
| `lms_lesson_progress` | `user_id` | `uuid` | NO | — | — |
| `lms_lesson_progress` | `progress_percent` | `numeric` | NO | 0 | — |
| `lms_lesson_progress` | `last_position_seconds` | `integer` | NO | 0 | — |
| `lms_lesson_progress` | `completed` | `boolean` | NO | false | — |
| `lms_lesson_progress` | `first_started_at` | `timestamp with time zone` | YES | — | — |
| `lms_lesson_progress` | `completed_at` | `timestamp with time zone` | YES | — | — |
| `lms_lesson_progress` | `last_accessed_at` | `timestamp with time zone` | NO | now() | — |
| `lms_lesson_resources` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_lesson_resources` | `lesson_id` | `uuid` | NO | — | — |
| `lms_lesson_resources` | `title` | `text` | NO | — | — |
| `lms_lesson_resources` | `resource_type` | `text` | NO | 'link'::text | — |
| `lms_lesson_resources` | `url` | `text` | NO | — | — |
| `lms_lesson_resources` | `position` | `integer` | NO | 1 | — |
| `lms_lesson_resources` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_lessons` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_lessons` | `section_id` | `uuid` | NO | — | — |
| `lms_lessons` | `title` | `text` | NO | — | — |
| `lms_lessons` | `slug` | `text` | YES | — | — |
| `lms_lessons` | `lesson_type` | `text` | NO | 'text'::text | — |
| `lms_lessons` | `content` | `text` | YES | — | — |
| `lms_lessons` | `video_url` | `text` | YES | — | — |
| `lms_lessons` | `audio_url` | `text` | YES | — | — |
| `lms_lessons` | `document_url` | `text` | YES | — | — |
| `lms_lessons` | `duration_seconds` | `integer` | YES | — | — |
| `lms_lessons` | `position` | `integer` | NO | 1 | — |
| `lms_lessons` | `is_preview` | `boolean` | NO | false | — |
| `lms_lessons` | `published` | `boolean` | NO | false | — |
| `lms_lessons` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_lessons` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_lessons` | `access_tier` | `text` | NO | 'free'::text | — |
| `lms_live_session_attendees` | `session_id` | `uuid` | NO | — | — |
| `lms_live_session_attendees` | `user_id` | `uuid` | NO | — | — |
| `lms_live_session_attendees` | `joined_at` | `timestamp with time zone` | YES | — | — |
| `lms_live_session_attendees` | `left_at` | `timestamp with time zone` | YES | — | — |
| `lms_live_session_attendees` | `attendance_status` | `text` | NO | 'registered'::text | — |
| `lms_live_sessions` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_live_sessions` | `course_id` | `uuid` | NO | — | — |
| `lms_live_sessions` | `lesson_id` | `uuid` | YES | — | — |
| `lms_live_sessions` | `host_id` | `uuid` | NO | — | — |
| `lms_live_sessions` | `title` | `text` | NO | — | — |
| `lms_live_sessions` | `description` | `text` | YES | — | — |
| `lms_live_sessions` | `meeting_url` | `text` | YES | — | — |
| `lms_live_sessions` | `starts_at` | `timestamp with time zone` | NO | — | — |
| `lms_live_sessions` | `ends_at` | `timestamp with time zone` | YES | — | — |
| `lms_live_sessions` | `recording_url` | `text` | YES | — | — |
| `lms_live_sessions` | `status` | `text` | NO | 'scheduled'::text | — |
| `lms_live_sessions` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_notes` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_notes` | `lesson_id` | `uuid` | NO | — | — |
| `lms_notes` | `user_id` | `uuid` | NO | — | — |
| `lms_notes` | `body` | `text` | NO | — | — |
| `lms_notes` | `position_seconds` | `integer` | YES | — | — |
| `lms_notes` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_notes` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_points_ledger` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_points_ledger` | `user_id` | `uuid` | NO | — | — |
| `lms_points_ledger` | `points` | `integer` | NO | — | — |
| `lms_points_ledger` | `reason` | `text` | NO | — | — |
| `lms_points_ledger` | `reference_type` | `text` | YES | — | — |
| `lms_points_ledger` | `reference_id` | `uuid` | YES | — | — |
| `lms_points_ledger` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_programme_authorities` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_programme_authorities` | `authority_name` | `text` | NO | — | — |
| `lms_programme_authorities` | `authority_type` | `text` | NO | — | — |
| `lms_programme_authorities` | `country_code` | `text` | YES | — | — |
| `lms_programme_authorities` | `official_url` | `text` | YES | — | — |
| `lms_programme_authorities` | `licence_or_approval_reference` | `text` | YES | — | — |
| `lms_programme_authorities` | `verification_status` | `text` | NO | 'unverified'::text | — |
| `lms_programme_authorities` | `active` | `boolean` | NO | true | — |
| `lms_programme_authorities` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_programme_authorities` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_programme_authorities` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_programme_authority_policies` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_programme_authority_policies` | `policy_code` | `text` | NO | — | — |
| `lms_programme_authority_policies` | `authority_model` | `text` | NO | — | — |
| `lms_programme_authority_policies` | `title` | `text` | NO | — | — |
| `lms_programme_authority_policies` | `description` | `text` | NO | — | — |
| `lms_programme_authority_policies` | `approval_required` | `boolean` | NO | false | — |
| `lms_programme_authority_policies` | `awarding_body_required` | `boolean` | NO | false | — |
| `lms_programme_authority_policies` | `partner_agreement_required` | `boolean` | NO | false | — |
| `lms_programme_authority_policies` | `regulatory_clearance_required` | `boolean` | NO | false | — |
| `lms_programme_authority_policies` | `certificate_issuer_rule` | `text` | NO | ''::text | — |
| `lms_programme_authority_policies` | `public_disclosure_rule` | `text` | NO | ''::text | — |
| `lms_programme_authority_policies` | `active` | `boolean` | NO | true | — |
| `lms_programme_enrolment_authority` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_programme_enrolment_authority` | `track_id` | `uuid` | NO | — | — |
| `lms_programme_enrolment_authority` | `authority_policy_code` | `text` | NO | — | — |
| `lms_programme_enrolment_authority` | `partner_authority_id` | `uuid` | YES | — | — |
| `lms_programme_enrolment_authority` | `application_route` | `text` | NO | 'academy'::text | — |
| `lms_programme_enrolment_authority` | `screening_status` | `text` | NO | 'pending'::text | — |
| `lms_programme_enrolment_authority` | `final_admission_by` | `text` | NO | 'academy'::text | — |
| `lms_programme_enrolment_authority` | `final_award_by` | `text` | NO | 'academy'::text | — |
| `lms_programme_enrolment_authority` | `disclosure_text` | `text` | NO | ''::text | — |
| `lms_programme_enrolment_authority` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_programme_levels` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_programme_levels` | `track_id` | `uuid` | NO | — | — |
| `lms_programme_levels` | `level_no` | `integer` | NO | — | — |
| `lms_programme_levels` | `level_title` | `text` | NO | — | — |
| `lms_programme_levels` | `duration_months` | `integer` | NO | — | — |
| `lms_programme_levels` | `sequence_no` | `integer` | NO | — | — |
| `lms_programme_levels` | `unlock_rule` | `text` | NO | 'previous_level_completed'::text | — |
| `lms_programme_levels` | `status` | `text` | NO | 'planned'::text | — |
| `lms_programme_levels` | `active` | `boolean` | NO | true | — |
| `lms_programme_levels` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_programme_progression` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_programme_progression` | `track_id` | `uuid` | NO | — | — |
| `lms_programme_progression` | `from_level_id` | `uuid` | NO | — | — |
| `lms_programme_progression` | `to_level_id` | `uuid` | NO | — | — |
| `lms_programme_progression` | `completion_requirement` | `text` | NO | — | — |
| `lms_programme_progression` | `assessment_requirement` | `text` | NO | 'required'::text | — |
| `lms_programme_progression` | `active` | `boolean` | NO | true | — |
| `lms_programme_resources` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_programme_resources` | `programme_id` | `uuid` | YES | — | — |
| `lms_programme_resources` | `topic_id` | `uuid` | YES | — | — |
| `lms_programme_resources` | `resource_type` | `text` | NO | — | — |
| `lms_programme_resources` | `title` | `text` | NO | — | — |
| `lms_programme_resources` | `locale` | `text` | YES | — | — |
| `lms_programme_resources` | `support_locale` | `text` | YES | — | — |
| `lms_programme_resources` | `generation_status` | `text` | NO | 'planned'::text | — |
| `lms_programme_resources` | `canonical_content_ref` | `text` | YES | — | — |
| `lms_programme_resources` | `storage_object_path` | `text` | YES | — | — |
| `lms_programme_resources` | `duration_minutes` | `integer` | YES | — | — |
| `lms_programme_resources` | `sequence_no` | `integer` | NO | 0 | — |
| `lms_programme_resources` | `curriculum_alignment` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_programme_resources` | `brand_metadata` | `jsonb` | NO | '{"brand": "Phenom Best Academy", "watermark": "Phenom Best Academy", "core_label": "Phenom Best Core"}'::jsonb | — |
| `lms_programme_resources` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_programme_schedules` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_programme_schedules` | `programme_id` | `uuid` | YES | — | — |
| `lms_programme_schedules` | `week_no` | `integer` | NO | — | — |
| `lms_programme_schedules` | `day_no` | `integer` | YES | — | — |
| `lms_programme_schedules` | `planned_hours` | `numeric` | YES | — | — |
| `lms_programme_schedules` | `planned_minutes` | `integer` | YES | — | — |
| `lms_programme_schedules` | `lesson_count` | `integer` | NO | 0 | — |
| `lms_programme_schedules` | `start_date` | `date` | YES | — | — |
| `lms_programme_schedules` | `end_date` | `date` | YES | — | — |
| `lms_programme_schedules` | `schedule_metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_programme_topics` | `programme_id` | `uuid` | NO | — | — |
| `lms_programme_topics` | `topic_id` | `uuid` | NO | — | — |
| `lms_programme_topics` | `sequence_no` | `integer` | NO | 0 | — |
| `lms_programme_topics` | `required` | `boolean` | NO | true | — |
| `lms_programme_topics` | `planned_hours` | `numeric` | YES | — | — |
| `lms_programme_tracks` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_programme_tracks` | `track_code` | `text` | NO | — | — |
| `lms_programme_tracks` | `track_name` | `text` | NO | — | — |
| `lms_programme_tracks` | `category_slug` | `text` | NO | — | — |
| `lms_programme_tracks` | `subject_id` | `uuid` | YES | — | — |
| `lms_programme_tracks` | `credential_label` | `text` | NO | — | — |
| `lms_programme_tracks` | `nominal_duration_months` | `integer` | NO | — | — |
| `lms_programme_tracks` | `delivery_mode` | `text` | NO | 'online'::text | — |
| `lms_programme_tracks` | `authority_policy_code` | `text` | NO | 'ACADEMY-DIRECT'::text | — |
| `lms_programme_tracks` | `status` | `text` | NO | 'planned'::text | — |
| `lms_programme_tracks` | `certificate_issuer_rule` | `text` | NO | 'pending_authority_verification'::text | — |
| `lms_programme_tracks` | `progression_model` | `text` | NO | 'sequential_levels'::text | — |
| `lms_programme_tracks` | `description` | `text` | NO | ''::text | — |
| `lms_programme_tracks` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_programme_tracks` | `active` | `boolean` | NO | true | — |
| `lms_programme_tracks` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_programme_tracks` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_programmes` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_programmes` | `programme_type` | `text` | NO | 'academic'::text | — |
| `lms_programmes` | `curriculum_id` | `text` | YES | — | — |
| `lms_programmes` | `level_id` | `uuid` | YES | — | — |
| `lms_programmes` | `subject_id` | `uuid` | YES | — | — |
| `lms_programmes` | `title` | `text` | NO | — | — |
| `lms_programmes` | `programme_code` | `text` | NO | — | — |
| `lms_programmes` | `credential_level` | `text` | YES | — | — |
| `lms_programmes` | `duration_weeks` | `integer` | YES | — | — |
| `lms_programmes` | `duration_hours` | `numeric` | YES | — | — |
| `lms_programmes` | `scheduled_hours_per_week` | `numeric` | YES | — | — |
| `lms_programmes` | `delivery_mode` | `text` | NO | 'self_paced'::text | — |
| `lms_programmes` | `language_locale` | `text` | YES | — | — |
| `lms_programmes` | `support_locale` | `text` | YES | — | — |
| `lms_programmes` | `status` | `text` | NO | 'planned'::text | — |
| `lms_programmes` | `official_source` | `text` | YES | — | — |
| `lms_programmes` | `source_version` | `text` | YES | — | — |
| `lms_programmes` | `curriculum_bound` | `boolean` | NO | true | — |
| `lms_programmes` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_programmes` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_programmes` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_programmes` | `authority_policy_code` | `text` | YES | — | — |
| `lms_programmes` | `authority_model` | `text` | YES | — | — |
| `lms_programmes` | `awarding_body` | `text` | YES | — | — |
| `lms_programmes` | `regulatory_body` | `text` | YES | — | — |
| `lms_programmes` | `accreditation_status` | `text` | YES | 'not_applicable'::text | — |
| `lms_programmes` | `partner_authority_id` | `uuid` | YES | — | — |
| `lms_programmes` | `approval_reference` | `text` | YES | — | — |
| `lms_programmes` | `public_disclosure` | `text` | YES | ''::text | — |
| `lms_programmes` | `access_tier` | `text` | NO | 'free'::text | — |
| `lms_qualification_frameworks` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_qualification_frameworks` | `country_code` | `text` | NO | — | — |
| `lms_qualification_frameworks` | `framework_name` | `text` | NO | — | — |
| `lms_qualification_frameworks` | `issuing_or_coordinating_body` | `text` | YES | — | — |
| `lms_qualification_frameworks` | `framework_source` | `text` | YES | — | — |
| `lms_qualification_frameworks` | `qualification_sequence` | `jsonb` | NO | '[]'::jsonb | — |
| `lms_qualification_frameworks` | `notes` | `text` | YES | — | — |
| `lms_qualification_frameworks` | `active` | `boolean` | NO | true | — |
| `lms_quiz_questions_student` | `id` | `uuid` | YES | — | — |
| `lms_quiz_questions_student` | `quiz_id` | `uuid` | YES | — | — |
| `lms_quiz_questions_student` | `position` | `integer` | YES | — | — |
| `lms_quiz_questions_student` | `question_text` | `text` | YES | — | — |
| `lms_quiz_questions_student` | `options` | `jsonb` | YES | — | — |
| `lms_quiz_questions_student` | `image_url` | `text` | YES | — | — |
| `lms_quiz_questions_student` | `explanation` | `text` | YES | — | — |
| `lms_retention_audit` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_retention_audit` | `object_type` | `text` | NO | — | — |
| `lms_retention_audit` | `object_id` | `uuid` | NO | — | — |
| `lms_retention_audit` | `action` | `text` | NO | — | — |
| `lms_retention_audit` | `reason` | `text` | NO | — | — |
| `lms_retention_audit` | `executed_at` | `timestamp with time zone` | NO | now() | — |
| `lms_rubric_criteria` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_rubric_criteria` | `rubric_id` | `uuid` | NO | — | — |
| `lms_rubric_criteria` | `title` | `text` | NO | — | — |
| `lms_rubric_criteria` | `description` | `text` | YES | — | — |
| `lms_rubric_criteria` | `max_points` | `numeric` | NO | 1 | — |
| `lms_rubric_criteria` | `position` | `integer` | NO | — | — |
| `lms_rubric_scores` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_rubric_scores` | `rubric_id` | `uuid` | NO | — | — |
| `lms_rubric_scores` | `criterion_id` | `uuid` | NO | — | — |
| `lms_rubric_scores` | `submission_id` | `uuid` | NO | — | — |
| `lms_rubric_scores` | `score` | `numeric` | NO | 0 | — |
| `lms_rubric_scores` | `feedback` | `text` | YES | — | — |
| `lms_rubric_scores` | `graded_by` | `uuid` | YES | — | — |
| `lms_rubric_scores` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_rubrics` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_rubrics` | `course_id` | `uuid` | YES | — | — |
| `lms_rubrics` | `title` | `text` | NO | — | — |
| `lms_rubrics` | `description` | `text` | YES | — | — |
| `lms_rubrics` | `created_by` | `uuid` | YES | — | — |
| `lms_rubrics` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_rubrics` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_tertiary_programme_catalogue` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `lms_tertiary_programme_catalogue` | `country_code` | `text` | NO | — | — |
| `lms_tertiary_programme_catalogue` | `sector` | `text` | NO | — | — |
| `lms_tertiary_programme_catalogue` | `qualification_level` | `text` | NO | — | — |
| `lms_tertiary_programme_catalogue` | `programme_name` | `text` | NO | — | — |
| `lms_tertiary_programme_catalogue` | `programme_family` | `text` | YES | — | — |
| `lms_tertiary_programme_catalogue` | `official_source` | `text` | YES | — | — |
| `lms_tertiary_programme_catalogue` | `source_version` | `text` | YES | — | — |
| `lms_tertiary_programme_catalogue` | `delivery_status` | `text` | NO | 'prebuilt_reference'::text | — |
| `lms_tertiary_programme_catalogue` | `authority_policy_code` | `text` | NO | 'ACADEMY-APPROVED'::text | — |
| `lms_tertiary_programme_catalogue` | `awarding_body_rule` | `text` | NO | 'external_awarding_body_required'::text | — |
| `lms_tertiary_programme_catalogue` | `practical_requirement` | `text` | NO | 'to_be_assessed'::text | — |
| `lms_tertiary_programme_catalogue` | `duration_months` | `integer` | YES | — | — |
| `lms_tertiary_programme_catalogue` | `active` | `boolean` | NO | true | — |
| `lms_tertiary_programme_catalogue` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `lms_tertiary_programme_catalogue` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `lms_tertiary_programme_catalogue` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `lms_user_badges` | `user_id` | `uuid` | NO | — | — |
| `lms_user_badges` | `badge_id` | `uuid` | NO | — | — |
| `lms_user_badges` | `awarded_at` | `timestamp with time zone` | NO | now() | — |
| `lms_user_badges` | `metadata` | `jsonb` | NO | '{}'::jsonb | — |
| `media_items` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `media_items` | `title` | `text` | NO | — | — |
| `media_items` | `description` | `text` | YES | — | — |
| `media_items` | `media_url` | `text` | NO | — | — |
| `media_items` | `media_type` | `text` | NO | — | — |
| `media_items` | `category` | `text` | YES | — | — |
| `media_items` | `published` | `boolean` | NO | false | — |
| `media_items` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `media_items` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `messages` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `messages` | `conversation_id` | `uuid` | NO | — | — |
| `messages` | `sender_id` | `uuid` | NO | — | — |
| `messages` | `body` | `text` | NO | — | — |
| `messages` | `moderation_status` | `text` | NO | 'allowed'::text | — |
| `messages` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `messages` | `retention_class` | `text` | NO | 'communication'::text | — |
| `messages` | `expires_at` | `timestamp with time zone` | YES | — | — |
| `moderation_reports` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `moderation_reports` | `reporter_id` | `uuid` | NO | — | — |
| `moderation_reports` | `target_type` | `text` | YES | — | — |
| `moderation_reports` | `target_id` | `text` | YES | — | — |
| `moderation_reports` | `reason` | `text` | NO | — | — |
| `moderation_reports` | `status` | `text` | NO | 'open'::text | — |
| `moderation_reports` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `parent_learning_notifications` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `parent_learning_notifications` | `student_id` | `uuid` | NO | — | — |
| `parent_learning_notifications` | `parent_id` | `uuid` | YES | — | — |
| `parent_learning_notifications` | `assignment_id` | `uuid` | YES | — | — |
| `parent_learning_notifications` | `quiz_attempt_id` | `uuid` | YES | — | — |
| `parent_learning_notifications` | `message` | `text` | NO | — | — |
| `parent_learning_notifications` | `score` | `numeric` | YES | — | — |
| `parent_learning_notifications` | `improvement` | `jsonb` | NO | '{}'::jsonb | — |
| `parent_learning_notifications` | `read_at` | `timestamp with time zone` | YES | — | — |
| `parent_learning_notifications` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `parent_links` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `parent_links` | `parent_id` | `uuid` | NO | — | — |
| `parent_links` | `child_id` | `uuid` | NO | — | — |
| `parent_links` | `status` | `text` | NO | 'active'::text | — |
| `parent_links` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `payment_orders` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `payment_orders` | `user_id` | `uuid` | YES | — | — |
| `payment_orders` | `amount` | `numeric` | NO | — | — |
| `payment_orders` | `currency` | `text` | NO | 'NGN'::text | — |
| `payment_orders` | `provider` | `text` | NO | 'flutterwave'::text | — |
| `payment_orders` | `tx_ref` | `text` | NO | — | — |
| `payment_orders` | `status` | `text` | NO | 'pending'::text | — |
| `payment_orders` | `provider_transaction_id` | `text` | YES | — | — |
| `payment_orders` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `payment_orders` | `paid_at` | `timestamp with time zone` | YES | — | — |
| `payment_provider_settings` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `payment_provider_settings` | `provider` | `text` | NO | — | — |
| `payment_provider_settings` | `enabled` | `boolean` | NO | false | — |
| `payment_provider_settings` | `public_label` | `text` | NO | — | — |
| `payment_provider_settings` | `public_note` | `text` | YES | — | — |
| `payment_provider_settings` | `direct_bank_name` | `text` | YES | — | — |
| `payment_provider_settings` | `direct_account_name` | `text` | YES | — | — |
| `payment_provider_settings` | `direct_account_number` | `text` | YES | — | — |
| `payment_provider_settings` | `direct_instructions` | `text` | YES | — | — |
| `payment_provider_settings` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `payroll_items` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `payroll_items` | `payroll_run_id` | `uuid` | NO | — | — |
| `payroll_items` | `staff_record_id` | `uuid` | NO | — | — |
| `payroll_items` | `gross_pay` | `numeric` | NO | 0 | — |
| `payroll_items` | `deductions` | `numeric` | NO | 0 | — |
| `payroll_items` | `net_pay` | `numeric` | NO | 0 | — |
| `payroll_runs` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `payroll_runs` | `school_id` | `uuid` | YES | — | — |
| `payroll_runs` | `organisation_id` | `uuid` | YES | — | — |
| `payroll_runs` | `period_start` | `date` | NO | — | — |
| `payroll_runs` | `period_end` | `date` | NO | — | — |
| `payroll_runs` | `status` | `text` | NO | 'draft'::text | — |
| `payroll_runs` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `person_signatures` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `person_signatures` | `person_id` | `uuid` | NO | — | — |
| `person_signatures` | `school_id` | `uuid` | YES | — | — |
| `person_signatures` | `label` | `text` | YES | — | — |
| `person_signatures` | `url` | `text` | YES | — | — |
| `person_signatures` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `premium_service_grants` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `premium_service_grants` | `email` | `text` | NO | — | — |
| `premium_service_grants` | `user_id` | `uuid` | YES | — | — |
| `premium_service_grants` | `service_code` | `text` | NO | — | — |
| `premium_service_grants` | `granted_by` | `uuid` | NO | — | — |
| `premium_service_grants` | `enabled` | `boolean` | NO | true | — |
| `premium_service_grants` | `notes` | `text` | YES | — | — |
| `premium_service_grants` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `premium_service_grants` | `revoked_at` | `timestamp with time zone` | YES | — | — |
| `profiles` | `id` | `uuid` | NO | — | — |
| `profiles` | `email` | `text` | YES | — | — |
| `profiles` | `full_name` | `text` | YES | — | — |
| `profiles` | `role` | `text` | NO | 'user'::text | — |
| `profiles` | `account_type` | `text` | NO | 'adult'::text | — |
| `profiles` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `profiles` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `profiles` | `account_category` | `text` | NO | 'individual'::text | — |
| `profiles` | `onboarding_role` | `text` | NO | 'individual'::text | — |
| `profiles` | `avatar_url` | `text` | YES | — | — |
| `profiles` | `passport_url` | `text` | YES | — | — |
| `profiles` | `phenom_user_id` | `text` | NO | — | — |
| `profiles` | `preferred_locale` | `text` | NO | 'en-NG'::text | — |
| `profiles` | `learning_locale` | `text` | YES | — | — |
| `profiles` | `support_locale` | `text` | YES | — | — |
| `profiles` | `parent_email` | `text` | YES | — | — |
| `profiles` | `first_name` | `text` | YES | — | — |
| `profiles` | `middle_name` | `text` | YES | — | — |
| `profiles` | `surname` | `text` | YES | — | — |
| `profiles` | `phone` | `text` | YES | — | — |
| `profiles` | `date_of_birth` | `date` | YES | — | — |
| `profiles` | `gender` | `text` | YES | — | — |
| `profiles` | `country` | `text` | YES | — | — |
| `profiles` | `state_region` | `text` | YES | — | — |
| `profiles` | `city` | `text` | YES | — | — |
| `profiles` | `address` | `text` | YES | — | — |
| `quiz_assignments` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `quiz_assignments` | `quiz_id` | `uuid` | NO | — | — |
| `quiz_assignments` | `teacher_id` | `uuid` | YES | — | — |
| `quiz_assignments` | `class_id` | `uuid` | YES | — | — |
| `quiz_assignments` | `student_id` | `uuid` | YES | — | — |
| `quiz_assignments` | `assigned_at` | `timestamp with time zone` | NO | now() | — |
| `quiz_assignments` | `assignment_mode` | `text` | NO | 'teacher_assigned'::text | — |
| `quiz_attempts` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `quiz_attempts` | `quiz_id` | `uuid` | NO | — | — |
| `quiz_attempts` | `student_id` | `uuid` | NO | — | — |
| `quiz_attempts` | `attempt_no` | `integer` | NO | — | — |
| `quiz_attempts` | `answers` | `jsonb` | NO | '{}'::jsonb | — |
| `quiz_attempts` | `score` | `numeric` | YES | — | — |
| `quiz_attempts` | `correct_count` | `integer` | YES | — | — |
| `quiz_attempts` | `feedback` | `jsonb` | NO | '{}'::jsonb | — |
| `quiz_attempts` | `started_at` | `timestamp with time zone` | YES | — | — |
| `quiz_attempts` | `submitted_at` | `timestamp with time zone` | YES | — | — |
| `quiz_questions` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `quiz_questions` | `quiz_id` | `uuid` | NO | — | — |
| `quiz_questions` | `position` | `integer` | NO | — | — |
| `quiz_questions` | `question_text` | `text` | NO | — | — |
| `quiz_questions` | `options` | `jsonb` | YES | — | — |
| `quiz_questions` | `image_url` | `text` | YES | — | — |
| `quiz_questions` | `correct_answer` | `text` | NO | — | — |
| `quiz_questions` | `explanation` | `text` | YES | — | — |
| `result_deletion_audit` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `result_deletion_audit` | `school_id` | `uuid` | NO | — | — |
| `result_deletion_audit` | `result_entry_id` | `uuid` | NO | — | — |
| `result_deletion_audit` | `deleted_by` | `uuid` | NO | — | — |
| `result_deletion_audit` | `reason` | `text` | NO | — | — |
| `result_deletion_audit` | `deleted_at` | `timestamp with time zone` | NO | now() | — |
| `result_release_notifications` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `result_release_notifications` | `publication_id` | `uuid` | NO | — | — |
| `result_release_notifications` | `recipient_id` | `uuid` | NO | — | — |
| `result_release_notifications` | `recipient_type` | `text` | NO | — | — |
| `result_release_notifications` | `email` | `text` | NO | — | — |
| `result_release_notifications` | `status` | `text` | NO | 'queued'::text | — |
| `result_release_notifications` | `sent_at` | `timestamp with time zone` | YES | — | — |
| `result_release_notifications` | `error_message` | `text` | YES | — | — |
| `result_release_notifications` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `safety_alerts` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `safety_alerts` | `user_id` | `uuid` | NO | — | — |
| `safety_alerts` | `category` | `text` | NO | — | — |
| `safety_alerts` | `description` | `text` | YES | — | — |
| `safety_alerts` | `status` | `text` | NO | 'open'::text | — |
| `safety_alerts` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_academic_sessions` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_academic_sessions` | `school_id` | `uuid` | NO | — | — |
| `school_academic_sessions` | `name` | `text` | NO | — | — |
| `school_academic_sessions` | `starts_on` | `date` | YES | — | — |
| `school_academic_sessions` | `ends_on` | `date` | YES | — | — |
| `school_academic_sessions` | `active` | `boolean` | NO | false | — |
| `school_academic_sessions` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_announcements` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_announcements` | `school_id` | `uuid` | NO | — | — |
| `school_announcements` | `title` | `text` | NO | — | — |
| `school_announcements` | `body` | `text` | NO | — | — |
| `school_announcements` | `published` | `boolean` | NO | false | — |
| `school_announcements` | `starts_at` | `timestamp with time zone` | YES | — | — |
| `school_announcements` | `ends_at` | `timestamp with time zone` | YES | — | — |
| `school_announcements` | `created_by` | `uuid` | YES | — | — |
| `school_announcements` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_assessment_scales` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_assessment_scales` | `school_id` | `uuid` | NO | — | — |
| `school_assessment_scales` | `name` | `text` | NO | — | — |
| `school_assessment_scales` | `minimum_value` | `integer` | NO | 1 | — |
| `school_assessment_scales` | `maximum_value` | `integer` | NO | 5 | — |
| `school_assessment_scales` | `labels` | `jsonb` | NO | '{}'::jsonb | — |
| `school_assessment_traits` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_assessment_traits` | `school_id` | `uuid` | NO | — | — |
| `school_assessment_traits` | `name` | `text` | NO | — | — |
| `school_assessment_traits` | `category` | `text` | NO | — | — |
| `school_assessment_traits` | `active` | `boolean` | NO | true | — |
| `school_assessment_traits` | `sequence_no` | `integer` | NO | 1 | — |
| `school_assignment_items` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_assignment_items` | `task_id` | `uuid` | NO | — | — |
| `school_assignment_items` | `position` | `integer` | NO | — | — |
| `school_assignment_items` | `question_text` | `text` | NO | — | — |
| `school_assignment_items` | `options` | `jsonb` | NO | '[]'::jsonb | — |
| `school_assignment_items` | `correct_answer` | `text` | NO | — | — |
| `school_assignment_items` | `explanation` | `text` | YES | — | — |
| `school_assignment_items` | `image_url` | `text` | YES | — | — |
| `school_assignment_items` | `marks` | `numeric` | NO | 1 | — |
| `school_assignment_items` | `source_type` | `text` | YES | — | — |
| `school_assignment_items` | `source_id` | `uuid` | YES | — | — |
| `school_assignment_items` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_assignment_items` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `school_assignment_submissions` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_assignment_submissions` | `task_id` | `uuid` | NO | — | — |
| `school_assignment_submissions` | `student_id` | `uuid` | NO | — | — |
| `school_assignment_submissions` | `answer_text` | `text` | YES | — | — |
| `school_assignment_submissions` | `attachment_urls` | `jsonb` | NO | '[]'::jsonb | — |
| `school_assignment_submissions` | `score` | `numeric` | YES | — | — |
| `school_assignment_submissions` | `teacher_feedback` | `text` | YES | — | — |
| `school_assignment_submissions` | `submitted_at` | `timestamp with time zone` | YES | — | — |
| `school_assignment_submissions` | `graded_at` | `timestamp with time zone` | YES | — | — |
| `school_assignment_targets` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_assignment_targets` | `task_id` | `uuid` | NO | — | — |
| `school_assignment_targets` | `class_id` | `uuid` | YES | — | — |
| `school_assignment_targets` | `student_id` | `uuid` | YES | — | — |
| `school_assignment_targets` | `target_mode` | `text` | NO | 'include'::text | — |
| `school_assignment_targets` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_assignment_tasks` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_assignment_tasks` | `school_id` | `uuid` | NO | — | — |
| `school_assignment_tasks` | `teacher_id` | `uuid` | NO | — | — |
| `school_assignment_tasks` | `class_id` | `uuid` | NO | — | — |
| `school_assignment_tasks` | `subject_id` | `uuid` | YES | — | — |
| `school_assignment_tasks` | `level_label` | `text` | YES | — | — |
| `school_assignment_tasks` | `topic` | `text` | NO | — | — |
| `school_assignment_tasks` | `title` | `text` | NO | — | — |
| `school_assignment_tasks` | `instructions` | `text` | YES | — | — |
| `school_assignment_tasks` | `due_at` | `timestamp with time zone` | YES | — | — |
| `school_assignment_tasks` | `status` | `text` | NO | 'draft'::text | — |
| `school_assignment_tasks` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_assignment_tasks` | `assignment_type` | `text` | NO | 'auto_graded'::text | — |
| `school_assignment_tasks` | `source_type` | `text` | YES | — | — |
| `school_assignment_tasks` | `source_id` | `uuid` | YES | — | — |
| `school_assignment_tasks` | `results_visible_immediately` | `boolean` | NO | true | — |
| `school_assignment_tasks` | `duration_minutes` | `integer` | YES | — | — |
| `school_assignment_tasks` | `randomise_questions` | `boolean` | NO | false | — |
| `school_attendance_settings` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_attendance_settings` | `school_id` | `uuid` | NO | — | — |
| `school_attendance_settings` | `checkpoint_mode` | `text` | NO | 'daily'::text | — |
| `school_attendance_settings` | `morning_open` | `time without time zone` | YES | — | — |
| `school_attendance_settings` | `closing_time` | `time without time zone` | YES | — | — |
| `school_attendance_settings` | `late_after` | `time without time zone` | YES | — | — |
| `school_attendance_settings` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_calendar_events` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_calendar_events` | `school_id` | `uuid` | NO | — | — |
| `school_calendar_events` | `title` | `text` | NO | — | — |
| `school_calendar_events` | `description` | `text` | YES | — | — |
| `school_calendar_events` | `event_type` | `text` | NO | 'academic'::text | — |
| `school_calendar_events` | `starts_at` | `timestamp with time zone` | NO | — | — |
| `school_calendar_events` | `ends_at` | `timestamp with time zone` | YES | — | — |
| `school_calendar_events` | `location` | `text` | YES | — | — |
| `school_calendar_events` | `created_by` | `uuid` | YES | — | — |
| `school_calendar_events` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_cbt_attempts` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_cbt_attempts` | `exam_id` | `uuid` | NO | — | — |
| `school_cbt_attempts` | `student_id` | `uuid` | NO | — | — |
| `school_cbt_attempts` | `attempt_no` | `integer` | NO | — | — |
| `school_cbt_attempts` | `answers` | `jsonb` | NO | '{}'::jsonb | — |
| `school_cbt_attempts` | `score` | `numeric` | YES | — | — |
| `school_cbt_attempts` | `correct_count` | `integer` | YES | — | — |
| `school_cbt_attempts` | `feedback` | `jsonb` | NO | '{}'::jsonb | — |
| `school_cbt_attempts` | `started_at` | `timestamp with time zone` | YES | — | — |
| `school_cbt_attempts` | `submitted_at` | `timestamp with time zone` | YES | — | — |
| `school_cbt_exam_assignments` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_cbt_exam_assignments` | `exam_id` | `uuid` | NO | — | — |
| `school_cbt_exam_assignments` | `school_id` | `uuid` | NO | — | — |
| `school_cbt_exam_assignments` | `student_id` | `uuid` | NO | — | — |
| `school_cbt_exam_assignments` | `assigned_by` | `uuid` | NO | — | — |
| `school_cbt_exam_assignments` | `assigned_at` | `timestamp with time zone` | NO | now() | — |
| `school_cbt_exam_attempts` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_cbt_exam_attempts` | `exam_id` | `uuid` | NO | — | — |
| `school_cbt_exam_attempts` | `assignment_id` | `uuid` | NO | — | — |
| `school_cbt_exam_attempts` | `school_id` | `uuid` | NO | — | — |
| `school_cbt_exam_attempts` | `student_id` | `uuid` | NO | — | — |
| `school_cbt_exam_attempts` | `attempt_no` | `integer` | NO | 1 | — |
| `school_cbt_exam_attempts` | `answers` | `jsonb` | NO | '{}'::jsonb | — |
| `school_cbt_exam_attempts` | `score` | `numeric` | YES | — | — |
| `school_cbt_exam_attempts` | `correct_count` | `integer` | YES | — | — |
| `school_cbt_exam_attempts` | `total_marks` | `numeric` | YES | — | — |
| `school_cbt_exam_attempts` | `started_at` | `timestamp with time zone` | NO | now() | — |
| `school_cbt_exam_attempts` | `submitted_at` | `timestamp with time zone` | YES | — | — |
| `school_cbt_exam_attempts` | `status` | `text` | NO | 'in_progress'::text | — |
| `school_cbt_exam_media` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_cbt_exam_media` | `school_id` | `uuid` | NO | — | — |
| `school_cbt_exam_media` | `exam_id` | `uuid` | NO | — | — |
| `school_cbt_exam_media` | `question_id` | `uuid` | YES | — | — |
| `school_cbt_exam_media` | `uploaded_by` | `uuid` | NO | — | — |
| `school_cbt_exam_media` | `storage_bucket` | `text` | NO | 'school-cbt-media'::text | — |
| `school_cbt_exam_media` | `storage_path` | `text` | NO | — | — |
| `school_cbt_exam_media` | `media_type` | `text` | NO | — | — |
| `school_cbt_exam_media` | `mime_type` | `text` | YES | — | — |
| `school_cbt_exam_media` | `file_size` | `bigint` | YES | — | — |
| `school_cbt_exam_media` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_cbt_exam_questions` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_cbt_exam_questions` | `exam_id` | `uuid` | NO | — | — |
| `school_cbt_exam_questions` | `position` | `integer` | NO | — | — |
| `school_cbt_exam_questions` | `question_text` | `text` | NO | — | — |
| `school_cbt_exam_questions` | `options` | `jsonb` | YES | — | — |
| `school_cbt_exam_questions` | `correct_answer` | `text` | YES | — | — |
| `school_cbt_exam_questions` | `explanation` | `text` | YES | — | — |
| `school_cbt_exam_questions` | `image_url` | `text` | YES | — | — |
| `school_cbt_exam_questions` | `marks` | `numeric` | NO | 1 | — |
| `school_cbt_exam_questions` | `media` | `jsonb` | NO | '[]'::jsonb | — |
| `school_cbt_exam_questions` | `resource_notes` | `text` | YES | — | — |
| `school_cbt_exam_questions_student` | `id` | `uuid` | NO | — | — |
| `school_cbt_exam_questions_student` | `exam_id` | `uuid` | NO | — | — |
| `school_cbt_exam_questions_student` | `position` | `integer` | NO | — | — |
| `school_cbt_exam_questions_student` | `question_text` | `text` | NO | — | — |
| `school_cbt_exam_questions_student` | `options` | `jsonb` | YES | — | — |
| `school_cbt_exam_questions_student` | `image_url` | `text` | YES | — | — |
| `school_cbt_exam_questions_student` | `media` | `jsonb` | NO | '[]'::jsonb | — |
| `school_cbt_exam_questions_student` | `marks` | `numeric` | NO | 1 | — |
| `school_cbt_exams` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_cbt_exams` | `school_id` | `uuid` | NO | — | — |
| `school_cbt_exams` | `class_id` | `uuid` | NO | — | — |
| `school_cbt_exams` | `teacher_id` | `uuid` | NO | — | — |
| `school_cbt_exams` | `title` | `text` | NO | — | — |
| `school_cbt_exams` | `subject` | `text` | NO | — | — |
| `school_cbt_exams` | `topic` | `text` | YES | — | — |
| `school_cbt_exams` | `question_count` | `integer` | NO | 10 | — |
| `school_cbt_exams` | `duration_minutes` | `integer` | YES | — | — |
| `school_cbt_exams` | `starts_at` | `timestamp with time zone` | YES | — | — |
| `school_cbt_exams` | `ends_at` | `timestamp with time zone` | YES | — | — |
| `school_cbt_exams` | `one_attempt` | `boolean` | NO | true | — |
| `school_cbt_exams` | `allow_redo` | `boolean` | NO | true | — |
| `school_cbt_exams` | `results_visible_to_students` | `boolean` | NO | false | — |
| `school_cbt_exams` | `status` | `text` | NO | 'draft'::text | — |
| `school_cbt_exams` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_cbt_exams` | `instructions` | `text` | YES | — | — |
| `school_cbt_exams` | `created_by` | `uuid` | YES | — | — |
| `school_cbt_exams` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `school_cbt_question_resources` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_cbt_question_resources` | `school_id` | `uuid` | NO | — | — |
| `school_cbt_question_resources` | `exam_id` | `uuid` | NO | — | — |
| `school_cbt_question_resources` | `question_id` | `uuid` | NO | — | — |
| `school_cbt_question_resources` | `library_item_id` | `uuid` | NO | — | — |
| `school_cbt_question_resources` | `relation_type` | `text` | NO | 'supporting_resource'::text | — |
| `school_cbt_question_resources` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_classes` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_classes` | `school_id` | `uuid` | NO | — | — |
| `school_classes` | `name` | `text` | NO | — | — |
| `school_classes` | `level_label` | `text` | YES | — | — |
| `school_classes` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_classes` | `class_teacher_id` | `uuid` | YES | — | — |
| `school_curricula` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_curricula` | `school_id` | `uuid` | NO | — | — |
| `school_curricula` | `curriculum_id` | `text` | NO | — | — |
| `school_curricula` | `priority` | `smallint` | NO | 1 | — |
| `school_curricula` | `state_or_region` | `text` | YES | — | — |
| `school_curricula` | `enabled` | `boolean` | NO | true | — |
| `school_curricula` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_election_candidates` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_election_candidates` | `position_id` | `uuid` | NO | — | — |
| `school_election_candidates` | `student_id` | `uuid` | NO | — | — |
| `school_election_candidates` | `manifesto` | `text` | YES | — | — |
| `school_election_positions` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_election_positions` | `election_id` | `uuid` | NO | — | — |
| `school_election_positions` | `title` | `text` | NO | — | — |
| `school_election_positions` | `sequence_no` | `integer` | NO | 1 | — |
| `school_election_voters` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_election_voters` | `election_id` | `uuid` | NO | — | — |
| `school_election_voters` | `voter_id` | `uuid` | NO | — | — |
| `school_election_voters` | `verified_at` | `timestamp with time zone` | YES | — | — |
| `school_election_votes` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_election_votes` | `election_id` | `uuid` | NO | — | — |
| `school_election_votes` | `position_id` | `uuid` | NO | — | — |
| `school_election_votes` | `candidate_id` | `uuid` | NO | — | — |
| `school_election_votes` | `voter_id` | `uuid` | NO | — | — |
| `school_election_votes` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_elections` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_elections` | `school_id` | `uuid` | NO | — | — |
| `school_elections` | `title` | `text` | NO | — | — |
| `school_elections` | `starts_at` | `timestamp with time zone` | YES | — | — |
| `school_elections` | `ends_at` | `timestamp with time zone` | YES | — | — |
| `school_elections` | `results_visible` | `boolean` | NO | false | — |
| `school_elections` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_fee_payments` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_fee_payments` | `school_id` | `uuid` | NO | — | — |
| `school_fee_payments` | `student_id` | `uuid` | NO | — | — |
| `school_fee_payments` | `amount` | `numeric` | NO | — | — |
| `school_fee_payments` | `currency` | `text` | NO | 'NGN'::text | — |
| `school_fee_payments` | `provider` | `text` | YES | — | — |
| `school_fee_payments` | `status` | `text` | NO | 'pending'::text | — |
| `school_fee_payments` | `reference` | `text` | YES | — | — |
| `school_fee_payments` | `paid_at` | `timestamp with time zone` | YES | — | — |
| `school_fee_payments` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_fee_schedules` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_fee_schedules` | `school_id` | `uuid` | NO | — | — |
| `school_fee_schedules` | `name` | `text` | NO | — | — |
| `school_fee_schedules` | `amount` | `numeric` | NO | 0 | — |
| `school_fee_schedules` | `currency` | `text` | NO | 'NGN'::text | — |
| `school_fee_schedules` | `active` | `boolean` | NO | true | — |
| `school_fee_schedules` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_id_card_templates` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_id_card_templates` | `school_id` | `uuid` | NO | — | — |
| `school_id_card_templates` | `name` | `text` | NO | — | — |
| `school_id_card_templates` | `paper_size` | `text` | NO | 'ID-1'::text | — |
| `school_id_card_templates` | `design` | `jsonb` | NO | '{}'::jsonb | — |
| `school_id_card_templates` | `active` | `boolean` | NO | true | — |
| `school_member_invites` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_member_invites` | `school_id` | `uuid` | NO | — | — |
| `school_member_invites` | `email` | `text` | NO | — | — |
| `school_member_invites` | `full_name` | `text` | NO | ''::text | — |
| `school_member_invites` | `requested_role` | `text` | NO | — | — |
| `school_member_invites` | `status` | `text` | NO | 'pending'::text | — |
| `school_member_invites` | `invited_by` | `uuid` | YES | — | — |
| `school_member_invites` | `invited_user_id` | `uuid` | YES | — | — |
| `school_member_invites` | `invite_token` | `text` | YES | — | — |
| `school_member_invites` | `sent_at` | `timestamp with time zone` | YES | — | — |
| `school_member_invites` | `accepted_at` | `timestamp with time zone` | YES | — | — |
| `school_member_invites` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_member_invites` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `school_members` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_members` | `school_id` | `uuid` | NO | — | — |
| `school_members` | `user_id` | `uuid` | NO | — | — |
| `school_members` | `role` | `text` | NO | — | — |
| `school_members` | `status` | `text` | NO | 'active'::text | — |
| `school_members` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_profile_fields` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_profile_fields` | `school_id` | `uuid` | NO | — | — |
| `school_profile_fields` | `category` | `text` | NO | — | — |
| `school_profile_fields` | `field_code` | `text` | NO | — | — |
| `school_profile_fields` | `field_label` | `text` | NO | — | — |
| `school_profile_fields` | `enabled` | `boolean` | NO | true | — |
| `school_profile_fields` | `required` | `boolean` | NO | false | — |
| `school_profile_fields` | `sequence_no` | `integer` | NO | 1 | — |
| `school_receipts` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_receipts` | `school_id` | `uuid` | NO | — | — |
| `school_receipts` | `student_id` | `uuid` | YES | — | — |
| `school_receipts` | `payment_id` | `uuid` | YES | — | — |
| `school_receipts` | `receipt_number` | `text` | NO | — | — |
| `school_receipts` | `amount` | `numeric` | NO | — | — |
| `school_receipts` | `currency` | `text` | NO | 'NGN'::text | — |
| `school_receipts` | `paper_size` | `text` | NO | 'A5'::text | — |
| `school_receipts` | `issued_at` | `timestamp with time zone` | NO | now() | — |
| `school_result_components` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_result_components` | `school_id` | `uuid` | NO | — | — |
| `school_result_components` | `name` | `text` | NO | — | — |
| `school_result_components` | `code` | `text` | NO | — | — |
| `school_result_components` | `component_type` | `text` | NO | — | — |
| `school_result_components` | `max_score` | `numeric` | NO | 100 | — |
| `school_result_components` | `weight` | `numeric` | NO | 0 | — |
| `school_result_components` | `sequence_no` | `integer` | NO | 1 | — |
| `school_result_components` | `term_no` | `integer` | NO | 1 | — |
| `school_result_components` | `active` | `boolean` | NO | true | — |
| `school_result_components` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_result_publications` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_result_publications` | `school_id` | `uuid` | NO | — | — |
| `school_result_publications` | `session_id` | `uuid` | NO | — | — |
| `school_result_publications` | `term_no` | `integer` | NO | — | — |
| `school_result_publications` | `class_id` | `uuid` | NO | — | — |
| `school_result_publications` | `student_id` | `uuid` | NO | — | — |
| `school_result_publications` | `published_by` | `uuid` | YES | — | — |
| `school_result_publications` | `published_at` | `timestamp with time zone` | NO | now() | — |
| `school_result_publications` | `published` | `boolean` | NO | false | — |
| `school_result_publications` | `download_enabled` | `boolean` | NO | false | — |
| `school_sensitive_access` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_sensitive_access` | `school_id` | `uuid` | NO | — | — |
| `school_sensitive_access` | `class_id` | `uuid` | NO | — | — |
| `school_sensitive_access` | `enabled` | `boolean` | NO | false | — |
| `school_sensitive_access` | `enabled_by` | `uuid` | YES | — | — |
| `school_sensitive_access` | `enabled_at` | `timestamp with time zone` | YES | — | — |
| `school_subjects` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_subjects` | `school_id` | `uuid` | NO | — | — |
| `school_subjects` | `name` | `text` | NO | — | — |
| `school_subjects` | `code` | `text` | YES | — | — |
| `school_subjects` | `active` | `boolean` | NO | true | — |
| `school_subjects` | `sequence_no` | `integer` | NO | 1 | — |
| `school_subjects` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `school_terms` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `school_terms` | `session_id` | `uuid` | NO | — | — |
| `school_terms` | `term_no` | `integer` | NO | — | — |
| `school_terms` | `name` | `text` | NO | — | — |
| `school_terms` | `starts_on` | `date` | YES | — | — |
| `school_terms` | `ends_on` | `date` | YES | — | — |
| `school_terms` | `entry_open` | `boolean` | NO | true | — |
| `school_terms` | `results_published` | `boolean` | NO | false | — |
| `school_terms` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `schools` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `schools` | `name` | `text` | NO | — | — |
| `schools` | `logo_url` | `text` | YES | — | — |
| `schools` | `primary_color` | `text` | YES | — | — |
| `schools` | `country` | `text` | YES | — | — |
| `schools` | `currency` | `text` | YES | — | — |
| `schools` | `active` | `boolean` | NO | true | — |
| `schools` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `schools` | `category` | `text` | NO | 'school'::text | — |
| `schools` | `logo_alt_text` | `text` | YES | — | — |
| `schools` | `accent_color` | `text` | YES | — | — |
| `schools` | `secondary_color` | `text` | YES | — | — |
| `schools` | `report_card_title` | `text` | YES | — | — |
| `schools` | `active_session` | `text` | YES | — | — |
| `schools` | `teacher_signature_url` | `text` | YES | — | — |
| `schools` | `head_signature_url` | `text` | YES | — | — |
| `schools` | `report_footer` | `text` | YES | — | — |
| `schools` | `legal_name` | `text` | YES | — | — |
| `schools` | `address` | `text` | YES | — | — |
| `schools` | `phone` | `text` | YES | — | — |
| `schools` | `email` | `text` | YES | — | — |
| `schools` | `website` | `text` | YES | — | — |
| `schools` | `motto` | `text` | YES | — | — |
| `schools` | `report_header` | `text` | YES | — | — |
| `service_consents` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `service_consents` | `user_id` | `uuid` | NO | — | — |
| `service_consents` | `service_code` | `text` | NO | — | — |
| `service_consents` | `policy_version` | `text` | NO | — | — |
| `service_consents` | `consented_at` | `timestamp with time zone` | NO | now() | — |
| `service_enquiries` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `service_enquiries` | `user_id` | `uuid` | YES | — | — |
| `service_enquiries` | `service` | `text` | NO | — | — |
| `service_enquiries` | `message` | `text` | NO | — | — |
| `service_enquiries` | `status` | `text` | NO | 'open'::text | — |
| `service_enquiries` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `service_enquiries` | `preferred_contact` | `text` | YES | — | — |
| `site_announcements` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `site_announcements` | `title` | `text` | NO | — | — |
| `site_announcements` | `body` | `text` | NO | — | — |
| `site_announcements` | `link_url` | `text` | YES | — | — |
| `site_announcements` | `published` | `boolean` | NO | false | — |
| `site_announcements` | `floating` | `boolean` | NO | true | — |
| `site_announcements` | `starts_at` | `timestamp with time zone` | YES | — | — |
| `site_announcements` | `ends_at` | `timestamp with time zone` | YES | — | — |
| `site_announcements` | `created_by` | `uuid` | YES | — | — |
| `site_announcements` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `site_settings` | `id` | `integer` | NO | 1 | — |
| `site_settings` | `background` | `text` | NO | '#f4efe6'::text | — |
| `site_settings` | `surface` | `text` | NO | '#fbf8f2'::text | — |
| `site_settings` | `accent` | `text` | NO | '#c94b16'::text | — |
| `site_settings` | `accent2` | `text` | NO | '#1a4a8c'::text | — |
| `site_settings` | `text` | `text` | NO | '#152238'::text | — |
| `site_settings` | `muted` | `text` | NO | '#4c5d73'::text | — |
| `site_settings` | `animation` | `text` | NO | 'refined'::text | — |
| `site_settings` | `logo_url` | `text` | NO | '/brand/academy-logo-primary.png'::text | — |
| `site_settings` | `background_mode` | `text` | NO | 'solid'::text | — |
| `site_settings` | `background_image_url` | `text` | YES | — | — |
| `site_settings` | `gradient_start` | `text` | NO | '#f4efe6'::text | — |
| `site_settings` | `gradient_end` | `text` | NO | '#fbf8f2'::text | — |
| `site_settings` | `gradient_angle` | `integer` | NO | 135 | — |
| `site_settings` | `pattern` | `text` | NO | 'none'::text | — |
| `site_settings` | `font_scale` | `numeric` | NO | 1 | — |
| `site_settings` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `staff_pay_structures` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `staff_pay_structures` | `staff_record_id` | `uuid` | NO | — | — |
| `staff_pay_structures` | `basic_salary` | `numeric` | NO | 0 | — |
| `staff_pay_structures` | `allowances` | `jsonb` | NO | '{}'::jsonb | — |
| `staff_pay_structures` | `deductions` | `jsonb` | NO | '{}'::jsonb | — |
| `staff_pay_structures` | `effective_from` | `date` | YES | — | — |
| `staff_pay_structures` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `staff_records` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `staff_records` | `school_id` | `uuid` | YES | — | — |
| `staff_records` | `staff_user_id` | `uuid` | YES | — | — |
| `staff_records` | `organisation_id` | `uuid` | YES | — | — |
| `staff_records` | `job_title` | `text` | YES | — | — |
| `staff_records` | `department` | `text` | YES | — | — |
| `staff_records` | `employment_status` | `text` | NO | 'active'::text | — |
| `staff_records` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `student_attendance` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `student_attendance` | `school_id` | `uuid` | NO | — | — |
| `student_attendance` | `student_id` | `uuid` | NO | — | — |
| `student_attendance` | `attendance_date` | `date` | NO | — | — |
| `student_attendance` | `arrival_time` | `timestamp with time zone` | YES | — | — |
| `student_attendance` | `departure_time` | `timestamp with time zone` | YES | — | — |
| `student_attendance` | `status` | `text` | NO | 'present'::text | — |
| `student_attendance` | `note` | `text` | YES | — | — |
| `student_attendance` | `recorded_by` | `uuid` | YES | — | — |
| `student_attendance` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `student_attendance` | `session_id` | `uuid` | YES | — | — |
| `student_attendance` | `term_no` | `integer` | YES | — | — |
| `student_attendance` | `class_id` | `uuid` | YES | — | — |
| `student_attendance` | `checkpoint` | `text` | YES | 'arrival'::text | — |
| `student_attendance` | `recorded_at` | `timestamp with time zone` | YES | — | — |
| `student_attendance` | `manual_override` | `boolean` | NO | false | — |
| `student_attendance` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `student_class_history` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `student_class_history` | `school_id` | `uuid` | NO | — | — |
| `student_class_history` | `student_id` | `uuid` | NO | — | — |
| `student_class_history` | `class_id` | `uuid` | NO | — | — |
| `student_class_history` | `previous_class_id` | `uuid` | YES | — | — |
| `student_class_history` | `session_id` | `uuid` | YES | — | — |
| `student_class_history` | `term_no` | `integer` | YES | — | — |
| `student_class_history` | `action` | `text` | NO | — | — |
| `student_class_history` | `effective_on` | `date` | NO | CURRENT_DATE | — |
| `student_class_history` | `reason` | `text` | YES | — | — |
| `student_class_history` | `recorded_by` | `uuid` | YES | — | — |
| `student_class_history` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `student_emergency_profiles` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `student_emergency_profiles` | `school_id` | `uuid` | NO | — | — |
| `student_emergency_profiles` | `student_id` | `uuid` | NO | — | — |
| `student_emergency_profiles` | `emergency_name` | `text` | YES | — | — |
| `student_emergency_profiles` | `emergency_phone` | `text` | YES | — | — |
| `student_emergency_profiles` | `medical_notes` | `text` | YES | — | — |
| `student_emergency_profiles` | `allergies` | `text` | YES | — | — |
| `student_emergency_profiles` | `emergency_instructions` | `text` | YES | — | — |
| `student_emergency_profiles` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `student_fee_adjustments` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `student_fee_adjustments` | `school_id` | `uuid` | NO | — | — |
| `student_fee_adjustments` | `student_id` | `uuid` | NO | — | — |
| `student_fee_adjustments` | `amount` | `numeric` | NO | — | — |
| `student_fee_adjustments` | `reason` | `text` | YES | — | — |
| `student_fee_adjustments` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `student_growth_records` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `student_growth_records` | `school_id` | `uuid` | NO | — | — |
| `student_growth_records` | `student_id` | `uuid` | NO | — | — |
| `student_growth_records` | `recorded_on` | `date` | NO | — | — |
| `student_growth_records` | `height_cm` | `numeric` | YES | — | — |
| `student_growth_records` | `weight_kg` | `numeric` | YES | — | — |
| `student_growth_records` | `notes` | `text` | YES | — | — |
| `student_growth_records` | `recorded_by` | `uuid` | YES | — | — |
| `student_growth_records` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `student_guardians` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `student_guardians` | `school_id` | `uuid` | NO | — | — |
| `student_guardians` | `student_id` | `uuid` | NO | — | — |
| `student_guardians` | `guardian_name` | `text` | NO | — | — |
| `student_guardians` | `relationship` | `text` | YES | — | — |
| `student_guardians` | `phone` | `text` | YES | — | — |
| `student_guardians` | `email` | `text` | YES | — | — |
| `student_guardians` | `address` | `text` | YES | — | — |
| `student_guardians` | `pickup_authorised` | `boolean` | NO | false | — |
| `student_guardians` | `consent_notes` | `text` | YES | — | — |
| `student_guardians` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `student_result_entries` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `student_result_entries` | `school_id` | `uuid` | NO | — | — |
| `student_result_entries` | `session_id` | `uuid` | NO | — | — |
| `student_result_entries` | `term_no` | `integer` | NO | — | — |
| `student_result_entries` | `class_id` | `uuid` | NO | — | — |
| `student_result_entries` | `student_id` | `uuid` | NO | — | — |
| `student_result_entries` | `subject_id` | `uuid` | NO | — | — |
| `student_result_entries` | `component_id` | `uuid` | NO | — | — |
| `student_result_entries` | `score` | `numeric` | NO | 0 | — |
| `student_result_entries` | `teacher_comment` | `text` | YES | — | — |
| `student_result_entries` | `entered_by` | `uuid` | YES | — | — |
| `student_result_entries` | `entered_at` | `timestamp with time zone` | NO | now() | — |
| `student_result_entries` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `student_result_entries` | `locked` | `boolean` | NO | false | — |
| `student_school_records` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `student_school_records` | `school_id` | `uuid` | NO | — | — |
| `student_school_records` | `student_id` | `uuid` | NO | — | — |
| `student_school_records` | `admission_number` | `text` | YES | — | — |
| `student_school_records` | `gender` | `text` | YES | — | — |
| `student_school_records` | `date_of_birth` | `date` | YES | — | — |
| `student_school_records` | `status` | `text` | NO | 'active'::text | — |
| `student_school_records` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `student_school_records` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `student_school_records` | `height_cm` | `numeric` | YES | — | — |
| `student_school_records` | `weight_kg` | `numeric` | YES | — | — |
| `student_school_records` | `psychomotor` | `jsonb` | NO | '{}'::jsonb | — |
| `student_school_records` | `performance_information` | `text` | YES | — | — |
| `student_school_status_history` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `student_school_status_history` | `school_id` | `uuid` | NO | — | — |
| `student_school_status_history` | `student_id` | `uuid` | NO | — | — |
| `student_school_status_history` | `previous_status` | `text` | YES | — | — |
| `student_school_status_history` | `new_status` | `text` | NO | — | — |
| `student_school_status_history` | `action` | `text` | NO | — | — |
| `student_school_status_history` | `effective_on` | `date` | NO | CURRENT_DATE | — |
| `student_school_status_history` | `reason` | `text` | YES | — | — |
| `student_school_status_history` | `recorded_by` | `uuid` | YES | — | — |
| `student_school_status_history` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `student_sensitive_records` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `student_sensitive_records` | `school_id` | `uuid` | NO | — | — |
| `student_sensitive_records` | `student_id` | `uuid` | NO | — | — |
| `student_sensitive_records` | `blood_group` | `text` | YES | — | — |
| `student_sensitive_records` | `genotype` | `text` | YES | — | — |
| `student_sensitive_records` | `allergies` | `text` | YES | — | — |
| `student_sensitive_records` | `parent_full_name` | `text` | YES | — | — |
| `student_sensitive_records` | `parent_phone` | `text` | YES | — | — |
| `student_sensitive_records` | `parent_email` | `text` | YES | — | — |
| `student_sensitive_records` | `address` | `text` | YES | — | — |
| `student_sensitive_records` | `notes` | `text` | YES | — | — |
| `student_sensitive_records` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `student_sensitive_records` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `student_term_summaries` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `student_term_summaries` | `school_id` | `uuid` | NO | — | — |
| `student_term_summaries` | `session_id` | `uuid` | NO | — | — |
| `student_term_summaries` | `term_no` | `integer` | NO | — | — |
| `student_term_summaries` | `class_id` | `uuid` | NO | — | — |
| `student_term_summaries` | `student_id` | `uuid` | NO | — | — |
| `student_term_summaries` | `subject_id` | `uuid` | NO | — | — |
| `student_term_summaries` | `ca_total` | `numeric` | YES | — | — |
| `student_term_summaries` | `test_total` | `numeric` | YES | — | — |
| `student_term_summaries` | `midterm_total` | `numeric` | YES | — | — |
| `student_term_summaries` | `exam_total` | `numeric` | YES | — | — |
| `student_term_summaries` | `term_total` | `numeric` | YES | — | — |
| `student_term_summaries` | `term_percentage` | `numeric` | YES | — | — |
| `student_term_summaries` | `first_term_brought_forward` | `numeric` | YES | — | — |
| `student_term_summaries` | `cumulative_percentage` | `numeric` | YES | — | — |
| `student_term_summaries` | `class_average` | `numeric` | YES | — | — |
| `student_term_summaries` | `performance_note` | `text` | YES | — | — |
| `student_term_summaries` | `generated_at` | `timestamp with time zone` | NO | now() | — |
| `student_trait_assessments` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `student_trait_assessments` | `school_id` | `uuid` | NO | — | — |
| `student_trait_assessments` | `student_id` | `uuid` | NO | — | — |
| `student_trait_assessments` | `trait_id` | `uuid` | NO | — | — |
| `student_trait_assessments` | `session_id` | `uuid` | YES | — | — |
| `student_trait_assessments` | `term_no` | `integer` | YES | — | — |
| `student_trait_assessments` | `score` | `numeric` | YES | — | — |
| `student_trait_assessments` | `comment` | `text` | YES | — | — |
| `student_trait_assessments` | `assessed_by` | `uuid` | YES | — | — |
| `student_trait_assessments` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `subscription_feature_grants` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `subscription_feature_grants` | `subscription_id` | `uuid` | NO | — | — |
| `subscription_feature_grants` | `feature_id` | `uuid` | NO | — | — |
| `subscription_feature_grants` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `subscription_features` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `subscription_features` | `code` | `text` | NO | — | — |
| `subscription_features` | `name` | `text` | NO | — | — |
| `subscription_features` | `description` | `text` | YES | — | — |
| `subscription_features` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `subscription_plans` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `subscription_plans` | `code` | `text` | NO | — | — |
| `subscription_plans` | `name` | `text` | NO | — | — |
| `subscription_plans` | `audience` | `text` | NO | 'individual'::text | — |
| `subscription_plans` | `description` | `text` | YES | — | — |
| `subscription_plans` | `price` | `numeric` | NO | 0 | — |
| `subscription_plans` | `currency` | `text` | NO | 'NGN'::text | — |
| `subscription_plans` | `billing_period` | `text` | NO | 'one_time'::text | — |
| `subscription_plans` | `features` | `jsonb` | NO | '[]'::jsonb | — |
| `subscription_plans` | `active` | `boolean` | NO | true | — |
| `subscription_plans` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `subscription_plans` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `subscription_tool_entitlements` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `subscription_tool_entitlements` | `plan_code_pattern` | `text` | NO | — | — |
| `subscription_tool_entitlements` | `service_code` | `text` | NO | — | — |
| `subscription_tool_entitlements` | `enabled` | `boolean` | NO | true | — |
| `subscription_tool_entitlements` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `subscriptions` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `subscriptions` | `user_id` | `uuid` | NO | — | — |
| `subscriptions` | `plan_code` | `text` | NO | — | — |
| `subscriptions` | `provider` | `text` | NO | 'flutterwave'::text | — |
| `subscriptions` | `status` | `text` | NO | 'pending'::text | — |
| `subscriptions` | `started_at` | `timestamp with time zone` | YES | — | — |
| `subscriptions` | `ends_at` | `timestamp with time zone` | YES | — | — |
| `subscriptions` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `subscriptions` | `school_id` | `uuid` | YES | — | — |
| `subscriptions` | `organisation_id` | `uuid` | YES | — | — |
| `subscriptions` | `currency` | `text` | YES | 'NGN'::text | — |
| `subscriptions` | `amount` | `numeric` | YES | — | — |
| `suggestions` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `suggestions` | `user_id` | `uuid` | YES | — | — |
| `suggestions` | `subject` | `text` | NO | — | — |
| `suggestions` | `body` | `text` | NO | — | — |
| `suggestions` | `status` | `text` | NO | 'open'::text | — |
| `suggestions` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `teacher_question_banks` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `teacher_question_banks` | `school_id` | `uuid` | NO | — | — |
| `teacher_question_banks` | `teacher_id` | `uuid` | NO | — | — |
| `teacher_question_banks` | `title` | `text` | NO | — | — |
| `teacher_question_banks` | `subject` | `text` | NO | — | — |
| `teacher_question_banks` | `topic` | `text` | NO | — | — |
| `teacher_question_banks` | `level_label` | `text` | YES | — | — |
| `teacher_question_banks` | `language` | `text` | NO | 'English'::text | — |
| `teacher_question_banks` | `instructions` | `text` | YES | — | — |
| `teacher_question_banks` | `status` | `text` | NO | 'draft'::text | — |
| `teacher_question_banks` | `created_at` | `timestamp with time zone` | NO | now() | — |
| `teacher_question_banks` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `teacher_question_items` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `teacher_question_items` | `bank_id` | `uuid` | NO | — | — |
| `teacher_question_items` | `position` | `integer` | NO | — | — |
| `teacher_question_items` | `question_text` | `text` | NO | — | — |
| `teacher_question_items` | `options` | `jsonb` | YES | — | — |
| `teacher_question_items` | `correct_answer` | `text` | YES | — | — |
| `teacher_question_items` | `explanation` | `text` | YES | — | — |
| `teacher_question_items` | `image_url` | `text` | YES | — | — |
| `teacher_question_items` | `marks` | `numeric` | NO | 1 | — |
| `ui_translation_resources` | `locale` | `text` | NO | — | — |
| `ui_translation_resources` | `resource_key` | `text` | NO | — | — |
| `ui_translation_resources` | `source_text` | `text` | NO | — | — |
| `ui_translation_resources` | `translated_text` | `text` | NO | — | — |
| `ui_translation_resources` | `source_version` | `text` | NO | 'v1'::text | — |
| `ui_translation_resources` | `quality_score` | `numeric` | YES | — | — |
| `ui_translation_resources` | `status` | `text` | NO | 'reviewed'::text | — |
| `ui_translation_resources` | `provider_trace` | `jsonb` | NO | '{}'::jsonb | — |
| `ui_translation_resources` | `updated_at` | `timestamp with time zone` | NO | now() | — |
| `user_notifications` | `id` | `uuid` | NO | gen_random_uuid() | — |
| `user_notifications` | `user_id` | `uuid` | NO | — | — |
| `user_notifications` | `title` | `text` | NO | — | — |
| `user_notifications` | `body` | `text` | NO | — | — |
| `user_notifications` | `link_url` | `text` | YES | — | — |
| `user_notifications` | `read_at` | `timestamp with time zone` | YES | — | — |
| `user_notifications` | `created_at` | `timestamp with time zone` | NO | now() | — |

## Foreign-key relationships

| Table | Constraint | Column | References | Referenced column |
|---|---|---|---|---|
| `analytics_events` | `analytics_events_user_id_fkey` | `user_id` | `profiles` | `id` |
| `assignment_submissions` | `assignment_submissions_assignment_id_fkey` | `assignment_id` | `learning_assignments` | `id` |
| `assignment_targets` | `assignment_targets_assignment_id_fkey` | `assignment_id` | `learning_assignments` | `id` |
| `audit_logs` | `audit_logs_actor_id_fkey` | `actor_id` | `profiles` | `id` |
| `class_members` | `class_members_class_id_fkey` | `class_id` | `school_classes` | `id` |
| `class_subjects` | `class_subjects_class_id_fkey` | `class_id` | `school_classes` | `id` |
| `class_subjects` | `class_subjects_subject_id_fkey` | `subject_id` | `school_subjects` | `id` |
| `community_ephemeral_shares` | `community_ephemeral_shares_conversation_id_fkey` | `conversation_id` | `conversations` | `id` |
| `conversation_member_restrictions` | `conversation_member_restrictions_conversation_id_fkey` | `conversation_id` | `conversations` | `id` |
| `conversation_members` | `conversation_members_conversation_id_fkey` | `conversation_id` | `conversations` | `id` |
| `conversation_members` | `conversation_members_user_id_fkey` | `user_id` | `profiles` | `id` |
| `conversations` | `conversations_created_by_fkey` | `created_by` | `profiles` | `id` |
| `course_enrolments` | `course_enrolments_course_id_fkey` | `course_id` | `courses` | `id` |
| `curriculum_subject_catalogue` | `curriculum_subject_catalogue_curriculum_id_fkey` | `curriculum_id` | `curriculum_catalogue` | `id` |
| `curriculum_subject_catalogue` | `curriculum_subject_catalogue_subject_id_fkey` | `subject_id` | `global_subject_catalogue` | `id` |
| `friend_requests` | `friend_requests_recipient_id_fkey` | `recipient_id` | `profiles` | `id` |
| `friend_requests` | `friend_requests_requester_id_fkey` | `requester_id` | `profiles` | `id` |
| `learning_assignments` | `learning_assignments_class_id_fkey` | `class_id` | `school_classes` | `id` |
| `learning_assignments` | `learning_assignments_school_id_fkey` | `school_id` | `schools` | `id` |
| `learning_quizzes` | `learning_quizzes_school_id_fkey` | `school_id` | `schools` | `id` |
| `lms_bookmarks` | `lms_bookmarks_lesson_id_fkey` | `lesson_id` | `lms_lessons` | `id` |
| `lms_canonical_curriculum_registry` | `lms_canonical_curriculum_registry_curriculum_id_fkey` | `curriculum_id` | `curriculum_catalogue` | `id` |
| `lms_certificates` | `lms_certificates_course_id_fkey` | `course_id` | `courses` | `id` |
| `lms_certificates` | `lms_certificates_enrolment_id_fkey` | `enrolment_id` | `course_enrolments` | `id` |
| `lms_communication_controls` | `lms_communication_controls_conversation_id_fkey` | `conversation_id` | `conversations` | `id` |
| `lms_communication_extraction_jobs` | `lms_communication_extraction_jobs_attachment_id_fkey` | `attachment_id` | `lms_ephemeral_attachments` | `id` |
| `lms_course_instructors` | `lms_course_instructors_course_id_fkey` | `course_id` | `courses` | `id` |
| `lms_course_prerequisites` | `lms_course_prerequisites_course_id_fkey` | `course_id` | `courses` | `id` |
| `lms_course_prerequisites` | `lms_course_prerequisites_prerequisite_course_id_fkey` | `prerequisite_course_id` | `courses` | `id` |
| `lms_course_reviews` | `lms_course_reviews_course_id_fkey` | `course_id` | `courses` | `id` |
| `lms_course_sections` | `lms_course_sections_course_id_fkey` | `course_id` | `courses` | `id` |
| `lms_cpd_professions` | `lms_cpd_professions_sector_id_fkey` | `sector_id` | `lms_cpd_sectors` | `id` |
| `lms_cpd_programme_resources` | `lms_cpd_programme_resources_programme_id_fkey` | `programme_id` | `lms_cpd_programmes` | `id` |
| `lms_cpd_programmes` | `lms_cpd_programmes_profession_id_fkey` | `profession_id` | `lms_cpd_professions` | `id` |
| `lms_curriculum_acquisition_items` | `lms_curriculum_acquisition_items_curriculum_id_fkey` | `curriculum_id` | `curriculum_catalogue` | `id` |
| `lms_curriculum_acquisition_items` | `lms_curriculum_acquisition_items_level_id_fkey` | `level_id` | `lms_curriculum_levels` | `id` |
| `lms_curriculum_acquisition_items` | `lms_curriculum_acquisition_items_local_asset_id_fkey` | `local_asset_id` | `lms_curriculum_assets` | `id` |
| `lms_curriculum_acquisition_items` | `lms_curriculum_acquisition_items_topic_id_fkey` | `topic_id` | `lms_curriculum_topics` | `id` |
| `lms_curriculum_asset_jobs` | `lms_curriculum_asset_jobs_asset_id_fkey` | `asset_id` | `lms_curriculum_assets` | `id` |
| `lms_curriculum_asset_permissions` | `lms_curriculum_asset_permissions_asset_id_fkey` | `asset_id` | `lms_curriculum_assets` | `id` |
| `lms_curriculum_assets` | `lms_curriculum_assets_level_id_fkey` | `level_id` | `lms_curriculum_levels` | `id` |
| `lms_curriculum_assets` | `lms_curriculum_assets_resource_pack_id_fkey` | `resource_pack_id` | `lms_curriculum_resource_packs` | `id` |
| `lms_curriculum_assets` | `lms_curriculum_assets_topic_id_fkey` | `topic_id` | `lms_curriculum_topics` | `id` |
| `lms_curriculum_content_jobs` | `lms_curriculum_content_jobs_topic_id_fkey` | `topic_id` | `lms_curriculum_topics` | `id` |
| `lms_curriculum_external_resources` | `lms_curriculum_external_resources_curriculum_id_fkey` | `curriculum_id` | `curriculum_catalogue` | `id` |
| `lms_curriculum_external_resources` | `lms_curriculum_external_resources_level_id_fkey` | `level_id` | `lms_curriculum_levels` | `id` |
| `lms_curriculum_external_resources` | `lms_curriculum_external_resources_local_asset_id_fkey` | `local_asset_id` | `lms_curriculum_assets` | `id` |
| `lms_curriculum_external_resources` | `lms_curriculum_external_resources_topic_id_fkey` | `topic_id` | `lms_curriculum_topics` | `id` |
| `lms_curriculum_framework_components` | `lms_curriculum_framework_components_curriculum_id_fkey` | `curriculum_id` | `curriculum_catalogue` | `id` |
| `lms_curriculum_ingestion_runs` | `lms_curriculum_ingestion_runs_source_id_fkey` | `source_id` | `lms_curriculum_sources` | `id` |
| `lms_curriculum_levels` | `lms_curriculum_levels_curriculum_id_fkey` | `curriculum_id` | `curriculum_catalogue` | `id` |
| `lms_curriculum_library_items` | `lms_curriculum_library_items_asset_id_fkey` | `asset_id` | `lms_curriculum_assets` | `id` |
| `lms_curriculum_library_items` | `lms_curriculum_library_items_external_resource_id_fkey` | `external_resource_id` | `lms_curriculum_external_resources` | `id` |
| `lms_curriculum_library_items` | `lms_curriculum_library_items_topic_id_fkey` | `topic_id` | `lms_curriculum_topics` | `id` |
| `lms_curriculum_library_topic_links` | `lms_curriculum_library_topic_links_library_item_id_fkey` | `library_item_id` | `lms_curriculum_library_items` | `id` |
| `lms_curriculum_library_topic_links` | `lms_curriculum_library_topic_links_topic_id_fkey` | `topic_id` | `lms_curriculum_topics` | `id` |
| `lms_curriculum_library_topic_links` | `lms_curriculum_library_topic_links_verified_by_fkey` | `verified_by` | `profiles` | `id` |
| `lms_curriculum_quality_reviews` | `lms_curriculum_quality_reviews_curriculum_id_fkey` | `curriculum_id` | `curriculum_catalogue` | `id` |
| `lms_curriculum_quality_reviews` | `lms_curriculum_quality_reviews_topic_id_fkey` | `topic_id` | `lms_curriculum_topics` | `id` |
| `lms_curriculum_requirement_mappings` | `lms_curriculum_requirement_mappings_topic_id_fkey` | `topic_id` | `lms_curriculum_topics` | `id` |
| `lms_curriculum_resource_packs` | `lms_curriculum_resource_packs_topic_id_fkey` | `topic_id` | `lms_curriculum_topics` | `id` |
| `lms_curriculum_sources` | `lms_curriculum_sources_curriculum_id_fkey` | `curriculum_id` | `curriculum_catalogue` | `id` |
| `lms_curriculum_topics` | `lms_curriculum_topics_curriculum_id_fkey` | `curriculum_id` | `curriculum_catalogue` | `id` |
| `lms_curriculum_topics` | `lms_curriculum_topics_level_id_fkey` | `level_id` | `lms_curriculum_levels` | `id` |
| `lms_curriculum_topics` | `lms_curriculum_topics_parent_topic_id_fkey` | `parent_topic_id` | `lms_curriculum_topics` | `id` |
| `lms_curriculum_topics` | `lms_curriculum_topics_subject_id_fkey` | `subject_id` | `global_subject_catalogue` | `id` |
| `lms_discussion_posts` | `lms_discussion_posts_parent_post_id_fkey` | `parent_post_id` | `lms_discussion_posts` | `id` |
| `lms_discussion_posts` | `lms_discussion_posts_thread_id_fkey` | `thread_id` | `lms_discussion_threads` | `id` |
| `lms_discussion_threads` | `lms_discussion_threads_course_id_fkey` | `course_id` | `courses` | `id` |
| `lms_discussion_threads` | `lms_discussion_threads_lesson_id_fkey` | `lesson_id` | `lms_lessons` | `id` |
| `lms_learning_path_courses` | `lms_learning_path_courses_course_id_fkey` | `course_id` | `courses` | `id` |
| `lms_learning_path_courses` | `lms_learning_path_courses_learning_path_id_fkey` | `learning_path_id` | `lms_learning_paths` | `id` |
| `lms_lesson_progress` | `lms_lesson_progress_lesson_id_fkey` | `lesson_id` | `lms_lessons` | `id` |
| `lms_lesson_resources` | `lms_lesson_resources_lesson_id_fkey` | `lesson_id` | `lms_lessons` | `id` |
| `lms_lessons` | `lms_lessons_section_id_fkey` | `section_id` | `lms_course_sections` | `id` |
| `lms_live_session_attendees` | `lms_live_session_attendees_session_id_fkey` | `session_id` | `lms_live_sessions` | `id` |
| `lms_live_sessions` | `lms_live_sessions_course_id_fkey` | `course_id` | `courses` | `id` |
| `lms_live_sessions` | `lms_live_sessions_lesson_id_fkey` | `lesson_id` | `lms_lessons` | `id` |
| `lms_notes` | `lms_notes_lesson_id_fkey` | `lesson_id` | `lms_lessons` | `id` |
| `lms_programme_enrolment_authority` | `lms_programme_enrolment_authority_partner_authority_id_fkey` | `partner_authority_id` | `lms_programme_authorities` | `id` |
| `lms_programme_enrolment_authority` | `lms_programme_enrolment_authority_track_id_fkey` | `track_id` | `lms_programme_tracks` | `id` |
| `lms_programme_levels` | `lms_programme_levels_track_id_fkey` | `track_id` | `lms_programme_tracks` | `id` |
| `lms_programme_progression` | `lms_programme_progression_from_level_id_fkey` | `from_level_id` | `lms_programme_levels` | `id` |
| `lms_programme_progression` | `lms_programme_progression_to_level_id_fkey` | `to_level_id` | `lms_programme_levels` | `id` |
| `lms_programme_progression` | `lms_programme_progression_track_id_fkey` | `track_id` | `lms_programme_tracks` | `id` |
| `lms_programme_resources` | `lms_programme_resources_programme_id_fkey` | `programme_id` | `lms_programmes` | `id` |
| `lms_programme_resources` | `lms_programme_resources_topic_id_fkey` | `topic_id` | `lms_curriculum_topics` | `id` |
| `lms_programme_schedules` | `lms_programme_schedules_programme_id_fkey` | `programme_id` | `lms_programmes` | `id` |
| `lms_programme_topics` | `lms_programme_topics_programme_id_fkey` | `programme_id` | `lms_programmes` | `id` |
| `lms_programme_topics` | `lms_programme_topics_topic_id_fkey` | `topic_id` | `lms_curriculum_topics` | `id` |
| `lms_programme_tracks` | `lms_programme_tracks_subject_id_fkey` | `subject_id` | `global_subject_catalogue` | `id` |
| `lms_programmes` | `lms_programmes_curriculum_id_fkey` | `curriculum_id` | `curriculum_catalogue` | `id` |
| `lms_programmes` | `lms_programmes_level_id_fkey` | `level_id` | `lms_curriculum_levels` | `id` |
| `lms_programmes` | `lms_programmes_partner_authority_id_fkey` | `partner_authority_id` | `lms_programme_authorities` | `id` |
| `lms_programmes` | `lms_programmes_subject_id_fkey` | `subject_id` | `global_subject_catalogue` | `id` |
| `lms_rubric_criteria` | `lms_rubric_criteria_rubric_id_fkey` | `rubric_id` | `lms_rubrics` | `id` |
| `lms_rubric_scores` | `lms_rubric_scores_criterion_id_fkey` | `criterion_id` | `lms_rubric_criteria` | `id` |
| `lms_rubric_scores` | `lms_rubric_scores_rubric_id_fkey` | `rubric_id` | `lms_rubrics` | `id` |
| `lms_rubric_scores` | `lms_rubric_scores_submission_id_fkey` | `submission_id` | `assignment_submissions` | `id` |
| `lms_rubrics` | `lms_rubrics_course_id_fkey` | `course_id` | `courses` | `id` |
| `lms_user_badges` | `lms_user_badges_badge_id_fkey` | `badge_id` | `lms_badges` | `id` |
| `messages` | `messages_conversation_id_fkey` | `conversation_id` | `conversations` | `id` |
| `messages` | `messages_sender_id_fkey` | `sender_id` | `profiles` | `id` |
| `moderation_reports` | `moderation_reports_reporter_id_fkey` | `reporter_id` | `profiles` | `id` |
| `parent_learning_notifications` | `parent_learning_notifications_assignment_id_fkey` | `assignment_id` | `learning_assignments` | `id` |
| `parent_learning_notifications` | `parent_learning_notifications_quiz_attempt_id_fkey` | `quiz_attempt_id` | `quiz_attempts` | `id` |
| `parent_links` | `parent_links_child_id_fkey` | `child_id` | `profiles` | `id` |
| `parent_links` | `parent_links_parent_id_fkey` | `parent_id` | `profiles` | `id` |
| `payment_orders` | `payment_orders_user_id_fkey` | `user_id` | `profiles` | `id` |
| `payroll_items` | `payroll_items_payroll_run_id_fkey` | `payroll_run_id` | `payroll_runs` | `id` |
| `payroll_items` | `payroll_items_staff_record_id_fkey` | `staff_record_id` | `staff_records` | `id` |
| `payroll_runs` | `payroll_runs_school_id_fkey` | `school_id` | `schools` | `id` |
| `person_signatures` | `person_signatures_school_id_fkey` | `school_id` | `schools` | `id` |
| `quiz_assignments` | `quiz_assignments_class_id_fkey` | `class_id` | `school_classes` | `id` |
| `quiz_assignments` | `quiz_assignments_quiz_id_fkey` | `quiz_id` | `learning_quizzes` | `id` |
| `quiz_attempts` | `quiz_attempts_quiz_id_fkey` | `quiz_id` | `learning_quizzes` | `id` |
| `quiz_questions` | `quiz_questions_quiz_id_fkey` | `quiz_id` | `learning_quizzes` | `id` |
| `result_deletion_audit` | `result_deletion_audit_school_id_fkey` | `school_id` | `schools` | `id` |
| `result_release_notifications` | `result_release_notifications_publication_id_fkey` | `publication_id` | `school_result_publications` | `id` |
| `safety_alerts` | `safety_alerts_user_id_fkey` | `user_id` | `profiles` | `id` |
| `school_academic_sessions` | `school_academic_sessions_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_announcements` | `school_announcements_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_assessment_scales` | `school_assessment_scales_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_assessment_traits` | `school_assessment_traits_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_assignment_items` | `school_assignment_items_task_id_fkey` | `task_id` | `school_assignment_tasks` | `id` |
| `school_assignment_submissions` | `school_assignment_submissions_task_id_fkey` | `task_id` | `school_assignment_tasks` | `id` |
| `school_assignment_targets` | `school_assignment_targets_class_id_fkey` | `class_id` | `school_classes` | `id` |
| `school_assignment_targets` | `school_assignment_targets_task_id_fkey` | `task_id` | `school_assignment_tasks` | `id` |
| `school_assignment_tasks` | `school_assignment_tasks_class_id_fkey` | `class_id` | `school_classes` | `id` |
| `school_assignment_tasks` | `school_assignment_tasks_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_assignment_tasks` | `school_assignment_tasks_subject_id_fkey` | `subject_id` | `school_subjects` | `id` |
| `school_attendance_settings` | `school_attendance_settings_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_calendar_events` | `school_calendar_events_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_cbt_attempts` | `school_cbt_attempts_exam_id_fkey` | `exam_id` | `school_cbt_exams` | `id` |
| `school_cbt_exam_assignments` | `school_cbt_exam_assignments_exam_id_fkey` | `exam_id` | `school_cbt_exams` | `id` |
| `school_cbt_exam_assignments` | `school_cbt_exam_assignments_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_cbt_exam_attempts` | `school_cbt_exam_attempts_assignment_id_fkey` | `assignment_id` | `school_cbt_exam_assignments` | `id` |
| `school_cbt_exam_attempts` | `school_cbt_exam_attempts_exam_id_fkey` | `exam_id` | `school_cbt_exams` | `id` |
| `school_cbt_exam_attempts` | `school_cbt_exam_attempts_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_cbt_exam_media` | `school_cbt_exam_media_exam_id_fkey` | `exam_id` | `school_cbt_exams` | `id` |
| `school_cbt_exam_media` | `school_cbt_exam_media_question_id_fkey` | `question_id` | `school_cbt_exam_questions` | `id` |
| `school_cbt_exam_media` | `school_cbt_exam_media_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_cbt_exam_questions` | `school_cbt_exam_questions_exam_id_fkey` | `exam_id` | `school_cbt_exams` | `id` |
| `school_cbt_exam_questions_student` | `school_cbt_exam_questions_student_exam_id_fkey` | `exam_id` | `school_cbt_exams` | `id` |
| `school_cbt_exam_questions_student` | `school_cbt_exam_questions_student_id_fkey` | `id` | `school_cbt_exam_questions` | `id` |
| `school_cbt_exams` | `school_cbt_exams_class_id_fkey` | `class_id` | `school_classes` | `id` |
| `school_cbt_exams` | `school_cbt_exams_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_cbt_question_resources` | `school_cbt_question_resources_exam_id_fkey` | `exam_id` | `school_cbt_exams` | `id` |
| `school_cbt_question_resources` | `school_cbt_question_resources_library_item_id_fkey` | `library_item_id` | `lms_curriculum_library_items` | `id` |
| `school_cbt_question_resources` | `school_cbt_question_resources_question_id_fkey` | `question_id` | `school_cbt_exam_questions` | `id` |
| `school_cbt_question_resources` | `school_cbt_question_resources_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_classes` | `school_classes_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_curricula` | `school_curricula_curriculum_id_fkey` | `curriculum_id` | `curriculum_catalogue` | `id` |
| `school_curricula` | `school_curricula_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_election_candidates` | `school_election_candidates_position_id_fkey` | `position_id` | `school_election_positions` | `id` |
| `school_election_positions` | `school_election_positions_election_id_fkey` | `election_id` | `school_elections` | `id` |
| `school_election_voters` | `school_election_voters_election_id_fkey` | `election_id` | `school_elections` | `id` |
| `school_election_votes` | `school_election_votes_candidate_id_fkey` | `candidate_id` | `school_election_candidates` | `id` |
| `school_election_votes` | `school_election_votes_election_id_fkey` | `election_id` | `school_elections` | `id` |
| `school_election_votes` | `school_election_votes_position_id_fkey` | `position_id` | `school_election_positions` | `id` |
| `school_elections` | `school_elections_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_fee_payments` | `school_fee_payments_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_fee_schedules` | `school_fee_schedules_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_id_card_templates` | `school_id_card_templates_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_member_invites` | `school_member_invites_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_members` | `school_members_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_profile_fields` | `school_profile_fields_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_receipts` | `school_receipts_payment_id_fkey` | `payment_id` | `school_fee_payments` | `id` |
| `school_receipts` | `school_receipts_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_result_components` | `school_result_components_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_result_publications` | `school_result_publications_class_id_fkey` | `class_id` | `school_classes` | `id` |
| `school_result_publications` | `school_result_publications_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_result_publications` | `school_result_publications_session_id_fkey` | `session_id` | `school_academic_sessions` | `id` |
| `school_sensitive_access` | `school_sensitive_access_class_id_fkey` | `class_id` | `school_classes` | `id` |
| `school_sensitive_access` | `school_sensitive_access_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_subjects` | `school_subjects_school_id_fkey` | `school_id` | `schools` | `id` |
| `school_terms` | `school_terms_session_id_fkey` | `session_id` | `school_academic_sessions` | `id` |
| `service_enquiries` | `service_enquiries_user_id_fkey` | `user_id` | `profiles` | `id` |
| `site_announcements` | `site_announcements_created_by_fkey` | `created_by` | `profiles` | `id` |
| `staff_pay_structures` | `staff_pay_structures_staff_record_id_fkey` | `staff_record_id` | `staff_records` | `id` |
| `staff_records` | `staff_records_school_id_fkey` | `school_id` | `schools` | `id` |
| `student_attendance` | `student_attendance_class_id_fkey` | `class_id` | `school_classes` | `id` |
| `student_attendance` | `student_attendance_school_id_fkey` | `school_id` | `schools` | `id` |
| `student_attendance` | `student_attendance_session_id_fkey` | `session_id` | `school_academic_sessions` | `id` |
| `student_class_history` | `student_class_history_class_id_fkey` | `class_id` | `school_classes` | `id` |
| `student_class_history` | `student_class_history_previous_class_id_fkey` | `previous_class_id` | `school_classes` | `id` |
| `student_class_history` | `student_class_history_school_id_fkey` | `school_id` | `schools` | `id` |
| `student_emergency_profiles` | `student_emergency_profiles_school_id_fkey` | `school_id` | `schools` | `id` |
| `student_fee_adjustments` | `student_fee_adjustments_school_id_fkey` | `school_id` | `schools` | `id` |
| `student_growth_records` | `student_growth_records_school_id_fkey` | `school_id` | `schools` | `id` |
| `student_guardians` | `student_guardians_school_id_fkey` | `school_id` | `schools` | `id` |
| `student_result_entries` | `student_result_entries_class_id_fkey` | `class_id` | `school_classes` | `id` |
| `student_result_entries` | `student_result_entries_component_id_fkey` | `component_id` | `school_result_components` | `id` |
| `student_result_entries` | `student_result_entries_school_id_fkey` | `school_id` | `schools` | `id` |
| `student_result_entries` | `student_result_entries_session_id_fkey` | `session_id` | `school_academic_sessions` | `id` |
| `student_result_entries` | `student_result_entries_subject_id_fkey` | `subject_id` | `school_subjects` | `id` |
| `student_school_records` | `student_school_records_school_id_fkey` | `school_id` | `schools` | `id` |
| `student_school_status_history` | `student_school_status_history_school_id_fkey` | `school_id` | `schools` | `id` |
| `student_sensitive_records` | `student_sensitive_records_school_id_fkey` | `school_id` | `schools` | `id` |
| `student_term_summaries` | `student_term_summaries_class_id_fkey` | `class_id` | `school_classes` | `id` |
| `student_term_summaries` | `student_term_summaries_school_id_fkey` | `school_id` | `schools` | `id` |
| `student_term_summaries` | `student_term_summaries_session_id_fkey` | `session_id` | `school_academic_sessions` | `id` |
| `student_term_summaries` | `student_term_summaries_subject_id_fkey` | `subject_id` | `school_subjects` | `id` |
| `student_trait_assessments` | `student_trait_assessments_school_id_fkey` | `school_id` | `schools` | `id` |
| `student_trait_assessments` | `student_trait_assessments_session_id_fkey` | `session_id` | `school_academic_sessions` | `id` |
| `student_trait_assessments` | `student_trait_assessments_trait_id_fkey` | `trait_id` | `school_assessment_traits` | `id` |
| `subscription_feature_grants` | `subscription_feature_grants_feature_id_fkey` | `feature_id` | `subscription_features` | `id` |
| `subscription_feature_grants` | `subscription_feature_grants_subscription_id_fkey` | `subscription_id` | `subscriptions` | `id` |
| `subscription_tool_entitlements` | `subscription_tool_entitlements_service_code_fkey` | `service_code` | `subscription_features` | `code` |
| `subscriptions` | `subscriptions_school_id_fkey` | `school_id` | `schools` | `id` |
| `subscriptions` | `subscriptions_user_id_fkey` | `user_id` | `profiles` | `id` |
| `suggestions` | `suggestions_user_id_fkey` | `user_id` | `profiles` | `id` |
| `teacher_question_banks` | `teacher_question_banks_school_id_fkey` | `school_id` | `schools` | `id` |
| `teacher_question_items` | `teacher_question_items_bank_id_fkey` | `bank_id` | `teacher_question_banks` | `id` |
| `user_notifications` | `user_notifications_user_id_fkey` | `user_id` | `profiles` | `id` |

## Row-level security status

| Table | RLS enabled | FORCE RLS |
|---|---|---|
| `academic_subject_catalog` | true | false |
| `academy_private_configuration` | true | false |
| `analytics_events` | true | false |
| `assignment_submissions` | true | false |
| `assignment_targets` | true | false |
| `audit_logs` | true | false |
| `class_members` | true | false |
| `class_subjects` | true | false |
| `cloudflare_migration_manifest` | false | false |
| `cms_content_blocks` | true | false |
| `community_ephemeral_shares` | true | false |
| `conversation_member_restrictions` | true | false |
| `conversation_members` | true | false |
| `conversations` | true | false |
| `course_enrolments` | true | false |
| `courses` | true | false |
| `curriculum_catalogue` | true | false |
| `curriculum_subject_catalogue` | true | false |
| `email_subscribers` | true | false |
| `friend_requests` | true | false |
| `global_subject_catalogue` | true | false |
| `learning_assignments` | true | false |
| `learning_quizzes` | true | false |
| `learning_topics` | true | false |
| `lms_assessment_pathways` | true | false |
| `lms_badges` | true | false |
| `lms_bookmarks` | true | false |
| `lms_canonical_curriculum_registry` | true | false |
| `lms_certificates` | true | false |
| `lms_communication_controls` | true | false |
| `lms_communication_extraction_jobs` | true | false |
| `lms_course_instructors` | true | false |
| `lms_course_prerequisites` | true | false |
| `lms_course_reviews` | true | false |
| `lms_course_sections` | true | false |
| `lms_cpd_professions` | true | false |
| `lms_cpd_programme_resources` | true | false |
| `lms_cpd_programmes` | true | false |
| `lms_cpd_sectors` | true | false |
| `lms_curriculum_acquisition_items` | true | false |
| `lms_curriculum_asset_jobs` | true | false |
| `lms_curriculum_asset_permissions` | true | false |
| `lms_curriculum_assets` | true | false |
| `lms_curriculum_content_jobs` | true | false |
| `lms_curriculum_external_resources` | true | false |
| `lms_curriculum_framework_components` | true | false |
| `lms_curriculum_ingestion_runs` | true | false |
| `lms_curriculum_levels` | true | false |
| `lms_curriculum_library_items` | true | false |
| `lms_curriculum_library_topic_links` | true | false |
| `lms_curriculum_quality_reviews` | true | false |
| `lms_curriculum_requirement_mappings` | true | false |
| `lms_curriculum_resource_packs` | true | false |
| `lms_curriculum_sources` | true | false |
| `lms_curriculum_topics` | true | false |
| `lms_discussion_posts` | true | false |
| `lms_discussion_threads` | true | false |
| `lms_distance_affiliation_rules` | true | false |
| `lms_education_domains` | true | false |
| `lms_ephemeral_attachments` | true | false |
| `lms_language_catalogue` | true | false |
| `lms_learning_path_courses` | true | false |
| `lms_learning_paths` | true | false |
| `lms_lesson_progress` | true | false |
| `lms_lesson_resources` | true | false |
| `lms_lessons` | true | false |
| `lms_live_session_attendees` | true | false |
| `lms_live_sessions` | true | false |
| `lms_notes` | true | false |
| `lms_points_ledger` | true | false |
| `lms_programme_authorities` | true | false |
| `lms_programme_authority_policies` | true | false |
| `lms_programme_enrolment_authority` | true | false |
| `lms_programme_levels` | true | false |
| `lms_programme_progression` | true | false |
| `lms_programme_resources` | true | false |
| `lms_programme_schedules` | true | false |
| `lms_programme_topics` | true | false |
| `lms_programme_tracks` | true | false |
| `lms_programmes` | true | false |
| `lms_qualification_frameworks` | true | false |
| `lms_retention_audit` | true | false |
| `lms_rubric_criteria` | true | false |
| `lms_rubric_scores` | true | false |
| `lms_rubrics` | true | false |
| `lms_tertiary_programme_catalogue` | true | false |
| `lms_user_badges` | true | false |
| `media_items` | true | false |
| `messages` | true | false |
| `moderation_reports` | true | false |
| `parent_learning_notifications` | true | false |
| `parent_links` | true | false |
| `payment_orders` | true | false |
| `payment_provider_settings` | true | false |
| `payroll_items` | true | false |
| `payroll_runs` | true | false |
| `person_signatures` | true | false |
| `premium_service_grants` | true | false |
| `profiles` | true | false |
| `quiz_assignments` | true | false |
| `quiz_attempts` | true | false |
| `quiz_questions` | true | false |
| `result_deletion_audit` | true | false |
| `result_release_notifications` | true | false |
| `safety_alerts` | true | false |
| `school_academic_sessions` | true | false |
| `school_announcements` | true | false |
| `school_assessment_scales` | true | false |
| `school_assessment_traits` | true | false |
| `school_assignment_items` | true | false |
| `school_assignment_submissions` | true | false |
| `school_assignment_targets` | true | false |
| `school_assignment_tasks` | true | false |
| `school_attendance_settings` | true | false |
| `school_calendar_events` | true | false |
| `school_cbt_attempts` | true | false |
| `school_cbt_exam_assignments` | true | false |
| `school_cbt_exam_attempts` | true | false |
| `school_cbt_exam_media` | true | false |
| `school_cbt_exam_questions` | true | false |
| `school_cbt_exam_questions_student` | true | false |
| `school_cbt_exams` | true | false |
| `school_cbt_question_resources` | true | false |
| `school_classes` | true | false |
| `school_curricula` | true | false |
| `school_election_candidates` | true | false |
| `school_election_positions` | true | false |
| `school_election_voters` | true | false |
| `school_election_votes` | true | false |
| `school_elections` | true | false |
| `school_fee_payments` | true | false |
| `school_fee_schedules` | true | false |
| `school_id_card_templates` | true | false |
| `school_member_invites` | true | false |
| `school_members` | true | false |
| `school_profile_fields` | true | false |
| `school_receipts` | true | false |
| `school_result_components` | true | false |
| `school_result_publications` | true | false |
| `school_sensitive_access` | true | false |
| `school_subjects` | true | false |
| `school_terms` | true | false |
| `schools` | true | false |
| `service_consents` | true | false |
| `service_enquiries` | true | false |
| `site_announcements` | true | false |
| `site_settings` | true | false |
| `staff_pay_structures` | true | false |
| `staff_records` | true | false |
| `student_attendance` | true | false |
| `student_class_history` | true | false |
| `student_emergency_profiles` | true | false |
| `student_fee_adjustments` | true | false |
| `student_growth_records` | true | false |
| `student_guardians` | true | false |
| `student_result_entries` | true | false |
| `student_school_records` | true | false |
| `student_school_status_history` | true | false |
| `student_sensitive_records` | true | false |
| `student_term_summaries` | true | false |
| `student_trait_assessments` | true | false |
| `subscription_feature_grants` | true | false |
| `subscription_features` | true | false |
| `subscription_plans` | true | false |
| `subscription_tool_entitlements` | true | false |
| `subscriptions` | true | false |
| `suggestions` | true | false |
| `teacher_question_banks` | true | false |
| `teacher_question_items` | true | false |
| `ui_translation_resources` | true | false |
| `user_notifications` | true | false |

## Policies (complete current definitions)

Policy expressions may contain user/tenant authorization rules. They must be translated into server-side authorization checks and tests; D1 itself does not implement PostgreSQL RLS.

| Table | Policy | Command | Roles | USING expression | WITH CHECK expression |
|---|---|---|---|---|---|
| `academic_subject_catalog` | `catalog readable` | SELECT | public | true | — |
| `academic_subject_catalog` | `catalog staff manage` | ALL | public | is_staff() | is_staff() |
| `academy_private_configuration` | `academy_private_configuration_none` | ALL | public | false | false |
| `analytics_events` | `analytics insert self` | INSERT | public | — | ((user_id IS NULL) OR (user_id = auth.uid())) |
| `analytics_events` | `analytics staff aggregate` | SELECT | public | is_staff() | — |
| `assignment_submissions` | `submissions read authorised` | SELECT | authenticated | ((student_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM learning_assignments a   WHERE ((a.id = assignment_submissions.assignment_id) AND ((a.teacher_id = auth.uid()) OR is_school_member(a.school_id, ARRAY['school_admin'::text]) OR is_staff() OR is_admin()))))) | — |
| `assignment_targets` | `targets read authorised` | SELECT | authenticated | ((student_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM learning_assignments a   WHERE ((a.id = assignment_targets.assignment_id) AND ((a.teacher_id = auth.uid()) OR is_school_member(a.school_id, ARRAY['school_admin'::text]) OR is_staff() OR is_admin()))))) | — |
| `audit_logs` | `audit insert staff` | INSERT | public | — | is_staff() |
| `audit_logs` | `audit staff` | SELECT | public | is_staff() | — |
| `class_members` | `class members admin manage` | ALL | authenticated | (is_super_admin() OR (EXISTS ( SELECT 1    FROM school_classes c   WHERE ((c.id = class_members.class_id) AND is_school_member(c.school_id, ARRAY['school_admin'::text]))))) | (is_super_admin() OR (EXISTS ( SELECT 1    FROM school_classes c   WHERE ((c.id = class_members.class_id) AND is_school_member(c.school_id, ARRAY['school_admin'::text]))))) |
| `class_members` | `class members scoped read` | SELECT | authenticated | (is_super_admin() OR (user_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM school_classes c   WHERE ((c.id = class_members.class_id) AND (is_school_member(c.school_id, ARRAY['school_admin'::text]) OR is_class_teacher_for(c.id) OR (EXISTS ( SELECT 1            FROM class_members mine           WHERE ((mine.class_id = c.id) AND (mine.user_id = auth.uid()) AND (mine.role = 'teacher'::text))))))))) | — |
| `class_subjects` | `class subjects admin manage` | ALL | authenticated | (is_super_admin() OR (EXISTS ( SELECT 1    FROM school_classes c   WHERE ((c.id = class_subjects.class_id) AND is_school_member(c.school_id, ARRAY['school_admin'::text]))))) | (is_super_admin() OR (EXISTS ( SELECT 1    FROM school_classes c   WHERE ((c.id = class_subjects.class_id) AND is_school_member(c.school_id, ARRAY['school_admin'::text]))))) |
| `class_subjects` | `class subjects scoped read` | SELECT | authenticated | (is_super_admin() OR (EXISTS ( SELECT 1    FROM school_classes c   WHERE ((c.id = class_subjects.class_id) AND (is_school_member(c.school_id) OR (class_subjects.teacher_id = auth.uid())))))) | — |
| `cms_content_blocks` | `cms blocks public read` | SELECT | public | ((published = true) OR is_super_admin()) | — |
| `cms_content_blocks` | `cms blocks super admin` | ALL | public | is_super_admin() | is_super_admin() |
| `community_ephemeral_shares` | `conversation members can create own ephemeral shares` | INSERT | authenticated | — | ((sender_id = auth.uid()) AND (EXISTS ( SELECT 1    FROM conversation_members cm   WHERE ((cm.conversation_id = community_ephemeral_shares.conversation_id) AND (cm.user_id = auth.uid()))))) |
| `community_ephemeral_shares` | `conversation members can view unexpired ephemeral shares` | SELECT | authenticated | ((expires_at > now()) AND (EXISTS ( SELECT 1    FROM conversation_members cm   WHERE ((cm.conversation_id = community_ephemeral_shares.conversation_id) AND (cm.user_id = auth.uid()))))) | — |
| `community_ephemeral_shares` | `senders can delete own ephemeral shares` | DELETE | authenticated | (sender_id = auth.uid()) | — |
| `conversation_member_restrictions` | `conversation restrictions moderators` | ALL | authenticated | (is_super_admin() OR (restricted_by = auth.uid())) | (is_super_admin() OR (restricted_by = auth.uid())) |
| `conversation_members` | `conversation member controlled insert` | INSERT | authenticated | — | (EXISTS ( SELECT 1    FROM conversations c   WHERE ((c.id = conversation_members.conversation_id) AND ((c.created_by = auth.uid()) OR is_super_admin())))) |
| `conversation_members` | `conversation member rows` | SELECT | authenticated | ((user_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1    FROM conversation_members m   WHERE ((m.conversation_id = conversation_members.conversation_id) AND (m.user_id = ( SELECT auth.uid() AS uid))))) OR is_staff()) | — |
| `conversations` | `conversation member create` | INSERT | public | — | (created_by = auth.uid()) |
| `conversations` | `conversation member read` | SELECT | public | ((EXISTS ( SELECT 1    FROM conversation_members m   WHERE ((m.conversation_id = conversations.id) AND (m.user_id = auth.uid())))) OR is_staff()) | — |
| `course_enrolments` | `enrolments read own` | SELECT | authenticated | ((user_id = auth.uid()) OR is_staff() OR is_admin()) | — |
| `courses` | `courses public read published` | SELECT | anon, authenticated | ((published = true) OR is_staff() OR is_admin()) | — |
| `curriculum_catalogue` | `curriculum_catalogue_public_read` | SELECT | public | (active = true) | — |
| `curriculum_subject_catalogue` | `curriculum_subject_catalogue_read` | SELECT | public | ((active = true) OR is_super_admin()) | — |
| `email_subscribers` | `public can subscribe email` | INSERT | public | — | (active = true) |
| `email_subscribers` | `super admin reads subscribers` | SELECT | public | is_super_admin() | — |
| `email_subscribers` | `super admin updates subscribers` | ALL | public | is_super_admin() | is_super_admin() |
| `friend_requests` | `friend request create` | INSERT | public | — | (requester_id = auth.uid()) |
| `friend_requests` | `friend request recipient update` | UPDATE | authenticated | ((recipient_id = auth.uid()) OR is_super_admin()) | ((recipient_id = auth.uid()) OR is_super_admin()) |
| `friend_requests` | `friend requests participants` | SELECT | public | ((requester_id = auth.uid()) OR (recipient_id = auth.uid()) OR is_admin()) | — |
| `global_subject_catalogue` | `global_subject_catalogue_read` | SELECT | public | ((active = true) OR is_super_admin()) | — |
| `learning_assignments` | `assignments read authorised` | SELECT | authenticated | ((teacher_id = ( SELECT auth.uid() AS uid)) OR ( SELECT is_school_member(learning_assignments.school_id, ARRAY['school_admin'::text]) AS is_school_member) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin) OR (EXISTS ( SELECT 1    FROM assignment_targets at   WHERE ((at.assignment_id = learning_assignments.id) AND (at.student_id = ( SELECT auth.uid() AS uid)))))) | — |
| `learning_quizzes` | `learning quizzes read privacy aware` | SELECT | authenticated | ((created_by = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin) OR ( SELECT is_school_member(learning_quizzes.school_id, ARRAY['school_admin'::text]) AS is_school_member) OR (EXISTS ( SELECT 1    FROM quiz_assignments qa   WHERE ((qa.quiz_id = learning_quizzes.id) AND ((qa.student_id = ( SELECT auth.uid() AS uid)) OR (qa.teacher_id = ( SELECT auth.uid() AS uid))))))) | — |
| `learning_topics` | `topics public read` | SELECT | anon, authenticated | true | — |
| `lms_assessment_pathways` | `public read active assessment pathways` | SELECT | anon, authenticated | (active = true) | — |
| `lms_assessment_pathways` | `super admin manage assessment pathways` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_badges` | `active badges read` | SELECT | anon, authenticated | ((active = true) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) | — |
| `lms_badges` | `badges manage` | ALL | authenticated | (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) | (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) |
| `lms_bookmarks` | `own bookmarks` | ALL | authenticated | (user_id = ( SELECT auth.uid() AS uid)) | (user_id = ( SELECT auth.uid() AS uid)) |
| `lms_canonical_curriculum_registry` | `authenticated users can view canonical curriculum registry` | SELECT | authenticated | (active = true) | — |
| `lms_certificates` | `certificate managers manage` | ALL | authenticated | (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) | (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) |
| `lms_certificates` | `certificates read own or public verification` | SELECT | authenticated | ((user_id = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) | — |
| `lms_communication_controls` | `super admin communication controls` | ALL | authenticated | is_super_admin() | is_super_admin() |
| `lms_communication_extraction_jobs` | `users view own extraction jobs` | SELECT | authenticated | (requested_by = auth.uid()) | — |
| `lms_course_instructors` | `course instructors read` | SELECT | authenticated | ( SELECT private.lms_can_access_course(lms_course_instructors.course_id) AS lms_can_access_course) | — |
| `lms_course_instructors` | `course managers manage instructors` | ALL | authenticated | ( SELECT private.lms_is_course_manager(lms_course_instructors.course_id) AS lms_is_course_manager) | ( SELECT private.lms_is_course_manager(lms_course_instructors.course_id) AS lms_is_course_manager) |
| `lms_course_prerequisites` | `course managers manage prerequisites` | ALL | authenticated | ( SELECT private.lms_is_course_manager(lms_course_prerequisites.course_id) AS lms_is_course_manager) | ( SELECT private.lms_is_course_manager(lms_course_prerequisites.course_id) AS lms_is_course_manager) |
| `lms_course_prerequisites` | `course prerequisites read` | SELECT | anon, authenticated | (EXISTS ( SELECT 1    FROM courses c   WHERE ((c.id = lms_course_prerequisites.course_id) AND (c.published = true)))) | — |
| `lms_course_reviews` | `own reviews manage` | ALL | authenticated | (user_id = ( SELECT auth.uid() AS uid)) | (user_id = ( SELECT auth.uid() AS uid)) |
| `lms_course_reviews` | `published reviews read` | SELECT | anon, authenticated | ((published = true) OR (user_id = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) | — |
| `lms_course_sections` | `course managers manage sections` | ALL | authenticated | ( SELECT private.lms_is_course_manager(lms_course_sections.course_id) AS lms_is_course_manager) | ( SELECT private.lms_is_course_manager(lms_course_sections.course_id) AS lms_is_course_manager) |
| `lms_course_sections` | `course sections read` | SELECT | anon, authenticated | ((published = true) OR ( SELECT private.lms_can_access_course(lms_course_sections.course_id) AS lms_can_access_course)) | — |
| `lms_cpd_professions` | `lms_cpd_professions_read` | SELECT | public | ((active = true) OR is_super_admin()) | — |
| `lms_cpd_programme_resources` | `lms_cpd_resources_read` | SELECT | public | (EXISTS ( SELECT 1    FROM lms_cpd_programmes p   WHERE ((p.id = lms_cpd_programme_resources.programme_id) AND ((p.status = ANY (ARRAY['ready'::text, 'published'::text])) OR is_super_admin())))) | — |
| `lms_cpd_programmes` | `lms_cpd_programmes_read` | SELECT | public | ((status = ANY (ARRAY['ready'::text, 'published'::text])) OR is_super_admin()) | — |
| `lms_cpd_sectors` | `lms_cpd_sectors_read` | SELECT | public | ((active = true) OR is_super_admin()) | — |
| `lms_curriculum_acquisition_items` | `authenticated_read_cambridge_acquisition` | SELECT | authenticated | true | — |
| `lms_curriculum_asset_jobs` | `super admins manage curriculum asset jobs` | ALL | authenticated | is_super_admin() | is_super_admin() |
| `lms_curriculum_asset_permissions` | `curriculum asset permissions own view` | SELECT | authenticated | (user_id = ( SELECT auth.uid() AS uid)) | — |
| `lms_curriculum_asset_permissions` | `super admins manage curriculum asset permissions` | ALL | authenticated | is_super_admin() | is_super_admin() |
| `lms_curriculum_assets` | `curriculum assets authenticated view` | SELECT | authenticated | ((visibility = ANY (ARRAY['public'::text, 'authenticated'::text])) OR (EXISTS ( SELECT 1    FROM lms_curriculum_asset_permissions p   WHERE ((p.asset_id = lms_curriculum_assets.id) AND (p.can_view = true) AND ((p.expires_at IS NULL) OR (p.expires_at > now())) AND ((p.user_id = ( SELECT auth.uid() AS uid)) OR (p.user_id IS NULL)))))) | — |
| `lms_curriculum_assets` | `super admins manage curriculum assets` | ALL | authenticated | is_super_admin() | is_super_admin() |
| `lms_curriculum_content_jobs` | `super admin manage curriculum content jobs` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_curriculum_external_resources` | `authenticated_read_lms_curriculum_external_resources` | SELECT | authenticated | true | — |
| `lms_curriculum_framework_components` | `authenticated_read_england_framework_components` | SELECT | authenticated | (active = true) | — |
| `lms_curriculum_ingestion_runs` | `lcir_public_read` | SELECT | anon, authenticated | (status = ANY (ARRAY['completed'::text, 'partial'::text])) | — |
| `lms_curriculum_ingestion_runs` | `lcir_super_admin` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_curriculum_levels` | `lms_curriculum_levels_read` | SELECT | public | ((active = true) OR is_super_admin()) | — |
| `lms_curriculum_library_items` | `authenticated users can view library catalogue` | SELECT | authenticated | true | — |
| `lms_curriculum_library_items` | `super admins manage library catalogue` | ALL | authenticated | is_super_admin() | is_super_admin() |
| `lms_curriculum_library_topic_links` | `authenticated users can view library topic links` | SELECT | authenticated | true | — |
| `lms_curriculum_library_topic_links` | `super admins manage library topic links` | ALL | authenticated | is_super_admin() | is_super_admin() |
| `lms_curriculum_quality_reviews` | `lms_curriculum_quality_reviews_authenticated_select` | SELECT | authenticated | true | — |
| `lms_curriculum_quality_reviews` | `lms_curriculum_quality_reviews_service_all` | ALL | service_role | true | true |
| `lms_curriculum_requirement_mappings` | `authenticated read curriculum requirement mappings` | SELECT | authenticated | true | — |
| `lms_curriculum_resource_packs` | `public read published curriculum resource packs` | SELECT | anon, authenticated | (status = 'published'::text) | — |
| `lms_curriculum_resource_packs` | `super admin manage curriculum resource packs` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_curriculum_sources` | `lcs_public_read` | SELECT | anon, authenticated | ((active = true) AND (verification_status = ANY (ARRAY['retrieved'::text, 'parsed'::text, 'verified'::text]))) | — |
| `lms_curriculum_sources` | `lcs_super_admin` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_curriculum_topics` | `lms_curriculum_topics_public_read` | SELECT | anon, authenticated | ((active = true) AND (source_status = ANY (ARRAY['verified'::text, 'imported'::text]))) | — |
| `lms_curriculum_topics` | `lms_curriculum_topics_read` | SELECT | public | ((active = true) OR is_super_admin()) | — |
| `lms_curriculum_topics` | `lms_curriculum_topics_super_admin` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_discussion_posts` | `discussion posts author/manage` | UPDATE | authenticated | ((author_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1    FROM lms_discussion_threads t   WHERE ((t.id = lms_discussion_posts.thread_id) AND ( SELECT private.lms_is_course_manager(t.course_id) AS lms_is_course_manager))))) | ((author_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1    FROM lms_discussion_threads t   WHERE ((t.id = lms_discussion_posts.thread_id) AND ( SELECT private.lms_is_course_manager(t.course_id) AS lms_is_course_manager))))) |
| `lms_discussion_posts` | `discussion posts create` | INSERT | authenticated | — | ((author_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1    FROM lms_discussion_threads t   WHERE ((t.id = lms_discussion_posts.thread_id) AND ( SELECT private.lms_is_enrolled(t.course_id) AS lms_is_enrolled))))) |
| `lms_discussion_posts` | `discussion posts delete` | DELETE | authenticated | ((author_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1    FROM lms_discussion_threads t   WHERE ((t.id = lms_discussion_posts.thread_id) AND ( SELECT private.lms_is_course_manager(t.course_id) AS lms_is_course_manager))))) | — |
| `lms_discussion_posts` | `discussion posts read` | SELECT | authenticated | (EXISTS ( SELECT 1    FROM lms_discussion_threads t   WHERE ((t.id = lms_discussion_posts.thread_id) AND ( SELECT private.lms_can_access_course(t.course_id) AS lms_can_access_course)))) | — |
| `lms_discussion_threads` | `discussion threads author/manage` | UPDATE | authenticated | ((author_id = ( SELECT auth.uid() AS uid)) OR ( SELECT private.lms_is_course_manager(lms_discussion_threads.course_id) AS lms_is_course_manager)) | ((author_id = ( SELECT auth.uid() AS uid)) OR ( SELECT private.lms_is_course_manager(lms_discussion_threads.course_id) AS lms_is_course_manager)) |
| `lms_discussion_threads` | `discussion threads create` | INSERT | authenticated | — | ((author_id = ( SELECT auth.uid() AS uid)) AND ( SELECT private.lms_is_enrolled(lms_discussion_threads.course_id) AS lms_is_enrolled)) |
| `lms_discussion_threads` | `discussion threads manager delete` | DELETE | authenticated | ((author_id = ( SELECT auth.uid() AS uid)) OR ( SELECT private.lms_is_course_manager(lms_discussion_threads.course_id) AS lms_is_course_manager)) | — |
| `lms_discussion_threads` | `discussion threads read` | SELECT | authenticated | ( SELECT private.lms_can_access_course(lms_discussion_threads.course_id) AS lms_can_access_course) | — |
| `lms_distance_affiliation_rules` | `public read active distance affiliation rules` | SELECT | anon, authenticated | (active = true) | — |
| `lms_distance_affiliation_rules` | `super admin manage distance affiliation rules` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_education_domains` | `led_public_read` | SELECT | anon, authenticated | (active = true) | — |
| `lms_education_domains` | `led_super_admin` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_ephemeral_attachments` | `users view own ephemeral attachments` | SELECT | authenticated | (sender_id = auth.uid()) | — |
| `lms_language_catalogue` | `lms_language_catalogue_read` | SELECT | public | ((active = true) OR is_super_admin()) | — |
| `lms_learning_path_courses` | `learning path courses manage` | ALL | authenticated | (EXISTS ( SELECT 1    FROM lms_learning_paths p   WHERE ((p.id = lms_learning_path_courses.learning_path_id) AND ((p.created_by = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin))))) | (EXISTS ( SELECT 1    FROM lms_learning_paths p   WHERE ((p.id = lms_learning_path_courses.learning_path_id) AND ((p.created_by = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin))))) |
| `lms_learning_path_courses` | `learning path courses read` | SELECT | anon, authenticated | (EXISTS ( SELECT 1    FROM lms_learning_paths p   WHERE ((p.id = lms_learning_path_courses.learning_path_id) AND ((p.published = true) OR (p.created_by = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin))))) | — |
| `lms_learning_paths` | `learning paths manage` | ALL | authenticated | ((created_by = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) | ((created_by = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) |
| `lms_learning_paths` | `learning paths read published` | SELECT | anon, authenticated | ((published = true) OR (created_by = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) | — |
| `lms_lesson_progress` | `managers read lesson progress` | SELECT | authenticated | (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin) OR (EXISTS ( SELECT 1    FROM (lms_lessons l      JOIN lms_course_sections s ON ((s.id = l.section_id)))   WHERE ((l.id = lms_lesson_progress.lesson_id) AND ( SELECT private.lms_is_course_manager(s.course_id) AS lms_is_course_manager))))) | — |
| `lms_lesson_progress` | `own lesson progress` | ALL | authenticated | (user_id = ( SELECT auth.uid() AS uid)) | (user_id = ( SELECT auth.uid() AS uid)) |
| `lms_lesson_resources` | `course managers manage resources` | ALL | authenticated | (EXISTS ( SELECT 1    FROM (lms_lessons l      JOIN lms_course_sections s ON ((s.id = l.section_id)))   WHERE ((l.id = lms_lesson_resources.lesson_id) AND ( SELECT private.lms_is_course_manager(s.course_id) AS lms_is_course_manager)))) | (EXISTS ( SELECT 1    FROM (lms_lessons l      JOIN lms_course_sections s ON ((s.id = l.section_id)))   WHERE ((l.id = lms_lesson_resources.lesson_id) AND ( SELECT private.lms_is_course_manager(s.course_id) AS lms_is_course_manager)))) |
| `lms_lesson_resources` | `lesson resources read` | SELECT | anon, authenticated | (EXISTS ( SELECT 1    FROM (lms_lessons l      JOIN lms_course_sections s ON ((s.id = l.section_id)))   WHERE ((l.id = lms_lesson_resources.lesson_id) AND ( SELECT private.lms_can_access_course(s.course_id) AS lms_can_access_course)))) | — |
| `lms_lessons` | `course managers manage lessons` | ALL | authenticated | (EXISTS ( SELECT 1    FROM lms_course_sections s   WHERE ((s.id = lms_lessons.section_id) AND ( SELECT private.lms_is_course_manager(s.course_id) AS lms_is_course_manager)))) | (EXISTS ( SELECT 1    FROM lms_course_sections s   WHERE ((s.id = lms_lessons.section_id) AND ( SELECT private.lms_is_course_manager(s.course_id) AS lms_is_course_manager)))) |
| `lms_lessons` | `lessons read` | SELECT | anon, authenticated | (((published = true) AND (EXISTS ( SELECT 1    FROM lms_course_sections s   WHERE ((s.id = lms_lessons.section_id) AND (s.published = true) AND (EXISTS ( SELECT 1            FROM courses c           WHERE ((c.id = s.course_id) AND (c.published = true)))))))) OR (EXISTS ( SELECT 1    FROM lms_course_sections s   WHERE ((s.id = lms_lessons.section_id) AND ( SELECT private.lms_can_access_course(s.course_id) AS lms_can_access_course))))) | — |
| `lms_live_session_attendees` | `live attendance manager update` | UPDATE | authenticated | (EXISTS ( SELECT 1    FROM lms_live_sessions s   WHERE ((s.id = lms_live_session_attendees.session_id) AND ((s.host_id = ( SELECT auth.uid() AS uid)) OR ( SELECT private.lms_is_course_manager(s.course_id) AS lms_is_course_manager))))) | (EXISTS ( SELECT 1    FROM lms_live_sessions s   WHERE ((s.id = lms_live_session_attendees.session_id) AND ((s.host_id = ( SELECT auth.uid() AS uid)) OR ( SELECT private.lms_is_course_manager(s.course_id) AS lms_is_course_manager))))) |
| `lms_live_session_attendees` | `live attendance own or manager` | SELECT | authenticated | ((user_id = ( SELECT auth.uid() AS uid)) OR (EXISTS ( SELECT 1    FROM lms_live_sessions s   WHERE ((s.id = lms_live_session_attendees.session_id) AND ((s.host_id = ( SELECT auth.uid() AS uid)) OR ( SELECT private.lms_is_course_manager(s.course_id) AS lms_is_course_manager)))))) | — |
| `lms_live_session_attendees` | `live attendance own register` | INSERT | authenticated | — | ((user_id = ( SELECT auth.uid() AS uid)) AND (EXISTS ( SELECT 1    FROM lms_live_sessions s   WHERE ((s.id = lms_live_session_attendees.session_id) AND ( SELECT private.lms_can_access_course(s.course_id) AS lms_can_access_course))))) |
| `lms_live_sessions` | `live sessions manage` | ALL | authenticated | ((host_id = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin) OR ( SELECT private.lms_is_course_manager(lms_live_sessions.course_id) AS lms_is_course_manager)) | ((host_id = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin) OR ( SELECT private.lms_is_course_manager(lms_live_sessions.course_id) AS lms_is_course_manager)) |
| `lms_live_sessions` | `live sessions read authorised` | SELECT | authenticated | ( SELECT private.lms_can_access_course(lms_live_sessions.course_id) AS lms_can_access_course) | — |
| `lms_notes` | `own notes` | ALL | authenticated | (user_id = ( SELECT auth.uid() AS uid)) | (user_id = ( SELECT auth.uid() AS uid)) |
| `lms_points_ledger` | `own points read` | SELECT | authenticated | ((user_id = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) | — |
| `lms_points_ledger` | `points managers write` | ALL | authenticated | (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) | (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) |
| `lms_programme_authorities` | `lpa_public_read` | SELECT | anon, authenticated | ((active = true) AND (verification_status = 'verified'::text)) | — |
| `lms_programme_authorities` | `lpa_super_admin` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_programme_authority_policies` | `lpap_public_read` | SELECT | anon, authenticated | (active = true) | — |
| `lms_programme_authority_policies` | `lpap_super_admin` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_programme_enrolment_authority` | `lpea_public_read` | SELECT | anon, authenticated | true | — |
| `lms_programme_enrolment_authority` | `lpea_super_admin` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_programme_levels` | `lpl_public_read` | SELECT | anon, authenticated | (active = true) | — |
| `lms_programme_levels` | `lpl_super_admin` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_programme_progression` | `lpp_public_read` | SELECT | anon, authenticated | (active = true) | — |
| `lms_programme_progression` | `lpp_super_admin` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_programme_resources` | `lms_programme_resources_read` | SELECT | public | (EXISTS ( SELECT 1    FROM lms_programmes p   WHERE ((p.id = lms_programme_resources.programme_id) AND ((p.status = ANY (ARRAY['ready'::text, 'published'::text])) OR is_super_admin())))) | — |
| `lms_programme_schedules` | `lms_programme_schedules_read` | SELECT | public | (EXISTS ( SELECT 1    FROM lms_programmes p   WHERE ((p.id = lms_programme_schedules.programme_id) AND ((p.status = ANY (ARRAY['ready'::text, 'published'::text])) OR is_super_admin())))) | — |
| `lms_programme_topics` | `lms_programme_topics_read` | SELECT | public | (EXISTS ( SELECT 1    FROM lms_programmes p   WHERE ((p.id = lms_programme_topics.programme_id) AND ((p.status = ANY (ARRAY['ready'::text, 'published'::text])) OR is_super_admin())))) | — |
| `lms_programme_tracks` | `lpt_public_read` | SELECT | anon, authenticated | ((active = true) AND (status = ANY (ARRAY['ready'::text, 'published'::text]))) | — |
| `lms_programme_tracks` | `lpt_super_admin` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_programmes` | `lms_programmes_read` | SELECT | public | ((status = ANY (ARRAY['ready'::text, 'published'::text])) OR is_super_admin()) | — |
| `lms_qualification_frameworks` | `public read active qualification frameworks` | SELECT | anon, authenticated | (active = true) | — |
| `lms_qualification_frameworks` | `super admin manage qualification frameworks` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_retention_audit` | `super admins view retention audit` | SELECT | authenticated | is_super_admin() | — |
| `lms_rubric_criteria` | `rubric criteria manage` | ALL | authenticated | (EXISTS ( SELECT 1    FROM lms_rubrics r   WHERE ((r.id = lms_rubric_criteria.rubric_id) AND (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin) OR (r.created_by = ( SELECT auth.uid() AS uid)) OR ((r.course_id IS NOT NULL) AND ( SELECT private.lms_is_course_manager(r.course_id) AS lms_is_course_manager)))))) | (EXISTS ( SELECT 1    FROM lms_rubrics r   WHERE ((r.id = lms_rubric_criteria.rubric_id) AND (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin) OR (r.created_by = ( SELECT auth.uid() AS uid)) OR ((r.course_id IS NOT NULL) AND ( SELECT private.lms_is_course_manager(r.course_id) AS lms_is_course_manager)))))) |
| `lms_rubric_criteria` | `rubric criteria read authorised` | SELECT | authenticated | (EXISTS ( SELECT 1    FROM lms_rubrics r   WHERE ((r.id = lms_rubric_criteria.rubric_id) AND (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin) OR (r.created_by = ( SELECT auth.uid() AS uid)) OR ((r.course_id IS NOT NULL) AND ( SELECT private.lms_is_course_manager(r.course_id) AS lms_is_course_manager)))))) | — |
| `lms_rubric_scores` | `rubric scores manage authorised` | ALL | authenticated | (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin) OR (graded_by = ( SELECT auth.uid() AS uid))) | (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin) OR (graded_by = ( SELECT auth.uid() AS uid))) |
| `lms_rubric_scores` | `rubric scores read authorised` | SELECT | authenticated | ((graded_by = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin) OR (EXISTS ( SELECT 1    FROM (assignment_submissions s      JOIN learning_assignments a ON ((a.id = s.assignment_id)))   WHERE ((s.id = lms_rubric_scores.submission_id) AND (a.teacher_id = ( SELECT auth.uid() AS uid)))))) | — |
| `lms_rubrics` | `rubrics manage` | ALL | authenticated | (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin) OR (created_by = ( SELECT auth.uid() AS uid)) OR ((course_id IS NOT NULL) AND ( SELECT private.lms_is_course_manager(lms_rubrics.course_id) AS lms_is_course_manager))) | (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin) OR (created_by = ( SELECT auth.uid() AS uid)) OR ((course_id IS NOT NULL) AND ( SELECT private.lms_is_course_manager(lms_rubrics.course_id) AS lms_is_course_manager))) |
| `lms_rubrics` | `rubrics read authorised` | SELECT | authenticated | (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin) OR (created_by = ( SELECT auth.uid() AS uid)) OR ((course_id IS NOT NULL) AND ( SELECT private.lms_is_course_manager(lms_rubrics.course_id) AS lms_is_course_manager))) | — |
| `lms_tertiary_programme_catalogue` | `public read active tertiary catalogue` | SELECT | anon, authenticated | (active = true) | — |
| `lms_tertiary_programme_catalogue` | `super admin manage tertiary catalogue` | ALL | authenticated | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) | (EXISTS ( SELECT 1    FROM profiles p   WHERE ((p.id = auth.uid()) AND (p.role = 'super_admin'::text)))) |
| `lms_user_badges` | `badges award managers` | ALL | authenticated | (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) | (( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) |
| `lms_user_badges` | `own badges read` | SELECT | authenticated | ((user_id = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) | — |
| `media_items` | `Authenticated admins can read all media` | SELECT | authenticated | is_staff() | — |
| `media_items` | `Public can read published media` | SELECT | public | (published = true) | — |
| `media_items` | `Super Admin can delete media library items` | DELETE | authenticated | is_super_admin() | — |
| `media_items` | `Super Admin can insert media library items` | INSERT | authenticated | — | is_super_admin() |
| `media_items` | `Super Admin can update media library items` | UPDATE | authenticated | is_super_admin() | is_super_admin() |
| `messages` | `messages member insert` | INSERT | public | — | ((sender_id = auth.uid()) AND (EXISTS ( SELECT 1    FROM conversation_members m   WHERE ((m.conversation_id = messages.conversation_id) AND (m.user_id = auth.uid()))))) |
| `messages` | `messages members read` | SELECT | public | ((EXISTS ( SELECT 1    FROM conversation_members m   WHERE ((m.conversation_id = messages.conversation_id) AND (m.user_id = auth.uid())))) OR is_staff()) | — |
| `messages` | `messages staff moderation` | UPDATE | public | is_staff() | — |
| `moderation_reports` | `reports create` | INSERT | public | — | (reporter_id = auth.uid()) |
| `moderation_reports` | `reports reporter or staff` | SELECT | public | ((reporter_id = auth.uid()) OR is_staff()) | — |
| `moderation_reports` | `reports staff update` | UPDATE | public | is_staff() | — |
| `parent_learning_notifications` | `parent notifications read own` | SELECT | authenticated | ((parent_id = auth.uid()) OR (student_id = auth.uid()) OR is_staff() OR is_admin()) | — |
| `parent_links` | `child creates parent link` | INSERT | public | — | (child_id = auth.uid()) |
| `parent_links` | `parent links participant read` | SELECT | public | ((child_id = auth.uid()) OR (parent_id = auth.uid()) OR is_admin()) | — |
| `parent_links` | `parent/admin manages link` | UPDATE | public | ((parent_id = auth.uid()) OR is_admin()) | — |
| `payment_orders` | `orders create` | INSERT | public | — | ((user_id = auth.uid()) OR is_staff()) |
| `payment_orders` | `orders own read` | SELECT | public | ((user_id = auth.uid()) OR is_staff()) | — |
| `payment_orders` | `orders staff update` | UPDATE | public | is_staff() | — |
| `payment_provider_settings` | `public reads enabled payment methods` | SELECT | public | (enabled = true) | — |
| `payment_provider_settings` | `super admin manages payment methods` | ALL | public | is_super_admin() | is_super_admin() |
| `payroll_items` | `payroll items read` | SELECT | authenticated | (is_super_admin() OR (EXISTS ( SELECT 1    FROM payroll_runs r   WHERE ((r.id = payroll_items.payroll_run_id) AND is_school_member(r.school_id, ARRAY['school_admin'::text])))) OR (EXISTS ( SELECT 1    FROM staff_records s   WHERE ((s.id = payroll_items.staff_record_id) AND (s.staff_user_id = auth.uid()))))) | — |
| `payroll_runs` | `payroll insert retained records` | INSERT | authenticated | — | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `payroll_runs` | `payroll select retained records` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | — |
| `payroll_runs` | `payroll update retained records` | UPDATE | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `person_signatures` | `signatures own` | ALL | authenticated | (is_super_admin() OR (person_id = auth.uid()) OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR (person_id = auth.uid()) OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `premium_service_grants` | `premium grants super admin` | ALL | authenticated | is_super_admin() | is_super_admin() |
| `profiles` | `profiles self insert` | INSERT | authenticated | — | (id = auth.uid()) |
| `profiles` | `profiles self read` | SELECT | authenticated | (id = auth.uid()) | — |
| `profiles` | `profiles self update` | UPDATE | authenticated | (id = auth.uid()) | (id = auth.uid()) |
| `quiz_assignments` | `quiz assignments read authorised` | SELECT | authenticated | ((student_id = auth.uid()) OR (teacher_id = auth.uid()) OR is_staff() OR is_admin() OR (EXISTS ( SELECT 1    FROM school_classes c   WHERE ((c.id = quiz_assignments.class_id) AND is_school_member(c.school_id, ARRAY['school_admin'::text]))))) | — |
| `quiz_attempts` | `quiz attempts read authorised` | SELECT | authenticated | ((student_id = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin) OR (EXISTS ( SELECT 1    FROM quiz_assignments qa   WHERE ((qa.quiz_id = quiz_attempts.quiz_id) AND (qa.teacher_id = ( SELECT auth.uid() AS uid)))))) | — |
| `quiz_questions` | `quiz questions read privacy aware` | SELECT | authenticated | (EXISTS ( SELECT 1    FROM learning_quizzes q   WHERE ((q.id = quiz_questions.quiz_id) AND (((q.learning_mode = 'self_directed'::text) AND (q.created_by = auth.uid())) OR is_staff() OR is_admin() OR (EXISTS ( SELECT 1            FROM quiz_assignments qa           WHERE ((qa.quiz_id = q.id) AND ((qa.student_id = auth.uid()) OR (qa.teacher_id = auth.uid()))))))))) | — |
| `result_deletion_audit` | `result_deletion_audit_select` | SELECT | authenticated | (is_super_admin() OR is_school_admin_for(school_id)) | — |
| `result_release_notifications` | `result release own read` | SELECT | authenticated | ((recipient_id = auth.uid()) OR is_super_admin()) | — |
| `safety_alerts` | `safety parent summary` | SELECT | public | is_parent_of(user_id) | — |
| `safety_alerts` | `safety staff` | ALL | public | is_staff() | is_staff() |
| `school_academic_sessions` | `sessions admin delete` | DELETE | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | — |
| `school_academic_sessions` | `sessions admin insert` | INSERT | authenticated | — | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_academic_sessions` | `sessions admin update` | UPDATE | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_academic_sessions` | `sessions read scoped` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id)) | — |
| `school_announcements` | `school admins manage announcements` | ALL | public | is_school_admin_for(school_id) | is_school_admin_for(school_id) |
| `school_assessment_scales` | `scales admin` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_assessment_traits` | `traits admin` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_assignment_items` | `assignment items teacher manage` | ALL | authenticated | (EXISTS ( SELECT 1    FROM school_assignment_tasks t   WHERE ((t.id = school_assignment_items.task_id) AND (is_super_admin() OR (t.teacher_id = auth.uid()) OR is_school_admin_for(t.school_id))))) | (EXISTS ( SELECT 1    FROM school_assignment_tasks t   WHERE ((t.id = school_assignment_items.task_id) AND (is_super_admin() OR (t.teacher_id = auth.uid()) OR is_school_admin_for(t.school_id))))) |
| `school_assignment_submissions` | `assignment submissions admin delete` | DELETE | authenticated | (is_super_admin() OR (EXISTS ( SELECT 1    FROM school_assignment_tasks t   WHERE ((t.id = school_assignment_submissions.task_id) AND is_school_member(t.school_id, ARRAY['school_admin'::text]))))) | — |
| `school_assignment_submissions` | `assignment submissions scoped read` | SELECT | authenticated | ((student_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM school_assignment_tasks t   WHERE ((t.id = school_assignment_submissions.task_id) AND (is_super_admin() OR is_school_member(t.school_id, ARRAY['school_admin'::text]) OR (t.teacher_id = auth.uid())))))) | — |
| `school_assignment_submissions` | `assignment submissions student insert` | INSERT | authenticated | — | ((student_id = auth.uid()) AND assignment_student_is_target(task_id, auth.uid()) AND (score IS NULL) AND (graded_at IS NULL)) |
| `school_assignment_submissions` | `assignment submissions teacher update` | UPDATE | authenticated | (EXISTS ( SELECT 1    FROM school_assignment_tasks t   WHERE ((t.id = school_assignment_submissions.task_id) AND (is_super_admin() OR (t.teacher_id = auth.uid()) OR is_school_admin_for(t.school_id))))) | ((score = ( SELECT s.score    FROM school_assignment_submissions s   WHERE (s.id = school_assignment_submissions.id))) AND (graded_at = ( SELECT s.graded_at    FROM school_assignment_submissions s   WHERE (s.id = school_assignment_submissions.id)))) |
| `school_assignment_targets` | `assignment targets authorised` | ALL | authenticated | (EXISTS ( SELECT 1    FROM school_assignment_tasks t   WHERE ((t.id = school_assignment_targets.task_id) AND (is_super_admin() OR (t.teacher_id = auth.uid()) OR is_school_admin_for(t.school_id))))) | (EXISTS ( SELECT 1    FROM school_assignment_tasks t   WHERE ((t.id = school_assignment_targets.task_id) AND (is_super_admin() OR (t.teacher_id = auth.uid()) OR is_school_admin_for(t.school_id))))) |
| `school_assignment_tasks` | `assignment tasks strict` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR ((teacher_id = auth.uid()) AND (subject_id IS NOT NULL) AND is_subject_teacher_for(class_id, subject_id))) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR ((teacher_id = auth.uid()) AND (subject_id IS NOT NULL) AND is_subject_teacher_for(class_id, subject_id))) |
| `school_attendance_settings` | `attendance settings authorised` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_calendar_events` | `school admins manage calendar` | ALL | public | is_school_admin_for(school_id) | is_school_admin_for(school_id) |
| `school_cbt_attempts` | `cbt attempts admin delete` | DELETE | authenticated | (is_super_admin() OR (EXISTS ( SELECT 1    FROM school_cbt_exams e   WHERE ((e.id = school_cbt_attempts.exam_id) AND is_school_member(e.school_id, ARRAY['school_admin'::text]))))) | — |
| `school_cbt_attempts` | `cbt attempts scoped read` | SELECT | authenticated | ((student_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM school_cbt_exams e   WHERE ((e.id = school_cbt_attempts.exam_id) AND (is_super_admin() OR is_school_member(e.school_id, ARRAY['school_admin'::text]) OR (e.teacher_id = auth.uid())))))) | — |
| `school_cbt_attempts` | `cbt attempts student insert` | INSERT | authenticated | — | ((student_id = auth.uid()) AND (EXISTS ( SELECT 1    FROM school_cbt_exams e   WHERE ((e.id = school_cbt_attempts.exam_id) AND (e.status = ANY (ARRAY['draft'::text, 'scheduled'::text, 'active'::text])) AND (EXISTS ( SELECT 1            FROM class_members cm           WHERE ((cm.class_id = e.class_id) AND (cm.user_id = auth.uid()) AND (cm.role = 'student'::text)))))))) |
| `school_cbt_attempts` | `cbt attempts student update` | UPDATE | authenticated | ((student_id = auth.uid()) AND (submitted_at IS NULL)) | ((student_id = auth.uid()) AND (submitted_at IS NULL)) |
| `school_cbt_attempts` | `cbt attempts teacher update` | UPDATE | authenticated | (is_super_admin() OR (EXISTS ( SELECT 1    FROM school_cbt_exams e   WHERE ((e.id = school_cbt_attempts.exam_id) AND (is_school_member(e.school_id, ARRAY['school_admin'::text]) OR (e.teacher_id = auth.uid())))))) | (is_super_admin() OR (EXISTS ( SELECT 1    FROM school_cbt_exams e   WHERE ((e.id = school_cbt_attempts.exam_id) AND (is_school_member(e.school_id, ARRAY['school_admin'::text]) OR (e.teacher_id = auth.uid())))))) |
| `school_cbt_exam_assignments` | `cbt assignments staff manage` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (assigned_by = auth.uid())) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (assigned_by = auth.uid())) |
| `school_cbt_exam_assignments` | `cbt assignments students read own` | SELECT | authenticated | (student_id = auth.uid()) | — |
| `school_cbt_exam_attempts` | `cbt attempts read authorised` | SELECT | authenticated | ((student_id = auth.uid()) OR is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (EXISTS ( SELECT 1    FROM school_cbt_exams e   WHERE ((e.id = school_cbt_exam_attempts.exam_id) AND (e.teacher_id = auth.uid()))))) | — |
| `school_cbt_exam_attempts` | `cbt attempts student create own` | INSERT | authenticated | — | (student_id = auth.uid()) |
| `school_cbt_exam_attempts` | `cbt attempts student update own` | UPDATE | authenticated | (student_id = auth.uid()) | (student_id = auth.uid()) |
| `school_cbt_exam_media` | `cbt media school scoped` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text, 'teacher'::text]) OR (uploaded_by = auth.uid())) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text, 'teacher'::text]) OR (uploaded_by = auth.uid())) |
| `school_cbt_exam_questions` | `cbt questions teacher/admin manage` | ALL | authenticated | (EXISTS ( SELECT 1    FROM school_cbt_exams e   WHERE ((e.id = school_cbt_exam_questions.exam_id) AND (is_super_admin() OR is_school_member(e.school_id, ARRAY['school_admin'::text]) OR (e.teacher_id = auth.uid()))))) | (EXISTS ( SELECT 1    FROM school_cbt_exams e   WHERE ((e.id = school_cbt_exam_questions.exam_id) AND (is_super_admin() OR is_school_member(e.school_id, ARRAY['school_admin'::text]) OR (e.teacher_id = auth.uid()))))) |
| `school_cbt_exam_questions_student` | `cbt student questions assigned only` | SELECT | authenticated | ((EXISTS ( SELECT 1    FROM school_cbt_exam_assignments a   WHERE ((a.exam_id = school_cbt_exam_questions_student.exam_id) AND (a.student_id = auth.uid())))) OR is_super_admin()) | — |
| `school_cbt_exams` | `cbt exams assigned students read` | SELECT | authenticated | (EXISTS ( SELECT 1    FROM school_cbt_exam_assignments a   WHERE ((a.exam_id = school_cbt_exams.id) AND (a.student_id = auth.uid()) AND (a.school_id = school_cbt_exams.school_id)))) | — |
| `school_cbt_exams` | `cbt exams teacher/admin manage` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR ((teacher_id = auth.uid()) AND is_assigned_teacher_for_subject_name(class_id, subject))) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR ((teacher_id = auth.uid()) AND is_assigned_teacher_for_subject_name(class_id, subject))) |
| `school_cbt_question_resources` | `cbt resource links school scoped` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text, 'teacher'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text, 'teacher'::text])) |
| `school_classes` | `school classes admin manage` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_classes` | `school classes scoped read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id)) | — |
| `school_curricula` | `school_curricula_manage` | ALL | public | (is_school_admin_for(school_id) OR is_super_admin()) | (is_school_admin_for(school_id) OR is_super_admin()) |
| `school_curricula` | `school_curricula_read` | SELECT | public | (is_school_member(school_id) OR is_super_admin()) | — |
| `school_election_candidates` | `election candidates read` | SELECT | authenticated | (is_super_admin() OR (EXISTS ( SELECT 1    FROM (school_election_positions p      JOIN school_elections e ON ((e.id = p.election_id)))   WHERE ((p.id = school_election_candidates.position_id) AND is_school_member(e.school_id))))) | — |
| `school_election_positions` | `election positions admin` | ALL | authenticated | (is_super_admin() OR (EXISTS ( SELECT 1    FROM school_elections e   WHERE ((e.id = school_election_positions.election_id) AND is_school_member(e.school_id, ARRAY['school_admin'::text]))))) | (is_super_admin() OR (EXISTS ( SELECT 1    FROM school_elections e   WHERE ((e.id = school_election_positions.election_id) AND is_school_member(e.school_id, ARRAY['school_admin'::text]))))) |
| `school_election_voters` | `election voters own` | SELECT | authenticated | ((voter_id = auth.uid()) OR is_super_admin() OR (EXISTS ( SELECT 1    FROM school_elections e   WHERE ((e.id = school_election_voters.election_id) AND is_school_member(e.school_id, ARRAY['school_admin'::text]))))) | — |
| `school_election_votes` | `election vote insert` | INSERT | authenticated | — | ((voter_id = auth.uid()) AND (EXISTS ( SELECT 1    FROM school_election_voters v   WHERE ((v.election_id = school_election_votes.election_id) AND (v.voter_id = auth.uid()) AND (v.verified_at IS NOT NULL))))) |
| `school_elections` | `election admin` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_fee_payments` | `fee payments admin insert` | INSERT | authenticated | — | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_fee_payments` | `fee payments admin update` | UPDATE | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_fee_payments` | `fee payments scoped read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (student_id = auth.uid()) OR is_parent_of(student_id)) | — |
| `school_fee_schedules` | `fees admin` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_id_card_templates` | `id card templates admin` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_member_invites` | `school_member_invites_manage` | ALL | authenticated | (is_super_admin() OR is_school_admin_for(school_id)) | (is_super_admin() OR is_school_admin_for(school_id)) |
| `school_member_invites` | `school_member_invites_select` | SELECT | authenticated | (is_super_admin() OR is_school_admin_for(school_id)) | — |
| `school_members` | `school members admin manage` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_members` | `school members scoped read` | SELECT | authenticated | (is_super_admin() OR (user_id = auth.uid()) OR is_school_member(school_id)) | — |
| `school_profile_fields` | `profile fields tenant` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text, 'teacher'::text, 'student'::text, 'parent'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_receipts` | `receipts tenant` | SELECT | authenticated | (is_super_admin() OR (is_school_member(school_id) AND ((student_id IS NULL) OR (student_id = auth.uid()) OR is_parent_of(student_id)))) | — |
| `school_result_components` | `school result tenant manage` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_result_components` | `school result tenant read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id)) | — |
| `school_result_publications` | `result publications admin publish` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_result_publications` | `result publications scoped read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR is_class_teacher_for(class_id) OR (published AND ((student_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM parent_links pl   WHERE ((pl.parent_id = auth.uid()) AND (pl.child_id = school_result_publications.student_id) AND (pl.status = 'active'::text))))))) | — |
| `school_sensitive_access` | `sensitive access school admin` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_subjects` | `school subjects admin manage` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_subjects` | `school subjects scoped read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id)) | — |
| `school_subjects` | `subjects tenant` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id)) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `school_terms` | `school terms manage` | ALL | authenticated | (EXISTS ( SELECT 1    FROM school_academic_sessions s   WHERE ((s.id = school_terms.session_id) AND (is_school_member(s.school_id, ARRAY['school_admin'::text]) OR is_super_admin())))) | (EXISTS ( SELECT 1    FROM school_academic_sessions s   WHERE ((s.id = school_terms.session_id) AND (is_school_member(s.school_id, ARRAY['school_admin'::text]) OR is_super_admin())))) |
| `school_terms` | `school terms tenant` | SELECT | authenticated | (EXISTS ( SELECT 1    FROM school_academic_sessions s   WHERE ((s.id = school_terms.session_id) AND (is_school_member(s.school_id) OR is_staff() OR is_admin())))) | — |
| `schools` | `schools admin manage own` | UPDATE | authenticated | (is_super_admin() OR is_school_member(id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(id, ARRAY['school_admin'::text])) |
| `schools` | `schools scoped read` | SELECT | authenticated | (is_super_admin() OR is_school_member(id)) | — |
| `service_consents` | `consents own insert` | INSERT | public | — | (user_id = auth.uid()) |
| `service_consents` | `consents own read` | SELECT | public | ((user_id = auth.uid()) OR is_super_admin()) | — |
| `service_enquiries` | `enquiries create` | INSERT | public | — | ((user_id IS NULL) OR (user_id = auth.uid())) |
| `service_enquiries` | `enquiries own or staff` | SELECT | public | ((user_id = auth.uid()) OR is_staff()) | — |
| `service_enquiries` | `enquiries staff update` | UPDATE | public | is_staff() | — |
| `site_announcements` | `public reads active announcements` | SELECT | public | ((published = true) AND ((starts_at IS NULL) OR (starts_at <= now())) AND ((ends_at IS NULL) OR (ends_at >= now()))) | — |
| `site_announcements` | `super admin manages announcements` | ALL | public | is_super_admin() | is_super_admin() |
| `site_settings` | `public can read site settings` | SELECT | public | true | — |
| `site_settings` | `super admin writes site settings` | ALL | public | is_super_admin() | is_super_admin() |
| `staff_pay_structures` | `staff pay structures admin insert` | INSERT | authenticated | — | (is_super_admin() OR (EXISTS ( SELECT 1    FROM staff_records sr   WHERE ((sr.id = staff_pay_structures.staff_record_id) AND is_school_member(sr.school_id, ARRAY['school_admin'::text]))))) |
| `staff_pay_structures` | `staff pay structures admin update` | UPDATE | authenticated | (is_super_admin() OR (EXISTS ( SELECT 1    FROM staff_records sr   WHERE ((sr.id = staff_pay_structures.staff_record_id) AND is_school_member(sr.school_id, ARRAY['school_admin'::text]))))) | (is_super_admin() OR (EXISTS ( SELECT 1    FROM staff_records sr   WHERE ((sr.id = staff_pay_structures.staff_record_id) AND is_school_member(sr.school_id, ARRAY['school_admin'::text]))))) |
| `staff_pay_structures` | `staff pay structures read` | SELECT | authenticated | (is_super_admin() OR (EXISTS ( SELECT 1    FROM staff_records sr   WHERE ((sr.id = staff_pay_structures.staff_record_id) AND ((sr.staff_user_id = auth.uid()) OR is_school_member(sr.school_id, ARRAY['school_admin'::text])))))) | — |
| `staff_records` | `staff records admin insert` | INSERT | authenticated | — | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `staff_records` | `staff records admin update` | UPDATE | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `staff_records` | `staff records scoped read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (staff_user_id = auth.uid())) | — |
| `student_attendance` | `attendance class teacher insert` | INSERT | authenticated | — | can_manage_attendance(school_id, class_id, student_id) |
| `student_attendance` | `attendance class teacher update` | UPDATE | authenticated | can_manage_attendance(school_id, class_id, student_id) | can_manage_attendance(school_id, class_id, student_id) |
| `student_attendance` | `attendance scoped read` | SELECT | authenticated | can_view_attendance(school_id, class_id, student_id) | — |
| `student_attendance` | `attendance super admin delete` | DELETE | authenticated | is_super_admin() | — |
| `student_attendance` | `attendance super admin update` | UPDATE | authenticated | is_super_admin() | is_super_admin() |
| `student_class_history` | `student_class_history_insert` | INSERT | authenticated | — | (is_super_admin() OR is_school_admin_for(school_id)) |
| `student_class_history` | `student_class_history_select` | SELECT | authenticated | (is_super_admin() OR is_school_admin_for(school_id) OR (student_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM parent_links pl   WHERE ((pl.parent_id = auth.uid()) AND (pl.child_id = student_class_history.student_id) AND (pl.status = 'approved'::text))))) | — |
| `student_emergency_profiles` | `emergency admin insert` | INSERT | authenticated | — | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `student_emergency_profiles` | `emergency admin update` | UPDATE | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `student_emergency_profiles` | `emergency scoped read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (student_id = auth.uid()) OR is_parent_of(student_id) OR (EXISTS ( SELECT 1    FROM (school_sensitive_access a      JOIN class_members cm ON ((cm.class_id = a.class_id)))   WHERE ((a.school_id = student_emergency_profiles.school_id) AND a.enabled AND (cm.user_id = auth.uid()) AND (cm.role = 'teacher'::text))))) | — |
| `student_fee_adjustments` | `fee adjustments admin insert` | INSERT | authenticated | — | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `student_fee_adjustments` | `fee adjustments admin update` | UPDATE | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `student_fee_adjustments` | `fee adjustments scoped read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (student_id = auth.uid()) OR is_parent_of(student_id)) | — |
| `student_growth_records` | `growth admin update` | UPDATE | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `student_growth_records` | `growth scoped read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (student_id = auth.uid()) OR is_parent_of(student_id) OR (EXISTS ( SELECT 1    FROM (school_classes c      JOIN class_members cm ON ((cm.class_id = c.id)))   WHERE ((c.school_id = student_growth_records.school_id) AND (cm.user_id = auth.uid()) AND (cm.role = 'teacher'::text) AND is_class_teacher_for(c.id) AND (cm.user_id = student_growth_records.student_id))))) | — |
| `student_growth_records` | `growth teacher insert` | INSERT | authenticated | — | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (EXISTS ( SELECT 1    FROM school_classes c   WHERE ((c.school_id = student_growth_records.school_id) AND is_class_teacher_for(c.id) AND (EXISTS ( SELECT 1            FROM class_members cm           WHERE ((cm.class_id = c.id) AND (cm.user_id = student_growth_records.student_id) AND (cm.role = 'student'::text)))))))) |
| `student_guardians` | `guardian admin insert` | INSERT | authenticated | — | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `student_guardians` | `guardian admin update` | UPDATE | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `student_guardians` | `guardian scoped read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR is_parent_of(student_id) OR (EXISTS ( SELECT 1    FROM (school_sensitive_access a      JOIN class_members cm ON ((cm.class_id = a.class_id)))   WHERE ((a.school_id = student_guardians.school_id) AND a.enabled AND (cm.user_id = auth.uid()) AND (cm.role = 'teacher'::text))))) | — |
| `student_result_entries` | `result entries scoped read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR is_subject_teacher_for(class_id, subject_id) OR (is_class_teacher_for(class_id) AND (EXISTS ( SELECT 1    FROM school_result_components c   WHERE ((c.id = student_result_entries.component_id) AND (c.component_type = ANY (ARRAY['midterm'::text, 'exam'::text])))))) OR can_view_published_result(school_id, class_id, student_id, session_id, term_no)) | — |
| `student_result_entries` | `result entries subject teacher insert` | INSERT | authenticated | — | can_manage_result_entry(school_id, class_id, subject_id, student_id) |
| `student_result_entries` | `result entries super admin delete` | DELETE | authenticated | is_super_admin() | — |
| `student_result_entries` | `result entries super admin update` | UPDATE | authenticated | is_super_admin() | is_super_admin() |
| `student_school_records` | `student records class teacher admin manage` | INSERT | authenticated | — | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (EXISTS ( SELECT 1    FROM (school_classes c      JOIN class_members cm ON (((cm.class_id = c.id) AND (cm.user_id = student_school_records.student_id) AND (cm.role = 'student'::text))))   WHERE ((c.school_id = student_school_records.school_id) AND is_class_teacher_for(c.id))))) |
| `student_school_records` | `student records class teacher admin student read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (student_id = auth.uid()) OR (EXISTS ( SELECT 1    FROM (school_classes c      JOIN class_members cm ON (((cm.class_id = c.id) AND (cm.user_id = student_school_records.student_id) AND (cm.role = 'student'::text))))   WHERE ((c.school_id = student_school_records.school_id) AND is_class_teacher_for(c.id))))) | — |
| `student_school_records` | `student records class teacher admin update` | UPDATE | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (EXISTS ( SELECT 1    FROM (school_classes c      JOIN class_members cm ON (((cm.class_id = c.id) AND (cm.user_id = student_school_records.student_id) AND (cm.role = 'student'::text))))   WHERE ((c.school_id = student_school_records.school_id) AND is_class_teacher_for(c.id))))) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (EXISTS ( SELECT 1    FROM (school_classes c      JOIN class_members cm ON (((cm.class_id = c.id) AND (cm.user_id = student_school_records.student_id) AND (cm.role = 'student'::text))))   WHERE ((c.school_id = student_school_records.school_id) AND is_class_teacher_for(c.id))))) |
| `student_school_status_history` | `school lifecycle history admin insert` | INSERT | authenticated | — | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `student_school_status_history` | `school lifecycle history scoped read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (student_id = auth.uid()) OR is_parent_of(student_id)) | — |
| `student_sensitive_records` | `sensitive records admin insert` | INSERT | authenticated | — | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `student_sensitive_records` | `sensitive records admin update` | UPDATE | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `student_sensitive_records` | `sensitive records scoped read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (student_id = auth.uid()) OR is_parent_of(student_id) OR (EXISTS ( SELECT 1    FROM (school_sensitive_access a      JOIN class_members cm ON ((cm.class_id = a.class_id)))   WHERE ((a.school_id = student_sensitive_records.school_id) AND a.enabled AND (cm.user_id = auth.uid()) AND (cm.role = 'teacher'::text))))) | — |
| `student_term_summaries` | `result summaries scoped read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR is_class_teacher_for(class_id) OR is_subject_teacher_for(class_id, subject_id) OR can_view_published_result(school_id, class_id, student_id, session_id, term_no)) | — |
| `student_trait_assessments` | `trait assessments admin update` | UPDATE | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text])) |
| `student_trait_assessments` | `trait assessments scoped read` | SELECT | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (student_id = auth.uid()) OR is_parent_of(student_id) OR (assessed_by = auth.uid())) | — |
| `student_trait_assessments` | `trait assessments teacher insert` | INSERT | authenticated | — | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (assessed_by = auth.uid())) |
| `subscription_feature_grants` | `subscription grants own read` | SELECT | authenticated | (EXISTS ( SELECT 1    FROM subscriptions s   WHERE ((s.id = subscription_feature_grants.subscription_id) AND ((s.user_id = auth.uid()) OR is_staff())))) | — |
| `subscription_features` | `subscription features public read` | SELECT | anon, authenticated | true | — |
| `subscription_plans` | `subscription plans active read` | SELECT | anon, authenticated | ((active = true) OR is_staff() OR is_admin()) | — |
| `subscription_plans` | `subscription plans staff manage` | ALL | authenticated | (is_staff() OR is_admin()) | (is_staff() OR is_admin()) |
| `subscription_tool_entitlements` | `tool entitlements super admin` | ALL | authenticated | is_super_admin() | is_super_admin() |
| `subscriptions` | `subscriptions create self` | INSERT | public | — | ((user_id = auth.uid()) OR is_staff()) |
| `subscriptions` | `subscriptions own read` | SELECT | public | ((user_id = auth.uid()) OR is_staff()) | — |
| `subscriptions` | `subscriptions staff update` | UPDATE | public | is_staff() | — |
| `suggestions` | `suggestions create` | INSERT | public | — | ((user_id IS NULL) OR (user_id = auth.uid())) |
| `suggestions` | `suggestions own or staff` | SELECT | public | ((user_id = auth.uid()) OR is_staff()) | — |
| `suggestions` | `suggestions staff update` | UPDATE | public | is_staff() | — |
| `teacher_question_banks` | `question banks scoped` | ALL | authenticated | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (is_teacher_for_subject_in_school(school_id, subject) AND (teacher_id = auth.uid()))) | (is_super_admin() OR is_school_member(school_id, ARRAY['school_admin'::text]) OR (is_teacher_for_subject_in_school(school_id, subject) AND (teacher_id = auth.uid()))) |
| `teacher_question_items` | `question items scoped` | ALL | authenticated | (EXISTS ( SELECT 1    FROM teacher_question_banks b   WHERE ((b.id = teacher_question_items.bank_id) AND (is_super_admin() OR is_school_member(b.school_id, ARRAY['school_admin'::text]) OR (b.teacher_id = auth.uid()))))) | (EXISTS ( SELECT 1    FROM teacher_question_banks b   WHERE ((b.id = teacher_question_items.bank_id) AND (is_super_admin() OR is_school_member(b.school_id, ARRAY['school_admin'::text]) OR (b.teacher_id = auth.uid()))))) |
| `ui_translation_resources` | `ui_translation_resources_public_read` | SELECT | anon, authenticated | (status = 'published'::text) | — |
| `ui_translation_resources` | `ui_translation_resources_super_admin` | ALL | authenticated | is_super_admin() | is_super_admin() |
| `user_notifications` | `super admin creates notifications` | ALL | public | is_super_admin() | is_super_admin() |
| `user_notifications` | `user marks own notifications` | UPDATE | public | (user_id = auth.uid()) | (user_id = auth.uid()) |
| `user_notifications` | `user reads own notifications` | SELECT | public | (user_id = auth.uid()) | — |

## Public SQL functions

Signatures are listed for dependency mapping. Function bodies and security-definer behaviour still need separate extraction and review before porting.

| Function | Arguments | Returns | Security definer | Language |
|---|---|---|---|---|
| `activate_school_membership_for_current_user` | `` | `void` | true | sql |
| `assignment_student_is_target` | `p_task_id uuid, p_student_id uuid` | `boolean` | true | sql |
| `audit_student_school_status` | `` | `trigger` | true | plpgsql |
| `bind_premium_grants_to_profile` | `` | `trigger` | true | plpgsql |
| `calculate_student_subject_term` | `p_session uuid, p_term integer, p_class uuid, p_student uuid, p_subject uuid` | `TABLE(ca_total numeric, test_total numeric, midterm_total numeric, exam_total numeric, term_total numeric, term_percentage numeric, first_term_brought_forward numeric, cumulative_percentage numeric)` | true | plpgsql |
| `can_manage_attendance` | `p_school uuid, p_class uuid, p_student uuid` | `boolean` | true | sql |
| `can_manage_result_entry` | `p_school uuid, p_class uuid, p_subject uuid, p_student uuid` | `boolean` | true | sql |
| `can_view_attendance` | `p_school uuid, p_class uuid, p_student uuid` | `boolean` | true | sql |
| `can_view_published_result` | `p_school uuid, p_class uuid, p_student uuid, p_session uuid, p_term integer` | `boolean` | true | sql |
| `claim_cloudflare_resource_packs` | `p_limit integer` | `SETOF lms_curriculum_resource_packs` | true | plpgsql |
| `claim_curriculum_asset_jobs` | `p_limit integer` | `SETOF lms_curriculum_asset_jobs` | true | plpgsql |
| `claim_curriculum_content_jobs` | `p_limit integer` | `SETOF lms_curriculum_content_jobs` | true | plpgsql |
| `create_friend_conversation` | `` | `trigger` | true | plpgsql |
| `create_school_assignment_from_lms_quiz` | `p_school_id uuid, p_class_id uuid, p_subject_id uuid, p_teacher_id uuid, p_quiz_id uuid, p_title text, p_instructions text, p_due_at timestamp with time zone, p_question_count integer, p_randomise boolean, p_all_students boolean, p_include_students uuid[], p_exclude_students uuid[]` | `uuid` | true | plpgsql |
| `create_school_for_current_user` | `p_name text, p_logo_url text, p_primary_color text, p_country text, p_currency text` | `schools` | true | plpgsql |
| `create_school_for_current_user_v2` | `p_name text, p_logo_url text, p_primary_color text, p_country text, p_currency text, p_curricula text[], p_state_or_region text` | `schools` | true | plpgsql |
| `enforce_single_super_admin` | `` | `trigger` | true | plpgsql |
| `enqueue_missing_curriculum_assets` | `p_curriculum_id text, p_limit integer` | `integer` | true | plpgsql |
| `generate_phenom_user_id` | `` | `text` | true | plpgsql |
| `get_classmates` | `p_class uuid` | `TABLE(user_id uuid, full_name text, email text, avatar_url text, passport_url text)` | true | sql |
| `get_my_phenom_user_id` | `` | `text` | true | sql |
| `get_student_assignment_items` | `p_task_id uuid` | `TABLE(id uuid, "position" integer, question_text text, options jsonb, image_url text, marks numeric, explanation text)` | true | sql |
| `get_teacher_assignment_items` | `p_task_id uuid` | `TABLE(id uuid, "position" integer, question_text text, options jsonb, correct_answer text, explanation text, image_url text, marks numeric, source_type text, source_id uuid)` | true | sql |
| `grade_school_assignment_submission` | `p_submission_id uuid` | `school_assignment_submissions` | true | plpgsql |
| `handle_new_user` | `` | `trigger` | true | plpgsql |
| `has_premium_access` | `p_service_code text, p_user_id uuid` | `boolean` | true | sql |
| `is_admin` | `` | `boolean` | true | sql |
| `is_assigned_teacher_for_subject_name` | `p_class uuid, p_subject_name text` | `boolean` | true | sql |
| `is_class_teacher_for` | `p_class uuid` | `boolean` | true | sql |
| `is_parent_of` | `child uuid` | `boolean` | true | sql |
| `is_school_admin_for` | `p_school uuid` | `boolean` | true | sql |
| `is_school_member` | `p_school uuid, p_roles text[]` | `boolean` | true | sql |
| `is_staff` | `` | `boolean` | true | sql |
| `is_subject_teacher_for` | `p_class uuid, p_subject uuid` | `boolean` | true | sql |
| `is_super_admin` | `` | `boolean` | true | sql |
| `is_teacher_for` | `p_school uuid` | `boolean` | true | sql |
| `is_teacher_for_subject_in_school` | `p_school uuid, p_subject_name text` | `boolean` | true | sql |
| `list_school_lms_assessment_sources` | `p_school_id uuid, p_subject text, p_topic text, p_level integer` | `TABLE(id uuid, subject text, topic text, level integer, language text, question_count integer, duration_minutes integer, generation_source text)` | true | sql |
| `lookup_auth_email_by_phenom_user_id` | `p_phenom_user_id text` | `text` | true | sql |
| `lookup_phenom_profile` | `p_email text, p_user_id text` | `jsonb` | false | sql |
| `mark_message_assignment_retained` | `p_message_id uuid` | `void` | true | plpgsql |
| `notify_assignment_result` | `` | `trigger` | true | plpgsql |
| `prevent_assignment_score_tampering` | `` | `trigger` | true | plpgsql |
| `prevent_result_mutation` | `` | `trigger` | true | plpgsql |
| `promote_student` | `p_school_id uuid, p_student_id uuid, p_new_class_id uuid, p_action text, p_session_id uuid, p_term_no integer, p_reason text` | `void` | true | plpgsql |
| `protect_profile_privileged_fields` | `` | `trigger` | true | plpgsql |
| `purge_expired_ephemeral_communications` | `` | `integer` | true | plpgsql |
| `queue_result_release_notifications` | `` | `trigger` | true | plpgsql |
| `refresh_student_term_summary` | `` | `trigger` | true | plpgsql |
| `regrade_assignment_task` | `p_task_id uuid` | `void` | true | plpgsql |
| `require_result_deletion_audit` | `` | `trigger` | true | plpgsql |
| `school_has_premium_lms_access` | `p_school_id uuid` | `boolean` | true | sql |
| `set_my_onboarding_choice` | `p_account_category text, p_onboarding_role text` | `profiles` | true | plpgsql |
| `set_school_curricula` | `p_school_id uuid, p_curricula text[], p_state_or_region text` | `void` | true | plpgsql |
| `submit_school_assignment` | `p_task_id uuid, p_answers jsonb` | `school_assignment_submissions` | true | plpgsql |
| `subscribe_email` | `p_email text` | `void` | true | plpgsql |
| `super_admin_delete_result_entry` | `p_result_entry_id uuid, p_reason text` | `void` | true | plpgsql |
| `sync_curriculum_asset_to_library` | `` | `trigger` | true | plpgsql |
| `touch_school_cbt_exam_updated_at` | `` | `trigger` | false | plpgsql |
| `trg_regrade_assignment_after_item_change` | `` | `trigger` | true | plpgsql |
| `update_school_assignment_item` | `p_item_id uuid, p_question_text text, p_options jsonb, p_correct_answer text, p_explanation text, p_marks numeric` | `void` | true | plpgsql |
| `validate_class_member_assignment` | `` | `trigger` | true | plpgsql |
| `validate_class_subject_assignment` | `` | `trigger` | true | plpgsql |
| `validate_school_class_assignment` | `` | `trigger` | true | plpgsql |
| `validate_student_attendance` | `` | `trigger` | true | plpgsql |
| `validate_student_result_entry` | `` | `trigger` | true | plpgsql |
| `verify_lms_certificate` | `p_code text` | `TABLE(certificate_number text, course_title text, learner_name text, issued_at timestamp with time zone, revoked boolean)` | true | sql |

## Triggers

| Table | Trigger | Event | Timing | Orientation | Statement |
|---|---|---|---|---|---|
| `class_members` | `trg_validate_class_member_assignment` | INSERT | BEFORE | ROW | `EXECUTE FUNCTION validate_class_member_assignment()` |
| `class_members` | `trg_validate_class_member_assignment` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION validate_class_member_assignment()` |
| `class_subjects` | `trg_validate_class_subject_assignment` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION validate_class_subject_assignment()` |
| `class_subjects` | `trg_validate_class_subject_assignment` | INSERT | BEFORE | ROW | `EXECUTE FUNCTION validate_class_subject_assignment()` |
| `courses` | `courses_updated_at_lms` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `friend_requests` | `trg_friend_conversation` | INSERT | AFTER | ROW | `EXECUTE FUNCTION create_friend_conversation()` |
| `friend_requests` | `trg_friend_conversation` | UPDATE | AFTER | ROW | `EXECUTE FUNCTION create_friend_conversation()` |
| `lms_course_reviews` | `lms_reviews_updated_at` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `lms_course_sections` | `lms_sections_updated_at` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `lms_curriculum_assets` | `trg_sync_curriculum_asset_to_library` | INSERT | AFTER | ROW | `EXECUTE FUNCTION sync_curriculum_asset_to_library()` |
| `lms_curriculum_assets` | `trg_sync_curriculum_asset_to_library` | UPDATE | AFTER | ROW | `EXECUTE FUNCTION sync_curriculum_asset_to_library()` |
| `lms_discussion_posts` | `lms_posts_updated_at` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `lms_discussion_threads` | `lms_threads_updated_at` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `lms_learning_paths` | `lms_paths_updated_at` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `lms_lessons` | `lms_lessons_updated_at` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `lms_notes` | `lms_notes_updated_at` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `lms_rubrics` | `lms_rubrics_updated_at` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION private.lms_set_updated_at()` |
| `profiles` | `protect_profile_privileged_fields` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION protect_profile_privileged_fields()` |
| `profiles` | `protect_profile_privileged_fields` | INSERT | BEFORE | ROW | `EXECUTE FUNCTION protect_profile_privileged_fields()` |
| `profiles` | `trg_bind_premium_grants` | UPDATE | AFTER | ROW | `EXECUTE FUNCTION bind_premium_grants_to_profile()` |
| `profiles` | `trg_bind_premium_grants` | INSERT | AFTER | ROW | `EXECUTE FUNCTION bind_premium_grants_to_profile()` |
| `profiles` | `trg_single_super_admin` | INSERT | BEFORE | ROW | `EXECUTE FUNCTION enforce_single_super_admin()` |
| `profiles` | `trg_single_super_admin` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION enforce_single_super_admin()` |
| `school_assignment_items` | `trg_regrade_assignment_after_item_change` | UPDATE | AFTER | ROW | `EXECUTE FUNCTION trg_regrade_assignment_after_item_change()` |
| `school_assignment_items` | `trg_regrade_assignment_after_item_change` | INSERT | AFTER | ROW | `EXECUTE FUNCTION trg_regrade_assignment_after_item_change()` |
| `school_assignment_submissions` | `trg_notify_assignment_result` | UPDATE | AFTER | ROW | `EXECUTE FUNCTION notify_assignment_result()` |
| `school_assignment_submissions` | `trg_notify_assignment_result` | INSERT | AFTER | ROW | `EXECUTE FUNCTION notify_assignment_result()` |
| `school_assignment_submissions` | `trg_prevent_assignment_score_tampering` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION prevent_assignment_score_tampering()` |
| `school_cbt_exam_questions` | `trg_sync_school_cbt_student_question` | DELETE | AFTER | ROW | `EXECUTE FUNCTION private.sync_school_cbt_student_question()` |
| `school_cbt_exam_questions` | `trg_sync_school_cbt_student_question` | INSERT | AFTER | ROW | `EXECUTE FUNCTION private.sync_school_cbt_student_question()` |
| `school_cbt_exam_questions` | `trg_sync_school_cbt_student_question` | UPDATE | AFTER | ROW | `EXECUTE FUNCTION private.sync_school_cbt_student_question()` |
| `school_cbt_exams` | `trg_touch_school_cbt_exam_updated_at` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION touch_school_cbt_exam_updated_at()` |
| `school_classes` | `trg_validate_school_class_assignment` | INSERT | BEFORE | ROW | `EXECUTE FUNCTION validate_school_class_assignment()` |
| `school_classes` | `trg_validate_school_class_assignment` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION validate_school_class_assignment()` |
| `school_result_publications` | `trg_queue_result_release_notifications` | UPDATE | AFTER | ROW | `EXECUTE FUNCTION queue_result_release_notifications()` |
| `school_result_publications` | `trg_queue_result_release_notifications` | INSERT | AFTER | ROW | `EXECUTE FUNCTION queue_result_release_notifications()` |
| `student_attendance` | `trg_validate_student_attendance` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION validate_student_attendance()` |
| `student_attendance` | `trg_validate_student_attendance` | INSERT | BEFORE | ROW | `EXECUTE FUNCTION validate_student_attendance()` |
| `student_result_entries` | `trg_refresh_student_term_summary` | UPDATE | AFTER | ROW | `EXECUTE FUNCTION refresh_student_term_summary()` |
| `student_result_entries` | `trg_refresh_student_term_summary` | INSERT | AFTER | ROW | `EXECUTE FUNCTION refresh_student_term_summary()` |
| `student_result_entries` | `trg_require_result_deletion_audit` | DELETE | BEFORE | ROW | `EXECUTE FUNCTION require_result_deletion_audit()` |
| `student_result_entries` | `trg_result_immutable` | DELETE | BEFORE | ROW | `EXECUTE FUNCTION prevent_result_mutation()` |
| `student_result_entries` | `trg_result_immutable` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION prevent_result_mutation()` |
| `student_result_entries` | `trg_validate_student_result_entry` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION validate_student_result_entry()` |
| `student_result_entries` | `trg_validate_student_result_entry` | INSERT | BEFORE | ROW | `EXECUTE FUNCTION validate_student_result_entry()` |
| `student_school_records` | `trg_audit_student_school_status` | INSERT | BEFORE | ROW | `EXECUTE FUNCTION audit_student_school_status()` |
| `student_school_records` | `trg_audit_student_school_status` | UPDATE | BEFORE | ROW | `EXECUTE FUNCTION audit_student_school_status()` |

## Migration requirements

1. Export and verify the actual data independently of this metadata snapshot.
2. Resolve any table without a primary key or with composite keys before writing a resumable importer.
3. Port and test all authorization semantics before exposing replacement endpoints.
4. Preserve user and foreign-key identifiers unless an explicit mapping is required.
5. Do not delete or modify source records as part of schema discovery.
