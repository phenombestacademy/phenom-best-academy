import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Calculator,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  GraduationCap,
  Landmark,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getMyActiveSubscriptions,
  getMyProfile,
  type ActiveSubscription,
  type Profile,
} from '@/lib/platform';

export const Route = createFileRoute('/subscriptions')({
  component: SubscriptionsPage,
});

type Tier = {
  name: string;
  schoolAdmin: number;
  learner: number;
  teaching: number;
  nonTeaching: number;
};

type Product = {
  name: string;
  description: string;
  code: string;
  label: string;
};

const tiers: Tier[] = [
  {
    name: 'Premium Level 1',
    schoolAdmin: 50000,
    learner: 15000,
    teaching: 20000,
    nonTeaching: 15000,
  },
  {
    name: 'Premium Level 2',
    schoolAdmin: 100000,
    learner: 25000,
    teaching: 35000,
    nonTeaching: 25000,
  },
  {
    name: 'Premium Level 3',
    schoolAdmin: 175000,
    learner: 40000,
    teaching: 50000,
    nonTeaching: 40000,
  },
];

const serviceProducts: Product[] = [
  {
    name: 'School Full Platform Premium',
    description:
      'A structured school environment covering staff and classes, assignments, CBT, attendance, results, report cards, finance, HR and controlled school data.',
    code: 'school-premium',
    label: 'School platform',
  },
  {
    name: 'Individual Premium',
    description:
      'Expanded learning tools, premium work, authorised resources, Smart Tools and eligible Academy services for individual users.',
    code: 'individual-premium',
    label: 'Individual',
  },
  {
    name: 'Organisation Premium',
    description:
      'A controlled assessment, training and learning environment designed for organisations and institutional programmes.',
    code: 'organisation-premium',
    label: 'Organisation',
  },
  {
    name: 'Academy Service Deposit',
    description:
      'A deposit for an approved Academy service enquiry, professional assistance or other authorised service.',
    code: 'academy-service-deposit',
    label: 'Academy service',
  },
  {
    name: 'Professional Programme',
    description:
      'Custom training, workshops, consultancy or other professionally delivered Academy programmes.',
    code: 'professional-programme',
    label: 'Professional',
  },
];

const individualSubscriptions = [
  {
    name: 'Individual Premium',
    text: 'Personal learning, Smart Tools, resources and eligible premium services.',
    accent: 'bg-orange/10 text-orange',
  },
  {
    name: 'Teacher & Educator Development',
    text: 'CPD, educator learning and professional development.',
    accent: 'bg-blue/10 text-blue',
  },
  {
    name: 'Teen & Youth',
    text: 'Age-aware learning, life skills and personal development.',
    accent: 'bg-purple/10 text-purple',
  },
  {
    name: 'NGO & Community',
    text: 'Capacity-building, learning and organisational support.',
    accent: 'bg-green/10 text-green',
  },
  {
    name: 'Faith Learning',
    text: 'Bible study, devotional, leadership and inspirational learning.',
    accent: 'bg-gold/15 text-gold',
  },
  {
    name: 'Language Learning',
    text: 'African and global language learning and development.',
    accent: 'bg-blue/10 text-blue',
  },
];

function formatNaira(amount: number) {
  return `₦${amount.toLocaleString('en-NG')}`;
}

function SubscriptionsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [activeSubscriptions, setActiveSubscriptions] = useState<
    ActiveSubscription[]
  >([]);

  const [tier, setTier] = useState<Tier>(tiers[0]);
  const [learners, setLearners] = useState(20);
  const [teaching, setTeaching] = useState(5);
  const [nonTeaching, setNonTeaching] = useState(3);
  const [calendar, setCalendar] = useState<'term' | 'semester'>('term');
  const [period, setPeriod] = useState<'one' | 'two' | 'year'>('one');

  useEffect(() => {
    void Promise.all([getMyProfile(), getMyActiveSubscriptions()])
      .then(([nextProfile, subscriptions]) => {
        setProfile(nextProfile);
        setActiveSubscriptions(subscriptions);
      })
      .catch(() => {
        setProfile(null);
        setActiveSubscriptions([]);
      });
  }, []);

  const calculation = useMemo(() => {
    const seatBase =
      learners * tier.learner +
      teaching * tier.teaching +
      nonTeaching * tier.nonTeaching;

    const multiplier =
      period === 'two'
        ? 2
        : period === 'year'
          ? calendar === 'semester'
            ? 2
            : 3
          : 1;

    const administration = tier.schoolAdmin * multiplier;
    const rawSeatCost = seatBase * multiplier;
    const rawTotal = administration + rawSeatCost;

    const seats = learners + teaching + nonTeaching;

    const discount =
      seats >= 100 ? 0.12 : seats >= 50 ? 0.08 : seats >= 20 ? 0.05 : 0;

    const discountedSeatCost = Math.round(
      rawSeatCost * (1 - discount),
    );

    return {
      administration,
      rawSeatCost,
      rawTotal,
      discount,
      total: administration + discountedSeatCost,
      seats,
      multiplier,
    };
  }, [
    calendar,
    learners,
    nonTeaching,
    period,
    teaching,
    tier,
  ]);

  const periodLabel =
    period === 'one'
      ? calendar === 'term'
        ? 'One term'
        : 'One semester'
      : period === 'two'
        ? calendar === 'term'
          ? 'Two terms'
          : 'Two semesters'
        : 'Complete academic year';

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
      {/* Premium hero */}
      <div className="relative overflow-hidden rounded-[2rem] border border-line bg-cream shadow-card">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-purple/10 blur-3xl" />
        <div className="absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-orange/10 blur-3xl" />

        <div className="relative grid gap-8 p-6 sm:p-10 lg:grid-cols-[1.35fr_.65fr] lg:p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange/20 bg-orange/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-orange">
              <Sparkles className="size-3.5" />
              Subscriptions & premium access
            </div>

            <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold leading-tight text-ink sm:text-6xl">
              Choose the Academy service or platform access you need.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">
              Phenom Best Academy keeps useful public tools available while
              providing additional premium learning, school, professional and
              organisational services through verified access.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/payments">
                  View secure payment options
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>

              <Button asChild variant="cream">
                <Link to="/tools">Explore free tools</Link>
              </Button>

              <Button asChild variant="cream">
                <Link to="/account">My account</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-white/80 p-5 backdrop-blur-sm sm:p-6">
            <div className="flex size-12 items-center justify-center rounded-xl bg-blue/10">
              <GraduationCap className="size-6 text-blue" />
            </div>

            <p className="mt-5 text-xs font-bold uppercase tracking-[0.15em] text-blue">
              Access model
            </p>

            <h2 className="mt-2 font-display text-2xl font-semibold">
              Free when you need it. Premium when you need more.
            </h2>

            <div className="mt-5 space-y-3">
              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green" />
                <p className="text-sm leading-6 text-muted">
                  Public tools and selected learning resources remain
                  accessible without premium payment.
                </p>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green" />
                <p className="text-sm leading-6 text-muted">
                  Premium access is attached to verified account
                  entitlements.
                </p>
              </div>

              <div className="flex gap-3">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green" />
                <p className="text-sm leading-6 text-muted">
                  School-funded access remains separate from optional
                  individual upgrades.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signed-in access */}
      {profile && (
        <div className="mt-5 rounded-2xl border border-green/20 bg-green/5 p-5 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-green">
                Your Academy access
              </p>

              <h2 className="mt-1 font-display text-2xl font-semibold">
                Welcome, {profile.fullName}
              </h2>

              <p className="mt-1 text-sm text-muted">
                {profile.accountCategory === 'school'
                  ? 'School account'
                  : 'Individual account'}
              </p>
            </div>

            <div className="rounded-xl border border-green/15 bg-white/70 px-4 py-3 text-sm">
              <p className="font-semibold">
                {activeSubscriptions.length > 0
                  ? `${activeSubscriptions.length} active access ${
                      activeSubscriptions.length === 1
                        ? 'record'
                        : 'records'
                    }`
                  : 'No active premium subscription'}
              </p>

              <p className="mt-1 text-muted">
                Verified access is shown below.
              </p>
            </div>
          </div>

          {activeSubscriptions.length === 0 ? (
            <div className="mt-4 rounded-xl bg-white/70 p-4 text-sm text-muted">
              No verified active subscription is attached to this account
              yet.
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {activeSubscriptions.map((subscription) => (
                <div
                  key={subscription.id}
                  className="rounded-xl border border-green/15 bg-white/80 p-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green" />

                    <div>
                      <p className="font-semibold">
                        {subscription.planCode}
                      </p>

                      <p className="mt-1 text-sm text-muted">
                        Status: {subscription.status}
                      </p>

                      {subscription.endsAt && (
                        <p className="mt-1 text-sm text-muted">
                          Through{' '}
                          {new Date(
                            subscription.endsAt,
                          ).toLocaleDateString('en-NG')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Premium services */}
      <div className="mt-10">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-orange">
            Premium services
          </p>

          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Choose a service and continue to secure checkout.
          </h2>

          <p className="mt-3 text-muted">
            Select the Academy service that matches your need. Payment is
            handled through the secure payment workflow rather than collecting
            card details directly on this page.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {serviceProducts.map((product, index) => (
            <article
              key={product.code}
              className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-cream p-6 shadow-card transition hover:-translate-y-1 hover:shadow-card-hover ${
                index === 0
                  ? 'md:col-span-2 lg:col-span-1 lg:ring-1 lg:ring-blue/10'
                  : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex size-11 items-center justify-center rounded-xl bg-gold/15">
                  <Sparkles className="size-5 text-gold" />
                </div>

                <span className="rounded-full bg-paper px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-muted">
                  {product.label}
                </span>
              </div>

              <h3 className="mt-5 font-display text-2xl font-semibold">
                {product.name}
              </h3>

              <p className="mt-3 flex-1 text-sm leading-6 text-muted">
                {product.description}
              </p>

              <Button asChild className="mt-6 w-full">
                <Link to="/payments">
                  Continue to secure checkout
                  <ChevronRight className="ml-2 size-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </div>

      {/* School calculator */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-3xl border border-line bg-cream p-6 shadow-card sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-xl bg-blue/10">
                  <Calculator className="size-6 text-blue" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue">
                    School platform
                  </p>

                  <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                    School premium calculator
                  </h2>
                </div>
              </div>

              <p className="mt-4 max-w-2xl leading-7 text-muted">
                Estimate school platform pricing using the configured Academy
                starting values. The calculation adjusts for learner,
                teaching and non-teaching seats, billing period and applicable
                bulk discount.
              </p>
            </div>
          </div>

          {/* Tier selector */}
          <div className="mt-7">
            <p className="text-sm font-bold">Premium level</p>

            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {tiers.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => setTier(option)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    tier.name === option.name
                      ? 'border-blue bg-blue/5 shadow-card'
                      : 'border-line bg-white hover:border-blue/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{option.name}</span>

                    {tier.name === option.name && (
                      <CheckCircle2 className="size-5 text-blue" />
                    )}
                  </div>

                  <p className="mt-2 text-xs leading-5 text-muted">
                    School administration plus configurable staff and learner
                    seats.
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs */}
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm font-bold">
              Learners
              <input
                type="number"
                min="0"
                inputMode="numeric"
                className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-4 text-base font-semibold outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/10"
                value={learners}
                onChange={(event) =>
                  setLearners(Math.max(0, Number(event.target.value) || 0))
                }
              />
            </label>

            <label className="text-sm font-bold">
              Teaching staff
              <input
                type="number"
                min="0"
                inputMode="numeric"
                className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-4 text-base font-semibold outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/10"
                value={teaching}
                onChange={(event) =>
                  setTeaching(Math.max(0, Number(event.target.value) || 0))
                }
              />
            </label>

            <label className="text-sm font-bold">
              Non-teaching staff
              <input
                type="number"
                min="0"
                inputMode="numeric"
                className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-4 text-base font-semibold outline-none transition focus:border-blue focus:ring-2 focus:ring-blue/10"
                value={nonTeaching}
                onChange={(event) =>
                  setNonTeaching(
                    Math.max(0, Number(event.target.value) || 0),
                  )
                }
              />
            </label>

            <label className="text-sm font-bold">
              School calendar
              <select
                className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-4 text-base outline-none focus:border-blue focus:ring-2 focus:ring-blue/10"
                value={calendar}
                onChange={(event) => {
                  const nextCalendar =
                    event.target.value as typeof calendar;

                  setCalendar(nextCalendar);
                  setPeriod('one');
                }}
              >
                <option value="term">Term-based</option>
                <option value="semester">Semester-based</option>
              </select>
            </label>

            <label className="text-sm font-bold sm:col-span-2">
              Billing period
              <select
                className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-4 text-base outline-none focus:border-blue focus:ring-2 focus:ring-blue/10"
                value={period}
                onChange={(event) =>
                  setPeriod(event.target.value as typeof period)
                }
              >
                <option value="one">
                  One {calendar === 'term' ? 'term' : 'semester'}
                </option>
                <option value="two">
                  Two {calendar === 'term' ? 'terms' : 'semesters'}
                </option>
                <option value="year">
                  Complete academic year
                </option>
              </select>
            </label>
          </div>

          {/* Calculation summary */}
          <div className="mt-7 overflow-hidden rounded-2xl border border-line bg-paper">
            <div className="border-b border-line px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                Estimate
              </p>

              <p className="mt-1 font-semibold">{periodLabel}</p>
            </div>

            <div className="grid gap-px bg-line sm:grid-cols-3">
              <div className="bg-cream p-5">
                <p className="text-xs font-semibold text-muted">
                  Seats
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {calculation.seats.toLocaleString('en-NG')}
                </p>
              </div>

              <div className="bg-cream p-5">
                <p className="text-xs font-semibold text-muted">
                  Bulk discount
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {Math.round(calculation.discount * 100)}%
                </p>
              </div>

              <div className="bg-orange/5 p-5">
                <p className="text-xs font-semibold text-muted">
                  Estimated total
                </p>
                <p className="mt-1 text-3xl font-bold text-orange">
                  {formatNaira(calculation.total)}
                </p>
              </div>
            </div>

            <div className="grid gap-3 border-t border-line p-5 text-sm sm:grid-cols-2">
              <div>
                <span className="text-muted">
                  Before bulk discount:
                </span>{' '}
                <strong>{formatNaira(calculation.rawTotal)}</strong>
              </div>

              <div>
                <span className="text-muted">
                  School administration:
                </span>{' '}
                <strong>
                  {formatNaira(calculation.administration)}
                </strong>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-muted">
            These are configurable starting values for the school platform.
            Final service terms and any authorised catalogue changes are
            handled through the Academy's controlled administration process.
          </p>

          <Button asChild className="mt-5 w-full sm:w-auto">
            <Link to="/payments">
              Continue with school premium
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>

        {/* Protection cards */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-cream p-6 shadow-card">
            <div className="flex size-11 items-center justify-center rounded-xl bg-green/10">
              <ShieldCheck className="size-6 text-green" />
            </div>

            <h2 className="mt-4 font-display text-2xl font-semibold">
              Protected entitlements
            </h2>

            <p className="mt-3 leading-7 text-muted">
              A verified paid entitlement is not silently downgraded during
              its paid period. School-funded access remains separate from
              optional individual upgrades.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-cream p-6 shadow-card">
            <div className="flex size-11 items-center justify-center rounded-xl bg-purple/10">
              <Users className="size-6 text-purple" />
            </div>

            <h2 className="mt-4 font-display text-2xl font-semibold">
              Seat-based school access
            </h2>

            <p className="mt-3 leading-7 text-muted">
              Schools can purchase learner, teaching and non-teaching seats
              using the configured Academy pricing and applicable bulk
              discounts.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-cream p-6 shadow-card">
            <div className="flex size-11 items-center justify-center rounded-xl bg-orange/10">
              <LockKeyhole className="size-6 text-orange" />
            </div>

            <h2 className="mt-4 font-display text-2xl font-semibold">
              Secure administration
            </h2>

            <p className="mt-3 leading-7 text-muted">
              Payment verification and premium entitlement changes belong to
              protected server-side workflows rather than browser-only
              controls.
            </p>
          </div>
        </div>
      </div>

      {/* Individual subscriptions */}
      <div className="mt-10">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-purple">
            Individual & specialist learning
          </p>

          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            More ways to learn and develop.
          </h2>

          <p className="mt-3 leading-7 text-muted">
            Specialist Academy programmes can serve individuals, educators,
            young people, communities and language learners while remaining
            part of the wider Phenom Best Academy ecosystem.
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {individualSubscriptions.map((item) => (
            <article
              key={item.name}
              className="group flex h-full flex-col rounded-2xl border border-line bg-cream p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              <div
                className={`flex size-11 items-center justify-center rounded-xl ${item.accent}`}
              >
                <GraduationCap className="size-5" />
              </div>

              <h3 className="mt-4 font-display text-xl font-semibold">
                {item.name}
              </h3>

              <p className="mt-2 flex-1 text-sm leading-6 text-muted">
                {item.text}
              </p>

              <Button
                asChild
                variant="outline"
                className="mt-5 w-full"
              >
                <Link to="/payments">
                  View package
                  <ChevronRight className="ml-2 size-4" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </div>

      {/* Payment reassurance */}
      <div className="mt-10 rounded-3xl bg-navy-deep p-6 text-cream shadow-card sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-white/10">
                <CreditCard className="size-6 text-gold" />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-gold">
                  Secure payment
                </p>

                <h2 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">
                  Your payment details stay with the payment provider.
                </h2>
              </div>
            </div>

            <p className="mt-4 max-w-3xl leading-7 text-cream/75">
              Phenom Best Academy uses protected payment workflows. The
              Academy should not receive customer card numbers or CVV, while
              provider credentials remain server-side.
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-cream/70">
              <span className="inline-flex items-center gap-2">
                <ShieldCheck className="size-4 text-green" />
                Protected checkout
              </span>

              <span className="inline-flex items-center gap-2">
                <Landmark className="size-4 text-gold" />
                Supported payment channels
              </span>

              <span className="inline-flex items-center gap-2">
                <LockKeyhole className="size-4 text-orange" />
                Server-side verification
              </span>
            </div>
          </div>

          <Button asChild variant="cream" className="w-full lg:w-auto">
            <Link to="/payments">
              Go to payments
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Closing */}
      <div className="mt-8 text-center">
        <p className="text-sm font-semibold text-orange">
          Phenom Best Academy
        </p>

        <h2 className="mx-auto mt-2 max-w-2xl font-display text-2xl font-semibold sm:text-3xl">
          Learning, technology and professional services working together.
        </h2>

        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted">
          Choose only the access or service you need, while the Academy keeps
          premium entitlements controlled and clearly separated from public
          access.
        </p>
      </div>
    </section>
  );
}
