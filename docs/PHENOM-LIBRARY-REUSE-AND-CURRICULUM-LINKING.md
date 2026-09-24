# Phenom LMS — Single Library Asset Reuse & Cross-Curriculum Linking

## Operating rule

Phenom stores learning material once as a canonical Library/asset record and links that material to every curriculum topic for which it is genuinely relevant.

A teacher entering a topic does not receive a newly generated duplicate copy. The LMS resolves the topic to the existing Library item and presents the same underlying asset.

Example:

- Cambridge Year 9 Mathematics → Algebra
- Nigeria JSS/SS Mathematics → an algebra topic with a genuinely overlapping learning objective

If the existing Phenom Library resource is appropriate to both, both curriculum topics point to the same canonical Library asset.

## Database model

- lms_curriculum_assets — canonical stored/generated asset.
- lms_curriculum_library_items — Library catalogue entry that exposes the asset.
- lms_curriculum_library_topic_links — many-to-many relationship between Library items and curriculum topics.
- lms_curriculum_topics — authoritative curriculum structure and learning outcomes.
- lms_curriculum_library_access — secure read view for resolving Library resources from a curriculum topic.

The original topic association is retained as an origin link. Additional cross-curriculum relationships use explicit relationship types such as shared_objective, shared_skill or supporting_resource.

## Verification rule

Existing relationships are migrated as verified origin links because they were already explicitly attached to those topics.

New cross-curriculum relationships must not be invented merely because two titles look similar. They should be added only after checking the topic objective/learning outcome, level, subject context and the actual Library resource. Candidate matches may be recorded as candidate until checked.

## Space and duplication rule

The LMS must not create a second physical content asset merely because another curriculum needs the same material.

The same canonical asset may serve many curriculum topics. Curriculum records describe where the material is relevant; the Library/asset record remains the single content source.

This preserves storage, avoids version drift and lets one properly reviewed resource serve multiple legitimate teaching contexts.

## Current implementation checkpoint — 24 September 2026

- Cambridge Library catalogue: 5,639 items.
- Existing library-topic relationships migrated into the new many-to-many link layer.
- Cambridge assets backed by published resource packs and already present in the Library were normalised from planned to published; no content was deleted.
- Cross-curriculum reuse is now structurally supported without duplicating the underlying asset.
- No unverified cross-curriculum matches were falsely marked as verified.
