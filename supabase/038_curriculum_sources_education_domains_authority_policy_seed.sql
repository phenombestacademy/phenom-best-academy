-- 038 authoritative source registry, education domains and authority policies
-- The production migration is idempotent and uses the official URLs recorded in docs/curriculum-ingestion-and-authority.md.
insert into public.global_subject_catalogue(name,slug,category,active) values
('Early Childhood Education','early-childhood-education','Education',true),('Mathematics Education','mathematics-education','Education',true),
('Primary Education','primary-education','Education',true),('Secondary Education','secondary-education','Education',true),
('Teacher Education','teacher-education','Education',true),('Educational Leadership','educational-leadership','Education',true),
('Educational Administration and Planning','educational-administration-and-planning','Education',true),('Educational Psychology','educational-psychology','Education',true),
('Curriculum Studies','curriculum-studies','Education',true),('Educational Technology','educational-technology','Education',true),
('Educational Measurement and Evaluation','educational-measurement-and-evaluation','Education',true),('Guidance and Counselling Education','guidance-and-counselling-education','Education',true),
('Science Education','science-education','Education',true),('Language Education','language-education','Education',true),
('Social Studies Education','social-studies-education','Education',true),('Special and Inclusive Education','special-and-inclusive-education','Education',true),
('Adult Education','adult-education','Education',true),('Vocational and Technical Education','vocational-and-technical-education','Education',true),
('Arts Education','arts-education','Education',true),('Physical and Health Education','physical-and-health-education','Education',true),
('PYP Transdisciplinary Learning','pyp-transdisciplinary-learning','Education',true),('IB Diploma Programme Core','ib-diploma-programme-core','Education',true),
('IB Career-related Programme Core','ib-career-related-programme-core','Education',true)
on conflict(slug) do update set name=excluded.name,category=excluded.category,active=true;

insert into public.lms_programme_authority_policies(policy_code,authority_model,title,description,approval_required,awarding_body_required,partner_agreement_required,regulatory_clearance_required,certificate_issuer_rule,public_disclosure_rule) values
('ACADEMY-DIRECT','academy_direct','Phenom Best Academy direct programme','Designed, delivered and administered directly by Phenom Best Academy within its lawful scope.',false,false,false,false,'Phenom Best Academy may issue its own certificate where appropriate.','Identify it as a Phenom Best Academy programme.'),
('ACADEMY-APPROVED','academy_licensed_or_approved','Academy programme requiring licence or approval','Delivered only after required licence, approval, registration or authorization is verified.',true,false,false,true,'Follow the verified approval arrangement.','Display only verified approval status and authority.'),
('AFFILIATED-INSTITUTION','affiliated_institution','Affiliated institution programme','Delivered with a verified university, polytechnic, college, professional institute, healthcare institution or other partner.',true,true,true,true,'Identify the actual verified awarding body and Academy role.','Disclose the verified partner and awarding arrangement.'),
('CO-DELIVERED','co_delivered','Co-delivered programme','Jointly designed or delivered with a verified institution, professional body, industry partner or organisation.',true,true,true,true,'Follow the documented co-delivery agreement.','Disclose participating organisations and responsibilities.'),
('REGULATORY-GOVERNMENT','regulatory_or_government','Regulatory or government-linked programme','Requires or involves a ministry, agency, regulator, statutory body or official authority.',true,true,false,true,'Follow the official authority requirements.','Display the official authority only after verification.'),
('REFERRAL-PATHWAY','referral_or_pathway','External pathway or referral','Provides guidance, preparation or referral without representing the external institution as Phenom Best Academy.',true,true,false,false,'External institution issues the credential.','Clearly state the Academy pathway/support role.')
on conflict(policy_code) do update set title=excluded.title,description=excluded.description;

-- Source records for all 19 established curriculum frameworks are seeded in production.
-- Detailed source rows are maintained in Supabase so the frontend never needs to retrieve documents.
