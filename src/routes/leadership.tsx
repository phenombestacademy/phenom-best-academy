import { createFileRoute, Link } from "@tanstack/react-router";
import { Linkedin, Mail, Phone } from "lucide-react";
import { PageHero, Section } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { founder } from "@/lib/academy";

export const Route = createFileRoute("/leadership")({ component: Leadership });

function Leadership() {
  return (
    <>
      <PageHero
        kicker="Leadership"
        title="The Academy is built on the principles and practice of educational leadership, management, and organisational development."
        lede="Phenom Best Academy is led from lived experience — over two decades of school leadership, educational management, quality assurance, human capital, operations, and organisational practice across British and Nigerian educational environments."
      />

      <Section>
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <img
              src={founder.photo}
              alt={founder.name}
              className="aspect-square w-full rounded-2xl object-cover object-top shadow-card outline outline-1 -outline-offset-1 outline-ink/10"
            />
            <div className="mt-5 space-y-2 text-sm">
              {founder.emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="flex min-h-11 items-center gap-2 text-ink-soft hover:text-blue"
                >
                  <Mail className="size-4" />
                  {email}
                </a>
              ))}
              {founder.phones.map((p) => (
                <a
                  key={p.href}
                  href={p.href}
                  className="flex min-h-11 items-center gap-2 text-ink-soft hover:text-blue"
                >
                  <Phone className="size-4" />
                  {p.display}
                </a>
              ))}
              <a
                href={founder.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-11 items-center gap-2 text-ink-soft hover:text-blue"
              >
                <Linkedin className="size-4" />
                LinkedIn
              </a>
            </div>
          </div>

          <div className="lg:col-span-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">
              Founder & Chief Executive
            </p>
            <h2 className="mt-2 font-display text-4xl font-semibold">{founder.name}</h2>
            <p className="mt-1 text-sm text-muted">{founder.location}</p>

            <div className="mt-5 space-y-5 text-muted">
              <p className="leading-relaxed">
                Best O.C.E is an educational leader, operations executive, school administrator,
                human-capital professional, and quality-assurance specialist with over two decades
                of progressive experience across British and Nigerian educational environments.
                His work has brought together school leadership, academic administration,
                organisational development, quality assurance, strategic planning, human-capital
                management, curriculum and instructional leadership, process improvement,
                technology integration, and stakeholder engagement.
              </p>

              <p className="leading-relaxed">
                He holds a <strong className="text-ink">Mathematics Education degree</strong>, backed
                by extensive practical expertise in educational leadership, school administration,
                and institutional management. His professional formation combines this strong
                analytical foundation with a deep commitment to learner development, human
                development, and institutional leadership. His background in{" "}
                <strong className="text-ink">Guidance and Counselling</strong> further strengthens
                his understanding of human behaviour, student support systems, personal development,
                and the broader pastoral dimensions of education.
              </p>

              <p className="leading-relaxed">
                His professional journey has included leadership as{" "}
                <strong className="text-ink">
                  Head of School, College Principal, Quality Assurance Manager, and Head Teacher
                </strong>
                . He has also served as a{" "}
                <strong className="text-ink">
                  Boarding House Parent, Mathematics Teacher, Class Teacher, Science Laboratory
                  Technician, Curriculum Coordinator, Private Tutor
                </strong>
                , and in other educational and professional capacities.
              </p>

              <p className="leading-relaxed">
                As a <strong className="text-ink">Head of School</strong>, he provided strategic
                leadership across academic, operational, financial, human-capital,
                quality-assurance, and stakeholder functions, with experience spanning British and
                Nigerian curricula and technology-enabled school management.
              </p>

              <p className="leading-relaxed">
                As a <strong className="text-ink">College Principal</strong>, he led the
                establishment and development of a college from inception, contributing to
                regulatory processes, recruitment, academic programmes, operational systems, staff
                development, and institutional growth.
              </p>

              <p className="leading-relaxed">
                As a <strong className="text-ink">Quality Assurance Manager</strong>, he led
                instructional review, performance monitoring, evidence-based improvement,
                quality-assurance processes, and continuous development across educational
                operations.
              </p>

              <p className="leading-relaxed">
                His experience as a{" "}
                <strong className="text-ink">
                  Mathematics Instructor, Science Laboratory Technician and Boarding House Parent
                </strong>{" "}
                brought together mathematics instruction, laboratory operations, curriculum
                support, STEM learning, student supervision, pastoral care, and residential student
                support.
              </p>

              <p className="leading-relaxed">
                His experience as a{" "}
                <strong className="text-ink">Head Teacher and Class Teacher</strong> further
                strengthened his understanding of classroom practice, curriculum delivery, learner
                development, teacher support, school administration, and the realities of
                day-to-day educational leadership.
              </p>

              <p className="leading-relaxed">
                His professional foundation in{" "}
                <strong className="text-ink">mathematics education and teaching</strong> developed
                his experience in lesson delivery, assessment, classroom management, learner
                support, and the practical application of educational principles.
              </p>

              <p className="leading-relaxed">
                Across these roles, he has worked with learners, educators, families, and
                institutions, gaining practical insight into both the academic and operational
                dimensions of education. Together, these experiences have given him a broad
                perspective on education — from the learner and classroom to the teacher, school,
                organisation, and wider institutional environment.
              </p>

              <p className="leading-relaxed">
                These experiences have shaped a practical leadership philosophy centred on{" "}
                <strong className="text-ink">
                  excellence, people development, continuous improvement, purposeful learning, and
                  the responsible use of knowledge and technology
                </strong>{" "}
                to strengthen individuals and institutions.
              </p>
            </div>

            <h3 className="mt-10 font-display text-2xl font-semibold">
              Areas of Executive Expertise
            </h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                "Executive leadership, strategic planning, and decision-making",
                "Operations, project management, and business-process optimisation",
                "Human-capital management, talent development, and workforce planning",
                "Learning and development, coaching, mentoring, and performance improvement",
                "Quality assurance, KPI reporting, risk management, and continuous improvement",
                "Policy development, governance, regulatory compliance, and internal controls",
                "British and Nigerian curriculum leadership, safeguarding, and student welfare",
                "Digital transformation, technology integration, Microsoft 365, Google Workspace, and data-informed decision-making",
              ].map((item) => (
                <li key={item} className="rounded-xl bg-cream px-4 py-3 text-sm shadow-card">
                  {item}
                </li>
              ))}
            </ul>

            <h3 className="mt-10 font-display text-2xl font-semibold">Leadership Philosophy</h3>
            <div className="mt-4 space-y-4 text-muted">
              <p className="leading-relaxed">
                His approach to leadership is grounded in the belief that strong institutions are
                built by developing strong people. He combines strategic thinking with practical
                experience, placing importance on{" "}
                <strong className="text-ink">
                  excellence, integrity, accountability, continuous learning, purposeful development,
                  and responsible stewardship
                </strong>
                .
              </p>
              <p className="leading-relaxed">
                For him, education extends beyond the transmission of knowledge. It involves
                developing <strong className="text-ink">character, capability, confidence, judgement</strong>,
                and the capacity to contribute meaningfully to society.
              </p>
              <p className="leading-relaxed">
                This philosophy informs the work of Phenom Best Academy:{" "}
                <strong className="text-ink">
                  empowering individuals, strengthening institutions, and connecting knowledge with
                  practical impact
                </strong>
                .
              </p>
            </div>

            <h3 className="mt-10 font-display text-2xl font-semibold">Professional Interests</h3>
            <p className="mt-4 leading-relaxed text-muted">
              His professional interests include{" "}
              <strong className="text-ink">
                strategic leadership, human capital, educational research, music composition and
                songwriting through Phenom Sound Lab, chess, lifelong learning, and the wider
                development of people and institutions
              </strong>
              .
            </p>

            <Button asChild className="mt-8">
              <Link to="/enquire">Make an enquiry</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
