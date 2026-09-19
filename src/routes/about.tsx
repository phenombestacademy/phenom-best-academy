import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/page-hero";
import { companyFaq } from "@/data/company-faq";
import {
  academy,
  commitments,
  deliveryModes,
  expertNetwork,
  strategicPartners,
  executiveSummary,
  mission,
  values,
  vision,
} from "@/lib/academy";

export const Route = createFileRoute("/about")({ component: About });

function About() {
  return (
    <>
      <PageHero
        kicker="About"
        title="A multidisciplinary academy, globally oriented."
        lede={executiveSummary}
      />

      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <article className="rounded-2xl bg-cream p-6 shadow-card sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">Mission</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Why we exist</h2>
            <p className="mt-4 leading-relaxed text-muted">{mission}</p>
          </article>
          <article className="rounded-2xl bg-navy p-6 text-cream shadow-card sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Vision</p>
            <h2 className="mt-2 font-display text-3xl font-semibold text-cream">Where we are going</h2>
            <p className="mt-4 leading-relaxed text-ivory/80">{vision}</p>
          </article>
        </div>
      </Section>

      <Section className="pt-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">Brand architecture</p>
        <h2 className="mt-2 max-w-3xl font-display text-3xl font-semibold sm:text-4xl">
          Knowledge and creativity, connected.
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">
          Phenom Sound Press and Phenom Sound Lab extend the Academy&apos;s work into publishing,
          knowledge resources, music, and creative development while remaining part of the wider
          Phenom Best Academy identity.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {academy.brands.map((brand, index) => (
            <div
              key={brand.name}
              className={`rounded-2xl border-l-4 bg-cream p-6 shadow-card service-accent-${index === 0 ? "gold" : "purple"}`}
            >
              <h3 className="font-display text-2xl font-semibold">{brand.name}</h3>
              <p className="mt-1 font-medium text-blue">{brand.descriptor}</p>
              <p className="mt-3 leading-relaxed text-muted">{brand.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">Core values</p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">The character of the Academy</h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {values.map((v) => (
            <li key={v.id} className="rounded-2xl border border-line bg-cream p-5">
              <h3 className="font-display text-2xl font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{v.body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">Identity</p>
        <h2 className="mt-2 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">
          Defined by excellence, guided by tranquillity, driven by purpose.
        </h2>
        <div className="mt-6 max-w-3xl space-y-4 leading-relaxed text-muted">
          <p>
            Phenom Best Academy is not limited to a conventional classroom. It is a knowledge,
            education, and human-capital institution whose work is delivered online, virtually,
            physically, or through blended approaches — according to the engagement.
          </p>
          <p>
            Knowledge is treated as a resource to be developed, organised, applied, and transformed
            into capability. The institutional direction is clear: from knowledge to capability,
            from capability to excellence, and from excellence to impact.
          </p>
          <p>
            The name <em>Phenom</em> reflects a belief in exceptional human potential — that people
            possess capacities which can be discovered, refined, and directed towards meaningful
            achievement.
          </p>
        </div>
      </Section>

      <Section className="pt-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">How we deliver</p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">Flexible by design</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">{academy.serviceDeliveryNote}</p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {deliveryModes.map((item) => (
            <div key={item} className="rounded-xl bg-cream p-4 text-sm text-muted shadow-card">
              {item}
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">Expert network</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Specialist knowledge beyond one person</h2>
            <p className="mt-3 leading-relaxed text-muted">
              Phenom Best Academy works with appropriately qualified specialists when a programme or project requires expertise beyond its core team, enabling a broader national and international talent pool while maintaining central coordination and quality standards.
            </p>
            <ul className="mt-5 space-y-2">
              {expertNetwork.map((item) => (
                <li key={item} className="border-l-2 border-orange/70 pl-4 text-sm text-muted">{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">Strategic partnerships</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Collaboration that expands impact</h2>
            <p className="mt-3 leading-relaxed text-muted">
              The Academy builds appropriate relationships that strengthen service delivery, access to expertise, educational opportunities, research, professional development, and international reach.
            </p>
            <ul className="mt-5 space-y-2">
              {strategicPartners.map((item) => (
                <li key={item} className="border-l-2 border-blue/50 pl-4 text-sm text-muted">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <section className="bg-paper-deep">
        <Section>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">Legal identity</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">Registered in Nigeria</h2>
          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info label="Registered company name" value={academy.legalName} />
            <Info label="Registration number (RC)" value={academy.rc} />
            <Info label="Tax identification number" value={academy.tin} />
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-muted">Registered business address</dt>
              <dd className="mt-1">
                <a href={academy.mapsUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-ink underline-offset-2 hover:underline hover:text-blue">
                  {academy.registeredAddress}
                </a>
              </dd>
            </div>
            <Info label="Legal form" value="Private company limited by shares, incorporated under CAMA" />
          </dl>
          <p className="mt-6 max-w-3xl text-sm leading-relaxed text-muted">
            The Company is established to provide multidisciplinary educational, research,
            consultancy, professional development, organisational development, language education,
            mentorship, guidance and counselling, study-abroad advisory, and related professional
            services. Additional licences or accreditations required by law are obtained before
            undertaking specifically regulated activities.
          </p>
        </Section>
      </section>

      <Section className="pt-0">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">Frequently asked questions</p>
        <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">How the Academy platform works</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {companyFaq.map(([q,a]) => <details key={q} className="rounded-2xl border border-line bg-cream p-5"><summary className="cursor-pointer font-display text-lg font-semibold">{q}</summary><p className="mt-3 text-sm leading-relaxed text-muted">{a}</p></details>)}
        </div>
      </Section>

      <Section>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">Commitment</p>
        <h2 className="mt-2 font-display text-3xl font-semibold">What you can hold us to</h2>
        <ul className="mt-6 space-y-3">
          {commitments.map((c) => (
            <li key={c} className="border-l-2 border-orange pl-4 text-muted">{c}</li>
          ))}
        </ul>
        <Button asChild className="mt-8" variant="navy">
          <Link to="/services">Explore services</Link>
        </Button>
      </Section>
    </>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-cream px-4 py-4 shadow-card">
      <dt className="text-xs font-medium uppercase tracking-wider text-muted">{label}</dt>
      <dd className="mt-1 font-medium text-ink">{value}</dd>
    </div>
  );
}
