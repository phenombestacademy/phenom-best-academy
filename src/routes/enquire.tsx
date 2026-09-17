import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { CheckCircle2 } from "lucide-react";
import { PageHero, Section } from "@/components/page-hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { academy, audiences, serviceById, services } from "@/lib/academy";
import { listEnquiries, saveEnquiry, type Enquiry } from "@/lib/enquiries";

type Search = {
  service?: string;
  audience?: string;
};


export const Route = createFileRoute("/enquire")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    service: typeof raw.service === "string" ? raw.service : undefined,
    audience: typeof raw.audience === "string" ? raw.audience : undefined,
  }),
  component: Enquire,
});

function Enquire() {
  const search = Route.useSearch();
  const [sent, setSent] = useState<Enquiry | null>(null);
  const [error, setError] = useState("");
  const [previous, setPrevious] = useState<Enquiry[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    audience: search.audience ?? "",
    service: search.service ?? "",
    message: "",
  });

  useEffect(() => {
    setPrevious(listEnquiries());
  }, [sent]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (form.phone.trim().length < 7) {
      setError("Please enter a telephone number.");
      return;
    }
    if (!form.audience) {
      setError("Please tell us who you are.");
      return;
    }
    if (!form.service) {
      setError("Please select a service.");
      return;
    }
    if (form.message.trim().length < 12) {
      setError("Please add a short note about what you need.");
      return;
    }
    const optionsNote =
      selectedOptions.length > 0
        ? `\n\nSelected service interests:\n${selectedOptions.map((item) => `• ${item}`).join("\n")}`
        : "";
    const item = saveEnquiry({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      audience: form.audience,
      service: form.service,
      message: `${form.message.trim()}${optionsNote}`,
    });
    setSent(item);
  }

  if (sent) {
    const svc = serviceById(sent.service);
    const mail = academy.emails[0];
    const subject = encodeURIComponent(`Enquiry ${sent.id} — ${svc?.title ?? sent.service}`);
    const body = encodeURIComponent(
      `Reference: ${sent.id}\nName: ${sent.name}\nPhone: ${sent.phone}\nAudience: ${sent.audience}\nService: ${svc?.title ?? sent.service}\n\n${sent.message}`,
    );
    const wa = academy.phones[0].wa;
    const whatsappBody = encodeURIComponent(
      `Hello Phenom Best Academy. I am following up on enquiry ${sent.id}.\n\nName: ${sent.name}\nPhone: ${sent.phone}\nEmail: ${sent.email}\nAudience: ${sent.audience}\nService: ${svc?.title ?? sent.service}\n\n${sent.message}`,
    );
    const whatsappHref = `${wa}?text=${whatsappBody}`;
    return (
      <>
        <PageHero kicker="Enquiry received" title="Thank you. We have your request." />
        <Section>
          <div className="mx-auto max-w-lg rounded-2xl bg-cream p-6 text-center shadow-card sm:p-8">
            <CheckCircle2 className="mx-auto size-10 text-green" strokeWidth={1.6} />
            <p className="mt-4 font-display text-2xl font-semibold">Reference {sent.id}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Saved on this device. For a direct line to the Academy, send the same details by
              email or WhatsApp — our team will respond with a clear next step.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Button asChild>
                <a href={`mailto:${mail}?subject=${subject}&body=${body}`}>Email this enquiry</a>
              </Button>
              {wa ? (
                <Button asChild variant="navy">
                  <a href={whatsappHref} target="_blank" rel="noreferrer">
                    WhatsApp the Academy
                  </a>
                </Button>
              ) : null}
              <Button asChild variant="outline">
                <Link to="/">Return home</Link>
              </Button>
            </div>
          </div>
        </Section>
      </>
    );
  }

  return (
    <>
      <PageHero
        kicker="Enquire"
        title="Tell us what you need."
        lede="Share a few details. We will match you with the right conversation — including education, professional development, consultancy, research, digital learning, counselling, study abroad, faith-based content, and music/creative development."
      />
      <Section>
        <form onSubmit={onSubmit} className="mx-auto grid max-w-xl gap-4">
          <Field label="Full name">
            <Input
              name="name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </Field>
          <Field label="Email">
            <Input
              type="email"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </Field>
          <Field label="Telephone">
            <Input
              type="tel"
              name="phone"
              autoComplete="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </Field>
          <Field label="I am a">
            <Select
              value={form.audience}
              onChange={(v) => setForm({ ...form, audience: v })}
              options={audiences.map((a) => ({ value: a.id, label: a.label }))}
              placeholder="Select…"
            />
          </Field>
          <Field label="Service of interest">
            <Select
              value={form.service}
              onChange={(v) => { setForm({ ...form, service: v }); setSelectedOptions([]); }}
              options={services.map((s) => ({ value: s.id, label: s.title }))}
              placeholder="Select a service…"
            />
          </Field>
          {serviceById(form.service)?.enquiryOptions.length ? (
            <fieldset className="grid gap-2 rounded-xl border border-line bg-cream p-4">
              <legend className="px-1 text-sm font-medium">What specifically are you interested in?</legend>
              <p className="text-xs leading-relaxed text-muted">Select any that apply. You can also describe a fully customised request below.</p>
              {serviceById(form.service)?.enquiryOptions.map((option) => (
                <label key={option} className="flex cursor-pointer items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option)}
                    onChange={(e) =>
                      setSelectedOptions((current) =>
                        e.target.checked ? [...current, option] : current.filter((item) => item !== option),
                      )
                    }
                    className="mt-0.5 size-4 accent-[currentColor]"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </fieldset>
          ) : null}
          <Field label="How can we help?">
            <Textarea
              name="message"
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            />
          </Field>
          {error ? <p className="text-sm text-orange-deep">{error}</p> : null}
          <Button type="submit" size="lg" className="mt-2">
            Submit enquiry
          </Button>
          <p className="text-xs text-muted">
            Enquiries are stored on this device so you can keep a record. Email or WhatsApp us to
            reach the Academy directly.
          </p>
        </form>

        {previous.length > 0 ? (
          <div className="mx-auto mt-12 max-w-xl">
            <h2 className="font-display text-2xl font-semibold">Previous enquiries on this device</h2>
            <ul className="mt-4 space-y-2">
              {previous.slice(0, 5).map((item) => (
                <li key={item.id} className="rounded-xl border border-line bg-cream px-4 py-3 text-sm">
                  <span className="font-medium">{item.id}</span>
                  <span className="text-muted">
                    {" "}
                    · {serviceById(item.service)?.title ?? item.service}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Section>
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-11 w-full rounded-md border border-line bg-cream px-3.5 text-[0.9375rem] text-ink outline-none focus-visible:border-blue focus-visible:ring-2 focus-visible:ring-ring/30"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
