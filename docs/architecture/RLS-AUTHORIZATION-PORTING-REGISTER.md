# Row-Level Security Porting and Review Register

Read-only review of the 314 policies in the live Supabase project's `public` schema on 11 October 2026. No policy has been changed.

## Summary

- Total policies: 314
- Policies explicitly targeting the `anon` database role: 28
- Policies targeting the PostgreSQL `public` role: 69
- Policies with an unconditional `USING (true)`: 12
- Policies with an unconditional `WITH CHECK (true)`: 1
- Policies referencing `auth.uid()`: 137

**Important:** these counts are review indicators, not proof of a vulnerability. The `public` role may be intentional for published catalogues, and a policy's actual exposure also depends on table grants, RLS being enabled, and other permissive/restrictive policies. Every policy must be reviewed in context before conversion.

## Unconditional USING policies

| Table | Policy | Command | Roles |
|---|---|---|---|
| `academic_subject_catalog` | `catalog readable` | SELECT | public |
| `learning_topics` | `topics public read` | SELECT | anon, authenticated |
| `lms_curriculum_acquisition_items` | `authenticated_read_cambridge_acquisition` | SELECT | authenticated |
| `lms_curriculum_external_resources` | `authenticated_read_lms_curriculum_external_resources` | SELECT | authenticated |
| `lms_curriculum_library_items` | `authenticated users can view library catalogue` | SELECT | authenticated |
| `lms_curriculum_library_topic_links` | `authenticated users can view library topic links` | SELECT | authenticated |
| `lms_curriculum_quality_reviews` | `lms_curriculum_quality_reviews_authenticated_select` | SELECT | authenticated |
| `lms_curriculum_quality_reviews` | `lms_curriculum_quality_reviews_service_all` | ALL | service_role |
| `lms_curriculum_requirement_mappings` | `authenticated read curriculum requirement mappings` | SELECT | authenticated |
| `lms_programme_enrolment_authority` | `lpea_public_read` | SELECT | anon, authenticated |
| `site_settings` | `public can read site settings` | SELECT | public |
| `subscription_features` | `subscription features public read` | SELECT | anon, authenticated |

These are the first policies to validate against product intent and table grants. For tables containing learning resources, acquisition data, job state or internal operational details, verify whether all authenticated users should really see every row. Do not infer that a policy is unsafe solely because it is unconditional; some catalogue rows are intentionally public.

## Unconditional WITH CHECK policies

| Table | Policy | Command | Roles |
|---|---|---|---|
| `lms_curriculum_quality_reviews` | `lms_curriculum_quality_reviews_service_all` | ALL | service_role |

## Anonymous-role policies

