import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import {
  Building2,
  CheckCircle2,
  GraduationCap,
  LogOut,
  ShieldCheck,
  UserRound,
  UsersRound,
  BriefcaseBusiness,
  HeartHandshake,
  Settings,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getMyProfile,
  getPendingAccountChoice,
  logAnalytics,
  saveAccountChoice,
  saveChildSafetySettings,
  signInWithGoogle,
  signOut,
  type AccountCategory,
  type OnboardingRole,
  type Profile,
} from '@/lib/platform';
import {
  getLocale,
  setLocale,
  supportedLocales,
  type SupportedLocale,
} from '@/lib/i18n';

export const Route = createFileRoute('/account')({
  component: AccountPage,
});

const schoolRoles: Array<{
  value: Exclude<OnboardingRole, 'individual'>;
  label: string;
  icon: typeof GraduationCap;
  description: string;
}> = [
  {
    value: 'school_admin',
    label: 'School Administrator',
    icon: Building2,
    description:
      'For an authorised school owner, administrator or designated school manager.',
  },
  {
    value: 'teacher',
    label: 'Teacher / School Staff',
    icon: BriefcaseBusiness,
    description:
      'For teaching and authorised school staff joining an existing school.',
  },
  {
    value: 'student',
    label: 'Student / Learner',
    icon: GraduationCap,
    description:
      'For a learner whose school or personal learning needs are being supported.',
  },
  {
    value: 'parent',
    label: 'Parent / Guardian',
    icon: UsersRound,
    description:
      'For a parent or guardian connected to a learner in a school.',
  },
];

