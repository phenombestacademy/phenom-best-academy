Phenom Best Academy

Website source for Phenom Best Academy Limited.

## Phenom Best Academy — Universal Curriculum Completion Standard

Every curriculum implemented in Phenom Best Academy follows the mandatory completion standard in `docs/PHENOM-CURRICULUM-COMPLETION-STANDARD.md`.

A curriculum is **not advertised as complete** until every applicable official requirement has been reconciled and quality-checked. The required curriculum-content and learning-resource layers are:

- Curriculum/source reference and official source/version/status
- Stage / key stage / year / class / grade or jurisdictional equivalent
- Subject / discipline / learning area
- Strand / domain / area of learning
- Topic and subtopic
- Knowledge statement/content requirement
- Skill/competency
- Attainment expectation/standard where applicable
- Learning outcome
- Scheme of work
- Lesson/lesson sequence
- Learner study material
- Teacher's guide
- Examples
- Worked examples where applicable
- Activities
- Workbook/workbook activities
- Practice
- Assessment
- Answers
- Marking guide/rubric where applicable
- Revision
- Audio scripts/resources where appropriate
- Video scripts/resources where appropriate
- Downloadable resources
- Progression/prerequisite links
- SEND/inclusion considerations where applicable
- Differentiation/intervention/extension guidance where appropriate
- Quality-control verification

Existing verified Phenom content is preserved. Partial content is completed, misaligned content is corrected, duplicates are consolidated without loss, and genuinely missing requirements are created. Historical curriculum versions are retained as historical/reference material; current requirements and policy changes are versioned and sourced rather than silently overwriting history.

The quality-control supervisor must reconcile detailed official programme requirements, not merely count high-level topic records. A curriculum remains **in progress** until all applicable requirements and resource layers are accounted for and verified.

The same standard applies to **every applicable curriculum framework** in the Phenom Best Academy LMS and Library. If Phenom says a curriculum is complete, the applicable official requirements have actually been reconciled, the required learning resources are in place, and quality control has passed.

## Platform stack

- React + TypeScript
- TanStack Start / TanStack Router
- Vite
- Tailwind CSS
- Nitro (Vercel deployment target)

## Local development

npm install
npm run dev

## Production build

npm run build

## Enquiries

The enquiry form validates and saves a visitor's enquiry locally on that device, then provides direct email and WhatsApp actions to the Academy. Academy contact details are maintained in `src/lib/academy.ts`.

## Public-source package

The public website package intentionally excludes the original corporate reference documents and other working materials. Those materials remain outside the deployable source so they are not accidentally published with the website.

The site uses the official Phenom Best Academy brand assets and incorporates the Academy's two specialist identities: Phenom Sound Press — The Library Service of Phenom Best Academy, and Phenom Sound Lab — The Creative Division of Phenom Best Academy.

This production source preserves the original visual system and Academy brand assets while keeping Phenom Best Academy branding only.

## LMS content principle

The curriculum catalogue is not treated as a list of topic names. The source-of-truth curriculum layer must be reconciled to the learning-resource layer, including lessons, study materials, teacher guidance, practice, assessments, answers/marking guidance, revision, media scripts/resources, downloads and progression. Where the official curriculum leaves teaching sequence flexible, Phenom may provide a pedagogically coherent sequence while clearly distinguishing Phenom organisation from statutory requirements.

## V6 Phenom Best LMS expansion

The V6 expansion foundation is documented in `docs/PHENOM-LMS-V6-EXPANSION.md` and `supabase/031_phenom_enterprise_lms_foundation.sql`. It is additive and preserves the existing LMS, school platform, curriculum catalogue and security policies.

## Phenom Best LMS — curriculum content standard

The curriculum content model is defined in `docs/PHENOM-BEST-LMS-CURRICULUM-CONTENT-STANDARD.md`.

For source-verified Nigerian secondary curriculum ingestion, the required scope is JSS1–JSS3 and SS1–SS3. Each topic must retain its level, subject, term, sequence/week, topic, source-derived subtopic/content and source reference. The learning layer is structured to support learning materials, objectives, expected learning outcomes, lesson materials, study notes, explanations, worked examples where applicable, practice activities, CBT assessment, answer keys, revision materials, teacher guides, audio scripts, video scripts and downloadable resources.

CBT supports both teacher-authored questions and professionally prepared questions from the Phenom Best LMS Question Bank/Marketplace. Objective CBT attempts are automatically scored from stored answer keys for immediate learner feedback and authorised staff result signals.

Existing Nursery, Pre-Primary, Primary, Technical Education and tertiary curriculum records are retained until authoritative replacement materials are supplied; they are not to be deleted merely because new source materials are still being collected.

The supplied NERDC secondary structured dataset is retained in the Academy Library as the source-ingestion reference for this work.

## Admin Studio / Media / platform architecture

The latest site includes the Admin Studio foundation at `/admin` and a public Media & Resources hub at `/media`. The platform architecture includes controlled media/resources, Google authentication through Supabase Auth, adult/teen/child account types with guardian linkage, privacy-conscious analytics, moderation hooks, organisation spaces, school multi-tenancy, CBT, result books/report cards, payment architecture and the relevant security boundaries documented in the source and Supabase migrations.

Production activation continues to require Supabase Auth/RLS, Edge Function secrets, approved integrations, safeguarding workflows and professional legal/privacy/security review where applicable.
