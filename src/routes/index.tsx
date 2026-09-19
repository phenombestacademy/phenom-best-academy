import { createFileRoute, Link } from "@tanstack/react-router";\nimport { useState } from "react";
import { ArrowRight, Check, Maximize2, X } from "lucide-react";
import { BrandFull, BrandWordmark } from "@/components/brand-mark";
import { ServiceIcon } from "@/components/service-icon";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/page-hero";
import { academy, faqs, founder, mission, services, values, whyChoose } from "@/lib/academy";

const serviceAccents = ["blue", "green", "orange", "purple", "gold"] as const;

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep text-cream">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-10 h-80 w-80 opacity-25 sm:right-6 sm:h-[28rem] sm:w-[28rem] sm:opacity-30"
        >
          <img src="/brand/mark-clear.png" alt="" className="h-full w-full object-contain" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20">
          <div className="w-fit max-w-full rounded-xl bg-cream p-2 shadow-card"><BrandFull className="max-w-[25rem] sm:max-w-[31rem]" /></div>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Multidisciplinary academy, based in Lagos, Nigeria
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-[2.35rem] font-semibold leading-[1.08] text-cream sm:text-6xl">
            {academy.motto}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ivory/90 sm:text-xl">
            Phenom Best Academy is a multidisciplinary, knowledge-driven and human-centred institution providing education,
            professional development, research, consultancy, leadership, language, mentorship, and related knowledge-based
            services. We help individuals and organisations build capability, strengthen performance, and create meaningful impact.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link to="/enquire">
                Make an enquiry
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="cream">
              <Link to="/path">Find your path</Link>
            </Button>
          </div>
          <p className="mt-8 text-xs tracking-wide text-ivory/55">
            {academy.legalName} · RC {academy.rc} · Incorporated under CAMA
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-cream">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:grid-cols-3 sm:px-6">
          <Stat label="Years of educational leadership" value="20+" />
          <Stat label="Core service areas" value={String(services.length)} />
          <Stat label="Languages offered" value="18+" />
        </div>
      </section>

      <AthleticsSpotlight />

      <Section>
        <HeaderBlock
          kicker="What we do"
          title="Interconnected service areas"
          lede="One academy. The person as learner, professional, leader, and developing human being — and the organisations that need them to grow."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, index) => (
            <Link
              key={s.id}
              to="/services/$slug"
              params={{ slug: s.id }}
              className={`group flex flex-col rounded-2xl border-t-4 bg-cream p-5 shadow-card transition-[box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-card-hover service-accent-${serviceAccents[index % serviceAccents.length]}`}
            >
              <span className={`flex size-11 items-center justify-center rounded-lg bg-paper-deep service-icon-${serviceAccents[index % serviceAccents.length]}`}>
                <ServiceIcon name={s.icon} />
              </span>
              <h3 className="mt-4 font-display text-2xl font-semibold leading-snug">{s.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{s.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-orange">
                View service
                <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <HeaderBlock
          kicker="Our knowledge and creative arms"
          title="Two specialist identities under the Academy"
          lede="Phenom Best Academy brings its wider knowledge and creative work together through two complementary service identities."
        />
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {academy.brands.map((brand, index) => (
            <div key={brand.name} className={`rounded-2xl border-l-4 bg-cream p-6 shadow-card service-accent-${index === 0 ? "gold" : "purple"}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange">Phenom Best Academy</p>
              <h3 className="mt-2 font-display text-2xl font-semibold">{brand.name}</h3>
              <p className="mt-1 font-medium text-blue">{brand.descriptor}</p>
              <p className="mt-3 leading-relaxed text-muted">{brand.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <section className="bg-navy text-cream">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Start here</p>
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">
              Not sure which programme you need?
            </h2>
            <p className="mt-3 text-ivory/80">
              Answer two questions. We will point you to the right service and open an enquiry
              already framed for our team.
            </p>
          </div>
          <Button asChild size="lg" variant="primary">
            <Link to="/path">
              Find your path
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Section>
        <HeaderBlock
          kicker="Why Phenom Best"
          title="A credible, multidisciplinary academy"
          lede={mission}
        />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {whyChoose.map((item) => (
            <li key={item.title} className="flex gap-3 rounded-2xl bg-cream p-5 shadow-card">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-green/10 text-green">
                <Check className="size-3.5" strokeWidth={2.4} />
              </span>
              <div>
                <h3 className="font-display text-xl font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section className="pt-0">
        <HeaderBlock kicker="Character" title="What we hold to" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {values.map((v) => (
            <div key={v.id} className="rounded-xl border border-line bg-cream px-4 py-5">
              <p className="font-display text-lg font-semibold leading-snug">{v.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">{v.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pt-0">
        <HeaderBlock
          kicker="Questions & answers"
          title="A few things visitors often ask"
          lede="Clear answers to common questions about the Academy, its services, and how we can work with individuals and organisations."
        />
        <div className="mt-8 grid gap-3">
          {faqs.map((item) => (
            <details key={item.question} className="group rounded-2xl border border-line bg-cream px-5 py-4 shadow-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-xl font-semibold">
                <span>{item.question}</span>
                <span aria-hidden className="text-orange transition-transform group-open:rotate-45 text-2xl leading-none">+</span>
              </summary>
              <p className="mt-3 max-w-3xl leading-relaxed text-muted">{item.answer}</p>
            </details>
          ))}
        </div>
      </Section>

      <section className="border-t border-line bg-cream">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <img
              src={founder.photo}
              alt={founder.name}
              className="aspect-[4/5] w-full max-w-sm rounded-2xl object-cover object-top shadow-card outline outline-1 -outline-offset-1 outline-ink/10"
            />
          </div>
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">Leadership</p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold sm:text-4xl">{founder.name}</h2>
            <p className="mt-1 text-sm font-medium text-blue">{founder.role}</p>
            <p className="mt-4 max-w-prose leading-relaxed text-muted">{founder.profile}</p>
            <Button asChild className="mt-6" variant="navy">
              <Link to="/leadership">
                Meet the founder
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

function AthleticsSpotlight() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section className="border-b border-line bg-paper">
        <div className="mx-auto flex max-w-6xl items-center gap-5 px-4 py-5 sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="group relative size-20 shrink-0 overflow-hidden rounded-2xl border border-line bg-cream shadow-card outline-none ring-offset-2 focus-visible:ring-2 focus-visible:ring-blue"
            aria-label="View Phenom Best Academy athletics recognition image"
          >
            <img
              src="/brand/phenom-athletics-award.png"
              alt="Phenom Best Academy athletics recognition"
              className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
            <span className="absolute bottom-1 right-1 flex size-7 items-center justify-center rounded-full bg-navy-deep/90 text-cream">
              <Maximize2 className="size-3.5" aria-hidden />
            </span>
          </button>
          <div className="min-w-0">
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-green">
              Recognition &amp; achievement
            </p>
            <p className="mt-1 font-display text-xl font-semibold leading-tight sm:text-2xl">
              Excellence beyond the classroom
            </p>
            <p className="mt-1 text-sm text-muted">
              A compact visual spotlight — tap the image to view it larger.
            </p>
          </div>
        </div>
      </section>

      {open ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-deep/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Athletics recognition image"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative max-h-[92vh] max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <img
              src="/brand/phenom-athletics-award.png"
              alt="Phenom Best Academy athletics recognition"
              className="max-h-[88vh] w-auto max-w-[92vw] object-contain"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 flex size-10 items-center justify-center rounded-full bg-navy-deep/90 text-cream ring-offset-2 focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close enlarged image"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center sm:text-left">
      <p className="font-display text-3xl font-semibold text-navy">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}

function HeaderBlock({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-orange">{kicker}</p>
      <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">{title}</h2>
      {lede ? <p className="mt-3 leading-relaxed text-muted">{lede}</p> : null}
    </div>
  );
}
