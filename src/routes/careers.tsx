import { createFileRoute, Link } from "@tanstack/react-router";
import { FileUp, Mail } from "lucide-react";
import { useState } from "react";
import { PageHero, Section } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { academy } from "@/lib/academy";

export const Route = createFileRoute("/careers")({ component: Careers });

function Careers() {
  const mail = academy.emails[0];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [interest, setInterest] = useState("");
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<string[]>([]);

  const subject = encodeURIComponent("Career or Opportunity Enquiry — Phenom Best Academy");
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\nArea of interest: ${interest}\n\n${message}\n\nSelected documents: ${files.length ? files.join(", ") : "None selected"}`,
  );

  return (
    <>
      <PageHero
        kicker="Careers & opportunities"
        title="Interested in working with Phenom Best Academy?"
        lede="We welcome enquiries from educators, facilitators, researchers, consultants, creative professionals, administrators, and other specialists who would like to contribute to future opportunities."
      />
      <Section>
        <div className="mx-auto max-w-2xl">
          <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid gap-1.5">
              <Label htmlFor="applicant-name">Full name</Label>
              <Input id="applicant-name" name="name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="applicant-email">Email</Label>
              <Input id="applicant-email" name="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="opportunity">Area of interest</Label>
              <Input id="opportunity" name="opportunity" placeholder="e.g. teaching, research, music, consultancy" value={interest} onChange={(e) => setInterest(e.target.value)} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="documents">CV or supporting documents</Label>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-line bg-cream px-4 py-4 text-sm text-muted hover:border-ink-soft">
                <FileUp className="size-5 shrink-0" />
                <span>{files.length ? `${files.length} document${files.length > 1 ? "s" : ""} selected` : "Choose files"}</span>
                <input
                  id="documents"
                  name="documents"
                  type="file"
                  multiple
                  className="sr-only"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((file) => file.name))}
                />
              </label>
              {files.length ? <p className="text-xs text-muted">{files.join(" · ")}</p> : null}
              <p className="text-xs leading-relaxed text-muted">
                This website version prepares the application details but does not upload attachments to a server yet. After opening your email app, attach the selected documents to the email before sending.
              </p>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="application-message">Brief message</Label>
              <Textarea id="application-message" name="message" placeholder="Tell us about your skills, experience, and the opportunity you are interested in." value={message} onChange={(e) => setMessage(e.target.value)} />
            </div>
            <Button asChild size="lg" className="mt-2">
              <a href={`mailto:${mail}?subject=${subject}&body=${body}`}>
                <Mail className="size-4" />
                Email your application
              </a>
            </Button>
          </form>
          <div className="mt-8 rounded-2xl bg-cream p-5 text-sm leading-relaxed text-muted">
            <strong className="text-ink">Secure upload can be added later:</strong> when you are ready, we can connect this application area to a proper document-storage and notification service so applicants can upload CVs and supporting documents directly.
          </div>
          <Button asChild variant="outline" className="mt-5">
            <Link to="/enquire">Make a service enquiry instead</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
