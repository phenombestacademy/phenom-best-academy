# Public View Migration Review

Read-only extraction from Supabase project `hajrdejlamuiqjjhdnsv` on 11 October 2026. The four public views were found with `security_invoker=true`, so they use the querying user's underlying table permissions/RLS in PostgreSQL. Recreate this behaviour explicitly; do not create an unprotected replacement view by default.

## View register

| View | Owner | Security invoker | Definition size | Initial purpose |
|---|---|---|---:|---|
| `lms_curriculum_asset_audit` | postgres | Yes | 674 chars | Curriculum asset status counts by curriculum. |
| `lms_curriculum_completion_audit` | postgres | Yes | 3036 chars | Topic-level resource, quality-review, mapping and job-completion audit. |
| `lms_curriculum_library_access` | postgres | Yes | 776 chars | Library items joined to linked topics, filtered to allowed alignment states and active topics. |
| `lms_quiz_questions_student` | postgres | Yes | 129 chars | Student-facing quiz-question projection. |

## Definitions captured from PostgreSQL

### `lms_curriculum_asset_audit`

```sql
SELECT curriculum_id,
    count(*) AS asset_records,
    count(*) FILTER (WHERE status = ANY (ARRAY['stored'::text, 'published'::text])) AS stored_assets,
    count(*) FILTER (WHERE status = 'queued'::text) AS queued_assets,
    count(*) FILTER (WHERE status = 'generating'::text) AS generating_assets,
    count(*) FILTER (WHERE status = 'failed'::text) AS failed_assets,
    count(*) FILTER (WHERE asset_type = 'scheme_of_work'::text AND (status = ANY (ARRAY['stored'::text, 'published'::text]))) AS stored_scheme_of_work,
    count(*) FILTER (WHERE asset_type = 'scheme_of_work'::text) AS scheme_of_work_required
   FROM lms_curriculum_assets a
  GROUP BY curriculum_id;
```

### `lms_curriculum_completion_audit`

```sql
SELECT t.id AS topic_id,
    t.curriculum_id,
    t.topic_code,
    t.topic_title,
    t.official_source IS NOT NULL AND t.source_version IS NOT NULL AND t.source_status IS NOT NULL AS source_verified,
    COALESCE(r.resource_types, 0::bigint) AS resource_type_count,
    COALESCE(r.populated_resource_types, 0::bigint) AS populated_resource_type_count,
    COALESCE(q.qc_exists, false) AS qc_recorded,
    COALESCE(q.qc_status, 'pending'::text) AS qc_status,
    COALESCE(m.mapping_types, 0::bigint) AS mapping_type_count,
    COALESCE(m.verified_mapping_types, 0::bigint) AS verified_mapping_type_count,
    COALESCE(j.queued_or_active_jobs, 0::bigint) AS queued_or_active_jobs,
    COALESCE(j.completed_jobs, 0::bigint) AS completed_jobs,
    COALESCE(r.populated_resource_types, 0::bigint) >= 14 AND COALESCE(q.qc_status, 'pending'::text) = 'complete'::text AND COALESCE(m.verified_mapping_types, 0::bigint) >= 5 AND COALESCE(j.queued_or_active_jobs, 0::bigint) = 0 AND t.official_source IS NOT NULL AND t.source_version IS NOT NULL AND t.source_status IS NOT NULL AS complete
   FROM lms_curriculum_topics t
     LEFT JOIN ( SELECT lms_curriculum_resource_packs.topic_id,
            count(DISTINCT lms_curriculum_resource_packs.resource_type) AS resource_types,
            count(DISTINCT
                CASE
                    WHEN lms_curriculum_resource_packs.content IS NOT NULL AND length(TRIM(BOTH FROM lms_curriculum_resource_packs.content)) > 200 THEN lms_curriculum_resource_packs.resource_type
                    ELSE NULL::text
                END) AS populated_resource_types
           FROM lms_curriculum_resource_packs
          GROUP BY lms_curriculum_resource_packs.topic_id) r ON r.topic_id = t.id
     LEFT JOIN ( SELECT lms_curriculum_quality_reviews.topic_id,
            true AS qc_exists,
            max(lms_curriculum_quality_reviews.status) AS qc_status
           FROM lms_curriculum_quality_reviews
          GROUP BY lms_curriculum_quality_reviews.topic_id) q ON q.topic_id = t.id
     LEFT JOIN ( SELECT lms_curriculum_requirement_mappings.topic_id,
            count(DISTINCT lms_curriculum_requirement_mappings.mapping_type) AS mapping_types,
            count(DISTINCT
                CASE
                    WHEN lms_curriculum_requirement_mappings.verification_status = 'verified'::text THEN lms_curriculum_requirement_mappings.mapping_type
                    ELSE NULL::text
                END) AS verified_mapping_types
           FROM lms_curriculum_requirement_mappings
          GROUP BY lms_curriculum_requirement_mappings.topic_id) m ON m.topic_id = t.id
     LEFT JOIN ( SELECT a.topic_id,
            count(*) FILTER (WHERE j_1.status = ANY (ARRAY['queued'::text, 'generating'::text])) AS queued_or_active_jobs,
            count(*) FILTER (WHERE j_1.status = 'completed'::text) AS completed_jobs
           FROM lms_curriculum_asset_jobs j_1
             JOIN lms_curriculum_assets a ON a.id = j_1.asset_id
          GROUP BY a.topic_id) j ON j.topic_id = t.id
  WHERE t.active;
```

