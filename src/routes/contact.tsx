import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
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
          <div className="flex items-start gap-4 rounded-2xl bg-cream p-5 shadow-card">
            <span className="flex size-11 items-center justify-center rounded-lg bg-paper-deep text-blue">
              <MapPin className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted">Location</p>
              <p className="mt-1 font-medium">{academy.location}</p>
              <p className="mt-1 text-sm text-muted">
                Services are delivered online, virtually, and on-site as the engagement requires.
              </p>
            </div>
          </div>
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