| Table | Policy | Command | USING expression | WITH CHECK expression |
|---|---|---|---|---|
| `courses` | `courses public read published` | SELECT | ((published = true) OR is_staff() OR is_admin()) | — |
| `learning_topics` | `topics public read` | SELECT | true | — |
| `lms_assessment_pathways` | `public read active assessment pathways` | SELECT | (active = true) | — |
| `lms_badges` | `active badges read` | SELECT | ((active = true) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) | — |
| `lms_course_prerequisites` | `course prerequisites read` | SELECT | (EXISTS ( SELECT 1    FROM courses c   WHERE ((c.id = lms_course_prerequisites.course_id) AND (c.published = true)))) | — |
| `lms_course_reviews` | `published reviews read` | SELECT | ((published = true) OR (user_id = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) | — |
| `lms_course_sections` | `course sections read` | SELECT | ((published = true) OR ( SELECT private.lms_can_access_course(lms_course_sections.course_id) AS lms_can_access_course)) | — |
| `lms_curriculum_ingestion_runs` | `lcir_public_read` | SELECT | (status = ANY (ARRAY['completed'::text, 'partial'::text])) | — |
| `lms_curriculum_resource_packs` | `public read published curriculum resource packs` | SELECT | (status = 'published'::text) | — |
| `lms_curriculum_sources` | `lcs_public_read` | SELECT | ((active = true) AND (verification_status = ANY (ARRAY['retrieved'::text, 'parsed'::text, 'verified'::text]))) | — |
| `lms_curriculum_topics` | `lms_curriculum_topics_public_read` | SELECT | ((active = true) AND (source_status = ANY (ARRAY['verified'::text, 'imported'::text]))) | — |
| `lms_distance_affiliation_rules` | `public read active distance affiliation rules` | SELECT | (active = true) | — |
| `lms_education_domains` | `led_public_read` | SELECT | (active = true) | — |
| `lms_learning_path_courses` | `learning path courses read` | SELECT | (EXISTS ( SELECT 1    FROM lms_learning_paths p   WHERE ((p.id = lms_learning_path_courses.learning_path_id) AND ((p.published = true) OR (p.created_by = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin))))) | — |
| `lms_learning_paths` | `learning paths read published` | SELECT | ((published = true) OR (created_by = ( SELECT auth.uid() AS uid)) OR ( SELECT is_staff() AS is_staff) OR ( SELECT is_admin() AS is_admin)) | — |
| `lms_lesson_resources` | `lesson resources read` | SELECT | (EXISTS ( SELECT 1    FROM (lms_lessons l      JOIN lms_course_sections s ON ((s.id = l.section_id)))   WHERE ((l.id = lms_lesson_resources.lesson_id) AND ( SELECT private.lms_can_access_course(s.course_id) AS lms_can_access_course)))) | — |
| `lms_lessons` | `lessons read` | SELECT | (((published = true) AND (EXISTS ( SELECT 1    FROM lms_course_sections s   WHERE ((s.id = lms_lessons.section_id) AND (s.published = true) AND (EXISTS ( SELECT 1            FROM courses c           WHERE ((c.id = s.course_id) AND (c.published = true)))))))) OR (EXISTS ( SELECT 1    FROM lms_course_sections s   WHERE ((s.id = lms_lessons.section_id) AND ( SELECT private.lms_can_access_course(s.course_id) AS lms_can_access_course))))) | — |
| `lms_programme_authorities` | `lpa_public_read` | SELECT | ((active = true) AND (verification_status = 'verified'::text)) | — |
| `lms_programme_authority_policies` | `lpap_public_read` | SELECT | (active = true) | — |
| `lms_programme_enrolment_authority` | `lpea_public_read` | SELECT | true | — |
| `lms_programme_levels` | `lpl_public_read` | SELECT | (active = true) | — |
| `lms_programme_progression` | `lpp_public_read` | SELECT | (active = true) | — |
| `lms_programme_tracks` | `lpt_public_read` | SELECT | ((active = true) AND (status = ANY (ARRAY['ready'::text, 'published'::text]))) | — |
| `lms_qualification_frameworks` | `public read active qualification frameworks` | SELECT | (active = true) | — |
| `lms_tertiary_programme_catalogue` | `public read active tertiary catalogue` | SELECT | (active = true) | — |
| `subscription_features` | `subscription features public read` | SELECT | true | — |
| `subscription_plans` | `subscription plans active read` | SELECT | ((active = true) OR is_staff() OR is_admin()) | — |
| `ui_translation_resources` | `ui_translation_resources_public_read` | SELECT | (status = 'published'::text) | — |

## RLS-enabled table coverage check

A read-only cross-check of all 171 public base tables found one table with RLS disabled and no policies: `cloudflare_migration_manifest`. Its table privileges were also checked: `anon` and `authenticated` have no SELECT, INSERT or UPDATE privilege; `service_role` has SELECT and UPDATE. This appears to be an internal migration table rather than a browser-exposed table. Keep the replacement migration ledger private to the migration service and do not expose it through a public API.

The other 170 public base tables have RLS enabled. This is useful inventory evidence, but does not replace policy-by-policy and grant-by-grant validation.

## Migration rules

1. D1 does not implement PostgreSQL RLS; do not attempt to port policies as comments and then allow browser SQL access.
2. All private tables must be reachable only through a server API that validates the authenticated principal and authorization scope.
3. Build policy-equivalent tests for each table group: anonymous, learner, parent, teacher, school administrator, academy administrator and super administrator.
4. Test both allowed and denied paths, including cross-school and cross-user record IDs.
5. Preserve intentionally public catalogue reads but expose only the required columns; do not expose private configuration, answer keys, payment records, audit data or internal jobs.
6. Recheck table grants and RLS enabled status for every table; policy existence alone does not prove protection.
7. Port `SECURITY DEFINER` helpers carefully. A replacement API must not let callers choose a role or user ID to impersonate.

## Recommended verification order

- Identity and profile ownership.
- School membership and invitations.
- Parent/child links and child-safety settings.
- Student results, attendance, assessments and assignments.
- Quiz question/answer separation and attempts.
- Subscriptions, payment orders and webhook state.
- Curriculum ingestion jobs and unpublished assets.
- Public catalogue, CMS and newsletter subscriptions.
