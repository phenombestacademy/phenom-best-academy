import { getSupabase } from './cms';

export type LearningLesson = {
  id: string;
  title: string;
  type: 'reading' | 'video' | 'audio' | 'resource' | 'external';
  body?: string;
  url?: string;
  downloadable?: boolean;
  order: number;
};

export type LearningModule = { id: string; title: string; description: string; lessons: LearningLesson[]; order: number };
export type CredentialType = 'none' | 'participation' | 'completion' | 'certificate' | 'diploma';
export type AffiliationType = 'none' | 'professional_partner' | 'university_or_polytechnic' | 'licensed_provider' | 'case_by_case';
export type LearningProgramme = {
  id: string;
  title: string;
  category: string;
  audience: string;
  description: string;
  level: 'free' | 'premium';
  price: number;
  currency: string;
  billing: 'one_time' | 'termly' | 'semester' | 'annual';
  durationMonths: number;
  credential: CredentialType;
  awardTitle: string;
  certificate: boolean;
  affiliation: AffiliationType;
  affiliationNote: string;
  passMark: number;
  published: boolean;
  modules: LearningModule[];
  brandName: string;
};

const KEY = 'phenom-learning-catalogue-v2';
const BRAND = 'Phenom Best Academy';

const lesson = (id: string, title: string, body: string, type: LearningLesson['type'] = 'reading', downloadable = false): LearningLesson => ({ id, title, body, type, downloadable, order: Number(id.replace(/\D/g, '')) || 1 });
const module = (id: string, title: string, description: string, lessons: LearningLesson[]): LearningModule => ({ id, title, description, lessons, order: Number(id.replace(/\D/g, '')) || 1 });

function programme(base: Omit<LearningProgramme, 'modules' | 'brandName'>, modules: LearningModule[]): LearningProgramme {
  return { ...base, modules, brandName: BRAND };
}

const languageModules = (language: string, duration: number): LearningModule[] => [
  module('m1', `${language} Foundations`, 'Pronunciation, core vocabulary, greetings, identity, numbers, everyday expressions and cultural orientation.', [
    lesson('l1', `Welcome to ${language}`, `Orientation to ${language}, the learning outcomes, study routine and cultural context. Learners build a personal vocabulary notebook and practise the first useful expressions.`),
    lesson('l2', 'Pronunciation and sound patterns', `Guided pronunciation practice, sound recognition, rhythm and common pronunciation challenges. Learners listen, repeat and self-check.`),
    lesson('l3', 'Essential vocabulary and expressions', `High-frequency vocabulary for introductions, family, time, numbers, places, courtesy and everyday needs. Includes recall activities and short practice tasks.`),
  ]),
  module('m2', 'Everyday Communication', 'Listening, speaking, reading and writing for practical communication.', [
    lesson('l1', 'Conversation patterns', 'Practise greetings, questions, answers, requests, directions and short conversations in realistic situations.'),
    lesson('l2', 'Reading and writing basics', 'Read short authentic-style passages, identify key information and produce simple written responses.'),
    lesson('l3', 'Listening and response practice', 'Listen for meaning, identify key words and respond appropriately using the target language.'),
  ]),
  module('m3', duration >= 12 ? 'Intermediate & Professional Communication' : 'Applied Language Practice', 'Progressive grammar, vocabulary, cultural competence and practical communication.', [
    lesson('l1', 'Grammar in context', 'Learn grammar through useful communication rather than isolated rules. Apply structures in short spoken and written tasks.'),
    lesson('l2', 'Culture and cross-cultural communication', 'Explore respectful communication, cultural conventions and situations where literal translation may not be enough.'),
    lesson('l3', 'Practical language project', 'Complete a guided communication project such as a dialogue, presentation, interview, message or cultural mini-project.'),
  ]),
  ...(duration >= 6 ? [module('m4', duration >= 12 ? 'Advanced Communication & Independent Use' : 'Extended Communication', 'Longer conversations, structured writing, presentations and independent learning.', [
    lesson('l1', 'Extended speaking', 'Deliver longer conversations and structured responses with increasing fluency and accuracy.'),
    lesson('l2', 'Reading, writing and presentation', 'Work with longer passages and prepare a short presentation or written project in the target language.'),
    lesson('l3', 'Progress assessment and portfolio', 'Review learning evidence, complete a portfolio task and prepare for the programme assessment.'),
  ])] : []),
  ...(duration >= 18 ? [module('m5', 'Diploma Project & Applied Language Study', 'Advanced independent work suitable for an 18-month diploma pathway.', [
    lesson('l1', 'Research and cultural project', 'Plan and complete a supervised language or cultural project using appropriate sources and documented learning evidence.', 'resource', true),
    lesson('l2', 'Advanced oral presentation', 'Present the project and demonstrate functional communication at the programme level.'),
    lesson('l3', 'Final assessment and portfolio defence', 'Complete the final assessment and present the learning portfolio for review by the authorised programme team.'),
  ])] : []),
];


