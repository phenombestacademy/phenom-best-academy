export const academy = {
  name: "Phenom Best Academy",
  legalName: "Phenom Best Academy Limited",
  motto: "Tranquil Excellence for Global Impact",
  tagline: "Empowering minds. Enriching cultures. Inspiring global leaders.",
  rc: "9704482",
  tin: "2622434760319",
  emails: ["phenombestacademy@gmail.com", "phenombesta@gmail.com"],
  phones: [
    { display: "+234 916 787 2339", href: "tel:+2349167872339", wa: "https://wa.me/2349167872339" },
    { display: "+234 804 486 8964", href: "tel:+2348044868964", wa: "https://wa.me/2348044868964" },
  ],
  location: "Lagos, Nigeria",
  copyright: "© 2026 Phenom Best Academy Limited. All Rights Reserved.",
} as const;

export const mission =
  "Phenom Best Academy exists to empower individuals, institutions, and communities through transformative education, innovative research, and holistic mentorship. We nurture intellectual excellence, ethical leadership, and global competence so people and organisations can thrive in a dynamic, interconnected world.";

export const vision =
  "To be a globally respected academy recognised for developing exceptional minds, strengthening institutions, and inspiring visionary leaders who drive sustainable and transformative impact across societies.";

export const executiveSummary =
  "Phenom Best Academy is a multidisciplinary institution committed to delivering high-quality education, research, consultancy, and professional development. Through innovative teaching, strategic guidance, and capacity-building, we promote intellectual excellence, ethical leadership, and global competence for learners, professionals, and organisations across local and international contexts.";

export const values = [
  {
    id: "excellence",
    title: "Excellence",
    body: "The highest academic and professional standards — quality, innovation, and measurable value in every programme.",
  },
  {
    id: "tranquillity",
    title: "Tranquillity",
    body: "A supportive, intellectually enriching environment that encourages clarity of thought, creativity, and purposeful growth.",
  },
  {
    id: "integrity",
    title: "Integrity",
    body: "Honesty, transparency, accountability, and ethical responsibility in every relationship and engagement.",
  },
  {
    id: "innovation",
    title: "Innovation & Research",
    body: "Critical inquiry, evidence-based practice, and innovative thinking that advance education and society.",
  },
  {
    id: "heritage",
    title: "Cultural Heritage",
    body: "African identity celebrated alongside global cultural awareness, mutual respect, and intercultural understanding.",
  },
  {
    id: "empowerment",
    title: "Empowerment",
    body: "Knowledge, skills, and confidence required for sustainable success and leadership.",
  },
  {
    id: "global",
    title: "Global Competence",
    body: "Academic excellence, cultural intelligence, and the ability to operate effectively in international contexts.",
  },
  {
    id: "service",
    title: "Service & Impact",
    body: "Meaningful service, social responsibility, and measurable positive outcomes for communities and institutions.",
  },
] as const;

export const whyChoose = [
  {
    title: "Legally registered and credible",
    body: "A private company limited by shares, incorporated under CAMA of the Federal Republic of Nigeria (RC 9704482).",
  },
  {
    title: "Multidisciplinary expertise",
    body: "Education, consultancy, research, leadership, mentorship, languages, counselling, study-abroad advisory, and professional development — in one academy.",
  },
  {
    title: "Excellence and integrity",
    body: "Professionalism, ethical practice, transparency, and accountability in every engagement.",
  },
  {
    title: "Client-centred approach",
    body: "Tailored solutions designed around the unique needs, goals, and aspirations of each person and organisation.",
  },
  {
    title: "Innovation with a global perspective",
    body: "Practical, research-driven, and internationally relevant programmes for an evolving world.",
  },
  {
    title: "Sustainable impact",
    body: "Capacity-building, institutional strengthening, and lasting change — not one-off transactions.",
  },
] as const;

export type ServiceId =
  | "language-education"
  | "academic-support"
  | "mentorship"
  | "leadership-human-capital"
  | "organisational-services"
  | "study-abroad"
  | "guidance-counselling"
  | "professional-development"
  | "educational-consultancy"
  | "research-knowledge"
  | "digital-learning"
  | "music-creative-development";

