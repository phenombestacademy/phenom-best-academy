# New Zealand Curriculum — Finalisation Checkpoint

Date: 25 September 2026
Curriculum ID: new-zealand-nzc

## Scope
Phenom's New Zealand curriculum layer covers the New Zealand Curriculum / Te Mātaiaho and Te Marautanga o Aotearoa architecture across Years/Tau 0–10, Years/Tau 11–13 pathways, current NCEA, Scholarship, University Entrance, and the forthcoming NZCE/NZACE transition.

## Live implementation checkpoint
- 7 curriculum levels/pathway bands
- 219 curriculum topic records
- 14 resource-pack families x 219 topics = 3,066 resource packs
- 219 topic-level scheme-of-work assets stored in the curriculum asset registry
- 2 additional published level/pathway scheme-of-work assets
- 18 topic-guide assets remain explicitly queued because their official topic corpus still requires extraction/reconciliation
- 5,475 detailed production jobs queued: 25 production families x 219 topics
- 0 detailed production jobs marked completed; queued work is not represented as completed

## Resource-pack families
Each topic has the available structured resource-pack layer for:
study notes, practice, assessment, answers, marking guides, revision, teacher guides, worked examples, activities, workbooks, audio scripts, video scripts, downloadables, lessons, and related teaching-resource families.

The scheme-of-work layer is stored in the database-backed curriculum resource/asset layer and is non-editable by teachers; super-admin remains the editorial authority.

## Production queue
The queue includes:
study_note, practice, assessment, answers, marking_guide, revision, teacher_guide, worked_example, activities, workbook, audio_script, video_script, downloadable, exam_questions, exam_answers, exam_mark_scheme, interactive_activity, simulation, differentiation, extension, pathway_guidance, source_reconciliation, plus the existing full_resource_pack, resource_expansion and topic_reconciliation jobs.

## Integrity rule
Official Ministry of Education / Tāhūrangi material remains the controlling source. Placeholder or unreconciled topic records are not falsely promoted to completed detailed curriculum content. Future official releases, especially the staged Years/Tau 11–13 curriculum, remain queued for source reconciliation and production.

## Status
The currently released New Zealand curriculum layer has been finalised for library structure, schemes, resource-pack coverage and production queueing. Remaining unreleased/unreconciled official material is deliberately queued rather than falsely marked complete.