const languagePathways: LearningProgramme[] = [
  ...['Yoruba','Hausa','Swahili','Zulu','Shona','Somali','Amharic','French','Spanish','German','Mandarin'].flatMap((lang) => [3,6,12,18].map((months) => {
    const isDiploma = months === 18;
    const label = isDiploma ? 'Diploma Pathway' : months === 12 ? 'Advanced Certificate Programme' : 'Certificate Programme';
    const prices: Record<number, number> = {3: 45000, 6: 80000, 12: 145000, 18: 220000};
    return programme({
      id: `lang-${lang.toLowerCase().replace(/[^a-z0-9]+/g,'-')}-${months}m`,
      title: `${lang} Language & Cultural Learning — ${months} Months ${label}`,
      category: 'Language Education',
      audience: 'Children, teenagers, adults, families, professionals, schools and organisations',
      description: `${months}-month ${lang} learning pathway with structured communication practice, cultural understanding, assessment and progressive learning outcomes.`,
      level: 'premium', price: prices[months], currency: 'NGN', billing: months === 12 || months === 18 ? 'annual' : 'one_time', durationMonths: months,
      credential: isDiploma ? 'diploma' : months === 12 ? 'certificate' : 'certificate',
      awardTitle: isDiploma ? `Diploma Pathway in ${lang} Language & Cultural Studies` : `${months === 12 ? 'Advanced ' : ''}Certificate in ${lang} Language & Cultural Learning`,
      certificate: true,
      affiliation: isDiploma ? 'university_or_polytechnic' : 'none',
      affiliationNote: isDiploma ? 'External diploma award requires a formal partnership with an appropriately recognised university or polytechnic and satisfaction of that institution’s requirements.' : 'Academy-issued learning certificate based on the published programme and assessment requirements.',
      passMark: 60, published: true,
    }, languageModules(lang, months));
  })),
];

