-- Generated from live Supabase public-table metadata on 2026-10-14.
-- Schema parity scaffold for 171 public tables; this is NOT a data import or production-ready schema conversion.
-- Deliberately preserves column names, basic SQLite-compatible affinities, NOT NULL markers, simple defaults, and primary keys.
-- PostgreSQL checks, unique constraints, foreign keys, indexes, generated expressions, RLS policies, functions, triggers, views,
-- extensions, auth schema dependencies, and complex defaults require separate reviewed migrations.
-- Before applying remotely, run against a local D1 database and compare every table/column and constraint against the source.
PRAGMA foreign_keys = ON;

-- Source rows at inventory time: 2; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "profiles" (
  "id" TEXT NOT NULL,
  "email" TEXT,
  "full_name" TEXT,
  "role" TEXT DEFAULT 'user' NOT NULL,
  "account_type" TEXT DEFAULT 'adult' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "account_category" TEXT DEFAULT 'individual' NOT NULL,
  "onboarding_role" TEXT DEFAULT 'individual' NOT NULL,
  "avatar_url" TEXT,
  "passport_url" TEXT,
  "phenom_user_id" TEXT NOT NULL,
  "preferred_locale" TEXT DEFAULT 'en-NG' NOT NULL,
  "learning_locale" TEXT,
  "support_locale" TEXT,
  "parent_email" TEXT,
  "first_name" TEXT,
  "middle_name" TEXT,
  "surname" TEXT,
  "phone" TEXT,
  "date_of_birth" TEXT,
  "gender" TEXT,
  "country" TEXT,
  "state_region" TEXT,
  "city" TEXT,
  "address" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "parent_links" (
  "id" TEXT NOT NULL,
  "parent_id" TEXT NOT NULL,
  "child_id" TEXT NOT NULL,
  "status" TEXT DEFAULT 'active' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 20; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "analytics_events" (
  "id" REAL NOT NULL,
  "user_id" TEXT,
  "event_name" TEXT NOT NULL,
  "payload" TEXT DEFAULT '{}' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "suggestions" (
  "id" TEXT NOT NULL,
  "user_id" TEXT,
  "subject" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "status" TEXT DEFAULT 'open' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "service_enquiries" (
  "id" TEXT NOT NULL,
  "user_id" TEXT,
  "service" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "status" TEXT DEFAULT 'open' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "preferred_contact" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "friend_requests" (
  "id" TEXT NOT NULL,
  "requester_id" TEXT NOT NULL,
  "recipient_id" TEXT NOT NULL,
  "status" TEXT DEFAULT 'pending' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "conversations" (
  "id" TEXT NOT NULL,
  "created_by" TEXT NOT NULL,
  "title" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "conversation_members" (
  "conversation_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "joined_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("conversation_id", "user_id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "messages" (
  "id" TEXT NOT NULL,
  "conversation_id" TEXT NOT NULL,
  "sender_id" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "moderation_status" TEXT DEFAULT 'allowed' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "retention_class" TEXT DEFAULT 'communication' NOT NULL,
  "expires_at" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "moderation_reports" (
  "id" TEXT NOT NULL,
  "reporter_id" TEXT NOT NULL,
  "target_type" TEXT,
  "target_id" TEXT,
  "reason" TEXT NOT NULL,
  "status" TEXT DEFAULT 'open' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "safety_alerts" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "description" TEXT,
  "status" TEXT DEFAULT 'open' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "payment_orders" (
  "id" TEXT NOT NULL,
  "user_id" TEXT,
  "amount" REAL NOT NULL,
  "currency" TEXT DEFAULT 'NGN' NOT NULL,
  "provider" TEXT DEFAULT 'flutterwave' NOT NULL,
  "tx_ref" TEXT NOT NULL,
  "status" TEXT DEFAULT 'pending' NOT NULL,
  "provider_transaction_id" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "paid_at" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "subscriptions" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "plan_code" TEXT NOT NULL,
  "provider" TEXT DEFAULT 'flutterwave' NOT NULL,
  "status" TEXT DEFAULT 'pending' NOT NULL,
  "started_at" TEXT,
  "ends_at" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "school_id" TEXT,
  "organisation_id" TEXT,
  "currency" TEXT DEFAULT 'NGN',
  "amount" REAL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "audit_logs" (
  "id" REAL NOT NULL,
  "actor_id" TEXT,
  "action" TEXT NOT NULL,
  "target_type" TEXT,
  "target_id" TEXT,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 1; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "media_items" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "media_url" TEXT NOT NULL,
  "media_type" TEXT NOT NULL,
  "category" TEXT,
  "published" INTEGER DEFAULT 0 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "schools" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "logo_url" TEXT,
  "primary_color" TEXT,
  "country" TEXT,
  "currency" TEXT,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "category" TEXT DEFAULT 'school' NOT NULL,
  "logo_alt_text" TEXT,
  "accent_color" TEXT,
  "secondary_color" TEXT,
  "report_card_title" TEXT,
  "active_session" TEXT,
  "teacher_signature_url" TEXT,
  "head_signature_url" TEXT,
  "report_footer" TEXT,
  "legal_name" TEXT,
  "address" TEXT,
  "phone" TEXT,
  "email" TEXT,
  "website" TEXT,
  "motto" TEXT,
  "report_header" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_members" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "status" TEXT DEFAULT 'active' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_classes" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "level_label" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "class_teacher_id" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "class_members" (
  "id" TEXT NOT NULL,
  "class_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "learning_assignments" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "class_id" TEXT,
  "teacher_id" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "instructions" TEXT,
  "language" TEXT DEFAULT 'English' NOT NULL,
  "due_at" TEXT,
  "source" TEXT DEFAULT 'teacher' NOT NULL,
  "status" TEXT DEFAULT 'published' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "assignment_targets" (
  "id" TEXT NOT NULL,
  "assignment_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "assignment_submissions" (
  "id" TEXT NOT NULL,
  "assignment_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "attempt_no" REAL DEFAULT 1 NOT NULL,
  "answers" TEXT DEFAULT '{}' NOT NULL,
  "score" REAL,
  "feedback" TEXT DEFAULT '{}' NOT NULL,
  "submitted_at" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "learning_quizzes" (
  "id" TEXT NOT NULL,
  "school_id" TEXT,
  "created_by" TEXT,
  "subject" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "level" REAL DEFAULT 1 NOT NULL,
  "language" TEXT DEFAULT 'English' NOT NULL,
  "question_count" REAL NOT NULL,
  "duration_minutes" REAL,
  "generation_source" TEXT DEFAULT 'academy' NOT NULL,
  "status" TEXT DEFAULT 'ready' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "learning_mode" TEXT DEFAULT 'teacher_assigned' NOT NULL,
  "brand_name" TEXT DEFAULT 'Phenom Best Academy' NOT NULL,
  "brand_logo_url" TEXT DEFAULT '/brand/academy-logo-primary.png' NOT NULL,
  "watermark_text" TEXT DEFAULT 'Phenom Best Academy' NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "quiz_questions" (
  "id" TEXT NOT NULL,
  "quiz_id" TEXT NOT NULL,
  "position" REAL NOT NULL,
  "question_text" TEXT NOT NULL,
  "options" TEXT,
  "image_url" TEXT,
  "correct_answer" TEXT NOT NULL,
  "explanation" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "quiz_assignments" (
  "id" TEXT NOT NULL,
  "quiz_id" TEXT NOT NULL,
  "teacher_id" TEXT,
  "class_id" TEXT,
  "student_id" TEXT,
  "assigned_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "assignment_mode" TEXT DEFAULT 'teacher_assigned' NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "quiz_attempts" (
  "id" TEXT NOT NULL,
  "quiz_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "attempt_no" REAL NOT NULL,
  "answers" TEXT DEFAULT '{}' NOT NULL,
  "score" REAL,
  "correct_count" REAL,
  "feedback" TEXT DEFAULT '{}' NOT NULL,
  "started_at" TEXT,
  "submitted_at" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "learning_topics" (
  "id" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "level" REAL,
  "language" TEXT DEFAULT 'English',
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "parent_learning_notifications" (
  "id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "parent_id" TEXT,
  "assignment_id" TEXT,
  "quiz_attempt_id" TEXT,
  "message" TEXT NOT NULL,
  "score" REAL,
  "improvement" TEXT DEFAULT '{}' NOT NULL,
  "read_at" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "courses" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "duration_label" TEXT,
  "price" REAL DEFAULT 0 NOT NULL,
  "currency" TEXT DEFAULT 'NGN' NOT NULL,
  "certificate_enabled" INTEGER DEFAULT 0 NOT NULL,
  "certificate_type" TEXT,
  "published" INTEGER DEFAULT 0 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "slug" TEXT,
  "short_description" TEXT,
  "thumbnail_url" TEXT,
  "intro_video_url" TEXT,
  "category" TEXT,
  "level_label" TEXT,
  "language" TEXT DEFAULT 'English' NOT NULL,
  "estimated_hours" REAL,
  "created_by" TEXT,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "status" TEXT DEFAULT 'draft' NOT NULL,
  "featured" INTEGER DEFAULT 0 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "course_enrolments" (
  "id" TEXT NOT NULL,
  "course_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "progress" REAL DEFAULT 0 NOT NULL,
  "completed_at" TEXT,
  "certificate_issued_at" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 1; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "site_settings" (
  "id" REAL DEFAULT 1 NOT NULL,
  "background" TEXT DEFAULT '#f4efe6' NOT NULL,
  "surface" TEXT DEFAULT '#fbf8f2' NOT NULL,
  "accent" TEXT DEFAULT '#c94b16' NOT NULL,
  "accent2" TEXT DEFAULT '#1a4a8c' NOT NULL,
  "text" TEXT DEFAULT '#152238' NOT NULL,
  "muted" TEXT DEFAULT '#4c5d73' NOT NULL,
  "animation" TEXT DEFAULT 'refined' NOT NULL,
  "logo_url" TEXT DEFAULT '/brand/academy-logo-primary.png' NOT NULL,
  "background_mode" TEXT DEFAULT 'solid' NOT NULL,
  "background_image_url" TEXT,
  "gradient_start" TEXT DEFAULT '#f4efe6' NOT NULL,
  "gradient_end" TEXT DEFAULT '#fbf8f2' NOT NULL,
  "gradient_angle" REAL DEFAULT 135 NOT NULL,
  "pattern" TEXT DEFAULT 'none' NOT NULL,
  "font_scale" REAL DEFAULT 1 NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "site_announcements" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "link_url" TEXT,
  "published" INTEGER DEFAULT 0 NOT NULL,
  "floating" INTEGER DEFAULT 1 NOT NULL,
  "starts_at" TEXT,
  "ends_at" TEXT,
  "created_by" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 1; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "email_subscribers" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "marketing_opt_in" INTEGER DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "user_notifications" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "link_url" TEXT,
  "read_at" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 5; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "payment_provider_settings" (
  "id" TEXT NOT NULL,
  "provider" TEXT NOT NULL,
  "enabled" INTEGER DEFAULT 0 NOT NULL,
  "public_label" TEXT NOT NULL,
  "public_note" TEXT,
  "direct_bank_name" TEXT,
  "direct_account_name" TEXT,
  "direct_account_number" TEXT,
  "direct_instructions" TEXT,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_result_components" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "component_type" TEXT NOT NULL,
  "max_score" REAL DEFAULT 100 NOT NULL,
  "weight" REAL DEFAULT 0 NOT NULL,
  "sequence_no" REAL DEFAULT 1 NOT NULL,
  "term_no" REAL DEFAULT 1 NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_academic_sessions" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "starts_on" TEXT,
  "ends_on" TEXT,
  "active" INTEGER DEFAULT 0 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_terms" (
  "id" TEXT NOT NULL,
  "session_id" TEXT NOT NULL,
  "term_no" REAL NOT NULL,
  "name" TEXT NOT NULL,
  "starts_on" TEXT,
  "ends_on" TEXT,
  "entry_open" INTEGER DEFAULT 1 NOT NULL,
  "results_published" INTEGER DEFAULT 0 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_subjects" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "code" TEXT,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "sequence_no" REAL DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "class_subjects" (
  "id" TEXT NOT NULL,
  "class_id" TEXT NOT NULL,
  "subject_id" TEXT NOT NULL,
  "teacher_id" TEXT,
  "active" INTEGER DEFAULT 1 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "student_school_records" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "admission_number" TEXT,
  "gender" TEXT,
  "date_of_birth" TEXT,
  "status" TEXT DEFAULT 'active' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "height_cm" REAL,
  "weight_kg" REAL,
  "psychomotor" TEXT DEFAULT '{}' NOT NULL,
  "performance_information" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "student_result_entries" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "session_id" TEXT NOT NULL,
  "term_no" REAL NOT NULL,
  "class_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "subject_id" TEXT NOT NULL,
  "component_id" TEXT NOT NULL,
  "score" REAL DEFAULT 0 NOT NULL,
  "teacher_comment" TEXT,
  "entered_by" TEXT,
  "entered_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "locked" INTEGER DEFAULT 0 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "student_term_summaries" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "session_id" TEXT NOT NULL,
  "term_no" REAL NOT NULL,
  "class_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "subject_id" TEXT NOT NULL,
  "ca_total" REAL,
  "test_total" REAL,
  "midterm_total" REAL,
  "exam_total" REAL,
  "term_total" REAL,
  "term_percentage" REAL,
  "first_term_brought_forward" REAL,
  "cumulative_percentage" REAL,
  "class_average" REAL,
  "performance_note" TEXT,
  "generated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_result_publications" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "session_id" TEXT NOT NULL,
  "term_no" REAL NOT NULL,
  "class_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "published_by" TEXT,
  "published_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "published" INTEGER DEFAULT 0 NOT NULL,
  "download_enabled" INTEGER DEFAULT 0 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_attendance_settings" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "checkpoint_mode" TEXT DEFAULT 'daily' NOT NULL,
  "morning_open" TEXT,
  "closing_time" TEXT,
  "late_after" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "student_attendance" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "attendance_date" TEXT NOT NULL,
  "arrival_time" TEXT,
  "departure_time" TEXT,
  "status" TEXT DEFAULT 'present' NOT NULL,
  "note" TEXT,
  "recorded_by" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "session_id" TEXT,
  "term_no" REAL,
  "class_id" TEXT,
  "checkpoint" TEXT DEFAULT 'arrival',
  "recorded_at" TEXT,
  "manual_override" INTEGER DEFAULT 0 NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "student_growth_records" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "recorded_on" TEXT NOT NULL,
  "height_cm" REAL,
  "weight_kg" REAL,
  "notes" TEXT,
  "recorded_by" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "student_guardians" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "guardian_name" TEXT NOT NULL,
  "relationship" TEXT,
  "phone" TEXT,
  "email" TEXT,
  "address" TEXT,
  "pickup_authorised" INTEGER DEFAULT 0 NOT NULL,
  "consent_notes" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "student_emergency_profiles" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "emergency_name" TEXT,
  "emergency_phone" TEXT,
  "medical_notes" TEXT,
  "allergies" TEXT,
  "emergency_instructions" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_profile_fields" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "field_code" TEXT NOT NULL,
  "field_label" TEXT NOT NULL,
  "enabled" INTEGER DEFAULT 1 NOT NULL,
  "required" INTEGER DEFAULT 0 NOT NULL,
  "sequence_no" REAL DEFAULT 1 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_assessment_traits" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "sequence_no" REAL DEFAULT 1 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_assessment_scales" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "minimum_value" REAL DEFAULT 1 NOT NULL,
  "maximum_value" REAL DEFAULT 5 NOT NULL,
  "labels" TEXT DEFAULT '{}' NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "student_trait_assessments" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "trait_id" TEXT NOT NULL,
  "session_id" TEXT,
  "term_no" REAL,
  "score" REAL,
  "comment" TEXT,
  "assessed_by" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 5; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "subscription_features" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "subscription_feature_grants" (
  "id" TEXT NOT NULL,
  "subscription_id" TEXT NOT NULL,
  "feature_id" TEXT NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 3; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "subscription_plans" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "audience" TEXT DEFAULT 'individual' NOT NULL,
  "description" TEXT,
  "price" REAL DEFAULT 0 NOT NULL,
  "currency" TEXT DEFAULT 'NGN' NOT NULL,
  "billing_period" TEXT DEFAULT 'one_time' NOT NULL,
  "features" TEXT DEFAULT '[]' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "staff_records" (
  "id" TEXT NOT NULL,
  "school_id" TEXT,
  "staff_user_id" TEXT,
  "organisation_id" TEXT,
  "job_title" TEXT,
  "department" TEXT,
  "employment_status" TEXT DEFAULT 'active' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "staff_pay_structures" (
  "id" TEXT NOT NULL,
  "staff_record_id" TEXT NOT NULL,
  "basic_salary" REAL DEFAULT 0 NOT NULL,
  "allowances" TEXT DEFAULT '{}' NOT NULL,
  "deductions" TEXT DEFAULT '{}' NOT NULL,
  "effective_from" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "payroll_runs" (
  "id" TEXT NOT NULL,
  "school_id" TEXT,
  "organisation_id" TEXT,
  "period_start" TEXT NOT NULL,
  "period_end" TEXT NOT NULL,
  "status" TEXT DEFAULT 'draft' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "payroll_items" (
  "id" TEXT NOT NULL,
  "payroll_run_id" TEXT NOT NULL,
  "staff_record_id" TEXT NOT NULL,
  "gross_pay" REAL DEFAULT 0 NOT NULL,
  "deductions" REAL DEFAULT 0 NOT NULL,
  "net_pay" REAL DEFAULT 0 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_fee_schedules" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "amount" REAL DEFAULT 0 NOT NULL,
  "currency" TEXT DEFAULT 'NGN' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "student_fee_adjustments" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "amount" REAL NOT NULL,
  "reason" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_fee_payments" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "amount" REAL NOT NULL,
  "currency" TEXT DEFAULT 'NGN' NOT NULL,
  "provider" TEXT,
  "status" TEXT DEFAULT 'pending' NOT NULL,
  "reference" TEXT,
  "paid_at" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_receipts" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "student_id" TEXT,
  "payment_id" TEXT,
  "receipt_number" TEXT NOT NULL,
  "amount" REAL NOT NULL,
  "currency" TEXT DEFAULT 'NGN' NOT NULL,
  "paper_size" TEXT DEFAULT 'A5' NOT NULL,
  "issued_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_elections" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "starts_at" TEXT,
  "ends_at" TEXT,
  "results_visible" INTEGER DEFAULT 0 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_election_positions" (
  "id" TEXT NOT NULL,
  "election_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "sequence_no" REAL DEFAULT 1 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_election_candidates" (
  "id" TEXT NOT NULL,
  "position_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "manifesto" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_election_voters" (
  "id" TEXT NOT NULL,
  "election_id" TEXT NOT NULL,
  "voter_id" TEXT NOT NULL,
  "verified_at" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_election_votes" (
  "id" TEXT NOT NULL,
  "election_id" TEXT NOT NULL,
  "position_id" TEXT NOT NULL,
  "candidate_id" TEXT NOT NULL,
  "voter_id" TEXT NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_id_card_templates" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "paper_size" TEXT DEFAULT 'ID-1' NOT NULL,
  "design" TEXT DEFAULT '{}' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "person_signatures" (
  "id" TEXT NOT NULL,
  "person_id" TEXT NOT NULL,
  "school_id" TEXT,
  "label" TEXT,
  "url" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 3; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "cms_content_blocks" (
  "id" TEXT NOT NULL,
  "page_key" TEXT NOT NULL,
  "block_key" TEXT NOT NULL,
  "title" TEXT,
  "body" TEXT,
  "icon_name" TEXT,
  "image_url" TEXT,
  "href" TEXT,
  "sort_order" REAL DEFAULT 0 NOT NULL,
  "published" INTEGER DEFAULT 1 NOT NULL,
  "updated_by" TEXT,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_assignment_tasks" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "teacher_id" TEXT NOT NULL,
  "class_id" TEXT NOT NULL,
  "subject_id" TEXT,
  "level_label" TEXT,
  "topic" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "instructions" TEXT,
  "due_at" TEXT,
  "status" TEXT DEFAULT 'draft' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "assignment_type" TEXT DEFAULT 'auto_graded' NOT NULL,
  "source_type" TEXT,
  "source_id" TEXT,
  "results_visible_immediately" INTEGER DEFAULT 1 NOT NULL,
  "duration_minutes" REAL,
  "randomise_questions" INTEGER DEFAULT 0 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_assignment_submissions" (
  "id" TEXT NOT NULL,
  "task_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "answer_text" TEXT,
  "attachment_urls" TEXT DEFAULT '[]' NOT NULL,
  "score" REAL,
  "teacher_feedback" TEXT,
  "submitted_at" TEXT,
  "graded_at" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_calendar_events" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "event_type" TEXT DEFAULT 'academic' NOT NULL,
  "starts_at" TEXT NOT NULL,
  "ends_at" TEXT,
  "location" TEXT,
  "created_by" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_announcements" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "published" INTEGER DEFAULT 0 NOT NULL,
  "starts_at" TEXT,
  "ends_at" TEXT,
  "created_by" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 45; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "academic_subject_catalog" (
  "id" TEXT NOT NULL,
  "stage" TEXT NOT NULL,
  "domain" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "aliases" TEXT DEFAULT '{}' NOT NULL,
  "exam_tags" TEXT DEFAULT '{}' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "service_consents" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "service_code" TEXT NOT NULL,
  "policy_version" TEXT NOT NULL,
  "consented_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "premium_service_grants" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "user_id" TEXT,
  "service_code" TEXT NOT NULL,
  "granted_by" TEXT NOT NULL,
  "enabled" INTEGER DEFAULT 1 NOT NULL,
  "notes" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "revoked_at" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "student_sensitive_records" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "blood_group" TEXT,
  "genotype" TEXT,
  "allergies" TEXT,
  "parent_full_name" TEXT,
  "parent_phone" TEXT,
  "parent_email" TEXT,
  "address" TEXT,
  "notes" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_sensitive_access" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "class_id" TEXT NOT NULL,
  "enabled" INTEGER DEFAULT 0 NOT NULL,
  "enabled_by" TEXT,
  "enabled_at" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "community_ephemeral_shares" (
  "id" TEXT NOT NULL,
  "conversation_id" TEXT NOT NULL,
  "sender_id" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "file_name" TEXT,
  "mime_type" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "expires_at" TEXT NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "conversation_member_restrictions" (
  "id" TEXT NOT NULL,
  "conversation_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "restricted_by" TEXT NOT NULL,
  "reason" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "result_release_notifications" (
  "id" TEXT NOT NULL,
  "publication_id" TEXT NOT NULL,
  "recipient_id" TEXT NOT NULL,
  "recipient_type" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "status" TEXT DEFAULT 'queued' NOT NULL,
  "sent_at" TEXT,
  "error_message" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "teacher_question_banks" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "teacher_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "level_label" TEXT,
  "language" TEXT DEFAULT 'English' NOT NULL,
  "instructions" TEXT,
  "status" TEXT DEFAULT 'draft' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "teacher_question_items" (
  "id" TEXT NOT NULL,
  "bank_id" TEXT NOT NULL,
  "position" REAL NOT NULL,
  "question_text" TEXT NOT NULL,
  "options" TEXT,
  "correct_answer" TEXT,
  "explanation" TEXT,
  "image_url" TEXT,
  "marks" REAL DEFAULT 1 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_cbt_exams" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "class_id" TEXT NOT NULL,
  "teacher_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "topic" TEXT,
  "question_count" REAL DEFAULT 10 NOT NULL,
  "duration_minutes" REAL,
  "starts_at" TEXT,
  "ends_at" TEXT,
  "one_attempt" INTEGER DEFAULT 1 NOT NULL,
  "allow_redo" INTEGER DEFAULT 1 NOT NULL,
  "results_visible_to_students" INTEGER DEFAULT 0 NOT NULL,
  "status" TEXT DEFAULT 'draft' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "instructions" TEXT,
  "created_by" TEXT,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_cbt_exam_questions" (
  "id" TEXT NOT NULL,
  "exam_id" TEXT NOT NULL,
  "position" REAL NOT NULL,
  "question_text" TEXT NOT NULL,
  "options" TEXT,
  "correct_answer" TEXT,
  "explanation" TEXT,
  "image_url" TEXT,
  "marks" REAL DEFAULT 1 NOT NULL,
  "media" TEXT DEFAULT '[]' NOT NULL,
  "resource_notes" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_cbt_attempts" (
  "id" TEXT NOT NULL,
  "exam_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "attempt_no" REAL NOT NULL,
  "answers" TEXT DEFAULT '{}' NOT NULL,
  "score" REAL,
  "correct_count" REAL,
  "feedback" TEXT DEFAULT '{}' NOT NULL,
  "started_at" TEXT,
  "submitted_at" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 33; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "curriculum_catalogue" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "country_codes" TEXT DEFAULT '{}' NOT NULL,
  "stages" TEXT DEFAULT '{}' NOT NULL,
  "subjects" TEXT DEFAULT '{}' NOT NULL,
  "official_source" TEXT NOT NULL,
  "notes" TEXT,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_curricula" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "curriculum_id" TEXT NOT NULL,
  "priority" REAL DEFAULT 1 NOT NULL,
  "state_or_region" TEXT,
  "enabled" INTEGER DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 1; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "academy_private_configuration" (
  "config_key" TEXT NOT NULL,
  "config_value" TEXT NOT NULL,
  "secret" INTEGER DEFAULT 1 NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("config_key")
);

-- Source rows at inventory time: 3; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "subscription_tool_entitlements" (
  "id" TEXT NOT NULL,
  "plan_code_pattern" TEXT NOT NULL,
  "service_code" TEXT NOT NULL,
  "enabled" INTEGER DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_course_instructors" (
  "id" TEXT NOT NULL,
  "course_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "instructor_role" TEXT DEFAULT 'instructor' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_course_sections" (
  "id" TEXT NOT NULL,
  "course_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "position" REAL DEFAULT 1 NOT NULL,
  "published" INTEGER DEFAULT 0 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_lessons" (
  "id" TEXT NOT NULL,
  "section_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT,
  "lesson_type" TEXT DEFAULT 'text' NOT NULL,
  "content" TEXT,
  "video_url" TEXT,
  "audio_url" TEXT,
  "document_url" TEXT,
  "duration_seconds" REAL,
  "position" REAL DEFAULT 1 NOT NULL,
  "is_preview" INTEGER DEFAULT 0 NOT NULL,
  "published" INTEGER DEFAULT 0 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "access_tier" TEXT DEFAULT 'free' NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_lesson_resources" (
  "id" TEXT NOT NULL,
  "lesson_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "resource_type" TEXT DEFAULT 'link' NOT NULL,
  "url" TEXT NOT NULL,
  "position" REAL DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_lesson_progress" (
  "id" TEXT NOT NULL,
  "lesson_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "progress_percent" REAL DEFAULT 0 NOT NULL,
  "last_position_seconds" REAL DEFAULT 0 NOT NULL,
  "completed" INTEGER DEFAULT 0 NOT NULL,
  "first_started_at" TEXT,
  "completed_at" TEXT,
  "last_accessed_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_bookmarks" (
  "id" TEXT NOT NULL,
  "lesson_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "note" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_notes" (
  "id" TEXT NOT NULL,
  "lesson_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "position_seconds" REAL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_course_prerequisites" (
  "course_id" TEXT NOT NULL,
  "prerequisite_course_id" TEXT NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("course_id", "prerequisite_course_id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_learning_paths" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "slug" TEXT,
  "description" TEXT,
  "thumbnail_url" TEXT,
  "published" INTEGER DEFAULT 0 NOT NULL,
  "created_by" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_learning_path_courses" (
  "learning_path_id" TEXT NOT NULL,
  "course_id" TEXT NOT NULL,
  "position" REAL NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("learning_path_id", "course_id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_certificates" (
  "id" TEXT NOT NULL,
  "enrolment_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "course_id" TEXT NOT NULL,
  "certificate_number" TEXT NOT NULL,
  "verification_code" TEXT NOT NULL,
  "issued_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "revoked_at" TEXT,
  "final_score" REAL,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_course_reviews" (
  "id" TEXT NOT NULL,
  "course_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "rating" REAL NOT NULL,
  "title" TEXT,
  "body" TEXT,
  "published" INTEGER DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_discussion_threads" (
  "id" TEXT NOT NULL,
  "course_id" TEXT NOT NULL,
  "lesson_id" TEXT,
  "author_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "status" TEXT DEFAULT 'open' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_discussion_posts" (
  "id" TEXT NOT NULL,
  "thread_id" TEXT NOT NULL,
  "author_id" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "parent_post_id" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_rubrics" (
  "id" TEXT NOT NULL,
  "course_id" TEXT,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "created_by" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_rubric_criteria" (
  "id" TEXT NOT NULL,
  "rubric_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "max_points" REAL DEFAULT 1 NOT NULL,
  "position" REAL NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_rubric_scores" (
  "id" TEXT NOT NULL,
  "rubric_id" TEXT NOT NULL,
  "criterion_id" TEXT NOT NULL,
  "submission_id" TEXT NOT NULL,
  "score" REAL DEFAULT 0 NOT NULL,
  "feedback" TEXT,
  "graded_by" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_live_sessions" (
  "id" TEXT NOT NULL,
  "course_id" TEXT NOT NULL,
  "lesson_id" TEXT,
  "host_id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "meeting_url" TEXT,
  "starts_at" TEXT NOT NULL,
  "ends_at" TEXT,
  "recording_url" TEXT,
  "status" TEXT DEFAULT 'scheduled' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_live_session_attendees" (
  "session_id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "joined_at" TEXT,
  "left_at" TEXT,
  "attendance_status" TEXT DEFAULT 'registered' NOT NULL,
  PRIMARY KEY ("session_id", "user_id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_badges" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "icon_url" TEXT,
  "points" REAL DEFAULT 0 NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_user_badges" (
  "user_id" TEXT NOT NULL,
  "badge_id" TEXT NOT NULL,
  "awarded_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  PRIMARY KEY ("user_id", "badge_id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_points_ledger" (
  "id" TEXT NOT NULL,
  "user_id" TEXT NOT NULL,
  "points" REAL NOT NULL,
  "reason" TEXT NOT NULL,
  "reference_type" TEXT,
  "reference_id" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_communication_controls" (
  "id" TEXT NOT NULL,
  "target_user_id" TEXT NOT NULL,
  "conversation_id" TEXT,
  "scope" TEXT NOT NULL,
  "action" TEXT DEFAULT 'block' NOT NULL,
  "reason" TEXT,
  "created_by" TEXT NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "expires_at" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "ui_translation_resources" (
  "locale" TEXT NOT NULL,
  "resource_key" TEXT NOT NULL,
  "source_text" TEXT NOT NULL,
  "translated_text" TEXT NOT NULL,
  "source_version" TEXT DEFAULT 'v1' NOT NULL,
  "quality_score" REAL,
  "status" TEXT DEFAULT 'reviewed' NOT NULL,
  "provider_trace" TEXT DEFAULT '{}' NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("locale", "resource_key", "source_version")
);

-- Source rows at inventory time: 497; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "global_subject_catalogue" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "category" TEXT DEFAULT 'academic' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 1527; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "curriculum_subject_catalogue" (
  "curriculum_id" TEXT NOT NULL,
  "subject_id" TEXT NOT NULL,
  "stage" TEXT NOT NULL,
  "country_code" TEXT,
  "source_note" TEXT,
  "active" INTEGER DEFAULT 1 NOT NULL,
  PRIMARY KEY ("curriculum_id", "subject_id", "stage")
);

-- Source rows at inventory time: 464; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_levels" (
  "id" TEXT NOT NULL,
  "curriculum_id" TEXT NOT NULL,
  "stage" TEXT NOT NULL,
  "level_code" TEXT NOT NULL,
  "display_name" TEXT NOT NULL,
  "sequence_no" REAL DEFAULT 0 NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 14266; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_topics" (
  "id" TEXT NOT NULL,
  "curriculum_id" TEXT NOT NULL,
  "level_id" TEXT NOT NULL,
  "subject_id" TEXT NOT NULL,
  "parent_topic_id" TEXT,
  "topic_title" TEXT NOT NULL,
  "topic_code" TEXT,
  "learning_outcomes" TEXT DEFAULT '[]' NOT NULL,
  "assessment_expectations" TEXT DEFAULT '[]' NOT NULL,
  "official_source" TEXT,
  "source_reference" TEXT,
  "source_version" TEXT,
  "source_status" TEXT DEFAULT 'source_pending' NOT NULL,
  "ai_generation_policy" TEXT DEFAULT 'curriculum_bound' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_programmes" (
  "id" TEXT NOT NULL,
  "programme_type" TEXT DEFAULT 'academic' NOT NULL,
  "curriculum_id" TEXT,
  "level_id" TEXT,
  "subject_id" TEXT,
  "title" TEXT NOT NULL,
  "programme_code" TEXT NOT NULL,
  "credential_level" TEXT,
  "duration_weeks" REAL,
  "duration_hours" REAL,
  "scheduled_hours_per_week" REAL,
  "delivery_mode" TEXT DEFAULT 'self_paced' NOT NULL,
  "language_locale" TEXT,
  "support_locale" TEXT,
  "status" TEXT DEFAULT 'planned' NOT NULL,
  "official_source" TEXT,
  "source_version" TEXT,
  "curriculum_bound" INTEGER DEFAULT 1 NOT NULL,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "authority_policy_code" TEXT,
  "authority_model" TEXT,
  "awarding_body" TEXT,
  "regulatory_body" TEXT,
  "accreditation_status" TEXT DEFAULT 'not_applicable',
  "partner_authority_id" TEXT,
  "approval_reference" TEXT,
  "public_disclosure" TEXT DEFAULT '',
  "access_tier" TEXT DEFAULT 'free' NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_programme_topics" (
  "programme_id" TEXT NOT NULL,
  "topic_id" TEXT NOT NULL,
  "sequence_no" REAL DEFAULT 0 NOT NULL,
  "required" INTEGER DEFAULT 1 NOT NULL,
  "planned_hours" REAL,
  PRIMARY KEY ("programme_id", "topic_id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_programme_resources" (
  "id" TEXT NOT NULL,
  "programme_id" TEXT,
  "topic_id" TEXT,
  "resource_type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "locale" TEXT,
  "support_locale" TEXT,
  "generation_status" TEXT DEFAULT 'planned' NOT NULL,
  "canonical_content_ref" TEXT,
  "storage_object_path" TEXT,
  "duration_minutes" REAL,
  "sequence_no" REAL DEFAULT 0 NOT NULL,
  "curriculum_alignment" TEXT DEFAULT '{}' NOT NULL,
  "brand_metadata" TEXT DEFAULT '{"brand": "Phenom Best Academy", "watermark": "Phenom Best Academy", "core_label": "Phenom Best Core"}' NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_programme_schedules" (
  "id" TEXT NOT NULL,
  "programme_id" TEXT,
  "week_no" REAL NOT NULL,
  "day_no" REAL,
  "planned_hours" REAL,
  "planned_minutes" REAL,
  "lesson_count" REAL DEFAULT 0 NOT NULL,
  "start_date" TEXT,
  "end_date" TEXT,
  "schedule_metadata" TEXT DEFAULT '{}' NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 20; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_cpd_sectors" (
  "id" TEXT NOT NULL,
  "sector_name" TEXT NOT NULL,
  "sector_slug" TEXT NOT NULL,
  "description" TEXT DEFAULT '' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 21; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_cpd_professions" (
  "id" TEXT NOT NULL,
  "sector_id" TEXT,
  "profession_name" TEXT NOT NULL,
  "profession_slug" TEXT NOT NULL,
  "regulated" INTEGER DEFAULT 0 NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_cpd_programmes" (
  "id" TEXT NOT NULL,
  "profession_id" TEXT,
  "title" TEXT NOT NULL,
  "programme_code" TEXT NOT NULL,
  "level" TEXT,
  "credential_type" TEXT DEFAULT 'certificate' NOT NULL,
  "duration_weeks" REAL,
  "duration_hours" REAL,
  "delivery_mode" TEXT DEFAULT 'self_paced' NOT NULL,
  "status" TEXT DEFAULT 'planned' NOT NULL,
  "official_body" TEXT,
  "official_source" TEXT,
  "scope_note" TEXT DEFAULT '' NOT NULL,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  "duration_months" REAL,
  "credential_label" TEXT,
  "authority_policy_code" TEXT DEFAULT 'ACADEMY-DIRECT',
  "progression_model" TEXT DEFAULT 'sequential_levels',
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_cpd_programme_resources" (
  "id" TEXT NOT NULL,
  "programme_id" TEXT,
  "resource_type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "sequence_no" REAL DEFAULT 0 NOT NULL,
  "generation_status" TEXT DEFAULT 'planned' NOT NULL,
  "storage_object_path" TEXT,
  "brand_metadata" TEXT DEFAULT '{"brand": "Phenom Best Academy", "watermark": "Phenom Best Academy", "core_label": "Phenom Best Core"}' NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 216; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_language_catalogue" (
  "locale" TEXT NOT NULL,
  "language_name" TEXT NOT NULL,
  "modality" TEXT DEFAULT 'spoken_written' NOT NULL,
  "interface_candidate" INTEGER DEFAULT 1 NOT NULL,
  "learning_candidate" INTEGER DEFAULT 1 NOT NULL,
  "google_cloud_supported" INTEGER DEFAULT 0 NOT NULL,
  "azure_translator_supported" INTEGER DEFAULT 0 NOT NULL,
  "provider_support_note" TEXT DEFAULT '' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("locale")
);

-- Source rows at inventory time: 222; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_sources" (
  "id" TEXT NOT NULL,
  "curriculum_id" TEXT NOT NULL,
  "source_title" TEXT NOT NULL,
  "source_type" TEXT DEFAULT 'official_document' NOT NULL,
  "issuing_body" TEXT NOT NULL,
  "official_url" TEXT NOT NULL,
  "source_version" TEXT,
  "publication_date" TEXT,
  "retrieved_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "verification_status" TEXT DEFAULT 'registered' NOT NULL,
  "content_hash" TEXT,
  "extraction_method" TEXT,
  "document_scope" TEXT DEFAULT '' NOT NULL,
  "notes" TEXT DEFAULT '' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 14; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_ingestion_runs" (
  "id" TEXT NOT NULL,
  "source_id" TEXT NOT NULL,
  "started_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "completed_at" TEXT,
  "status" TEXT DEFAULT 'queued' NOT NULL,
  "extracted_levels" REAL DEFAULT 0 NOT NULL,
  "extracted_subjects" REAL DEFAULT 0 NOT NULL,
  "extracted_topics" REAL DEFAULT 0 NOT NULL,
  "extracted_outcomes" REAL DEFAULT 0 NOT NULL,
  "extracted_expectations" REAL DEFAULT 0 NOT NULL,
  "verified_topics" REAL DEFAULT 0 NOT NULL,
  "warnings" TEXT DEFAULT '[]' NOT NULL,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 17; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_education_domains" (
  "id" TEXT NOT NULL,
  "domain_name" TEXT NOT NULL,
  "domain_slug" TEXT NOT NULL,
  "description" TEXT DEFAULT '' NOT NULL,
  "education_stage" TEXT DEFAULT 'all' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "sequence_no" REAL DEFAULT 0 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 6; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_programme_authority_policies" (
  "id" TEXT NOT NULL,
  "policy_code" TEXT NOT NULL,
  "authority_model" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "approval_required" INTEGER DEFAULT 0 NOT NULL,
  "awarding_body_required" INTEGER DEFAULT 0 NOT NULL,
  "partner_agreement_required" INTEGER DEFAULT 0 NOT NULL,
  "regulatory_clearance_required" INTEGER DEFAULT 0 NOT NULL,
  "certificate_issuer_rule" TEXT DEFAULT '' NOT NULL,
  "public_disclosure_rule" TEXT DEFAULT '' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_programme_authorities" (
  "id" TEXT NOT NULL,
  "authority_name" TEXT NOT NULL,
  "authority_type" TEXT NOT NULL,
  "country_code" TEXT,
  "official_url" TEXT,
  "licence_or_approval_reference" TEXT,
  "verification_status" TEXT DEFAULT 'unverified' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 5; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_programme_tracks" (
  "id" TEXT NOT NULL,
  "track_code" TEXT NOT NULL,
  "track_name" TEXT NOT NULL,
  "category_slug" TEXT NOT NULL,
  "subject_id" TEXT,
  "credential_label" TEXT NOT NULL,
  "nominal_duration_months" REAL NOT NULL,
  "delivery_mode" TEXT DEFAULT 'online' NOT NULL,
  "authority_policy_code" TEXT DEFAULT 'ACADEMY-DIRECT' NOT NULL,
  "status" TEXT DEFAULT 'planned' NOT NULL,
  "certificate_issuer_rule" TEXT DEFAULT 'pending_authority_verification' NOT NULL,
  "progression_model" TEXT DEFAULT 'sequential_levels' NOT NULL,
  "description" TEXT DEFAULT '' NOT NULL,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 10; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_programme_levels" (
  "id" TEXT NOT NULL,
  "track_id" TEXT NOT NULL,
  "level_no" REAL NOT NULL,
  "level_title" TEXT NOT NULL,
  "duration_months" REAL NOT NULL,
  "sequence_no" REAL NOT NULL,
  "unlock_rule" TEXT DEFAULT 'previous_level_completed' NOT NULL,
  "status" TEXT DEFAULT 'planned' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_programme_progression" (
  "id" TEXT NOT NULL,
  "track_id" TEXT NOT NULL,
  "from_level_id" TEXT NOT NULL,
  "to_level_id" TEXT NOT NULL,
  "completion_requirement" TEXT NOT NULL,
  "assessment_requirement" TEXT DEFAULT 'required' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 1; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_programme_enrolment_authority" (
  "id" TEXT NOT NULL,
  "track_id" TEXT NOT NULL,
  "authority_policy_code" TEXT NOT NULL,
  "partner_authority_id" TEXT,
  "application_route" TEXT DEFAULT 'academy' NOT NULL,
  "screening_status" TEXT DEFAULT 'pending' NOT NULL,
  "final_admission_by" TEXT DEFAULT 'academy' NOT NULL,
  "final_award_by" TEXT DEFAULT 'academy' NOT NULL,
  "disclosure_text" TEXT DEFAULT '' NOT NULL,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 131; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_tertiary_programme_catalogue" (
  "id" TEXT NOT NULL,
  "country_code" TEXT NOT NULL,
  "sector" TEXT NOT NULL,
  "qualification_level" TEXT NOT NULL,
  "programme_name" TEXT NOT NULL,
  "programme_family" TEXT,
  "official_source" TEXT,
  "source_version" TEXT,
  "delivery_status" TEXT DEFAULT 'prebuilt_reference' NOT NULL,
  "authority_policy_code" TEXT DEFAULT 'ACADEMY-APPROVED' NOT NULL,
  "awarding_body_rule" TEXT DEFAULT 'external_awarding_body_required' NOT NULL,
  "practical_requirement" TEXT DEFAULT 'to_be_assessed' NOT NULL,
  "duration_months" REAL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 9; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_qualification_frameworks" (
  "id" TEXT NOT NULL,
  "country_code" TEXT NOT NULL,
  "framework_name" TEXT NOT NULL,
  "issuing_or_coordinating_body" TEXT,
  "framework_source" TEXT,
  "qualification_sequence" TEXT DEFAULT '[]' NOT NULL,
  "notes" TEXT,
  "active" INTEGER DEFAULT 1 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 6; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_assessment_pathways" (
  "id" TEXT NOT NULL,
  "pathway_code" TEXT NOT NULL,
  "pathway_name" TEXT NOT NULL,
  "stage_scope" TEXT NOT NULL,
  "awarding_body" TEXT,
  "official_source" TEXT,
  "delivery_model" TEXT DEFAULT 'prepare_and_route' NOT NULL,
  "exam_or_assessment_requirement" TEXT,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 1; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_distance_affiliation_rules" (
  "id" TEXT NOT NULL,
  "rule_code" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "platform_role" TEXT NOT NULL,
  "admission_owner" TEXT NOT NULL,
  "student_record_owner" TEXT NOT NULL,
  "academic_approval_owner" TEXT NOT NULL,
  "credential_award_owner" TEXT NOT NULL,
  "student_portal_rule" TEXT NOT NULL,
  "centre_rule" TEXT NOT NULL,
  "physical_activity_rule" TEXT NOT NULL,
  "curriculum_prebuild_rule" TEXT NOT NULL,
  "public_disclosure_rule" TEXT NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 146759; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_resource_packs" (
  "id" TEXT NOT NULL,
  "topic_id" TEXT NOT NULL,
  "pack_code" TEXT NOT NULL,
  "resource_type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "content" TEXT NOT NULL,
  "locale" TEXT DEFAULT 'en-NG' NOT NULL,
  "support_locale" TEXT DEFAULT 'en-NG' NOT NULL,
  "sequence_no" REAL NOT NULL,
  "status" TEXT DEFAULT 'ready' NOT NULL,
  "curriculum_alignment" TEXT DEFAULT '{}' NOT NULL,
  "brand_metadata" TEXT DEFAULT '{"brand": "Phenom Best Academy", "engine": "Phenom Best Core"}' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 63188; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_content_jobs" (
  "id" TEXT NOT NULL,
  "curriculum_id" TEXT,
  "topic_id" TEXT,
  "job_type" TEXT NOT NULL,
  "status" TEXT DEFAULT 'queued' NOT NULL,
  "priority" REAL DEFAULT 50 NOT NULL,
  "requested_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "completed_at" TEXT,
  "error_message" TEXT,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "student_school_status_history" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "previous_status" TEXT,
  "new_status" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "effective_on" TEXT NOT NULL,
  "reason" TEXT,
  "recorded_by" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_member_invites" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "full_name" TEXT DEFAULT '' NOT NULL,
  "requested_role" TEXT NOT NULL,
  "status" TEXT DEFAULT 'pending' NOT NULL,
  "invited_by" TEXT,
  "invited_user_id" TEXT,
  "invite_token" TEXT,
  "sent_at" TEXT,
  "accepted_at" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "student_class_history" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "class_id" TEXT NOT NULL,
  "previous_class_id" TEXT,
  "session_id" TEXT,
  "term_no" REAL,
  "action" TEXT NOT NULL,
  "effective_on" TEXT NOT NULL,
  "reason" TEXT,
  "recorded_by" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "result_deletion_audit" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "result_entry_id" TEXT NOT NULL,
  "deleted_by" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "deleted_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_assignment_items" (
  "id" TEXT NOT NULL,
  "task_id" TEXT NOT NULL,
  "position" REAL NOT NULL,
  "question_text" TEXT NOT NULL,
  "options" TEXT DEFAULT '[]' NOT NULL,
  "correct_answer" TEXT NOT NULL,
  "explanation" TEXT,
  "image_url" TEXT,
  "marks" REAL DEFAULT 1 NOT NULL,
  "source_type" TEXT,
  "source_id" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_assignment_targets" (
  "id" TEXT NOT NULL,
  "task_id" TEXT NOT NULL,
  "class_id" TEXT,
  "student_id" TEXT,
  "target_mode" TEXT DEFAULT 'include' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 408; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_framework_components" (
  "id" TEXT NOT NULL,
  "curriculum_id" TEXT NOT NULL,
  "component_code" TEXT NOT NULL,
  "component_type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "stage" TEXT,
  "year_group" TEXT,
  "statutory_status" TEXT,
  "official_source" TEXT,
  "official_url" TEXT,
  "source_version" TEXT,
  "description" TEXT,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 3203; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_quality_reviews" (
  "id" TEXT NOT NULL,
  "curriculum_id" TEXT NOT NULL,
  "topic_id" TEXT NOT NULL,
  "reviewer_role" TEXT DEFAULT 'curriculum_supervisor' NOT NULL,
  "status" TEXT DEFAULT 'pending' NOT NULL,
  "curriculum_verified" INTEGER DEFAULT 0 NOT NULL,
  "lesson_verified" INTEGER DEFAULT 0 NOT NULL,
  "study_note_verified" INTEGER DEFAULT 0 NOT NULL,
  "practice_verified" INTEGER DEFAULT 0 NOT NULL,
  "assessment_verified" INTEGER DEFAULT 0 NOT NULL,
  "revision_verified" INTEGER DEFAULT 0 NOT NULL,
  "teacher_guide_verified" INTEGER DEFAULT 0 NOT NULL,
  "worked_example_verified" INTEGER DEFAULT 0 NOT NULL,
  "audio_script_verified" INTEGER DEFAULT 0 NOT NULL,
  "video_script_verified" INTEGER DEFAULT 0 NOT NULL,
  "downloadable_verified" INTEGER DEFAULT 0 NOT NULL,
  "notes" TEXT,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 76612; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_assets" (
  "id" TEXT NOT NULL,
  "curriculum_id" TEXT NOT NULL,
  "level_id" TEXT,
  "topic_id" TEXT,
  "resource_pack_id" TEXT,
  "asset_type" TEXT NOT NULL,
  "format" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "status" TEXT DEFAULT 'planned' NOT NULL,
  "storage_bucket" TEXT,
  "storage_path" TEXT,
  "mime_type" TEXT,
  "file_size" REAL,
  "content_hash" TEXT,
  "version" REAL DEFAULT 1 NOT NULL,
  "visibility" TEXT DEFAULT 'restricted' NOT NULL,
  "downloadable" INTEGER DEFAULT 0 NOT NULL,
  "viewable" INTEGER DEFAULT 1 NOT NULL,
  "editable" INTEGER DEFAULT 0 NOT NULL,
  "generation_source" TEXT DEFAULT 'phenom-background-worker' NOT NULL,
  "generator_metadata" TEXT DEFAULT '{}' NOT NULL,
  "generated_at" TEXT,
  "stored_at" TEXT,
  "published_at" TEXT,
  "last_error" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 53496; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_asset_jobs" (
  "id" TEXT NOT NULL,
  "asset_id" TEXT NOT NULL,
  "trigger_type" TEXT DEFAULT 'background' NOT NULL,
  "priority" REAL DEFAULT 50 NOT NULL,
  "status" TEXT DEFAULT 'queued' NOT NULL,
  "attempts" REAL DEFAULT 0 NOT NULL,
  "max_attempts" REAL DEFAULT 3 NOT NULL,
  "requested_by" TEXT,
  "requested_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "started_at" TEXT,
  "completed_at" TEXT,
  "error_message" TEXT,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_asset_permissions" (
  "id" TEXT NOT NULL,
  "asset_id" TEXT NOT NULL,
  "user_id" TEXT,
  "school_id" TEXT,
  "role_code" TEXT,
  "can_view" INTEGER DEFAULT 1 NOT NULL,
  "can_download" INTEGER DEFAULT 0 NOT NULL,
  "can_edit" INTEGER DEFAULT 0 NOT NULL,
  "expires_at" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 286; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_external_resources" (
  "id" TEXT NOT NULL,
  "curriculum_id" TEXT NOT NULL,
  "level_id" TEXT,
  "topic_id" TEXT,
  "resource_type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "official_url" TEXT NOT NULL,
  "source_authority" TEXT DEFAULT 'Cambridge International' NOT NULL,
  "access_class" TEXT DEFAULT 'public_official' NOT NULL,
  "licence_status" TEXT DEFAULT 'official_link_only' NOT NULL,
  "retrieval_status" TEXT DEFAULT 'catalogued' NOT NULL,
  "storage_status" TEXT DEFAULT 'not_stored' NOT NULL,
  "local_asset_id" TEXT,
  "source_version" TEXT,
  "publication_date" TEXT,
  "retrieved_at" TEXT,
  "content_hash" TEXT,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 9171; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_acquisition_items" (
  "id" TEXT NOT NULL,
  "curriculum_id" TEXT NOT NULL,
  "level_id" TEXT,
  "topic_id" TEXT,
  "qualification" TEXT,
  "subject_name" TEXT,
  "syllabus_code" TEXT,
  "resource_type" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "official_url" TEXT NOT NULL,
  "source_authority" TEXT DEFAULT 'Cambridge International' NOT NULL,
  "access_class" TEXT DEFAULT 'public_official' NOT NULL,
  "licence_status" TEXT DEFAULT 'official_link_only' NOT NULL,
  "retrieval_status" TEXT DEFAULT 'catalogued' NOT NULL,
  "storage_status" TEXT DEFAULT 'not_stored' NOT NULL,
  "local_asset_id" TEXT,
  "source_version" TEXT,
  "publication_date" TEXT,
  "retrieved_at" TEXT,
  "content_hash" TEXT,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 5858; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_requirement_mappings" (
  "id" TEXT NOT NULL,
  "curriculum_id" TEXT NOT NULL,
  "topic_id" TEXT NOT NULL,
  "mapping_type" TEXT NOT NULL,
  "official_source_url" TEXT,
  "source_version" TEXT,
  "official_reference" TEXT,
  "requirement_text" TEXT,
  "mapping_status" TEXT DEFAULT 'queued' NOT NULL,
  "verification_status" TEXT DEFAULT 'pending' NOT NULL,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 64208; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_library_items" (
  "id" TEXT NOT NULL,
  "curriculum_id" TEXT NOT NULL,
  "topic_id" TEXT,
  "asset_id" TEXT,
  "external_resource_id" TEXT,
  "title" TEXT NOT NULL,
  "item_type" TEXT NOT NULL,
  "source_class" TEXT DEFAULT 'phenom_authored' NOT NULL,
  "access_class" TEXT DEFAULT 'internal' NOT NULL,
  "licence_status" TEXT DEFAULT 'pending' NOT NULL,
  "storage_status" TEXT DEFAULT 'not_stored' NOT NULL,
  "public_status" TEXT DEFAULT 'private' NOT NULL,
  "qc_status" TEXT DEFAULT 'pending' NOT NULL,
  "metadata" TEXT DEFAULT '{}' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 53444; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_curriculum_library_topic_links" (
  "id" TEXT NOT NULL,
  "library_item_id" TEXT NOT NULL,
  "topic_id" TEXT NOT NULL,
  "relation_type" TEXT DEFAULT 'curriculum_alignment' NOT NULL,
  "alignment_status" TEXT DEFAULT 'pending' NOT NULL,
  "alignment_score" REAL,
  "alignment_basis" TEXT,
  "verified_by" TEXT,
  "verified_at" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_ephemeral_attachments" (
  "id" TEXT NOT NULL,
  "conversation_id" TEXT,
  "sender_id" TEXT NOT NULL,
  "storage_bucket" TEXT NOT NULL,
  "storage_path" TEXT NOT NULL,
  "media_type" TEXT NOT NULL,
  "purpose" TEXT DEFAULT 'communication' NOT NULL,
  "expires_at" TEXT NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "deleted_at" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_communication_extraction_jobs" (
  "id" TEXT NOT NULL,
  "attachment_id" TEXT NOT NULL,
  "requested_by" TEXT NOT NULL,
  "extraction_status" TEXT DEFAULT 'queued' NOT NULL,
  "extracted_text" TEXT,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "completed_at" TEXT,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_retention_audit" (
  "id" TEXT NOT NULL,
  "object_type" TEXT NOT NULL,
  "object_id" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "reason" TEXT NOT NULL,
  "executed_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_cbt_exam_assignments" (
  "id" TEXT NOT NULL,
  "exam_id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "assigned_by" TEXT NOT NULL,
  "assigned_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_cbt_exam_attempts" (
  "id" TEXT NOT NULL,
  "exam_id" TEXT NOT NULL,
  "assignment_id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "student_id" TEXT NOT NULL,
  "attempt_no" REAL DEFAULT 1 NOT NULL,
  "answers" TEXT DEFAULT '{}' NOT NULL,
  "score" REAL,
  "correct_count" REAL,
  "total_marks" REAL,
  "started_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "submitted_at" TEXT,
  "status" TEXT DEFAULT 'in_progress' NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_cbt_exam_media" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "exam_id" TEXT NOT NULL,
  "question_id" TEXT,
  "uploaded_by" TEXT NOT NULL,
  "storage_bucket" TEXT DEFAULT 'school-cbt-media' NOT NULL,
  "storage_path" TEXT NOT NULL,
  "media_type" TEXT NOT NULL,
  "mime_type" TEXT,
  "file_size" REAL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_cbt_question_resources" (
  "id" TEXT NOT NULL,
  "school_id" TEXT NOT NULL,
  "exam_id" TEXT NOT NULL,
  "question_id" TEXT NOT NULL,
  "library_item_id" TEXT NOT NULL,
  "relation_type" TEXT DEFAULT 'supporting_resource' NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 0; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "school_cbt_exam_questions_student" (
  "id" TEXT NOT NULL,
  "exam_id" TEXT NOT NULL,
  "position" REAL NOT NULL,
  "question_text" TEXT NOT NULL,
  "options" TEXT,
  "image_url" TEXT,
  "media" TEXT DEFAULT '[]' NOT NULL,
  "marks" REAL DEFAULT 1 NOT NULL,
  PRIMARY KEY ("id")
);

-- Source rows at inventory time: 19; source RLS enabled: true
CREATE TABLE IF NOT EXISTS "lms_canonical_curriculum_registry" (
  "canonical_order" REAL NOT NULL,
  "curriculum_id" TEXT NOT NULL,
  "canonical_name" TEXT NOT NULL,
  "jurisdiction" TEXT NOT NULL,
  "authority" TEXT NOT NULL,
  "official_source" TEXT,
  "structure_scope" TEXT NOT NULL,
  "required_resource_families" TEXT DEFAULT '[]' NOT NULL,
  "verification_status" TEXT DEFAULT 'framework_registered' NOT NULL,
  "active" INTEGER DEFAULT 1 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "updated_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  PRIMARY KEY ("canonical_order")
);

-- Source rows at inventory time: 0; source RLS enabled: false
CREATE TABLE IF NOT EXISTS "cloudflare_migration_manifest" (
  "source_type" TEXT NOT NULL,
  "source_id" TEXT NOT NULL,
  "r2_key" TEXT NOT NULL,
  "sha256" TEXT,
  "bytes" REAL,
  "verified" INTEGER DEFAULT 0 NOT NULL,
  "source_deleted" INTEGER DEFAULT 0 NOT NULL,
  "created_at" TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "verified_at" TEXT,
  PRIMARY KEY ("source_type", "source_id")
);
