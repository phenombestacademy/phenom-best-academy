# Kenya CBC Curriculum — Separate Implementation

## Status
Phase 2 — Kenya started.

This curriculum is maintained as a separate LMS layer with its own curriculum ID, source registry, levels/pathways, subjects, topics, resource packs, assets, assessment resources and QA/provenance records.

## Official controlling sources
- Kenya Institute of Curriculum Development (KICD) — CBC Materials and Curriculum Designs
- Basic Education Curriculum Framework (BECF)
- KICD regular curriculum designs: Pre-Primary, Grades 1–12 and Diploma in Teacher Education
- KICD Special Needs Education curriculum designs
- KICD approved CBC course materials
- Kenya National Examinations Council (KNEC) assessment frameworks, regulations, timetables and assessment guidance

## Scope

### Basic Education
1. Pre-Primary 1
2. Pre-Primary 2
3. Grade 1
4. Grade 2
5. Grade 3
6. Grade 4
7. Grade 5
8. Grade 6
9. Grade 7
10. Grade 8
11. Grade 9
12. Grade 10
13. Grade 11
14. Grade 12

### Senior School pathways
The Senior School layer must preserve the official pathway structure and subject/course choices published by KICD and current Ministry/KNEC guidance, rather than inventing combinations.

### Teacher Education
Diploma in Teacher Education is included as a distinct higher-level curriculum layer, with professional, pedagogical, subject and practicum components.

### Special Needs Education
SNE/adapted designs are retained as distinct curriculum resources rather than being collapsed into the mainstream curriculum. KICD currently lists Hearing Impairment, Physical Impairment and Visual Impairment designs from Pre-Primary through Grade 10, plus prevocational and vocational designs.

## Curriculum content model
For every official topic/strand/sub-strand, Phenom will maintain:
- official curriculum alignment
- level/pathway
- subject/course
- strand and sub-strand
- learning outcomes
- competencies
- values
- Pertinent and Contemporary Issues (PCIs)
- suggested learning experiences
- key inquiry questions
- assessment expectations/rubrics
- official source and version/provenance

## Resource families
Each verified topic is to receive the complete Phenom resource family:
- scheme of work
- lesson
- study note
- practice
- assessment
- answers
- marking guide
- revision
- teacher guide
- worked example
- activities
- workbook
- downloadable resource
- audio script
- video script
- teaching material
- educational resource
- differentiated resource
- extension challenge
- interactive activity
- original examination question
- examination answer/mark scheme
- simulation/virtual lab where educationally appropriate
- IQA/provenance record

## Assessment layer
The Kenya assessment layer must include current KNEC structures and not be reduced to generic quizzes:
- school-based/formative assessment
- Grade-level projects/practicals where applicable
- KPSEA
- KJSEA
- senior-school assessment and pathway assessment
- KCSE where still applicable to the relevant transition/cohort
- KILEA/KPLEA where applicable
- teacher-education assessments
- business/technical/TVET examination interfaces where the relevant curriculum layer requires them

## Integrity rules
- Do not duplicate existing curriculum records.
- Do not overwrite existing authoritative records.
- Teachers remain read-only for authoritative library resources.
- Super-admin retains authoritative editing/publishing control.
- Official source material remains the controlling reference.
- Structured LMS assets must not be described as separate PDF/DOCX binaries unless physical storage is verified.
- Queued production must remain queued until actually generated and verified.

## Current implementation constraint
The Supabase project connection is currently timing out. Therefore database insertion and final live counts are deliberately not fabricated in this commit. Source acquisition and the Kenya implementation specification are prepared first; database ingestion will be verified when the connection is available.
