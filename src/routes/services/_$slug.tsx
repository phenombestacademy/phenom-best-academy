import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, ChevronDown } from "lucide-react";
import { PageHero, Section } from "@/components/page-hero";
import { ServiceIcon } from "@/components/service-icon";
import { Button } from "@/components/ui/button";
import { serviceById, services } from "@/lib/academy";

export const Route = createFileRoute("/services/$slug")({
  component: ServiceDetail,
});

function ServiceDetail() {
  const { slug } = Route.useParams();
  const service = serviceById(slug);
  if (!service) throw notFound();

  const others = services.filter((s) => s.id !== service.id).slice(0, 3);
  const visibleOfferings = service.offerings.slice(0, 4);
  const additionalOfferings = service.offerings.slice(4);

  return (
    <>
      <PageHero kicker="Service" title={service.title} lede={service.summary}>
        <div className="mt-6 flex items-center gap-3 text-ivory/70">
          <span className="flex size-10 items-center justify-center rounded-lg bg-navy-mid text-gold">
            <ServiceIcon name={service.icon} />
          </span>
          <p className="text-sm italic">{service.kicker}</p>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-9 lg:col-span-8">
            <Block title="About this service" body={service.summary} />
            <Block title="Who it is for" body={service.audience} />

            <div>
              <h2 className="font-display text-2xl font-semibold">What is included</h2>
              <p className="mt-2 leading-relaxed text-muted">
                The scope can be tailored to the learner, professional, organisation, or project. Key areas include:
              </p>
              <ul className="mt-5 space-y-3">
                {visibleOfferings.map((item) => (
                  <li key={item} className="border-l-2 border-orange/70 pl-4 leading-relaxed text-muted">
                    {item}
                  </li>
                ))}
              </ul>

              {additionalOfferings.length > 0 ? (
                <details className="group mt-4 rounded-xl border border-line bg-cream px-4 py-3 shadow-card">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink marker:hidden">
                    <span>See the full service scope</span>
                    <ChevronDown className="size-4 shrink-0 text-orange transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="mt-4 space-y-3 border-t border-line pt-4">
                    {additionalOfferings.map((item) => (
                      <li key={item} className="border-l-2 border-orange/50 pl-4 leading-relaxed text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </div>

            <div>
              <h2 className="font-display text-2xl font-semibold">Common requests</h2>
              <p className="mt-2 leading-relaxed text-muted">
                You can select a specific need when making an enquiry, or describe a customised requirement for the Academy to assess.
              </p>
              <details className="group mt-4 rounded-xl border border-line bg-cream px-4 py-3 shadow-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink marker:hidden">
                  <span>View enquiry options</span>
                  <ChevronDown className="size-4 shrink-0 text-orange transition-transform group-open:rotate-180" />
                </summary>
                <ul className="mt-4 grid gap-2 border-t border-line pt-4 sm:grid-cols-2">
                  {service.enquiryOptions.map((item) => (
                    <li key={item} className="rounded-lg bg-paper px-3 py-2 text-sm leading-relaxed text-ink-soft">
                      {item}
                    </li>
                  ))}
                </ul>
              </details>
            </div>

            <div>
              <h2 className="font-display text-2xl font-semibold">How it is delivered</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {service.delivery.map((item) => (
                  <li key={item} className="rounded-xl bg-cream px-4 py-3 leading-relaxed text-ink-soft shadow-card">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <Block title="What you can expect" body={service.outcome} />
          </div>

          <aside className="lg:col-span-4">
            <div className="rounded-2xl bg-navy p-6 text-cream lg:sticky lg:top-24">
              <p className="font-display text-2xl font-semibold text-cream">Begin this conversation</p>
              <p className="mt-2 leading-relaxed text-ivory/75">
                Tell us who you are, what you need, and what you hope to achieve. We will respond with a clear next step and a suitable approach.
              </p>
              <Button asChild className="mt-5 w-full">
                <Link to="/enquire" search={{ service: service.id }}>
                  Enquire about this service
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Link
                to="/path"
                className="mt-3 block text-center text-sm text-ivory/70 hover:text-cream"
              >
                Or find your path first
              </Link>
            </div>
          </aside>
        </div>
      </Section>

      <Section className="pt-0">
        <h2 className="font-display text-2xl font-semibold">Other services</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {others.map((s) => (
            <Link
              key={s.id}
              to="/services/$slug"
              params={{ slug: s.id }}
              className="rounded-xl border border-line bg-cream p-4 hover:border-blue/40"
            >
              <p className="font-display text-lg font-semibold">{s.title}</p>
              <p className="mt-1 line-clamp-2 text-sm text-muted">{s.summary}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
      <p className="mt-3 leading-relaxed text-muted">{body}</p>
    </div>
  );
}
