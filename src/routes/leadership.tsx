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
        title="The Academy is built by a practitioner of educational leadership."
        lede="Phenom Best Academy is led from lived experience — twenty years of school leadership, quality assurance, human capital, and operations across British and Nigerian environments."
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
            <p className="mt-5 leading-relaxed text-muted">{founder.profile}</p>
            <p className="mt-4 leading-relaxed text-muted">
              Currently pursuing a Master of Education in Guidance and Counselling to deepen
              expertise in educational leadership, safeguarding, employee wellbeing, student
              support, and whole-person growth — the same terrain the Academy serves.
            </p>

            <h3 className="mt-10 font-display text-2xl font-semibold">Selected experience</h3>
            <ol className="mt-4 space-y-5">
              {founder.highlights.map((h) => (
                <li key={h.role + h.org} className="border-l-2 border-line pl-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-orange">{h.years}</p>
                  <p className="font-display text-xl font-semibold">
                    {h.role}
                    <span className="text-ink-soft"> · {h.org}</span>
                  </p>
                  <p className="mt-1 text-sm text-muted">{h.point}</p>
                </li>
              ))}
            </ol>

            <h3 className="mt-10 font-display text-2xl font-semibold">Education</h3>
            <ul className="mt-4 space-y-3">
              {founder.education.map((e) => (
                <li key={e.title}>
                  <p className="font-medium">{e.title}</p>
                  <p className="text-sm text-muted">{e.place}</p>
                </li>
              ))}
            </ul>

            <h3 className="mt-10 font-display text-2xl font-semibold">Core competencies</h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {founder.competencies.map((c) => (
                <li key={c} className="rounded-xl bg-cream px-4 py-3 text-sm shadow-card">
                  {c}
                </li>
              ))}
            </ul>

            <h3 className="mt-10 font-display text-2xl font-semibold">Professional development</h3>
            <ul className="mt-4 space-y-2">
              {founder.professionalDevelopment.map((item) => (
                <li key={item} className="border-l-2 border-line pl-4 text-sm text-muted">{item}</li>
              ))}
            </ul>

            <p className="mt-10 text-sm italic text-muted">
              Professional interests include strategic leadership, human capital, educational
              research, music composition and songwriting — the foundation of the Academy’s
              transformational music programme — chess, and lifelong learning.
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
