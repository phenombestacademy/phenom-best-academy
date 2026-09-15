import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { BrandWordmark } from "@/components/brand-mark";
import { ServiceIcon } from "@/components/service-icon";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/page-hero";
import { academy, founder, mission, services, values, whyChoose } from "@/lib/academy";

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
          <BrandWordmark className="h-16 sm:h-[4.5rem]" />
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Multidisciplinary academy · Lagos, Nigeria
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-[2.35rem] font-semibold leading-[1.08] text-cream sm:text-6xl">
            {academy.motto}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ivory/80">
            {academy.tagline} Education, languages, leadership, research, digital learning, consultancy, and professional
            services for people and institutions who intend to matter.
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

      <Section>
        <HeaderBlock
          kicker="What we do"
          title="Interconnected service areas"
          lede="One academy. The person as learner, professional, leader, and developing human being — and the organisations that need them to grow."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.id}
              to="/services/$slug"
              params={{ slug: s.id }}
              className="group flex flex-col rounded-2xl bg-cream p-5 shadow-card transition-[box-shadow,transform] duration-200 hover:shadow-card-hover"
            >
              <span className="flex size-11 items-center justify-center rounded-lg bg-paper-deep text-blue">
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
            <h2 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{founder.name}</h2>
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