### `lms_curriculum_library_access`

```sql
SELECT li.id AS library_item_id,
    li.title,
    li.item_type,
    li.source_class,
    li.access_class,
    li.licence_status,
    li.storage_status,
    li.public_status,
    li.qc_status,
    li.asset_id,
    li.external_resource_id,
    ltl.topic_id,
    ltl.relation_type,
    ltl.alignment_status,
    ltl.alignment_score,
    ltl.alignment_basis,
    t.curriculum_id AS linked_curriculum_id,
    t.topic_title AS linked_topic_title,
    t.topic_code AS linked_topic_code
   FROM lms_curriculum_library_items li
     JOIN lms_curriculum_library_topic_links ltl ON ltl.library_item_id = li.id
     JOIN lms_curriculum_topics t ON t.id = ltl.topic_id
  WHERE (ltl.alignment_status = ANY (ARRAY['origin'::text, 'verified'::text, 'candidate'::text])) AND t.active = true;
```

### `lms_quiz_questions_student`

```sql
SELECT id,
    quiz_id,
    "position",
    question_text,
    options,
    image_url,
    explanation
   FROM quiz_questions q;
```

## Porting notes

- **`lms_curriculum_asset_audit`** uses PostgreSQL aggregate FILTER clauses and an array/ANY expression. Convert those to equivalent SQLite conditional aggregates, then compare all counts.
- **`lms_curriculum_completion_audit`** joins topic, resource-pack, quality-review, requirement-mapping and job state. Preserve its completion predicate exactly; it encodes a curriculum quality gate, not just a display count.
- **`lms_curriculum_library_access`** applies alignment-status and active-topic filters. Do not widen access to draft/inactive topics during conversion.
- **`lms_quiz_questions_student`** projects question text, options, image URL and explanation while omitting any correct-answer field from this view. Because explanation content may still reveal an answer, verify when the client is allowed to query it and whether it must be withheld until an attempt is submitted.

## Acceptance tests

1. Compare each view's output on a staging data copy before and after conversion.
2. Test under anonymous, learner, teacher, school-admin and super-admin identities where applicable.
3. Verify the student view never exposes answer keys, grading rubrics, unpublished questions or private assessment data.
4. Confirm the new API selects only necessary columns and enforces the original visibility rules.
