import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { PageHero, Section } from "@/components/page-hero";
import { ServiceIcon } from "@/components/service-icon";
import { Button } from "@/components/ui/button";
import { audiences, needs, serviceById, type ServiceId } from "@/lib/academy";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/path")({ component: PathFinder });

function PathFinder() {
  const [audience, setAudience] = useState<string>("");
  const [need, setNeed] = useState<string>("");

  const selectedNeed = needs.find((n) => n.id === need);
  const service = selectedNeed ? serviceById(selectedNeed.service) : undefined;
  const audienceLabel = audiences.find((a) => a.id === audience)?.label;

  return (
    <>
      <PageHero
        kicker="Find your path"
        title="Two questions. A clear recommendation."
        lede="Tell us who you are and what you need. We will match you to a service area and prepare an enquiry."
      />

      <Section>
        <ol className="grid gap-8 lg:grid-cols-2">
          <li>
            <Step n={1} title="I am a…" />
            <div className="mt-4 grid gap-2">
              {audiences.map((a) => (
                <Choice
                  key={a.id}
                  selected={audience === a.id}
                  onClick={() => setAudience(a.id)}
                  label={a.label}
                />
              ))}
            </div>
          </li>
          <li>
            <Step n={2} title="I need…" />
            <div className="mt-4 grid gap-2">
              {needs.map((n) => (
                <Choice
                  key={n.id}
                  selected={need === n.id}
                  onClick={() => setNeed(n.id)}
                  label={n.label}
                />
              ))}
            </div>
          </li>
        </ol>

        {service ? (
          <div className="mt-10 rounded-2xl bg-navy p-6 text-cream sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
              Recommended
            </p>
            <div className="mt-3 flex items-start gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-navy-mid text-gold">
                <ServiceIcon name={service.icon} className="size-6" />
              </span>
              <div>
                <h2 className="font-display text-3xl font-semibold text-cream">{service.title}</h2>
                <p className="mt-2 max-w-2xl text-ivory/80">{service.summary}</p>
                {audienceLabel ? (
                  <p className="mt-3 text-sm text-ivory/60">Matched for {audienceLabel}.</p>
                ) : (
                  <p className="mt-3 text-sm text-ivory/60">Select who you are to personalise the enquiry.</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link
                  to="/enquire"
                  search={{
                    service: service.id as ServiceId,
                    audience: audience || undefined,
                  }}
                >
                  Continue to enquiry
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="cream">
                <Link to="/services/$slug" params={{ slug: service.id }}>
                  Read about this service
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <p className="mt-10 text-sm text-muted">Select a need to see a recommendation.</p>
        )}
      </Section>
    </>
  );
}

function Step({ n, title }: { n: number; title: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="font-display text-3xl font-semibold text-orange">{n}</span>
      <h2 className="font-display text-2xl font-semibold">{title}</h2>
    </div>
  );
}

function Choice({
  selected,
  onClick,
  label,
}: {
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "min-h-12 rounded-xl px-4 text-left text-sm font-medium transition-colors duration-150",
        selected ? "bg-navy text-cream" : "bg-cream text-ink shadow-card hover:bg-paper-deep",
      )}
    >
      {label}
    </button>
  );
}