export type Service = {
  id: ServiceId;
  title: string;
  kicker: string;
  summary: string;
  audience: string;
  offerings: string[];
  enquiryOptions: string[];
  delivery: string[];
  outcome: string;
  icon:
    | "languages"
    | "book"
    | "compass"
    | "building"
    | "leadership"
    | "globe"
    | "heart"
    | "award"
    | "consultancy"
    | "research"
    | "digital"
    | "music";
};

export const services: Service[] = [
  {
    id: "language-education",
    title: "Language Education",
    kicker: "Speak with the world",
    summary:
      "Structured, immersive language programmes that build communication, cultural literacy, academic progress, and professional mobility.",
    audience:
      "Students, professionals, expatriates, researchers, and organisations seeking linguistic excellence and cross-cultural competence.",
    offerings: [
      "African languages: Yoruba, Igbo, Hausa, Swahili, Zulu, Shona, Somali, Amharic",
      "Global languages: English, Mandarin Chinese, Spanish, Hindi, Arabic, French, German, Portuguese, Japanese, Russian",
      "Other languages available on request",
      "Cultural enrichment, identity, and intercultural understanding",
      "Academic English, business English, and professional communication",
    ],
    enquiryOptions: [
  "English language development",
  "Academic English / academic communication",
  "Business or professional English",
  "Conversational language training",
  "Foreign-language learning",
  "Pronunciation and fluency development",
  "Language assessment / placement",
  "Language for children and young people",
  "Cross-cultural communication and cultural learning",
  "Translation / interpretation support",
  "Language programme for a school or organisation",
  "Other language request / customised programme"
],
    delivery: [
      "One-on-one and group instruction",
      "Online, blended, and hybrid formats",
      "Immersive, task-based, and communicative approaches",
      "Role-plays and cross-cultural projects",
    ],
    outcome:
      "Learners gain language proficiency, cultural insight, and the communication ability to succeed academically, professionally, and socially in diverse international settings.",
    icon: "languages",
  },
  {
    id: "academic-support",
    title: "Academic Support",
    kicker: "Mastery at every level",
    summary:
      "Learner-centred academic support from nursery through postgraduate study — subject mastery, examination preparation, and research documentation.",
    audience:
      "Students, educators, professionals, and institutions seeking academic advancement, examination preparation, and research support.",
    offerings: [
      "Nursery, primary, secondary, A-Level, diploma, undergraduate, and postgraduate support",
      "English, Mathematics, Sciences, ICT, Economics, Government, Geography, Civic Education, Reasoning, and Creative Arts",
      "Examination preparation: WAEC, NECO, GCE, JAMB, BECE, SAT, IELTS, TOEFL, IGCSE, Cambridge Checkpoint, A-Level",
      "Projects, theses, dissertations, SIWES reports, and academic editing (APA, MLA, Chicago)",
    ],
    enquiryOptions: [
  "General academic tutoring",
  "Homework / assignment support",
  "Examination preparation",
  "University / undergraduate support",
  "Postgraduate academic support",
  "Research project guidance",
  "Project / thesis / dissertation guidance",
  "SIWES / industrial training report guidance",
  "Academic writing, editing and referencing support",
  "National Open University of Nigeria (NOUN) academic/research support",
  "ICT / Computer Science / data-literacy support",
  "Study skills and academic coaching",
  "Holiday / intensive learning programme",
  "Other customised academic support"
],
    delivery: [
      "Individual tutoring and mentoring",
      "Group workshops and study sessions",
      "Online academic support and virtual learning",
      "Guided research and practical assignments",
    ],
    outcome:
      "Students achieve mastery, critical thinking, and research competence — ready for examinations, higher education, and professional contribution.",
    icon: "book",
  },
  {
    id: "mentorship",
    title: "Mentorship & Transformational Music",
    kicker: "Purpose, voice, and leadership",
    summary:
      "Structured mentorship and leadership development, with music used as a catalyst for identity, discipline, confidence, and influence.",
    audience:
      "Students, professionals, educators, entrepreneurs, and organisational leaders seeking personal development and leadership enhancement.",
    offerings: [
      "Personal growth, self-awareness, and values-based leadership",
      "Academic and career insight aligned to strengths",
      "Confidence, communication, goal setting, and life planning",
      "Leadership anthems, guided songwriting, and vocal confidence",
      "Rhythm-based team-building and inspirational music production",
    ],
    enquiryOptions: [
  "Personal development",
  "Academic mentorship",
  "Career mentorship",
  "Professional growth",
  "Leadership mentorship",
  "Entrepreneurship guidance",
  "Goal setting and life planning",
  "Confidence and communication development",
  "Productivity and personal effectiveness",
  "Student mentorship",
  "Structured one-to-one mentorship",
  "Group / cohort mentorship",
  "Other customised mentorship programme"
],
    delivery: [
      "One-on-one mentoring",
      "Group coaching and leadership workshops",
      "Music-integrated mentoring sessions",
      "Leadership and expression masterclasses",
    ],
    outcome:
      "Participants cultivate self-awareness, resilience, expressive confidence, and the capacity to inspire others and create change.",
    icon: "compass",
  },
  {
    id: "leadership-human-capital",
    title: "Leadership & Human Capital Development",
    kicker: "People who lead. Organisations that grow.",
    summary:
      "Leadership development, talent development, people management, and human-capital support for individuals, schools, and organisations.",
    audience:
      "Emerging leaders, managers, executives, educators, school leaders, HR professionals, teams, and organisations developing people and leadership capacity.",
    offerings: [
      "Leadership foundations and emerging-leader development",
      "Executive and supervisory development",
      "Strategic thinking, decision-making, and accountability",
      "Emotional intelligence, communication, and influence",
      "Team leadership, conflict management, and workplace relationships",
      "Change management, talent development, and succession planning",
      "Performance development, organisational learning, and human-capital advisory",
    ],
    enquiryOptions: [
      "Leadership foundations",
      "Emerging-leader development",
      "Executive development",
      "Supervisory skills",
      "Strategic thinking and decision-making",
      "Emotional intelligence",
      "Communication and influence",
      "Team leadership",
      "Conflict management",
      "Accountability and workplace relationships",
      "Change management",
      "Talent development",
      "Performance development",
      "Succession planning",
      "Human-capital advisory",
      "Leadership programme for a school or organisation",
      "Other customised leadership / human-capital programme"
],
    delivery: [
      "Leadership workshops and masterclasses",
      "One-to-one executive and leadership coaching",
      "Team and organisational development programmes",
      "Virtual, on-site, and blended engagements",
    ],
    outcome:
      "Leaders and organisations build stronger capability, healthier working relationships, better decision-making, and sustainable people development.",
    icon: "leadership",
  },
  {
    id: "organisational-services",
    title: "Organisational Services",
    kicker: "Institutions that perform",
    summary:
      "Consultancy and capacity-building for schools, companies, NGOs, faith-based institutions, and public bodies.",
    audience:
      "School administrators, corporate executives, NGO managers, faith-based leaders, and public officers.",
    offerings: [
      "Management and leadership consultancy",
      "Organisational development and restructuring",
      "HR, workforce development, and recruitment support",
      "Strategic planning, policy, monitoring and evaluation",
      "Educational consultancy, governance, and change management",
      "Manuals, training design, communication strategy, and events",
    ],
    enquiryOptions: [
  "Management and leadership consultancy",
  "Organisational development / restructuring",
  "HR and workforce development",
  "Recruitment / onboarding support",
  "Strategic planning",
  "Policy development and documentation",
  "Monitoring and evaluation",
  "Governance and change management",
  "Staff training and development",
  "Training manuals / learning materials",
  "Communication strategy",
  "Event / workshop support",
  "School or institutional organisational support",
  "Other customised organisational service"
],
    delivery: [
      "On-site consultancy and training",
      "Virtual coaching and webinars",
      "Workshops, seminars, and interactive group sessions",
    ],
    outcome:
      "Organisations strengthen leadership, operational efficiency, and culture — with durable results across structure, strategy, and people.",
    icon: "building",
  },
  {
    id: "study-abroad",
    title: "Study Abroad & Scholarships",
    kicker: "A global academic pathway",
    summary:
      "Guidance for international study and scholarships — informed choices, strong applications, and a smooth transition abroad.",
    audience:
      "Secondary students, undergraduates, postgraduates, young professionals, and families seeking global academic opportunities.",
    offerings: [
      "University and programme selection",
      "Scholarship search and application support",
      "Statement of purpose and scholarship essay coaching",
      "CV, transcripts, and recommendation-letter preparation",
      "IELTS, TOEFL, SAT and other test preparation",
      "Visa guidance, interview preparation, and pre-departure orientation",
    ],
    enquiryOptions: [
  "International study planning",
  "University / institution selection",
  "Programme / course selection",
  "Country and education-system guidance",
  "Admission pathway guidance",
  "Application preparation support",
  "Scholarship search and application support",
  "Statement of purpose / personal statement coaching",
  "CV / academic-document preparation guidance",
  "IELTS / TOEFL / SAT preparation",
  "Interview preparation",
  "Pre-departure orientation",
  "Other customised international education advisory"
],
    delivery: [
      "One-on-one mentoring and consultations",
      "Workshops and group orientation",
      "Online coaching, webinars, and document review",
    ],
    outcome:
      "Students gain the expertise, documents, and confidence to pursue international study and flourish in multicultural settings.",
    icon: "globe",
  },
  {
    id: "guidance-counselling",
    title: "Guidance, Counselling & Human Development",
    kicker: "Whole-person support",
    summary:
      "Professional guidance and counselling for emotional wellbeing, personal growth, healthy relationships, and life decisions.",
    audience:
      "Children, adolescents, students, professionals, families, and organisational members.",
    offerings: [
      "Emotional and psychological support",
      "Career exploration and educational counselling",
      "Child and adolescent development",
      "Character education and values formation",
      "Conflict resolution and peacebuilding",
      "Marriage, family, and relationship counselling",
      "Talent discovery, life coaching, and personal empowerment",
    ],
    enquiryOptions: [
  "Educational guidance",
  "Career guidance and planning",
  "Academic decision-making",
  "Study-pathway guidance",
  "Personal development",
  "Transition / life-stage support",
  "Decision-making and goal setting",
  "Child and adolescent development support",
  "Character and values development",
  "Conflict resolution / peacebuilding",
  "Family / relationship counselling",
  "Life coaching and personal empowerment",
  "Other customised guidance request"
],
    delivery: [
      "Individual counselling tailored to need",
      "Group workshops and training programmes",
      "Practical coaching and developmental exercises",
    ],
    outcome:
      "Participants build resilience, emotional insight, and the capacity to manage life’s challenges and relationships with clarity.",
    icon: "heart",
  },
  {
    id: "professional-development",
    title: "Professional Development & Certification",
    kicker: "Competence that travels",
    summary:
      "Short courses, CPD, executive education, and certification support that raise professional standards for people and organisations.",
    audience:
      "Students, educators, professionals, and institutions seeking recognised growth and workforce excellence.",
    offerings: [
      "Workshops, seminars, executive education, and specialised training",
      "Guidance toward recognised professional certifications",
      "Educator CPD, instructional improvement, and classroom leadership",
      "Professional examination registration and preparation support",
      "Organisational workforce development and coaching",
      "Collaborative programmes with accredited partners where applicable",
    ],
    enquiryOptions: [
  "Professional skills development",
  "Continuing Professional Development (CPD)",
  "Corporate / staff training",
  "In-house training",
  "Executive education / masterclass",
  "Leadership training",
  "Workplace communication and business writing",
  "Presentation and public speaking",
  "Customer service",
  "Professional ethics",
  "Digital workplace skills",
  "Productivity and administrative effectiveness",
  "Career development",
  "Professional certification guidance / preparation",
  "Technology-enabled professional development",
  "Other customised professional programme"
],
    delivery: [
      "On-site and virtual training",
      "Workshops, conferences, and masterclasses",
      "One-on-one professional coaching",
      "Blended and online learning",
    ],
    outcome:
      "Participants strengthen career prospects and the skills required to excel, with access to recognised development pathways.",
    icon: "award",
  },
  {
    id: "educational-consultancy",
    title: "Educational Consultancy & Advisory",
    kicker: "Better decisions. Better systems.",
    summary:
      "Professional educational planning, school improvement, curriculum, teacher-development, quality, and academic pathway advisory for individuals and institutions.",
    audience:
      "Schools, education companies, training organisations, parents and families, learners, educational institutions, NGOs, and organisations requiring educational expertise.",
    offerings: [
      "Educational planning and academic programme advice",
      "School improvement and educational management support",
      "Curriculum-related consultancy and learning-system development",
      "Teacher-development and instructional improvement consultancy",
      "Quality-improvement, governance, and institutional support",
      "Educational resource development and academic pathway advisory",
    ],
    enquiryOptions: [
  "Educational planning",
  "Academic programme advice",
  "School improvement",
  "School management / educational management",
  "Curriculum consultancy",
  "Learning-system development",
  "Teacher-development consultancy",
  "Instructional improvement",
  "Quality assurance / quality improvement",
  "Educational governance support",
  "Educational resource development",
  "Academic pathway advisory",
  "Educational technology consultancy",
  "Educational policy / documentation",
  "Institutional review / educational research",
  "Other customised educational consultancy"
],
    delivery: [
      "Assessment and diagnostic consultations",
      "Professional recommendations and improvement plans",
      "On-site and virtual advisory engagements",
      "Intervention, review, and continuing advisory support",
    ],
    outcome:
      "Clients receive clear, practical educational recommendations and structured support that strengthen learning systems, institutional quality, and educational decisions.",
    icon: "consultancy",
  },
  {
    id: "research-knowledge",
    title: "Research & Knowledge Services",
    kicker: "Knowledge that creates value",
    summary:
      "Research support, knowledge development, reports, studies, methodology guidance, and research-based consultancy for educational, professional, and organisational needs.",
    audience:
      "Students, researchers, educators, professionals, organisations, institutions, and clients requiring evidence-based research or knowledge services.",
    offerings: [
      "Educational and professional research",
      "Literature reviews and research methodology guidance",
      "Research support, documentation, reports, and studies",
      "Commissioned research and research-based consultancy",
      "Knowledge development, educational materials, and professional resources",
      "Evidence-informed studies and organisational knowledge projects",
    ],
    enquiryOptions: [
  "Research topic refinement",
  "Research methodology training",
  "Research proposal development",
  "Literature review support",
  "Qualitative research guidance",
  "Quantitative research guidance",
  "Questionnaire / interview design",
  "Data collection planning",
  "Data analysis and interpretation",
  "Academic research project guidance",
  "Research documentation / reporting",
  "Academic writing and scholarly communication",
  "Referencing and citation",
  "Research presentation / defence preparation",
  "Commissioned research / institutional study",
  "Research-based consultancy",
  "Research publication / knowledge product",
  "Other customised research service"
],
    delivery: [
      "One-to-one research guidance",
      "Commissioned research projects",
      "Institutional research engagements",
      "Reports, studies, workshops, and knowledge resources",
    ],
    outcome:
      "Clients gain clearer evidence, stronger research capability, and useful knowledge products that support academic, professional, and organisational decisions.",
    icon: "research",
  },
  {
    id: "digital-learning",
    title: "Digital Learning & Educational Resources",
    kicker: "Learning beyond the classroom",
    summary:
      "Digital courses, e-books, manuals, workbooks, recorded lessons, professional guides, assessment resources, and downloadable learning materials.",
    audience:
      "Learners, educators, professionals, organisations, institutions, and anyone seeking flexible, high-quality digital learning resources.",
    offerings: [
      "Online courses and recorded lessons",
      "E-books, educational manuals, and workbooks",
      "Professional guides, templates, and training materials",
      "Assessment and revision resources",
      "Research publications and knowledge resources",
      "Original downloadable educational materials",
    ],
    enquiryOptions: [
  "Online course development",
  "Recorded lessons / learning content",
  "E-books and educational manuals",
  "Workbooks and study guides",
  "Professional guides and templates",
  "Assessment and revision resources",
  "Digital learning resource library",
  "Research publications / knowledge resources",
  "Digital educational products",
  "Learning platform / virtual learning support",
  "Digital skills / technology-enabled learning",
  "Other customised digital learning resource"
],
    delivery: [
      "Self-paced digital learning",
      "Downloadable resources and resource libraries",
      "Expert-led online programmes",
      "Digital materials integrated into training and academic support",
    ],
    outcome:
      "Learners and organisations gain flexible access to useful knowledge and repeatable learning assets that extend the Academy's reach beyond live sessions.",
    icon: "digital",
  },
  {
    id: "music-creative-development",
    title: "Music & Creative Development",
    kicker: "Create, express, and produce",
    summary:
      "A dedicated creative-development pathway for music, songwriting, vocal expression, custom songs, music production, and purpose-driven creative projects.",
    audience:
      "Aspiring and developing musicians, singers, songwriters, students, schools, organisations, brands, churches, and clients seeking customised music solutions.",
    offerings: [
      "Songwriting and guided songwriting for personal vision, storytelling, education, and purpose",
      "Vocal confidence, expressive delivery, harmonies, and performance development",
      "Custom song creation for individuals, schools, organisations, events, campaigns, and special occasions",
      "Music production, beat development, arrangement, instrumentation, and creative direction",
      "Remix, musical polishing, melody enhancement, vocal/beat alignment, and production refinement",
      "Jingles, anthems, motivational songs, educational songs, and brand-oriented music concepts",
      "Creative collaboration, artist development, and music-integrated leadership or mentoring projects",
    ],
    enquiryOptions: [
  "Custom song / original composition",
  "Songwriting / lyric development",
  "Music production / beat creation",
  "Remix / music polishing",
  "Vocal development / harmonies",
  "Arrangement / melody enhancement",
  "Jingle / anthem / motivational song",
  "Music for school, organisation, brand, event, or campaign",
  "Artist / creative development",
  "Music-integrated leadership / mentoring project",
  "Other customised music project"
],
    delivery: [
      "One-on-one creative consultations and music development",
      "Custom project briefs and tailored production engagements",
      "Vocal, songwriting, and expression masterclasses",
      "Collaborative creative sessions for individuals and groups",
    ],
    outcome:
      "Clients and learners develop stronger musical expression and receive purposeful, customised music solutions aligned with their identity, message, audience, and goals.",
    icon: "music",
  },
];

