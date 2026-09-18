export const academy = {
  name: "Phenom Best Academy",
  legalName: "Phenom Best Academy Limited",
  motto: "Tranquil Excellence for Global Impact",
  tagline: "Empowering minds. Enriching cultures. Inspiring global leaders.",
  rc: "9704482",
  tin: "2622434760319",
  emails: ["phenombestacademy@gmail.com", "phenombesta@gmail.com"],
  phones: [
    { display: "+234 916 787 2339", href: "tel:+2349167872339", wa: "https://wa.me/message/WN7IL67RAVZTM1", label: "Official Academy WhatsApp" },
    { display: "+234 806 486 8964", href: "tel:+2348064868964", wa: "https://wa.me/2348064868964", label: "Personal / secondary contact" },
  ],
  location: "Lagos, Nigeria",
  registeredAddress: "4 Zamba St, Ikate, Lagos 101283, Lagos, Nigeria",
  mapsUrl: "https://maps.app.goo.gl/c8zTGNpaxAcpude59?g_st=ac",
  serviceDeliveryNote:
    "The Academy operates primarily online and can also provide in-person services by arrangement, including at a client’s location, an agreed venue, or an available office arrangement.",
  brands: [
    {
      name: "Phenom Sound Press",
      descriptor: "The Library Service of Phenom Best Academy",
      description:
        "The Academy’s library and publishing service for books, e-books, manuscripts, research and learning resources, professional guides, and related knowledge products.",
    },
    {
      name: "Phenom Sound Lab",
      descriptor: "The Creative Division of Phenom Best Academy",
      description:
        "The creative arm for music, songwriting, production, vocal and creative development, and purpose-driven music projects.",
    },
  ],
  copyright: "© 2026 Phenom Best Academy Limited. All Rights Reserved.",
} as const;

export const mission =
  "Phenom Best Academy exists to empower individuals, institutions, and communities through transformative education, innovative research, and holistic mentorship. We nurture intellectual excellence, ethical leadership, and global competence so people and organisations can thrive in a dynamic, interconnected world.";

export const vision =
  "To be a globally respected academy recognised for developing exceptional minds, strengthening institutions, and inspiring visionary leaders who drive sustainable and transformative impact across societies.";

