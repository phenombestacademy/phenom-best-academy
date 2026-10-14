# Supabase Migration History Snapshot

Read-only list from project `hajrdejlamuiqjjhdnsv`, captured 11 October 2026. The project reports 107 applied migration records. This list records versions and names only; it does not include migration SQL bodies and does not prove that the current live schema has no drift from the files that originally produced it.

- First recorded version: `20260916172439` — `001_platform_schema`
- Latest recorded version: `20261002062338` — `cloudflare_background_job_claims`

| Version | Migration name |
|---|---|
| `20260916172439` | `001_platform_schema` |
| `20260916172448` | `002_media_schema` |
| `20260916172536` | `003_school_tables` |
| `20260916172546` | `004_learning_tables` |
| `20260916172600` | `005_activation_security` |
| `20260916172608` | `006_platform_controls` |
| `20260916172616` | `007_media_storage_policies` |
| `20260916172629` | `008_school_results_and_records` |
| `20260916172641` | `009_school_operations` |
| `20260916172649` | `010_subscription_catalogue` |
| `20260916172701` | `011_school_finance_hr_elections` |
| `20260916172830` | `012_security_hardening` |
| `20260916233856` | `013_v5_comprehensive_final` |
| `20260916234059` | `014_community_calls_and_premium_grants` |
| `20260916234134` | `015_subject_catalog_seed` |
| `20260917004535` | `016_school_privacy_results_communication` |
| `20260917004628` | `017_language_result_notifications_group_controls` |
| `20260917004951` | `018_community_access_hardening` |
| `20260917004958` | `019_group_owner_membership` |
| `20260917005052` | `020_classmate_directory_and_result_release_rpc` |
| `20260917005115` | `021_class_teacher_result_visibility` |
| `20260917005132` | `022_student_record_privacy` |
| `20260917005313` | `023_super_admin_attendance_delete` |
| `20260917005430` | `024_school_tenant_teacher_scope` |
| `20260917005522` | `025_classmate_passport_directory` |
| `20260917005604` | `026_teacher_lms_and_cbt_permissions` |
| `20260917013840` | `027_global_localisation_curriculum_super_admin` |
| `20260917014019` | `028_localisation_curriculum_security_hardening` |
| `20260917015924` | `029_global_curriculum_catalogue_expansion` |
| `20260917043353` | `security_definer_execute_hardening` |
| `20260917043408` | `security_definer_public_execute_hardening` |
| `20260917043423` | `attendance_scope_hardening` |
| `20260917160234` | `restrict_permanent_media_to_super_admin` |
| `20260917160250` | `restrict_media_library_mutations_to_super_admin` |
| `20260917180143` | `tools_and_cpd_entitlements_v56` |
| `20260922005734` | `phenom_best_lms_premium_foundation_and_rls_hardening` |
| `20260922005752` | `phenom_best_lms_certificate_verification` |
| `20260922010407` | `phenom_best_lms_communication_privacy_and_admin_policy_hardening` |
| `20260922010427` | `phenom_best_lms_rpc_privilege_hardening` |
| `20260922010837` | `phenom_best_lms_super_admin_controls_and_email_privacy` |
| `20260922011219` | `client_auth_profiles_and_payment_auto_upgrade` |
| `20260922011230` | `harden_auth_profile_trigger_execute` |
| `20260922012525` | `phenom_user_identity_and_record_integrity` |
| `20260922013550` | `fix_public_email_subscription` |
| `20260922013612` | `harden_email_subscription_validation` |
| `20260922090146` | `032_multilingual_interface_learning_preferences` |
| `20260922091501` | `033_ui_translation_resources` |
| `20260922093337` | `034_expand_language_locale_support` |
| `20260922094840` | `035_lms_curriculum_execution_and_cpd` |
| `20260922094908` | `036_global_language_catalogue` |
| `20260922101139` | `037_curriculum_ingestion_education_authority_schema` |
| `20260922101154` | `038_curriculum_sources_education_domains_authority_policy_seed` |
| `20260922101222` | `039_verified_framework_topics_and_pending_coverage` |
| `20260922101345` | `040_hide_unverified_curriculum_topics_from_public` |
| `20260922105511` | `042_tertiary_nd_global_qualification_and_distance_affiliation_architecture` |
| `20260922110817` | `043_curriculum_resource_packs_and_content_jobs` |
| `20260922111622` | `044_expand_verified_curriculum_resource_corpus` |
| `20260922130111` | `060_school_record_retention_and_media_guard` |
| `20260922130156` | `061_harden_trigger_only_function_execute` |
| `20260924073613` | `expand_england_national_curriculum_source_library_2026` |
| `20260924073759` | `expand_england_eyfs_2026_framework_library` |
| `20260924074008` | `england_national_curriculum_complete_framework_v2026` |
| `20260924075116` | `england_curriculum_completion_and_supervision` |
| `20260924075705` | `complete_england_official_source_reconciliation` |
| `20260924081826` | `add_england_curriculum_completion_audit_view` |
| `20260924082209` | `expand_curriculum_resource_types_for_phenom_completion_standard` |
| `20260924082237` | `tighten_england_completion_gate_to_14_resource_types` |
| `20260924090530` | `cambridge_acquisition_manifest` |
| `20260924090758` | `cambridge_acquisition_topic_scoping` |
| `20260924090827` | `cambridge_external_resource_read_policy` |
| `20260924100429` | `cambridge_completion_mapping_queue` |
| `20260924100504` | `universal_curriculum_completion_audit` |
| `20260924104310` | `curriculum_library_cross_curriculum_links` |
| `20260924104319` | `secure_curriculum_library_access_view` |
| `20260924105451` | `unify_curriculum_assets_with_library` |
| `20260924110955` | `school_communication_ephemeral_retention` |
| `20260924110959` | `communication_retention_safety_defaults` |
| `20260924111554` | `school_cbt_tenant_workspace_and_retention` |
| `20260924111710` | `school_cbt_student_question_trigger_security` |
| `20260924111744` | `school_cbt_private_media_bucket` |
| `20260924111814` | `school_cbt_super_admin_media_visibility` |
| `20260924161301` | `increase_curriculum_asset_worker_batch` |
| `20260924163054` | `secure_curriculum_asset_storage_for_super_admin` |
| `20260924170357` | `allow_topic_scoped_curriculum_assets` |
| `20260924181247` | `us_american_curriculum_completion_queue` |
| `20260924181557` | `cambridge_assessment_qualification_completion` |
| `20260924181614` | `cambridge_canonical_library_completion` |
| `20260924210531` | `new_zealand_completion_framework_and_library_v2` |
| `20260924211514` | `india_ncf_se_2023_completion_baseline` |
| `20260924212019` | `india_ncf_assessment_planning_exam_university_expansion` |
| `20260924212357` | `india_ncf_comprehensive_domain_source_and_resource_completion_v3` |
| `20260924213324` | `new_zealand_2026_rollout_and_completion_layer_v3` |
| `20260924214721` | `ireland_levels_pathways_v2` |
| `20260924214725` | `ireland_subject_domain_baseline` |
| `20260924214755` | `ireland_resource_and_iqa_queue_v3` |
| `20260924214851` | `ireland_official_sources_and_pathway_layer_v2` |
| `20260925021453` | `netherlands_curriculum_foundation_2026` |
| `20260925231219` | `tidy_curriculum_and_ephemeral_rls_policies` |
| `20260925232321` | `establish_canonical_19_curriculum_registry` |
| `20260927033835` | `add_phenom_user_id_login_lookup` |
| `20260927040018` | `add_phenom_profile_auth_lookup` |
| `20260927044848` | `add_account_profile_settings` |
| `20260927044932` | `add_profile_avatar_storage` |
| `20260927052602` | `performance_navigation_indexes_20260927` |
| `20260927211900` | `add_my_phenom_user_id_rpc` |
| `20260927211957` | `fix_profiles_rls_function_grants` |
| `20261002062338` | `cloudflare_background_job_claims` |

## Migration planning implications

1. The replacement schema must reflect the current live schema and data, not just a mechanical translation of these migration names.
2. Capture full schema, constraints, indexes, grants, functions, triggers, views and RLS definitions before the production cutover.
3. Review the most recent background-job claim migration together with the Cloudflare workers; preserve concurrency and retry semantics.
4. Keep this snapshot as evidence of the source migration history. It is not a replacement database backup.
