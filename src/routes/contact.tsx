import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageHero, Section } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { academy } from "@/lib/academy";

export const Route = createFileRoute("/contact")({ component: Contact });

function Contact() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="A direct line to the Academy."
        lede="Write, call, or send a WhatsApp message. For programme matching, use Find your path or the enquiry form."
      />
      <Section>
        <div className="grid gap-4 sm:grid-cols-2">
          {academy.emails.map((email) => (
            <a
              key={email}
              href={`mailto:${email}`}
              className="flex items-start gap-4 rounded-2xl bg-cream p-5 shadow-card"
            >
              <span className="flex size-11 items-center justify-center rounded-lg bg-paper-deep text-blue">
                <Mail className="size-5" />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Email
                </span>
                <span className="mt-1 block font-medium">{email}</span>
              </span>
            </a>
          ))}
          {academy.phones.map((p) => (
            <a
              key={p.href}
              href={p.href}
              className="flex items-start gap-4 rounded-2xl bg-cream p-5 shadow-card"
            >
              <span className="flex size-11 items-center justify-center rounded-lg bg-paper-deep text-blue">
                <Phone className="size-5" />
              </span>
              <span>
                <span className="block text-xs font-semibold uppercase tracking-wider text-muted">
                  Telephone
                </span>
                <span className="mt-1 block font-medium">{p.display}</span>
              </span>
            </a>
          ))}
          <a
            href={academy.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-4 rounded-2xl bg-cream p-5 shadow-card transition-colors hover:border-blue/40 hover:bg-white"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-paper-deep text-blue">
              <MapPin className="size-5" />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-muted">Registered business address</span>
              <span className="mt-1 block font-medium">{academy.registeredAddress}</span>
              <span className="mt-2 flex items-center gap-1 text-sm font-medium text-orange">
                View on Google Maps <ExternalLink className="size-3.5" />
              </span>
            </span>
          </a>
          <a
            href={academy.phones[0].wa}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-4 rounded-2xl bg-navy p-5 text-cream shadow-card"
          >
            <span className="flex size-11 items-center justify-center rounded-lg bg-navy-mid text-gold">
              <MessageCircle className="size-5" />
            </span>
            <span>
              <span className="block text-xs font-semibold uppercase tracking-wider text-gold">
                WhatsApp
              </span>
              <span className="mt-1 block font-medium">Message {academy.phones[0].display}</span>
            </span>
          </a>
        </div>

        <div className="mt-8 rounded-2xl border border-line bg-cream p-5 shadow-card">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange">How we operate</p>
          <p className="mt-2 max-w-3xl leading-relaxed text-muted">{academy.serviceDeliveryNote}</p>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link to="/enquire">Make an enquiry</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/path">Find your path</Link>
          </Button>
        </div>

        <p className="mt-10 max-w-2xl text-sm text-muted">
          {academy.legalName} · RC {academy.rc} · TIN {academy.tin}. {academy.copyright}
        </p>
      </Section>
    </>
  );
}