const faithModules = (duration: number): LearningModule[] => [
  module('m1', 'Biblical Foundations & Responsible Study', 'Bible study methods, context, reflection and responsible interpretation.', [
    lesson('l1', 'Approaching Scripture responsibly', 'Learn practical principles for reading biblical texts with context, humility and care.'),
    lesson('l2', 'Observation, interpretation and application', 'Move from what a passage says to what it means and how its principles may be applied responsibly.'),
    lesson('l3', 'Personal reflection and study notes', 'Create structured study notes, reflection questions and practical applications.'),
  ]),
  module('m2', 'Faith, Character & Service', 'Christian character, service, stewardship and purposeful living.', [
    lesson('l1', 'Character and integrity', 'Explore integrity, responsibility, compassion, discipline and consistent conduct.'),
    lesson('l2', 'Serving people and communities', 'Consider practical service, teamwork, leadership and responsible community engagement.'),
    lesson('l3', 'Faith in everyday life', 'Apply learning to family, work, education, relationships and community responsibilities.'),
  ]),
  ...(duration >= 6 ? [module('m3', 'Christian Leadership & Ministry Development', 'Leadership, communication, team development and ministry support.', [
    lesson('l1', 'Servant leadership', 'Study leadership as responsibility, stewardship, influence and service.'),
    lesson('l2', 'Teaching, facilitation and group learning', 'Plan Bible study, Sunday school, seminars and small-group learning sessions.'),
    lesson('l3', 'Ministry communication project', 'Develop a practical teaching, devotional or seminar resource.'),
  ])] : []),
  ...(duration >= 12 ? [module('m4', 'Capstone & Ministry Resource Portfolio', 'Longer-term faith learning with a practical portfolio.', [
    lesson('l1', 'Devotional or study resource project', 'Create a structured resource for a church, fellowship, school or personal study setting.', 'resource', true),
    lesson('l2', 'Final reflection and assessment', 'Complete the programme assessment and reflective learning record.'),
    lesson('l3', 'Portfolio review', 'Review the learner portfolio against the programme outcomes.'),
  ])] : []),
];

const professionalModules = (title: string, focus: string): LearningModule[] => [
  module('m1', 'Foundations', `Core concepts and professional standards for ${focus}.`, [
    lesson('l1', 'Learning objectives and professional context', `Understand the purpose, standards and workplace relevance of ${focus}.`),
    lesson('l2', 'Core knowledge', `Build the essential knowledge required to apply ${focus} confidently.`),
    lesson('l3', 'Knowledge check', 'Complete a short formative assessment and review corrections.'),
  ]),
  module('m2', 'Practical Application', 'Apply learning to realistic professional situations.', [
    lesson('l1', 'Case study practice', 'Analyse a realistic scenario and identify appropriate actions.'),
    lesson('l2', 'Practical task', 'Complete a structured task that demonstrates application.'),
    lesson('l3', 'Reflection and feedback', 'Review performance and identify improvement priorities.'),
  ]),
  module('m3', 'Assessment & Continuous Improvement', 'Demonstrate competence and plan continued development.', [
    lesson('l1', 'Professional self-assessment', 'Assess strengths, gaps and next-step development needs.'),
    lesson('l2', 'Final assessment preparation', 'Review the programme and prepare for the final assessment.'),
    lesson('l3', `${title} final assessment`, 'Complete the final assessment. Feedback and corrections are provided after submission.'),
  ]),
];

