Phenom Best Academy

Website source for Phenom Best Academy Limited.

Stack

- React + TypeScript
- TanStack Start / TanStack Router
- Vite
- Tailwind CSS
- Nitro (Vercel deployment target)

Local development

npm install
npm run dev

Production build

npm run build

Enquiries

The enquiry form validates and saves a visitor's enquiry locally on that device, then provides direct email and WhatsApp actions to the Academy. Academy contact details are maintained in "src/lib/academy.ts".

Public-source package

The public website package intentionally excludes the original corporate reference documents and other working materials. Those materials remain outside the deployable source so they are not accidentally published with the website.

The site uses the official Phenom Best Academy brand assets and incorporates the Academy's two specialist identities: Phenom Sound Press — The Library Service of Phenom Best Academy, and Phenom Sound Lab — The Creative Division of Phenom Best Academy.

This production source preserves the original visual system and Academy brand assets while keeping Phenom Best Academy branding only.

Level 2 CMS — Admin Studio

The latest site now includes a professional Admin Studio foundation at "/admin" and a public Media & Resources hub at "/media".

What it supports

- Pictures and gallery-ready content
- YouTube/external video links and direct video uploads when connected storage is enabled
- Songs, MP3/M4A/WAV audio and free sounds/samples
- Resources, learning materials, downloads and useful links
- News and updates
- Featured content
- Draft/published status
- Thumbnail and download URLs
- Controlled background/surface/accent settings
- Refined/minimal/off animation preferences
- Approved logo replacement architecture

Important: secure live CMS connection

Without Supabase environment variables, the Admin Studio runs in local preview mode and stores content only on the current device. This is intentional: no secret credentials are placed in the website code.

For the real cross-device Level 2 CMS:

1. Create a Supabase project.
2. Run "supabase-schema.sql" in its SQL Editor.
3. Enable Email/Password authentication and create the administrator account.
4. Add "VITE_SUPABASE_URL" and "VITE_SUPABASE_ANON_KEY" to Vercel Environment Variables.
5. Redeploy the Vercel project.

The same GitHub/Vercel website remains the foundation; the CMS becomes its management layer. Large media should normally remain on specialist hosts or object storage rather than inside GitHub.

Level 3 — Interactive Digital Platform foundation

This package now includes the architecture for:

- Google authentication through Supabase Auth (the Academy never receives Google passwords).
- Adult/teen/child account types with parent/guardian email linkage.
- Privacy-conscious analytics and user suggestions.
- Academy-controlled service enquiries and mentorship workflow.
- Smart Calculator plus Mathematics, Physics and Chemistry formulas/short notes.
- Optional camera capture for question images (analysis service can be connected later).
- Protected chat architecture with automated pre-moderation hooks, reports and safety alerts.
- Community/friend-request architecture, with voice/video rooms planned around WebRTC and protected realtime signalling.
- Super-admin/staff control centre for aggregated metrics, support and serious safety signals.
- Legal & Safety Centre pages.
- Flutterwave hosted/server-side payment architecture. Card details are entered on the payment provider's checkout, not in the Academy application. The Flutterwave secret key remains server-side.
- Payment order/subscription tables and webhook foundation.

School results, CBT and premium entitlements

The school platform now includes the database foundation for configurable school result books and report cards: subjects by class, First CA/Second CA/Midterm/Third CA/Final Exam and custom components, school-defined marks/weights, private staff entry and moderation, publication controls, term-by-term records, brought-forward/cumulative calculations, class averages, teacher/student/parent visibility rules, school branding, and authorised report-card export.

CBT/learning work supports teacher-authored question banks alongside Academy-generated question sets. Learning questions and answer/feedback views can carry Phenom Best Academy branding and a watermark. Premium entitlements can control authorised screenshots, PDF downloads and school result exports. Prices and currencies remain configurable by authorised Academy administrators.

A critical privacy rule is enforced in the architecture: a teacher sees only the classes/students/subjects they are authorised to teach; a school admin is bounded to their school; a student sees their own records; a parent sees linked-child results; and self-directed personal learning is not automatically exposed as an individual result to Academy staff unless it is deliberately placed into a school/Academy assignment workflow.

The broader platform also supports controlled organisation spaces for companies, NGOs, churches and other groups, while individual users can maintain their own accounts and learning activity.

Production activation

1. Create/connect the Supabase project.
2. Run "supabase-schema.sql", then "supabase-schema-platform.sql".
3. Configure Google provider in Supabase Auth and the Google OAuth client. Add the production domain and callback URLs.
4. Set "VITE_SUPABASE_URL" and the current Supabase publishable/anon client key in Vercel. Supabase is moving toward publishable/secret key names; follow the current Supabase dashboard for the project keys.
5. Deploy the Edge Functions under "supabase/functions/".
6. Set "FLW_SECRET_KEY" and "FLW_SECRET_HASH" only as server-side Supabase secrets. Never place them in "Vercel VITE_*" variables or frontend code.
7. Configure Flutterwave webhook URL and verify webhook signatures before marking an order paid.
8. Assign the first authorised Academy administrator/super-admin through a secure database/admin procedure. Do not make public users administrators.
9. Connect a production moderation service to "VITE_MODERATION_ENDPOINT" or, preferably, to a server-side moderation Edge Function so moderation credentials remain private.
10. Before enabling child accounts, user-to-user messaging, voice/video calls or payments for the public, have the final privacy, safeguarding, community, moderation, payment/refund and terms documents reviewed by qualified Nigerian counsel.

