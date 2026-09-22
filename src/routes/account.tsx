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
  Compass,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  getMyProfile,
  getPendingAccountChoice,
  logAnalytics,
  saveAccountChoice,
  saveChildSafetySettings,
  saveLearningLanguage,
  savePreferredLocale,
  sendEmailOtp,
  sendWelcomeEmail,
  setAccountPassword,
  signInWithEmailPassword,
  signInWithGoogle,
  verifyEmailOtp,
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

const accountChoices: Array<{ value: OnboardingRole; label: string; description: string; category: AccountCategory }> = [
  { value: 'teacher', label: 'Teacher', description: 'Teacher or teaching professional joining a school.', category: 'individual' },
  { value: 'non_teaching_staff', label: 'Non-teaching staff', description: 'Administrative, operations, finance, HR or support staff.', category: 'individual' },
  { value: 'student', label: 'Student', description: 'Learner in a school or independent programme.', category: 'individual' },
  { value: 'child', label: 'Child', description: 'Child account, including parent-supported access.', category: 'individual' },
  { value: 'teenager', label: 'Teenager', description: 'Teen learner account.', category: 'individual' },
  { value: 'adult', label: 'Adult', description: 'Adult individual account.', category: 'individual' },
  { value: 'professional', label: 'Professional', description: 'Professional learning, career and service account.', category: 'individual' },
  { value: 'parent', label: 'Parent / Guardian', description: 'Parent or guardian account.', category: 'individual' },
  { value: 'school_admin', label: 'School', description: 'Creates a school workspace and is the school administrator. This does not create a Super Admin.', category: 'school' },
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
  const [authStep, setAuthStep] = useState<'method' | 'password' | 'otp' | 'emailPassword'>('method');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [welcomeSent, setWelcomeSent] = useState(false);
  const [locale, setAccountLocale] = useState<SupportedLocale>(() => getLocale());
  const [learningLocale, setLearningLocale] = useState<SupportedLocale | ''>('');
  const [supportLocale, setSupportLocale] = useState<SupportedLocale>(() => getLocale());

  useEffect(() => {
    getMyProfile()
      .then((p) => {
        setProfile(p);

        if (p) {
          setCategory(p.accountCategory);
          setRole(p.onboardingRole);
          setAccountType(p.accountType);
          setParentEmail(p.parentEmail || '');
          setLearningLocale((p.learningLocale as SupportedLocale | null) || '');
          setSupportLocale((p.supportLocale as SupportedLocale | null) || getLocale());
        }
      })
      .catch(() =>
        setMessage('Connect Supabase before enabling accounts.'),
      );
  }, []);

  const selectRole = (r: OnboardingRole) => {
    const choice = accountChoices.find((x) => x.value === r);
    const nextCategory = choice?.category ?? 'individual';
    setCategory(nextCategory);
    setRole(r);
    void saveAccountChoice(nextCategory, r);
  };

  const loginWithGoogle = async () => {
    try {
      setBusy(true);
      await saveAccountChoice(category, role);
      await signInWithGoogle();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Google sign-in could not start.');
      setBusy(false);
    }
  };

  const requestEmailOtp = async () => {
    try {
      setBusy(true);
      setMessage('');
      await saveAccountChoice(category, role);
      await sendEmailOtp(email);
      setAuthStep('otp');
      setMessage('A 6-digit verification code has been sent to your email address.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'We could not send the verification code.');
    } finally {
      setBusy(false);
    }
  };

  const verifyEmail = async () => {
    try {
      setBusy(true);
      setMessage('');
      await verifyEmailOtp(email, otp);
      const p = await getMyProfile();
      setProfile(p);
      if (p) {
        setCategory(p.accountCategory);
        setRole(p.onboardingRole);
        setAccountType(p.accountType);
        setParentEmail(p.parentEmail || '');
      }
      setAuthStep('password');
      setMessage('Email verified. Create your password to complete your Phenom account.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'The verification code could not be accepted.');
    } finally {
      setBusy(false);
    }
  };

  const createPassword = async () => {
    try {
      setBusy(true);
      setMessage('');
      if (password !== passwordConfirm) throw new Error('The passwords do not match.');
      await setAccountPassword(password);
      let welcomeDelivered = false;
      try {
        await sendWelcomeEmail();
        welcomeDelivered = true;
        setWelcomeSent(true);
      } catch {
        setWelcomeSent(false);
      }
      const p = await getMyProfile();
      setProfile(p);
      setAuthStep('method');
      setMessage(welcomeDelivered ? 'Your Phenom account is ready. A welcome email has been sent.' : 'Your Phenom account is ready.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Your password could not be created.');
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

  const roleLabel = accountChoices.find((x) => x.value === profile?.onboardingRole)?.label || 'Individual';

  return (
    <>
      {!profile ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-deep/70 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="phenom-auth-title" className="w-full max-w-md rounded-3xl bg-cream p-6 text-ink shadow-card sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-orange">Phenom Best Academy</p>
            <h2 id="phenom-auth-title" className="mt-2 font-display text-3xl font-bold">
              {authStep === 'method' ? 'Sign in or create your account' : authStep === 'otp' ? 'Verify your email' : authStep === 'emailPassword' ? 'Sign in with email and password' : 'Create your password'}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {authStep === 'method'
                ? 'Choose how you want to continue. Email verification does not require your phone.'
                : authStep === 'otp'
                  ? <>We sent a 6-digit code to <strong>{email}</strong>. Enter it here to continue.</>
                  : 'Your email has been verified. Create a password so you can also sign in with your Phenom User ID or email address.'}
            </p>

            {authStep === 'method' ? (
              <>
                <div className="mt-5 rounded-xl border border-line bg-white p-4">
                  <label className="text-sm font-semibold">Account type</label>
                  <select value={role} onChange={(e) => selectRole(e.target.value as OnboardingRole)} className="mt-2 w-full rounded-xl border border-line bg-paper p-3 text-sm">
                    {accountChoices.map((choice) => <option key={choice.value} value={choice.value}>{choice.label}</option>)}
                  </select>
                  <p className="mt-2 text-xs text-muted">{accountChoices.find((x) => x.value === role)?.description}</p>
                </div>
                
                <Button className="mt-6 w-full" onClick={loginWithGoogle} disabled={busy}>
                  {busy ? 'Opening Google sign-in…' : 'Continue with Google'}
                </Button>
                <div className="my-3 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" /><span>or</span><span className="h-px flex-1 bg-line" /></div>
                <div className="rounded-xl border border-line bg-white p-4">
                  <label htmlFor="phenom-email" className="text-sm font-semibold">Email address</label>
                  <input id="phenom-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-line bg-paper p-3 text-sm" />
                  <Button className="mt-3 w-full" onClick={requestEmailOtp} disabled={busy || !email.trim()}>
                    {busy ? 'Sending verification code…' : 'Continue with email address'}
                  </Button>
                  <p className="mt-2 text-center text-xs text-muted">We will send a 6-digit code to this email. No phone is required.</p>
                </div>
              </>
            ) : null}

            {authStep === 'otp' ? (
              <div className="mt-5">
                <label htmlFor="phenom-otp" className="text-sm font-semibold">6-digit verification code</label>
                <input id="phenom-otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))} className="mt-2 w-full rounded-xl border border-line bg-white p-4 text-center text-2xl tracking-[.35em]" />
                <Button className="mt-4 w-full" onClick={verifyEmail} disabled={busy || otp.length !== 6}>{busy ? 'Verifying…' : 'Verify email'}</Button>
                <button type="button" onClick={() => setAuthStep('method')} className="mt-3 w-full text-sm font-semibold text-green">Use a different email or sign-in method</button>
              </div>
            ) : null}

            {authStep === 'emailPassword' ? (
              <div className="mt-5">
                <label htmlFor="phenom-login-email" className="text-sm font-semibold">Email address</label>
                <input id="phenom-login-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-sm" />
                <label htmlFor="phenom-login-password" className="mt-3 block text-sm font-semibold">Password</label>
                <input id="phenom-login-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-sm" />
                <Button className="mt-4 w-full" onClick={async () => {
                  try {
                    setBusy(true); setMessage('');
                    const p = await signInWithEmailPassword(email, password);
                    setProfile(p);
                    if (p) { setCategory(p.accountCategory); setRole(p.onboardingRole); }
                    setAuthStep('method');
                    setMessage('Signed in successfully.');
                  } catch (e) {
                    setMessage(e instanceof Error ? e.message : 'Email and password sign-in failed.');
                  } finally { setBusy(false); }
                }} disabled={busy || !email.trim() || !password}>{busy ? 'Signing in…' : 'Sign in'}</Button>
              </div>
            ) : null}

            {authStep === 'password' ? (
              <div className="mt-5">
                <label htmlFor="phenom-password" className="text-sm font-semibold">Create password</label>
                <input id="phenom-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-sm" />
                <label htmlFor="phenom-password-confirm" className="mt-3 block text-sm font-semibold">Confirm password</label>
                <input id="phenom-password-confirm" type="password" autoComplete="new-password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-sm" />
                <Button className="mt-4 w-full" onClick={createPassword} disabled={busy || password.length < 8 || password !== passwordConfirm}>{busy ? 'Creating password…' : 'Create password & continue'}</Button>
              </div>
            ) : null}

            {message ? <p className="mt-4 rounded-xl bg-paper p-3 text-sm text-muted">{message}</p> : null}

            {authStep !== 'method' ? <button type="button" onClick={() => setAuthStep('method')} className="mt-3 w-full text-xs text-muted">Back to sign-in options</button> : null}
            <p className="mt-4 text-center text-xs text-muted">Phenom Best Academy keeps your authentication secure. Your password is never shown to the Academy.</p>
          </div>
        </div>
      ) : null}

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
            <div className="mt-7 rounded-2xl border border-white/15 bg-white/5 p-5">
              <label className="text-sm font-semibold text-cream">Choose account type</label>
              <select value={role} onChange={(e) => selectRole(e.target.value as OnboardingRole)} className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 p-3 text-cream">
                {accountChoices.map((choice) => <option key={choice.value} value={choice.value} className="text-navy-deep">{choice.label}</option>)}
              </select>
              <p className="mt-2 text-sm text-cream/60">{accountChoices.find((x) => x.value === role)?.description}</p>
              <p className="mt-3 text-xs text-cream/50">Choosing School registers you as the administrator for that school workspace. It never creates or grants Super Admin access.</p>
            </div>

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

            <span className="rounded-full bg-white/10 px-4 py-2 text-sm">
              Phenom User ID: {profile.phenomUserId || 'Being prepared'}
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
          <div className="rounded-2xl border border-green/30 bg-cream p-6 lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[.16em] text-green">
                  Your Phenom access
                </p>
                <h2 className="mt-1 font-display text-2xl font-semibold">Your Phenom Entry Points</h2>
                <p className="mt-2 max-w-3xl text-sm text-muted">
                  These are the Academy areas you can enter from your account. Each entry point means a specific workspace, service or control area available to you based on your account type, authorised role and access entitlement.
                </p>
              </div>
              <span className="rounded-full border border-green/30 bg-green/10 px-3 py-1 text-xs font-semibold text-green">
                {profile.accountCategory === 'school' ? 'School · ' + roleLabel : 'Individual account'}
              </span>
            </div>

            <Link className="group rounded-2xl border-2 border-green bg-green/5 p-5 font-semibold text-green transition-colors hover:bg-green/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green sm:col-span-2 lg:col-span-4" to={profile.accountCategory === 'school' ? '/schools' : '/learning'}>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <span className="block text-lg">Phenom Best Academy Access</span>
                  <span className="mt-2 inline-flex rounded-full border border-green/40 bg-green/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green">
                    {profile.role === 'super_admin' ? 'SUPER ADMIN' : profile.onboardingRole === 'school_admin' ? 'SCHOOL ADMINISTRATOR' : profile.onboardingRole === 'teacher' ? 'TEACHER' : profile.onboardingRole === 'student' ? 'STUDENT' : profile.role === 'staff' ? 'STAFF' : 'FREE'}
                  </span>
                </div>
                <span className="text-sm font-semibold">Enter →</span>
              </div>
            </Link>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link className="group rounded-xl border border-green/25 bg-white p-4 font-semibold text-green transition-colors hover:border-green hover:bg-green/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green" to="/learning">
                <GraduationCap className="mb-2 size-5 text-green" />
                Learning Centre
                <span className="mt-1 block text-xs font-normal text-muted">Free learning and authorised premium learning.</span>
              </Link>
              <Link className="group rounded-xl border border-green/25 bg-white p-4 font-semibold text-green transition-colors hover:border-green hover:bg-green/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green" to="/tools">
                <Compass className="mb-2 size-5 text-green" />
                Phenom Tool Hub
                <span className="mt-1 block text-xs font-normal text-muted">Free tools with premium features controlled by entitlement.</span>
              </Link>
              <Link className="group rounded-xl border border-green/25 bg-white p-4 font-semibold text-green transition-colors hover:border-green hover:bg-green/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green" to="/subscriptions">
                <ShieldCheck className="mb-2 size-5 text-green" />
                Plans & Premium
                <span className="mt-1 block text-xs font-normal text-muted">View plans and your current access status.</span>
              </Link>
              <Link className="group rounded-xl border border-green/25 bg-white p-4 font-semibold text-green transition-colors hover:border-green hover:bg-green/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green" to="/enquire">
                <Send className="mb-2 size-5 text-green" />
                Request a Service
                <span className="mt-1 block text-xs font-normal text-muted">Consultancy, training and other Academy services.</span>
              </Link>

              {profile.accountCategory === 'school' || profile.role === 'super_admin' ? (
                <Link className="group rounded-xl border border-green/25 bg-white p-4 font-semibold text-green transition-colors hover:border-green hover:bg-green/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green" to="/schools">
                  <Building2 className="mb-2 size-5 text-green" />
                  School Platform
                  <span className="mt-1 block text-xs font-normal text-muted">Available to authorised school users and Super Admin.</span>
                </Link>
              ) : null}

              {profile.role === 'super_admin' ? (
                <>
                  <Link className="rounded-xl border border-green/30 bg-green/5 p-4 font-semibold text-green hover:border-green" to="/admin">
                    <Settings className="mb-2 size-5 text-green" />
                    Super Admin Studio
                    <span className="mt-1 block text-xs font-normal text-muted">Private control centre for content, media, payments, announcements and platform administration.</span>
                  </Link>
                  <Link className="rounded-xl border border-green/30 bg-green/5 p-4 font-semibold text-green hover:border-green" to="/schools">
                    <UsersRound className="mb-2 size-5 text-green" />
                    All School Workspaces
                    <span className="mt-1 block text-xs font-normal text-muted">Super Admin can enter and manage authorised school environments.</span>
                  </Link>
                  <Link className="rounded-xl border border-green/30 bg-green/5 p-4 font-semibold text-green hover:border-green" to="/subscriptions">
                    <ShieldCheck className="mb-2 size-5 text-green" />
                    Premium & Entitlements
                    <span className="mt-1 block text-xs font-normal text-muted">Review plans and administer authorised premium access from the protected controls.</span>
                  </Link>
                </>
              ) : null}
            </div>

            {profile.role === 'super_admin' ? (
              <div className="mt-5 rounded-2xl border border-purple/25 bg-purple/5 p-5">
                <div className="flex items-start gap-3">
                  <Settings className="mt-0.5 size-5 text-purple" />
                  <div>
                    <h3 className="font-display text-lg font-semibold">Super Admin access</h3>
                    <p className="mt-1 text-sm text-muted">
                      This private entry point is shown only to the authenticated Super Admin profile. Other users will never see this section or the Super Admin Studio link.
                    </p>
                    <Button asChild className="mt-4"><Link to="/admin">Open Super Admin Studio</Link></Button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-2xl border border-green/30 bg-cream p-6 lg:col-span-2">
            <p className="text-xs font-semibold uppercase tracking-[.16em] text-green">Language learning settings</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">Interface language and learning language are separate</h2>
            <p className="mt-2 text-sm text-muted">Your interface language controls Phenom. Your learning language is the language you are studying. Explanations and support can remain in your familiar language.</p>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="block text-sm font-semibold">Interface language
                <select value={locale} onChange={(e) => { const v=e.target.value as SupportedLocale; setAccountLocale(v); setLocale(v); setSupportLocale(v); void savePreferredLocale(v).catch(()=>undefined); }} className="mt-1 w-full rounded-xl border border-line bg-white p-3">
                  {supportedLocales.map(([code,label]) => <option key={code} value={code}>{label}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold">Language I am studying
                <select value={learningLocale} onChange={(e) => { const v=e.target.value as SupportedLocale | ''; setLearningLocale(v); void saveLearningLanguage(v || null, supportLocale); }} className="mt-1 w-full rounded-xl border border-line bg-white p-3">
                  <option value="">Not selected</option>
                  {supportedLocales.map(([code,label]) => <option key={code} value={code}>{label}</option>)}
                </select>
              </label>
              <label className="block text-sm font-semibold">Support / explanation language
                <select value={supportLocale} onChange={(e) => { const v=e.target.value as SupportedLocale; setSupportLocale(v); void saveLearningLanguage(learningLocale || null, v); }} className="mt-1 w-full rounded-xl border border-line bg-white p-3">
                  {supportedLocales.map(([code,label]) => <option key={code} value={code}>{label}</option>)}
                </select>
              </label>
            </div>
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
    </>
  );
}