export const defaultProgrammes: LearningProgramme[] = [
  // Language pathways: intentionally separate products so duration, content and credential can differ.
  programme({ id: 'igbo-3m', title: 'Igbo Language Essentials — 3-Month Certificate Programme', category: 'Language Education', audience: 'Beginners, families, young people, adults, professionals and lifelong learners', description: 'A focused three-month Igbo language pathway covering practical communication, pronunciation, vocabulary, reading, writing and cultural understanding.', level: 'premium', price: 45000, currency: 'NGN', billing: 'one_time', durationMonths: 3, credential: 'certificate', awardTitle: 'Certificate in Igbo Language Essentials', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued learning certificate; no external affiliation required.', passMark: 60, published: true }, languageModules('Igbo', 3)),
  programme({ id: 'igbo-6m', title: 'Igbo Language Development — 6-Month Certificate Programme', category: 'Language Education', audience: 'Learners seeking stronger conversational and written Igbo ability', description: 'A six-month progressive programme with extended communication practice, culture, writing and assessment.', level: 'premium', price: 80000, currency: 'NGN', billing: 'one_time', durationMonths: 6, credential: 'certificate', awardTitle: 'Certificate in Igbo Language Development', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued learning certificate; no external affiliation required.', passMark: 60, published: true }, languageModules('Igbo', 6)),
  programme({ id: 'igbo-12m', title: 'Igbo Language Proficiency — 12-Month Advanced Programme', category: 'Language Education', audience: 'Learners seeking sustained language proficiency and cultural competence', description: 'A full-year advanced pathway with intermediate and professional communication, extended writing, presentations and portfolio work.', level: 'premium', price: 145000, currency: 'NGN', billing: 'annual', durationMonths: 12, credential: 'certificate', awardTitle: 'Advanced Certificate in Igbo Language Proficiency', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued certificate based on the Academy programme and assessment.', passMark: 60, published: true }, languageModules('Igbo', 12)),
  programme({ id: 'igbo-18m', title: 'Igbo Language & Cultural Studies — 18-Month Diploma Pathway', category: 'Language Education', audience: 'Advanced learners seeking a longer academic-style language and cultural pathway', description: 'An 18-month advanced pathway culminating in a diploma-level programme project. External diploma award requires a formal partner institution and its own academic/quality requirements.', level: 'premium', price: 220000, currency: 'NGN', billing: 'annual', durationMonths: 18, credential: 'diploma', awardTitle: 'Diploma Pathway in Igbo Language & Cultural Studies', certificate: true, affiliation: 'university_or_polytechnic', affiliationNote: 'The external diploma component is subject to a formal agreement with an appropriately recognised university or polytechnic and that institution’s requirements.', passMark: 60, published: true }, languageModules('Igbo', 18)),
  programme({ id: 'english-professional-6m', title: 'English Language & Professional Communication — 6 Months', category: 'Language Education', audience: 'Students, educators, professionals and lifelong learners', description: 'Extended British English development covering grammar, spelling, punctuation, writing, speaking, pronunciation and professional communication.', level: 'premium', price: 85000, currency: 'NGN', billing: 'one_time', durationMonths: 6, credential: 'certificate', awardTitle: 'Certificate in English Language & Professional Communication', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued certificate.', passMark: 60, published: true }, languageModules('English', 6)),

  ...languagePathways,
  programme({ id: 'cpd-educator', title: 'Educator Excellence & Continuing Professional Development', category: 'Professional Development & Certification', audience: 'Teachers, educators, school leaders and education professionals', description: 'Structured CPD with professional reading, practical activities, assessments, reflective practice and a Certificate of Completion.', level: 'premium', price: 50000, currency: 'NGN', billing: 'termly', durationMonths: 3, credential: 'completion', awardTitle: 'Certificate of Completion — Educator Excellence & CPD', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued CPD completion certificate unless a specific external awarding arrangement is stated.', passMark: 60, published: true }, professionalModules('Educator Excellence & CPD', 'educator professional development')),
  programme({ id: 'leadership', title: 'Leadership & Human Capital Development', category: 'Leadership & Human Capital Development', audience: 'Professionals, supervisors, managers, educators and organisational leaders', description: 'Practical leadership, emotional intelligence, strategic thinking, team development, performance and human-capital learning.', level: 'premium', price: 60000, currency: 'NGN', billing: 'termly', durationMonths: 3, credential: 'completion', awardTitle: 'Certificate of Completion in Leadership & Human Capital Development', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued completion certificate.', passMark: 60, published: true }, professionalModules('Leadership & Human Capital Development', 'leadership and human-capital development')),
  programme({ id: 'youth-development', title: 'Teen & Youth Personal Development', category: 'Mentorship & Personal Development', audience: 'Teenagers and young adults', description: 'Age-aware learning in confidence, identity, decision-making, life skills, career awareness and youth leadership.', level: 'free', price: 0, currency: 'NGN', billing: 'one_time', durationMonths: 3, credential: 'completion', awardTitle: 'Certificate of Completion — Teen & Youth Personal Development', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued completion certificate where assessment and completion requirements are met.', passMark: 60, published: true }, professionalModules('Teen & Youth Personal Development', 'youth personal development')),
  programme({ id: 'research', title: 'Research & Knowledge Skills', category: 'Research & Knowledge Services', audience: 'Students, researchers, professionals and organisations', description: 'Research topics, methodology, literature review, qualitative and quantitative methods, data, referencing and scholarly communication.', level: 'premium', price: 45000, currency: 'NGN', billing: 'termly', durationMonths: 3, credential: 'completion', awardTitle: 'Certificate of Completion in Research & Knowledge Skills', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued completion certificate; this is not a university degree or external academic award.', passMark: 60, published: true }, professionalModules('Research & Knowledge Skills', 'research and knowledge development')),
  programme({ id: 'digital-learning', title: 'Digital Learning & Educational Resources', category: 'Digital Learning & Educational Resources', audience: 'Learners, educators, professionals and organisations', description: 'Self-paced digital learning, e-books, manuals, workbooks, recorded lessons and practical digital resources.', level: 'free', price: 0, currency: 'NGN', billing: 'one_time', durationMonths: 3, credential: 'completion', awardTitle: 'Certificate of Completion — Digital Learning Foundations', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued completion certificate for configured assessed programmes.', passMark: 60, published: true }, professionalModules('Digital Learning Foundations', 'digital learning')),
  programme({ id: 'academic-mastery', title: 'Academic Mastery & Examination Preparation', category: 'Academic Support', audience: 'Nursery, primary, secondary, tertiary and postgraduate learners', description: 'Structured subject learning, revision, examination preparation and assessment support across appropriate levels.', level: 'premium', price: 40000, currency: 'NGN', billing: 'termly', durationMonths: 3, credential: 'completion', awardTitle: 'Certificate of Completion — Academic Mastery', certificate: true, affiliation: 'none', affiliationNote: 'Completion recognition; formal school/university qualifications remain the responsibility of the relevant awarding institution.', passMark: 60, published: true }, professionalModules('Academic Mastery', 'academic learning and examination preparation')),
  programme({ id: 'org-services', title: 'Organisational Management & Capacity Building', category: 'Organisational Services', audience: 'Schools, companies, NGOs, churches and other organisations', description: 'Management, HR, onboarding, strategic planning, policy, governance, monitoring and evaluation, communication and staff development.', level: 'premium', price: 70000, currency: 'NGN', billing: 'termly', durationMonths: 3, credential: 'completion', awardTitle: 'Certificate of Completion — Organisational Capacity Building', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued completion certificate unless a client-specific external credential is expressly arranged.', passMark: 60, published: true }, professionalModules('Organisational Capacity Building', 'organisational management and capacity building')),
  programme({ id: 'study-abroad', title: 'Study Abroad & Scholarship Readiness', category: 'Study Abroad & Scholarships', audience: 'Students, parents, graduates and professionals', description: 'Programme selection, scholarship readiness, application documents, tests, interviews, visa preparation and pre-departure guidance.', level: 'premium', price: 55000, currency: 'NGN', billing: 'one_time', durationMonths: 3, credential: 'completion', awardTitle: 'Certificate of Completion — Study Abroad & Scholarship Readiness', certificate: true, affiliation: 'case_by_case', affiliationNote: 'Specific university, scholarship, immigration, travel or licensed-provider relationships are used only where genuinely required; the Academy does not present advisory support as a government or university award.', passMark: 60, published: true }, professionalModules('Study Abroad & Scholarship Readiness', 'international education advisory')),
  programme({ id: 'guidance', title: 'Guidance, Counselling & Human Development', category: 'Guidance, Counselling & Human Development', audience: 'Children, teenagers, young adults, families and professionals', description: 'Age-aware learning and guidance around confidence, identity, decision-making, relationships, family and personal development.', level: 'premium', price: 30000, currency: 'NGN', billing: 'termly', durationMonths: 3, credential: 'completion', awardTitle: 'Certificate of Completion — Human Development Foundations', certificate: true, affiliation: 'licensed_provider', affiliationNote: 'Where clinical, medical or regulated counselling services are required, appropriately qualified or licensed professionals are engaged. The learning certificate itself is Academy-issued.', passMark: 60, published: true }, professionalModules('Human Development Foundations', 'human development and guidance')),
  programme({ id: 'consultancy', title: 'Educational Consultancy & Advisory Learning', category: 'Educational Consultancy & Advisory', audience: 'Educators, school owners, administrators and education organisations', description: 'School improvement, curriculum, teacher development, instructional leadership, quality assurance, governance and education technology.', level: 'premium', price: 60000, currency: 'NGN', billing: 'termly', durationMonths: 3, credential: 'completion', awardTitle: 'Certificate of Completion — Educational Consultancy Foundations', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued completion certificate. External professional recognition is only added where formally arranged.', passMark: 60, published: true }, professionalModules('Educational Consultancy Foundations', 'educational consultancy and advisory practice')),
  programme({ id: 'music-creative', title: 'Music & Creative Development', category: 'Music & Creative Development', audience: 'Artists, learners, schools, organisations and creative teams', description: 'Songwriting, vocal development, creative projects, production concepts, jingles, anthems and artist development.', level: 'premium', price: 35000, currency: 'NGN', billing: 'one_time', durationMonths: 3, credential: 'completion', awardTitle: 'Certificate of Completion — Music & Creative Development', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued completion certificate for the learning programme.', passMark: 60, published: true }, professionalModules('Music & Creative Development', 'music and creative development')),
  programme({ id: 'faith-3m', title: 'Faith-Based Learning & Christian Foundations — 3 Months', category: 'Faith-Based & Inspirational Content', audience: 'Churches, ministries, Christian organisations, fellowship groups and individuals', description: 'Bible study, devotional learning, Christian character, service and practical faith-based development.', level: 'premium', price: 25000, currency: 'NGN', billing: 'one_time', durationMonths: 3, credential: 'completion', awardTitle: 'Certificate of Completion — Faith-Based Learning Foundations', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued completion certificate; no external affiliation is required.', passMark: 60, published: true }, faithModules(3)),
  programme({ id: 'faith-6m', title: 'Christian Leadership & Ministry Development — 6 Months', category: 'Faith-Based & Inspirational Content', audience: 'Pastors, ministry leaders, church workers, teachers, fellowship leaders and individuals', description: 'Extended faith-based learning covering Bible study, Christian leadership, facilitation, service and ministry resource development.', level: 'premium', price: 50000, currency: 'NGN', billing: 'one_time', durationMonths: 6, credential: 'certificate', awardTitle: 'Certificate in Christian Leadership & Ministry Development', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued certificate based on the programme and assessment.', passMark: 60, published: true }, faithModules(6)),
  programme({ id: 'faith-12m', title: 'Advanced Christian Leadership & Faith-Based Learning — 12 Months', category: 'Faith-Based & Inspirational Content', audience: 'Ministry leaders, educators, Christian organisations and committed learners', description: 'A full-year structured programme with advanced study, leadership, teaching-resource development and a capstone portfolio.', level: 'premium', price: 95000, currency: 'NGN', billing: 'annual', durationMonths: 12, credential: 'certificate', awardTitle: 'Advanced Certificate in Christian Leadership & Faith-Based Learning', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued certificate. Formal theological degrees are outside this certificate unless separately arranged with an appropriate institution.', passMark: 60, published: true }, faithModules(12)),
  programme({ id: 'design-library', title: 'Creative Design & Digital Library Skills', category: 'Digital Learning & Educational Resources', audience: 'Students, teachers, organisations, churches, NGOs, entrepreneurs and creative teams', description: 'Practical learning around posters, flyers, ID cards, social graphics, educational layouts, branded documents and responsible use of digital design resources.', level: 'free', price: 0, currency: 'NGN', billing: 'one_time', durationMonths: 3, credential: 'completion', awardTitle: 'Certificate of Completion — Creative Design & Digital Library Skills', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued completion certificate.', passMark: 60, published: true }, professionalModules('Creative Design & Digital Library Skills', 'creative design and digital resource production')),
  programme({ id: 'advisory-noncert', title: 'Professional Advisory & Resource Briefing — Non-Certifying', category: 'Educational Consultancy & Advisory', audience: 'Individuals and organisations seeking focused professional guidance', description: 'A short advisory resource pathway for consultation preparation, checklists, guidance notes and decision support. This product is intentionally non-certifying.', level: 'premium', price: 15000, currency: 'NGN', billing: 'one_time', durationMonths: 1, credential: 'none', awardTitle: 'No certificate — advisory service', certificate: false, affiliation: 'none', affiliationNote: 'Non-certifying advisory service. No external academic or professional award is represented.', passMark: 0, published: true }, [module('m1', 'Advisory Preparation', 'Understand the scope of the advisory engagement and prepare the information needed for a useful consultation.', [lesson('l1', 'Preparing for professional advisory support', 'Identify the problem, desired outcome, available evidence and practical constraints before an advisory session.')])]),
  programme({ id: 'mentorship', title: 'Mentorship & Personal Development', category: 'Mentorship & Personal Development', audience: 'Teenagers, young adults, students, professionals, educators and leaders', description: 'Goal setting, confidence, career awareness, leadership, entrepreneurship and personal growth delivered through structured learning and Academy-assigned support.', level: 'free', price: 0, currency: 'NGN', billing: 'one_time', durationMonths: 3, credential: 'completion', awardTitle: 'Certificate of Completion — Personal Development Foundations', certificate: true, affiliation: 'none', affiliationNote: 'Academy-issued completion certificate where configured requirements are met.', passMark: 60, published: true }, professionalModules('Personal Development Foundations', 'personal development and structured mentorship')),
];

export function getLocalProgrammes(): LearningProgramme[] {
  if (typeof window === 'undefined') return defaultProgrammes;
  try {
    const x = JSON.parse(localStorage.getItem(KEY) || 'null');
    return Array.isArray(x) && x.length ? x : defaultProgrammes;
  } catch { return defaultProgrammes; }
}

export function saveLocalProgrammes(items: LearningProgramme[]) { localStorage.setItem(KEY, JSON.stringify(items)); }

export async function listProgrammes() {
  const s = getSupabase();
  if (!s) return getLocalProgrammes().filter(p => p.published);
  const { data, error } = await s.from('learning_programmes').select('*').eq('published', true).order('created_at');
  if (error) throw error;
  return (data || []).map((row: any) => ({
    id: row.id, title: row.title, category: row.category, audience: row.audience, description: row.description || '', level: row.level, price: Number(row.price || 0), currency: row.currency || 'NGN', billing: row.billing_period || 'one_time', durationMonths: Number(row.duration_months || 3), credential: row.credential_type || (row.certificate_enabled ? 'certificate' : 'none'), awardTitle: row.award_title || row.title, certificate: Boolean(row.certificate_enabled), affiliation: row.affiliation_type || 'none', affiliationNote: row.affiliation_note || '', passMark: Number(row.pass_mark || 60), published: Boolean(row.published), modules: row.content || [], brandName: row.brand_name || BRAND,
  })) as LearningProgramme[];
}

export async function saveProgramme(p: LearningProgramme) {
  const s = getSupabase();
  if (!s) {
    const all = getLocalProgrammes().filter(x => x.id !== p.id);
    saveLocalProgrammes([p, ...all]);
    return;
  }
  const { error } = await s.from('learning_programmes').upsert({
    id: p.id, title: p.title, category: p.category, audience: p.audience, description: p.description, level: p.level, price: p.price, currency: p.currency,
    billing_period: p.billing, duration_months: p.durationMonths, credential_type: p.credential, award_title: p.awardTitle, affiliation_type: p.affiliation,
    affiliation_note: p.affiliationNote, pass_mark: p.passMark, certificate_enabled: p.certificate, published: p.published, content: p.modules, brand_name: p.brandName,
  });
  if (error) throw error;
}

export function programmeById(id: string) { return getLocalProgrammes().find(p => p.id === id); }