function AccountPage() {
  const pending = getPendingAccountChoice();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [category, setCategory] = useState<AccountCategory>(
    pending.category,
  );
  const [role, setRole] = useState<OnboardingRole>(pending.role);
  const [accountType, setAccountType] = useState<
    'adult' | 'teen' | 'child'
  >('adult');
  const [parentEmail, setParentEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [locale, setAccountLocale] = useState<SupportedLocale>(
    () => getLocale(),
  );

  useEffect(() => {
    getMyProfile()
      .then((p) => {
        setProfile(p);

        if (p) {
          setCategory(p.accountCategory);
          setRole(p.onboardingRole);
          setAccountType(p.accountType);
          setParentEmail(p.parentEmail || '');
        }
      })
      .catch(() =>
        setMessage('Connect Supabase before enabling accounts.'),
      );
  }, []);

  const selectCategory = (c: AccountCategory) => {
    const r =
      c === 'school'
        ? role === 'individual'
          ? 'school_admin'
          : role
        : 'individual';

    setCategory(c);
    setRole(r);
    void saveAccountChoice(c, r);
  };

  const login = async () => {
    try {
      setBusy(true);
      await saveAccountChoice(category, role);
      await signInWithGoogle();
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : 'Secure sign-in could not start.',
      );
    } finally {
      setBusy(false);
    }
  };

  const saveSafety = async () => {
    try {
      await saveChildSafetySettings({
        accountType,
        parentEmail,
      });

      setMessage('Safety settings saved.');
    } catch (e) {
      setMessage(
        e instanceof Error
          ? e.message
          : 'Could not save settings.',
      );
    }
  };

  const roleLabel =
    schoolRoles.find(
      (x) => x.value === profile?.onboardingRole,
    )?.label || 'Individual';

  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl bg-navy-deep p-6 text-cream sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">
          Phenom Best Academy account centre
        </p>

        <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold text-white sm:text-6xl">
          Know what you are joining before you create your account.
        </h1>

        <p className="mt-5 max-w-3xl text-on-navy-muted">
          Your account type determines the services and workspace you are
          shown. No public sign-up option can create a Super Admin account.
        </p>

        {!profile ? (
          <>
            <div className="mt-7 grid gap-5 lg:grid-cols-2">
              <button
                onClick={() => selectCategory('individual')}
                className={`rounded-2xl border p-6 text-left ${
                  category === 'individual'
                    ? 'border-gold bg-white/10 ring-2 ring-gold/30'
                    : 'border-white/15 bg-white/5'
                }`}
              >
                <UserRound className="text-gold" />

                <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                  Individual account
                </h2>

                <p className="mt-2 text-on-navy">
                  For students, professionals, teachers, parents, adults,
                  young people, researchers, creatives and anyone using
                  Academy services independently.
                </p>

                <div className="mt-4 grid gap-2 text-sm text-on-navy">
                  <span>
                    Free: selected Phenom Calculator, learning resources,
                    free programmes and Academy information.
                  </span>

                  <span>
                    Premium: expanded learning, premium resources, specialist
                    programmes and paid Academy services.
                  </span>
                </div>

                {category === 'individual' && (
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-gold">
                    <CheckCircle2 className="size-4" />
                    Selected
                  </span>
                )}
              </button>

              <button
                onClick={() => selectCategory('school')}
                className={`rounded-2xl border p-6 text-left ${
                  category === 'school'
                    ? 'border-gold bg-white/10 ring-2 ring-gold/30'
                    : 'border-white/15 bg-white/5'
                }`}
              >
                <Building2 className="text-gold" />

                <h2 className="mt-3 font-display text-2xl font-semibold text-white">
                  School account
                </h2>

                <p className="mt-2 text-on-navy">
                  For an authorised school using a controlled school
                  workspace for administration, teachers, learners and
                  parents.
                </p>

                <div className="mt-4 grid gap-2 text-sm text-on-navy">
                  <span>
                    School services: classes, students, attendance, learning,
                    CBT, assignments, results, report cards, fees, HR,
                    elections and ID cards.
                  </span>

                  <span>
                    Premium: expanded school platform access, seats and
                    administration features according to the selected plan.
                  </span>
                </div>

                {category === 'school' && (
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-gold">
                    <CheckCircle2 className="size-4" />
                    Selected
                  </span>
                )}
              </button>
            </div>

            {category === 'school' && (
              <div className="mt-5 rounded-2xl bg-white/5 p-5">
                <h2 className="font-display text-xl font-semibold">
                  Choose your school role
                </h2>

                <p className="mt-1 text-sm text-cream/65">
                  This tells the Academy what type of school access you are
                  requesting. It does not grant administrative privileges by
                  itself.
                </p>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {schoolRoles.map((r) => {
                    const I = r.icon;

                    return (
                      <button
                        key={r.value}
                        onClick={() => {
                          setRole(r.value);
                          void saveAccountChoice(category, r.value);
                        }}
                        className={`rounded-xl border p-4 text-left ${
                          role === r.value
                            ? 'border-gold bg-gold/10'
                            : 'border-white/15 bg-white/5'
                        }`}
                      >
                        <I className="text-gold" />

                        <strong className="mt-2 block">
                          {r.label}
                        </strong>

                        <span className="mt-1 block text-xs text-cream/60">
                          {r.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <label className="mt-6 block max-w-sm text-sm font-semibold text-cream">
              Academy language

              <select
                value={locale}
                onChange={(e) => {
                  const value =
                    e.target.value as SupportedLocale;

                  setAccountLocale(value);
                  setLocale(value);
                }}
                className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 p-3 text-cream"
              >
                {supportedLocales.map(([code, label]) => (
                  <option
                    key={code}
                    value={code}
                    className="text-navy-deep"
                  >
                    {label}
                  </option>
                ))}
              </select>

              <span className="mt-1 block text-xs font-normal text-cream/55">
                This becomes the default language for the Academy and Tool
                Hub on this device.
              </span>
            </label>

            <Button
              className="mt-4"
              onClick={login}
              disabled={busy}
            >
              {busy
                ? 'Opening secure Google sign-in…'
                : 'Continue with Google'}
            </Button>

            <p className="mt-3 text-xs text-cream/55">
              Google handles authentication. Phenom Best Academy does not
              receive your Google password.
            </p>
          </>
        ) : (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
              {profile.fullName}
            </span>

            <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
              {profile.accountCategory === 'school'
                ? `School · ${roleLabel}`
                : 'Individual'}
            </span>

            <Button
              variant="cream"
              onClick={() =>
                signOut().then(() => location.reload())
              }
            >
              <LogOut className="mr-2 size-4" />
              Sign out
            </Button>
          </div>
        )}
      </div>

      {profile && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-cream p-6 lg:col-span-2">
            <h2 className="font-display text-2xl font-semibold">
              Your available workspace
            </h2>

            {profile.accountCategory === 'school' ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  className="rounded-xl border border-line bg-white p-4 font-semibold"
                  to="/schools"
                >
                  School platform
                </Link>

                <Link
                  className="rounded-xl border border-line bg-white p-4 font-semibold"
                  to="/learning"
                >
                  Lessons & learning
                </Link>

                <Link
                  className="rounded-xl border border-line bg-white p-4 font-semibold"
                  to="/tools"
                >
                  Phenom Tool Hub
                </Link>

                <Link
                  className="rounded-xl border border-line bg-white p-4 font-semibold"
                  to="/subscriptions"
                >
                  School premium
                </Link>

                {profile.role === 'super_admin' ? (
                  <Link
                    className="rounded-xl border border-purple/30 bg-purple/5 p-4 font-semibold"
                    to="/admin"
                  >
                    <Settings className="mb-2 size-5 text-purple" />
                    Admin Studio
                  </Link>
                ) : null}
              </div>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Link
                  className="rounded-xl border border-line bg-white p-4 font-semibold"
                  to="/learning"
                >
                  Lessons & learning
                </Link>

                <Link
                  className="rounded-xl border border-line bg-white p-4 font-semibold"
                  to="/tools"
                >
                  Phenom Tool Hub
                </Link>

                <Link
                  className="rounded-xl border border-line bg-white p-4 font-semibold"
                  to="/subscriptions"
                >
                  Premium services
                </Link>

                <Link
                  className="rounded-xl border border-line bg-white p-4 font-semibold"
                  to="/enquire"
                >
                  Request Academy service
                </Link>

                {profile.role === 'super_admin' ? (
                  <Link
                    className="rounded-xl border border-purple/30 bg-purple/5 p-4 font-semibold"
                    to="/admin"
                  >
                    <Settings className="mb-2 size-5 text-purple" />
                    Admin Studio
                  </Link>
                ) : null}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-line bg-cream p-6">
            <ShieldCheck className="text-green" />

            <h2 className="mt-3 font-display text-xl font-semibold">
              Safety & family connection
            </h2>

            <label className="mt-4 block text-sm font-semibold">
              Account safety type

              <select
                className="mt-1 w-full rounded-xl border border-line bg-white p-3"
                value={accountType}
                onChange={(e) =>
                  setAccountType(
                    e.target.value as typeof accountType,
                  )
                }
              >
                <option value="adult">Adult</option>
                <option value="teen">Teenager</option>
                <option value="child">Child</option>
              </select>
            </label>

            <label className="mt-3 block text-sm font-semibold">
              Parent/guardian email

              <input
                type="email"
                className="mt-1 w-full rounded-xl border border-line bg-white p-3"
                value={parentEmail}
                onChange={(e) =>
                  setParentEmail(e.target.value)
                }
                placeholder="parent@example.com"
              />
            </label>

            <Button className="mt-4" onClick={saveSafety}>
              Save safety settings
            </Button>
          </div>

          <div className="rounded-2xl border border-line bg-cream p-6">
            <HeartHandshake className="text-purple" />

            <h2 className="mt-3 font-display text-xl font-semibold">
              Super Admin is separate
            </h2>

            <p className="mt-2 text-sm text-muted">
              Public registration never offers Super Admin. The Academy owner
              account is designated privately through the protected database
              administration process.
            </p>
          </div>
        </div>
      )}

      {message && (
        <p className="mt-5 rounded-xl bg-orange/10 p-4 text-sm">
          {message}
        </p>
      )}
    </section>
  );
}
