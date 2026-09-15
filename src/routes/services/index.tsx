import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/page-hero";
import { ServiceIcon } from "@/components/service-icon";
import { services } from "@/lib/academy";

export const Route = createFileRoute("/services/")({ component: ServicesIndex });

function ServicesIndex() {
  return (
    <>
      <PageHero
        kicker="Services"
        title="Education, development, and professional practice — under one roof."
        lede="Each service area has a defined purpose, audience, and delivery model. Together they form a continuous development platform rather than a conventional school."
      />
      <Section>
        <div className="grid gap-5">
          {services.map((s) => (
            <Link
              key={s.id}
              to="/services/$slug"
              params={{ slug: s.id }}
              className="group grid gap-4 rounded-2xl bg-cream p-5 shadow-card transition-[box-shadow] duration-200 hover:shadow-card-hover sm:grid-cols-[auto_1fr_auto] sm:items-start sm:p-7"
            >
              <span className="flex size-12 items-center justify-center rounded-lg bg-paper-deep text-blue">
                <ServiceIcon name={s.icon} className="size-6" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange">
                  {s.kicker}
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">{s.title}</h2>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
                  {s.summary}
                </p>
              </div>
              <span className="inline-flex items-center gap-1 self-center text-sm font-medium text-orange">
                Details
                <ArrowRight className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