export const executiveSummary =
  "Phenom Best Academy is a multidisciplinary, knowledge-driven and human-centred institution providing education, professional development, research, consultancy, leadership, language, mentorship, and related knowledge-based services. We help individuals and organisations build capability, strengthen performance, and create meaningful impact through practical expertise, strategic guidance, and purposeful learning.";

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
  | "music-creative-development"
  | "faith-based-content";

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
    title: "Mentorship & Personal Development",
    kicker: "Purpose, voice, and leadership",
    summary:
      "Structured mentorship and personal development that strengthen self-awareness, confidence, leadership capacity, communication, and purposeful growth.",
    audience:
      "Teenagers, young adults, students, professionals, educators, entrepreneurs, and organisational leaders seeking personal development, mentoring, and leadership enhancement.",
    offerings: [
      "Personal growth, self-awareness, and values-based leadership",
      "Academic and career insight aligned to strengths",
      "Confidence, communication, goal setting, and life planning",
      "Purpose, identity, values, confidence, and personal effectiveness",
      "Leadership, academic, career, and professional development guidance",
      "Youth leadership, career awareness, and life-skills seminars",
      "Teen and young-adult mentoring and personal development",
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
  "Youth and teen mentorship",
  "Youth leadership and life-skills seminars",
  "Structured one-to-one mentorship",
  "Group / cohort mentorship",
  "Other customised mentorship programme"
],
    delivery: [
      "One-on-one and group mentoring",
      "Group coaching and leadership workshops",
      "Leadership, career, and personal-development workshops",
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
      "Children, teenagers, young adults, students, professionals, families, and organisational members.",
    offerings: [
      "Emotional and psychological support",
      "Career exploration and educational counselling",
      "Child and adolescent development",
      "Youth and teen development, mentoring, and life guidance",
      "Teen confidence, identity, decision-making, and life-skills support",
      "Character education and values formation",
      "Conflict resolution and peacebuilding",
      "Marriage preparation, family, and relationship counselling",
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
  "Youth and teen development support",
  "Teen confidence, identity, and life-skills support",
  "Character and values development",
  "Conflict resolution / peacebuilding",
  "Marriage preparation / relationship guidance",
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
      "Guidance towards recognised professional certifications",
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
      "Digital courses, e-books, manuals, workbooks, recorded lessons, professional guides, assessment resources, and downloadable learning materials, including knowledge products developed through Phenom Sound Press — The Library Service of Phenom Best Academy.",
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
    id: "faith-based-content",
    title: "Faith-Based & Inspirational Content",
    kicker: "Purposeful content for faith and growth",
    summary:
      "Thoughtfully developed Christian, devotional, inspirational, and motivational content for churches, ministries, Christian organisations, leaders, and individuals.",
    audience:
      "Churches, ministries, Christian organisations, pastors and ministry leaders, schools, fellowship groups, and individuals seeking well-structured faith-based or inspirational resources.",
    offerings: [
      "Bible study and Sunday school outlines developed around clear themes, learning objectives, scripture, discussion, and practical application",
      "Devotional materials, inspirational messages, motivational content, and faith-centred educational resources",
      "Church and ministry seminar papers, workshop materials, leadership-development resources, and training content",
      "Christian leadership, character, values, personal development, and human-development materials",
      "Inspirational books, booklets, study guides, manuscripts, and other faith-based publications",
      "Purpose-driven songs, motivational songs, worship-related creative concepts, and supporting written content",
      "Proofreading, editing, restructuring, and refinement of existing faith-based and inspirational materials",
      "Custom content development for conferences, retreats, fellowships, special programmes, and ministry initiatives",
    ],
    enquiryOptions: [
      "Bible study outline",
      "Sunday school outline / teaching material",
      "Devotional development",
      "Church / ministry seminar paper",
      "Leadership training material",
      "Christian leadership / character-development resource",
      "Inspirational book / booklet",
      "Motivational content",
      "Faith-based educational material",
      "Proofreading / editing of church or Christian materials",
      "Faith-based song / motivational song concept",
      "Conference / retreat / fellowship resource",
      "Other customised faith-based content",
    ],
    delivery: [
      "Research-informed content development",
      "Custom writing, editing, and proofreading engagements",
      "One-off resources or structured content series",
      "Digital and print-ready manuscript preparation",
    ],
    outcome:
      "Clients receive clear, engaging, purposeful resources that communicate ideas effectively, support learning and reflection, and serve the needs of their intended audience.",
    icon: "heart",
  },
  {
    id: "music-creative-development",
    title: "Music & Creative Development",
    kicker: "Create, express, and produce",
    summary:
      "A dedicated creative-development pathway delivered through Phenom Sound Lab — The Creative Division of Phenom Best Academy, covering music, songwriting, vocal expression, custom songs, music production, and purpose-driven creative projects.",
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
  { id: "youth", label: "Teenager / young adult" },
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
  { id: "youth-development", label: "Youth / teen development, mentoring, or life skills", service: "guidance-counselling" as ServiceId },
  { id: "relationships", label: "Marriage, family, or relationship guidance", service: "guidance-counselling" as ServiceId },
  { id: "counselling", label: "Guidance or counselling", service: "guidance-counselling" as ServiceId },
  { id: "training", label: "Staff or organisational training", service: "organisational-services" as ServiceId },
  { id: "leadership", label: "Leadership or human-capital development", service: "leadership-human-capital" as ServiceId },
  { id: "certification", label: "Professional certification or CPD", service: "professional-development" as ServiceId },
  { id: "education-consultancy", label: "Educational consultancy or school improvement", service: "educational-consultancy" as ServiceId },
  { id: "research", label: "Research, knowledge, or report support", service: "research-knowledge" as ServiceId },
  { id: "digital-learning", label: "Digital courses or educational resources", service: "digital-learning" as ServiceId },
  { id: "music", label: "Music, songwriting, production, or a custom music project", service: "music-creative-development" as ServiceId },
  { id: "faith-content", label: "Faith-based, devotional, inspirational, or church content", service: "faith-based-content" as ServiceId },
] as const;

export const faqs = [
  {
    question: "What is Phenom Best Academy Limited?",
    answer:
      "Phenom Best Academy Limited is a multidisciplinary, knowledge-driven and human-centred academy based in Lagos, Nigeria. We provide education, professional development, leadership and human-capital development, research, consultancy, language education, mentorship, digital learning, creative development, and related services for individuals and organisations.",
  },
  {
    question: "Who can use the Academy's services?",
    answer:
      "Our services are designed for learners, parents and families, educators, professionals, researchers, entrepreneurs, leaders, schools, companies, NGOs, faith-based organisations, and other institutions. Services can be tailored to the needs and goals of the client.",
  },
  {
    question: "Does the Academy work with organisations as well as individuals?",
    answer:
      "Yes. We support both individuals and organisations through training, consultancy, leadership development, staff development, onboarding, research, educational advisory, content development, and other customised engagements.",
  },
  {
    question: "Can you provide staff training and onboarding programmes?",
    answer:
      "Yes. Staff training, onboarding, workplace skills, leadership development, performance development, communication, professional development, and team-focused programmes can be designed around an organisation's needs.",
  },
  {
    question: "Do you prepare seminars, workshops and leadership materials?",
    answer:
      "Yes. We develop seminar papers, workshop materials, training resources, leadership-development content, presentations, manuals, and related knowledge products for educational, professional, organisational, and faith-based settings.",
  },
  {
    question: "Do you provide proofreading and editing services?",
    answer:
      "Yes. We provide proofreading, editing, restructuring, language refinement, formatting guidance, and content-development support for academic, professional, educational, organisational, inspirational, and faith-based materials.",
  },
  {
    question: "Do you develop Bible study, Sunday school and devotional materials?",
    answer:
      "Yes. Through our faith-based and inspirational content service, we can develop Bible study outlines, Sunday school materials, devotionals, church seminar resources, Christian leadership materials, motivational content, and other customised ministry resources.",
  },
  {
    question: "Can you create books, e-books and other learning resources?",
    answer:
      "Yes. We develop and refine books, e-books, manuals, workbooks, study guides, professional resources, inspirational publications, and other educational or knowledge-based materials, subject to the nature and scope of the project.",
  },
  {
    question: "Do you offer music and songwriting services?",
    answer:
      "Yes. Our Music & Creative Development service covers songwriting, custom songs, music production, arrangement, vocal development, creative direction, motivational and educational songs, and other purpose-driven music projects.",
  },
  {
    question: "Can you design a customised programme for my organisation or project?",
    answer:
      "Yes. Where an existing service does not fully match your need, we can discuss the objective, audience, scope, delivery format, and expected outcome and develop an appropriate customised engagement.",
  },
  {
    question: "How do I start an enquiry?",
    answer:
      "Use the enquiry page, select the service that best matches your need, and tell us what you are trying to achieve. If you are unsure which service fits, use the Academy's guided path or contact us directly for direction.",
  },
] as const;

export const founder = {
  name: "Best O.C.E, popularly known as Bestoce and Mrbestoce.",
  role: "Founder & Chief Executive",
  location: "Lagos, Nigeria",
  emails: ["mrbestoce@gmail.com"],
  phones: [
    
    { display: "+234 806 486 8964", href: "tel:+2348064868964" },
  ],
  linkedin: "https://linkedin.com/in/bestoce-mrbestoce",
  photo: "/brand/founder.jpg",
  profile:
    "Best O.C.E is an educational leader, operations executive, school administrator, human-capital professional, and quality-assurance specialist with over two decades of progressive experience across British and Nigerian educational environments. His work has brought together school leadership, academic administration, organisational development, quality assurance, strategic planning, human-capital management, curriculum and instructional leadership, process improvement, technology integration, and stakeholder engagement.",
  profileParagraphs: [
    "Best O.C.E is an educational leader, operations executive, school administrator, human-capital professional, and quality-assurance specialist with over two decades of progressive experience across British and Nigerian educational environments. His work has brought together school leadership, academic administration, organisational development, quality assurance, strategic planning, human-capital management, curriculum and instructional leadership, process improvement, technology integration, and stakeholder engagement.",
    "His professional journey includes leadership as Head of School in Surulere, Lagos; College Principal in Ago Palace, Okota, Lagos; Quality Assurance Manager in Maryland, Ikeja, Lagos; and Head Teacher across Alimosho and Ikeja, Lagos. He has also served as a Boarding House Parent, Mathematics Teacher, Class Teacher, Science Laboratory Technician, Curriculum Coordinator, Private Tutor, and in other educational and professional capacities across Lagos and Imo State, Nigeria.",
    "These experiences have shaped a practical leadership philosophy centred on excellence, people development, continuous improvement, purposeful learning, and the responsible use of knowledge and technology to strengthen individuals and institutions."
  ],
  educationSummary:
    "A graduate of Mathematics Education from the University of Nigeria, Nsukka, who is currently pursuing a Master of Education (M.Ed.) in Guidance and Counselling to deepen his expertise in learner development, human behaviour, and educational guidance, and has undertaken a range of professional certifications, continuing professional development programmes, and specialised training.",
  highlights: [
    {
      role: "Head of School",
      org: "Surulere, Lagos",
      point:
        "Provided strategic leadership across academic, operational, financial, people, quality-assurance, and stakeholder functions, with experience spanning British and Nigerian curricula and technology-enabled school management.",
    },
    {
      role: "College Principal",
      org: "Ago Palace, Okota, Lagos",
      point:
        "Led the establishment and development of a college from inception, including regulatory processes, recruitment, academic programmes, operational systems, and institutional growth.",
    },
    {
      role: "Quality Assurance Manager",
      org: "Maryland, Ikeja, Lagos",
      point:
        "Led quality-assurance activities, instructional review, performance monitoring, evidence-based improvement, and continuous development across educational operations.",
    },
    {
      role: "Mathematics Instructor, Science Laboratory Technician & Boarding House Parent",
      org: "Ikeja, Lagos",
      point:
        "Combined mathematics instruction with laboratory operations, curriculum support, STEM learning, student supervision, pastoral care, and residential student support.",
    },
    {
      role: "Head Teacher & Class Teacher",
      org: "Alimosho and Ikeja, Lagos",
      point:
        "Provided classroom and school leadership, supported curriculum delivery, mentored learners and teachers, and contributed to effective day-to-day educational management.",
    },
    {
      role: "Mathematics Educator and Teacher",
      org: "Owerri and Ngor-Okpala, Imo State",
      point:
        "Built early teaching experience through mathematics education, teaching practice, learner support, lesson delivery, assessment, and classroom management.",
    },
  ],
  competencies: [
    "Executive leadership, strategic planning, and decision-making",
    "Operations, project management, and business-process optimisation",
    "Human capital management, talent development, and workforce planning",
    "Learning and development, coaching, mentoring, and performance improvement",
    "Quality assurance, KPI reporting, risk management, and continuous improvement",
    "Policy development, governance, regulatory compliance, and internal controls",
    "British and Nigerian curriculum leadership, safeguarding, and student welfare",
    "Digital transformation, technology integration, Microsoft 365, Google Workspace, and data-informed decision-making",
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

Phenom Best Calc — The Calculation Tool of Phenom Best Academy
Phenom Best Core — The Intelligent Technology Core of Phenom Best Academy
