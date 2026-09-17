import { createFileRoute, Link } from '@tanstack/react-router';
import {
  BookOpen,
  Calculator,
  CreditCard,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  School,
  GraduationCap,
} from 'lucide-react';
import { useEffect } from 'react';
import { logAnalytics } from '@/lib/platform';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/platform')({
  component: PlatformPage,
});

const platformAreas = [
  {
    icon: Calculator,
    title: 'Tools',
    text: 'Calculators, formulas, scanning and practical learning tools.',
    to: '/tools',
    accent: 'text-orange',
  },
  {
    icon: BookOpen,
    title: 'Learn',
    text: 'Courses, resources, CPD and digital learning materials.',
    to: '/media',
    accent: 'text-blue',
  },
  {
    icon: HeartHandshake,
    title: 'Get help',
    text: 'Academy-controlled mentoring, professional services and support.',
    to: '/enquire',
    accent: 'text-green',
  },
  {
    icon: MessageCircle,
    title: 'Connect',
    text: 'A carefully managed environment for future Academy community features.',
    to: '/account',
    accent: 'text-purple',
  },
];

function PlatformPage() {
  useEffect(() => {
    logAnalytics('platform_home_view');
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-line bg-cream shadow-card">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue/10 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-orange/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.35fr_.65fr] lg:p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue/20 bg-blue/5 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue">
              <Sparkles className="size-3.5" />
              Phenom Best Academy digital platform
            </div>

            <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-tight text-ink sm:text-6xl">
              Learn, calculate, create, get help and connect.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
              A growing digital home for Phenom Best Academy services,
              learning resources, practical tools and professionally managed
              support.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/tools">
                  Open Phenom Calculator
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>

              <Button asChild variant="cream">
                <Link to="/cpd">Explore CPD</Link>
              </Button>

              <Button asChild variant="cream">
                <Link to="/account">My account</Link>
              </Button>
            </div>

            <p className="mt-4 max-w-xl text-sm text-muted">
              Public tools remain available without requiring an account.
              Sign in when you need saved features, Academy services or
              account-based access.
            </p>
          </div>

          <div className="flex items-end">
            <div className="w-full rounded-2xl border border-line bg-white/80 p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-orange">
                One Academy · Many pathways
              </p>

              <div className="mt-5 grid gap-3">
                <div className="flex items-start gap-3 rounded-xl bg-blue/5 p-4">
                  <GraduationCap className="mt-0.5 size-5 shrink-0 text-blue" />
                  <div>
                    <p className="font-semibold">Individual learning</p>
                    <p className="mt-1 text-sm text-muted">
                      Learn independently and access Academy resources.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl bg-green/5 p-4">
                  <School className="mt-0.5 size-5 shrink-0 text-green" />
                  <div>
                    <p className="font-semibold">School platform</p>
                    <p className="mt-1 text-sm text-muted">
                      Structured tools and services for schools and learners.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main platform areas */}
      <div className="mt-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-orange">
            Explore the platform
          </p>

          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Everything has a purpose.
          </h2>

          <p className="mt-3 text-muted">
            Move between practical tools, learning, Academy services and
            account features without losing the focus of the main website.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {platformAreas.map((area) => {
            const Icon = area.icon;

            return (
              <Link
                key={area.title}
                to={area.to}
                className="group rounded-2xl border border-line bg-cream p-5 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"
              >
                <div className="flex items-center justify-between">
                  <Icon className={`size-6 ${area.accent}`} />

                  <ArrowRight className="size-4 text-muted transition-transform group-hover:translate-x-1" />
                </div>

                <h3 className="mt-5 font-display text-2xl font-semibold">
                  {area.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted">
                  {area.text}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Safety + premium */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-cream p-6 shadow-card sm:p-7">
          <div className="flex size-11 items-center justify-center rounded-xl bg-green/10">
            <ShieldCheck className="size-6 text-green" />
          </div>

          <h2 className="mt-4 font-display text-2xl font-semibold">
            Safety first
          </h2>

          <p className="mt-3 leading-7 text-muted">
            Google handles Google authentication. Payment providers handle
            card details. The Academy uses privacy-conscious analytics and
            controlled safety processes, with human review for serious cases.
          </p>
        </div>

        <div className="rounded-2xl border border-line bg-cream p-6 shadow-card sm:p-7">
          <div className="flex size-11 items-center justify-center rounded-xl bg-purple/10">
            <CreditCard className="size-6 text-purple" />
          </div>

          <h2 className="mt-4 font-display text-2xl font-semibold">
            Premium when you need it
          </h2>

          <p className="mt-3 leading-7 text-muted">
            Free access remains available. Premium courses, resources,
            subscriptions and pay-per-service Academy assistance can be added
            without turning the public website into a heavy application.
          </p>
        </div>
      </div>

      {/* Academy network */}
      <div className="mt-8 rounded-2xl border border-line bg-cream p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gold/15">
            <Sparkles className="size-6 text-gold" />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              The Academy vision
            </p>

            <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
              A controlled Academy network
            </h2>

            <p className="mt-3 max-w-4xl leading-7 text-muted">
              Community connections can be introduced carefully as the
              platform develops. Mentorship remains assigned and delivered by
              Phenom Best Academy rather than creating uncontrolled
              direct mentor-to-user relationships.
            </p>
          </div>
        </div>
      </div>

      {/* Final navigation */}
      <div className="mt-8 rounded-2xl bg-navy-deep p-6 text-cream sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gold">
              Ready to continue?
            </p>

            <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">
              Choose the part of the Academy you need.
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/tools">Use the tools</Link>
            </Button>

            <Button asChild variant="cream">
              <Link to="/account">Open account</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