export function serviceById(id: string): Service | undefined {
  return services.find((s) => s.id === id);
}

export const africanLanguages = [
  "Yoruba",
  "Igbo",
  "Hausa",
  "Swahili",
  "Zulu",
  "Shona",
  "Somali",
  "Amharic",
] as const;

export const globalLanguages = [
  "English",
  "Mandarin Chinese",
  "Spanish",
  "Hindi",
  "Arabic",
  "French",
  "German",
  "Portuguese",
  "Japanese",
  "Russian",
] as const;

export const examinations = [
  "WAEC",
  "NECO",
  "GCE",
  "JAMB",
  "BECE",
  "SAT",
  "IELTS",
  "TOEFL",
  "IGCSE",
  "Cambridge Checkpoint",
  "A-Level",
] as const;

export const academicLevels = [
  { title: "Nursery, Primary & Secondary", body: "Foundational learning and skill development, tailored to age-appropriate curricula." },
  { title: "A-Level & Diploma", body: "Advanced preparation for higher education and professional pathways." },
  { title: "Undergraduate & Postgraduate", body: "Rigorous support for degree programmes, research, and scholarly success." },
] as const;

export const subjectAreas = [
  "English Language & Literature",
  "Mathematics (General, Further, Advanced)",
  "Sciences — Physics, Chemistry, Biology",
  "ICT, Computer Science & Data Literacy",
  "Economics, Commerce, Business & Accounting",
  "History, Government & Political Science",
  "Geography & Environmental Studies",
  "Civic Education & Social Studies",
  "Verbal & Quantitative Reasoning",
  "Creative Arts & Cultural Studies",
] as const;

