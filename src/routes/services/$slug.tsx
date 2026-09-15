import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
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
          <div className="space-y-8 lg:col-span-8">
            <Block title="Who it is for" body={service.audience} />
            <div>
              <h2 className="font-display text-2xl font-semibold">What is included</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                A focused overview is shown below. Open the full scope when you want to see the complete range of support available in this service area.
              </p>
              <ul className="mt-4 space-y-2">
                {service.offerings.slice(0, 5).map((item) => (
                  <li key={item} className="border-l-2 border-orange/70 pl-4 text-muted">
                    {item}
                  </li>
                ))}
              </ul>
              {service.offerings.length > 5 ? (
                <details className="mt-4 rounded-xl border border-line bg-cream px-4 py-3 shadow-card">
                  <summary className="cursor-pointer list-none font-medium text-blue">
                    <span className="flex items-center justify-between gap-4">
                      See the full service scope <span aria-hidden className="text-orange">+</span>
                    </span>
                  </summary>
                  <ul className="mt-4 space-y-2">
                    {service.offerings.slice(5).map((item) => (
                      <li key={item} className="border-l-2 border-orange/50 pl-4 text-sm leading-relaxed text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">How it is delivered</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {service.delivery.map((item) => (
                  <li key={item} className="rounded-xl bg-cream px-4 py-3 text-sm text-ink-soft shadow-card">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold">Enquiry options</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Select the specific area you need when you make an enquiry. These options help us understand your request and respond more accurately.
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {service.enquiryOptions.slice(0, 8).map((item) => (
                  <li key={item} className="rounded-xl border border-line bg-cream px-4 py-3 text-sm leading-relaxed text-ink-soft">
                    {item}
                  </li>
                ))}
              </ul>
              {service.enquiryOptions.length > 8 ? (
                <details className="mt-3 rounded-xl border border-line bg-cream px-4 py-3 shadow-card">
                  <summary className="cursor-pointer list-none font-medium text-blue">
                    <span className="flex items-center justify-between gap-4">
                      View all enquiry options <span aria-hidden className="text-orange">+</span>
                    </span>
                  </summary>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {service.enquiryOptions.slice(8).map((item) => (
                      <li key={item} className="rounded-lg bg-paper px-3 py-2 text-sm leading-relaxed text-muted">
                        {item}
                      </li>
                    ))}
                  </ul>
                </details>
              ) : null}
            </div>
            <Block title="Outcome" body={service.outcome} />
          </div>
          <aside className="lg:col-span-4">
            <div className="rounded-2xl bg-navy p-6 text-cream">
              <p className="font-display text-2xl font-semibold text-cream">Begin this conversation</p>
              <p className="mt-2 text-sm text-ivory/75">
                Tell us who you are and what you need. We will respond with a clear next step.
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
