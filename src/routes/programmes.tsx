import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PageHero, Section } from "@/components/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  academicLevels,
  africanLanguages,
  examinations,
  globalLanguages,
  subjectAreas,
} from "@/lib/academy";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/programmes")({ component: Programmes });

type Tab = "languages" | "academic" | "exams";

function Programmes() {
  const [tab, setTab] = useState<Tab>("languages");

  return (
    <>
      <PageHero
        kicker="Programmes"
        title="Languages, academic mastery, and examination pathways."
        lede="Browse what we teach. Then enquire — or use Find your path if you would rather be guided."
      />

      <Section className="pb-4">
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["languages", "Languages"],
              ["academic", "Academic support"],
              ["exams", "Examinations"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "h-11 rounded-full px-4 text-sm font-medium transition-colors duration-150",
                tab === id ? "bg-navy text-cream" : "bg-cream text-ink-soft shadow-card",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </Section>

      {tab === "languages" ? (
        <Section className="pt-4">
          <h2 className="font-display text-3xl font-semibold">African languages</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Strengthening heritage, identity, and intercultural understanding — taught with
            authentic linguistic expertise from our global instructional network.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {africanLanguages.map((lang) => (
              <Badge key={lang} className="px-4 py-2 text-sm">
                {lang}
              </Badge>
            ))}
          </div>

          <h2 className="mt-12 font-display text-3xl font-semibold">Global languages</h2>
          <p className="mt-2 max-w-2xl text-muted">
            English and world languages for academic advancement, professional mobility, and
            international engagement. Other languages may be offered on request.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {globalLanguages.map((lang) => (
              <Badge key={lang} className="border-blue/20 bg-cream px-4 py-2 text-sm">
                {lang}
              </Badge>
            ))}
          </div>

          <Button asChild className="mt-10">
            <Link to="/enquire" search={{ service: "language-education" }}>
              Enquire about language education
            </Link>
          </Button>
        </Section>
      ) : null}

      {tab === "academic" ? (
        <Section className="pt-4">
          <h2 className="font-display text-3xl font-semibold">Levels served</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {academicLevels.map((level) => (
              <article key={level.title} className="rounded-2xl bg-cream p-5 shadow-card">
                <h3 className="font-display text-xl font-semibold">{level.title}</h3>
                <p className="mt-2 text-sm text-muted">{level.body}</p>
              </article>
            ))}
          </div>
          <h2 className="mt-12 font-display text-3xl font-semibold">Subject mastery</h2>
          <ul className="mt-5 grid gap-2 sm:grid-cols-2">
            {subjectAreas.map((s) => (
              <li key={s} className="rounded-xl border border-line bg-cream px-4 py-3 text-sm">
                {s}
              </li>
            ))}
          </ul>
          <Button asChild className="mt-10">
            <Link to="/enquire" search={{ service: "academic-support" }}>
              Enquire about academic support
            </Link>
          </Button>
        </Section>
      ) : null}

      {tab === "exams" ? (
        <Section className="pt-4">
          <h2 className="font-display text-3xl font-semibold">Examination preparation</h2>
          <p className="mt-2 max-w-2xl text-muted">
            Structured coaching for major national and international assessments, with emphasis on
            conceptual understanding, examination technique, and confidence.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {examinations.map((exam) => (
              <div
                key={exam}
                className="flex min-h-16 items-center justify-center rounded-xl bg-cream px-3 text-center text-sm font-medium shadow-card"
              >
                {exam}
              </div>
            ))}
          </div>
          <Button asChild className="mt-10">
            <Link to="/enquire" search={{ service: "academic-support" }}>
              Enquire about exam preparation
            </Link>
          </Button>
        </Section>
      ) : null}
    </>
  );
}