export const audiences = [
  { id: "learner", label: "Learner / student" },
  { id: "parent", label: "Parent or guardian" },
  { id: "professional", label: "Professional" },
  { id: "educator", label: "Educator" },
  { id: "researcher", label: "Researcher / knowledge professional" },
  { id: "organisation", label: "Organisation / institution" },
] as const;

export const needs = [
  { id: "academic", label: "Academic support or exam preparation", service: "academic-support" as ServiceId },
  { id: "language", label: "Learn a language", service: "language-education" as ServiceId },
  { id: "abroad", label: "Study abroad or scholarships", service: "study-abroad" as ServiceId },
  { id: "mentorship", label: "Mentorship or leadership growth", service: "mentorship" as ServiceId },
  { id: "counselling", label: "Guidance or counselling", service: "guidance-counselling" as ServiceId },
  { id: "training", label: "Staff or organisational training", service: "organisational-services" as ServiceId },
  { id: "leadership", label: "Leadership or human-capital development", service: "leadership-human-capital" as ServiceId },
  { id: "certification", label: "Professional certification or CPD", service: "professional-development" as ServiceId },
  { id: "education-consultancy", label: "Educational consultancy or school improvement", service: "educational-consultancy" as ServiceId },
  { id: "research", label: "Research, knowledge, or report support", service: "research-knowledge" as ServiceId },
  { id: "digital-learning", label: "Digital courses or educational resources", service: "digital-learning" as ServiceId },
  { id: "music", label: "Music, songwriting, production, or a custom music project", service: "music-creative-development" as ServiceId },
] as const;

