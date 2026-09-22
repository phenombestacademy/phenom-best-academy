# Phenom Best Academy — Curriculum Ingestion and Programme Authority Framework

## Purpose

This framework keeps the LMS fast for learners while making curriculum content traceable to authoritative sources.

### Curriculum rule

The LMS follows:

**Curriculum → Level/Stage → Subject → Topic/Subtopic → Lesson → Activity → Assessment → Competency**

A topic is not presented as verified curriculum content unless its authoritative source has been registered, extracted and verified.

### Source states

- **registered** — official source identified.
- **retrieved** — source retrieved for processing.
- **parsed** — source structure extracted.
- **verified** — extracted structure checked against the authoritative source.
- **stale** — source has been superseded and requires re-ingestion.
- **failed** — ingestion failed and must not be published.

The LMS uses `lms_curriculum_sources`, `lms_curriculum_ingestion_runs` and `lms_curriculum_topics` to maintain this chain.

## No invented curriculum

Phenom Best Core may generate lessons, explanations, examples, exercises, audio, video and assessments **from verified curriculum objectives and expectations**. It must not invent an official curriculum topic, outcome or statutory expectation.

Unextracted material remains `source_pending`.

## Education scope

Education is a first-class programme domain. It includes, where appropriate:

- Early Childhood Education
- Primary Education
- Secondary Education
- Teacher Education
- Mathematics Education
- Science Education
- Language Education
- Special and Inclusive Education
- Educational Leadership
- Educational Administration and Planning
- Educational Psychology
- Curriculum Studies
- Educational Technology
- Educational Measurement and Evaluation
- Guidance and Counselling Education
- Adult Education
- Vocational and Technical Education
- Arts Education
- Physical and Health Education

These are distinct from school-curriculum subjects and can support undergraduate, postgraduate, teacher-development and CPD pathways.

## Programme authority and affiliation policy

Every programme must identify how Phenom Best Academy is authorised to offer it.

### 1. Academy direct

Phenom Best Academy designs, delivers and administers the programme directly within its lawful scope.

### 2. Academy licensed or approved

The programme requires a licence, registration, accreditation, approval or other official authorization before delivery or award. The LMS must not imply that the approval exists until it is verified.

### 3. Affiliated institution

The programme is delivered with a verified university, polytechnic, college, professional institute, healthcare institution or other recognised partner. The actual awarding body and Phenom's role must be disclosed.

This is the normal architecture for programmes such as regulated medicine, degree pathways, specialist professional education or programmes whose award belongs to an external institution.

### 4. Co-delivered

Phenom and a verified institution, regulator, professional body, industry organisation or other partner jointly deliver the programme. Responsibilities and credential issuance must be documented.

### 5. Regulatory or government

The programme involves a ministry, government agency, statutory body, regulator or other official authority. The relevant approval/authority reference must be stored before publication.

### 6. Referral or pathway

Phenom provides preparation, guidance, admissions support or a pathway to another institution. Phenom must not present the external institution's credential as its own.

## Certificate rule

The certificate issuer must match the documented authority model. The LMS must never automatically label an externally awarded qualification as a Phenom Best Academy award.

## Speed architecture

Official source ingestion is an administrative/background process. Learner navigation must not fetch or parse curriculum documents.

Published curriculum structures are stored in Supabase and queried directly. Generated resources are cached/materialised server-side and heavy media is stored in object storage. The learner receives lightweight metadata and media URLs.

This keeps the public platform fast while preserving curriculum traceability and auditability.