Important architecture principle

The public website stays light. Large media and user files should use object storage/CDNs rather than GitHub. The database stores structured records, not large media binaries. Realtime chat/presence uses Supabase Realtime. Voice/video should use WebRTC with appropriate TURN infrastructure; media should not be routed through the website server.

School premium learning environment

The platform now includes the "/schools" foundation and a multi-tenant school LMS schema. The intended hierarchy is Phenom Super Admin -> Academy Admin/Staff -> School Admin -> Teacher -> Student/Parent.

School tenants can have their own name, small logo, approved colour, country/currency, classes and members. Teachers are restricted to authorised classes/students. School administrators manage only their own school. Academy administrators retain the higher platform oversight layer.

Assignments and quizzes support subject/topic/level/language selection, configurable question counts, image/diagram fields, recorded attempts, automatic scoring and feedback. A submitted attempt is never silently replaced: a later redo is stored as another numbered attempt. Students receive learning feedback, while parents receive concise result notifications and authorised staff can inspect appropriate performance data.

"supabase/functions/generate-quiz" is the server-side AI generation boundary. Set "QUIZ_AI_ENDPOINT" and "QUIZ_AI_SECRET" in Supabase Edge Function secrets to connect an approved question-generation provider. The child-facing client does not receive generation prompts or answer keys.

"supabase/functions/submit-quiz" scores submitted answers server-side and records the attempt, score, corrections and improvement areas.

The English Language Tools section is also included in Smart Tools for British English/American English selection, grammar, spelling, punctuation and writing-improvement architecture.

Production requirements remain: configure Supabase Auth/RLS, Edge Function secrets, approved AI provider, payment provider, realtime authorisation, safeguarding workflows and professional legal/privacy review before public activation.

School results v3 additions

- Automatically generated subject result comments use current performance plus prior-term context; teachers can edit or replace the generated comment before publication.
- Master result components can apply across classes and future academic sessions; schools can remove unused columns and set their own marks/weights.
- Anonymous class statistics include class average, cumulative average, highest score and lowest score without naming the students holding the extremes.
- Daily attendance supports configurable resumption, half-day and closing times, arrival/departure checkpoints, half-day scoring and end-of-day closure of untouched checkpoints.
- Attendance and result visibility follow the school/class/subject privacy boundary.

Final school & organisation administration extension

The final platform foundation also includes optional, tenant-controlled personal and operational records:

- configurable student/staff profile fields, including identity/contact/address information;
- optional emergency health fields such as blood group, genotype, known ailments, allergies and medications, protected by role-based access;
- student guardian/authorised collection records and consent status;
- beginning-of-term, midterm and closing-term height/weight records;
- configurable psychomotor, academic/personal-development, behavioural, physical-growth and attendance assessment groups with a school-editable 1–5 scale;
- staff HR records for schools and other organisations;
- salary structures, allowances, deductions, payroll runs, payment status and payslip numbers;
- organisation/school financial accounts and manually recorded income/expense entries;
- school fee schedules, approved discounts/waivers, payment allocation and child-specific receipts;
- bulk-payment allocation so one parent payment can produce separate receipts for each child;
- school electronic prefectship/election architecture with positions, candidates, verified voters, one vote per voter/position and publishable results;
- school ID-card templates with standard ID-1 dimensions, front/back configuration and signature-image support;
- Super Admin school-access audit logging for authorised troubleshooting/support.

Receipts, report cards and payslips are designed as tenant-owned documents and should use the school/company/organisation's own identity rather than unnecessarily displaying Phenom Best Academy branding. The Academy remains the platform provider and master administrative layer.

These features are schema/architecture foundations in this package. Production activation still requires the corresponding UI workflows, Supabase RLS testing, secure handling of sensitive personal/health data, verified payment/HR integrations where desired, and professional legal/privacy/security review before public use.

V5.9.2 complete working reference

This package is the consolidated working reference for the replacement build. It preserves the approved V5.9.2 interface and includes the reconciled GitHub project structure, brand architecture, a compact zoomable athletics recognition image, and machine-building instructions.

The basic Formula & Units capability is intentionally not Premium and must work immediately. The mobile Language selector is also required to remain visible and functional.

Machine instructions are in "Machine-Instructions/".

Vercel private-repository connection test

This line was added only to verify that the private GitHub repository can still trigger a Vercel deployment.