export const founder = {
  name: "Best Orji Chijioke",
  role: "Founder & Chief Executive",
  location: "Surulere, Lagos, Nigeria",
  emails: ["mrbestoce@gmail.com", "bestoce22@gmail.com"],
  phones: [
    { display: "+234 903 628 0221", href: "tel:+2349036280221" },
    { display: "+234 806 486 8964", href: "tel:+2348064868964" },
  ],
  linkedin: "https://linkedin.com/in/bestoce-mrbestoce",
  photo: "/brand/founder.jpg",
  profile:
    "Visionary, results-driven Operations Executive, Educational Leader, School Administrator, Human Capital Management Professional, and Quality Assurance Specialist with over twenty years of progressive leadership experience across British and Nigerian educational environments. Expertise spans organisational transformation, operational excellence, governance, regulatory compliance, people management, institutional growth, strategic planning, project management, process optimisation, technology integration, digital transformation, and data-informed decision-making.",
  education: [
    {
      title: "Master of Education (M.Ed.) in Guidance and Counselling",
      place: "National Open University of Nigeria — in progress",
    },
    {
      title: "Bachelor of Science in Education (B.Sc. Ed.) — Mathematics",
      place: "University of Nigeria, Nsukka · 2008",
    },
  ],
  highlights: [
    {
      role: "Head of School",
      org: "Jason's Tendercare School, Surulere",
      years: "2022 – 2026",
      point:
        "Strategic leadership of academic, operational, financial, and human-capital functions; British and Nigerian curricula; digital transformation and quality assurance.",
    },
    {
      role: "Principal",
      org: "Studyhabit College, Lagos",
      years: "2019 – 2022",
      point:
        "Established the college from inception — regulatory approvals, workforce, academic programmes, and a fully operational institution.",
    },
    {
      role: "Quality Assurance Manager",
      org: "Silverwood Schools, Lagos",
      years: "2018 – 2019",
      point:
        "Designed and ran the institutional QA framework — instructional audits, KPIs, and evidence-based improvement.",
    },
    {
      role: "Mathematics Instructor, Lab Technologist & House Parent",
      org: "Legacy High School, Lagos",
      years: "2015 – 2018",
      point:
        "IGCSE and national-examination mathematics, STEM laboratories, curriculum coordination, and student pastoral care.",
    },
  ],
  competencies: [
    "Executive leadership, strategic planning, and decision-making",
    "Operations, project management, and business-process optimisation",
    "Human capital management, talent acquisition, and workforce planning",
    "Learning & development, coaching, mentoring, and employee performance",
    "Quality assurance, KPI reporting, risk management, and continuous improvement",
    "Policy development, governance, regulatory compliance, and internal controls",
    "British and Nigerian curriculum leadership, safeguarding, and student welfare",
    "Digital transformation, Microsoft 365, Google Workspace, SIMS, and data analytics",
  ],
  professionalDevelopment: [
    "Safety and Health Professional Certification — OHS Academy, USA (In Progress)",
    "Teaching Adult Learning Frameworks — Open University of Austria (In Progress)",
    "Technology-Blended Learning & Creative Problem Solving — AISEN CPD Programme",
    "Jolly Phonics Instruction — Chalis Education Consult Limited",
  ],
};

export const commitments = [
  "World-class education and consultancy that meet international standards",
  "Organisational excellence and leadership effectiveness",
  "African and global cultural heritage, held together",
  "Empowering individuals and institutions with knowledge and strategic insight",
  "Ethical, innovative, and results-driven solutions",
] as const;

export const deliveryModes = [
  "Online and virtual learning",
  "Digital and self-paced resources",
  "Physical and on-site engagements",
  "Blended and hybrid programmes",
  "Workshops, seminars, masterclasses, and consultations",
] as const;

export const expertNetwork = [
  "Teachers, tutors, professors, and lecturers",
  "Researchers and subject-matter experts",
  "Language experts and culturally knowledgeable educators",
  "Counsellors, consultants, HR and leadership specialists",
  "Corporate trainers and technology professionals",
] as const;

export const strategicPartners = [
  "Schools and educational institutions",
  "Universities and professional bodies",
  "Language schools and international education organisations",
  "Industry, corporate, NGO, and community partners",
  "Qualified specialists and professional networks",
] as const;
