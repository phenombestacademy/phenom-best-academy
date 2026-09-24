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
  { value: 'teenager', label: 'Teenager / Youth (Young Adult)', description: 'Teenager, youth or young adult learner account.', category: 'individual' },
  { value: 'adult', label: 'Adult', description: 'Adult individual account.', category: 'individual' },
  { value: 'professional', label: 'Professional', description: 'Professional learning, career and service account.', category: 'individual' },
  { value: 'parent', label: 'Parent / Guardian', description: 'Parent or guardian account.', category: 'individual' },
  { value: 'school_admin', label: 'School', description: 'Creates a school workspace and is the school administrator. This does not create a Super Admin.', category: 'school' },
];

function AccountPage() {
  const pending = getPendingAccountChoice();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [category, setCategory] = useState<AccountCategory>(pending.category);
  const [role, setRole] = useState<OnboardingRole>(pending.role);
  const [accountType, setAccountType] = useState<'adult' | 'teen' | 'child'>('adult');
  const [parentEmail, setParentEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  // Keep the active method explicit so Google can never make the email
  // control look as though it is sending an OTP at the same time.
  const [busyMethod, setBusyMethod] = useState<'google' | 'email' | 'password' | 'verify' | null>(null);
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
      .catch(() => setMessage('Connect Supabase before enabling accounts.'));
  }, []);

  const selectRole = (r: OnboardingRole) => {
    const choice = accountChoices.find((x) => x.value === r);
    const nextCategory = choice?.category ?? 'individual';
    setCategory(nextCategory);
    setRole(r);
    void saveAccountChoice(nextCategory, r);
  };

  const loginWithGoogle = async () => {
    if (busy) return;
    try {
      setBusy(true);
      setBusyMethod('google');
      setMessage('');
      await saveAccountChoice(category, role);
      await signInWithGoogle();
      // OAuth normally navigates away immediately. If it does not, return
      // the method chooser to a clean state rather than leaving a spinner.
      setBusy(false);
      setBusyMethod(null);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Google sign-in could not start.');
      setBusy(false);
      setBusyMethod(null);
    }
  };

  const requestEmailOtp = async () => {
    if (busy) return;
    try {
      setBusy(true);
      setBusyMethod('email');
      setMessage('');
      await saveAccountChoice(category, role);
      await sendEmailOtp(email);
      setAuthStep('otp');
      setMessage('A 6-digit verification code has been sent to your email address.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'We could not send the verification code.');
    } finally {
      setBusy(false);
      setBusyMethod(null);
    }
  };

  const verifyEmail = async () => {
    try {
      setBusy(true);
      setBusyMethod('verify');
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
      setBusyMethod(null);
    }
  };

  const createPassword = async () => {
    try {
      setBusy(true);
      setBusyMethod('password');
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
      setBusyMethod(null);
    }
  };

  const saveSafety = async () => {
    try {
      await saveChildSafetySettings({ accountType, parentEmail });
      setMessage('Safety settings saved.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Could not save settings.');
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
              {authStep === 'method' ? 'Create your account' : authStep === 'otp' ? 'Verify your email' : authStep === 'emailPassword' ? 'Sign in with email and password' : 'Create your password'}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {authStep === 'method' ? 'Choose how you want to continue.' : authStep === 'otp' ? <>We sent a 6-digit code to <strong>{email}</strong>. Enter it here to continue.</> : 'Your email has been verified. Create a password so you can also sign in with your Phenom User ID or email address.'}
            </p>

            {authStep === 'method' ? (
              <>
                <p className="mt-2 text-xs leading-relaxed text-muted">Signing in with your Google account may require phone verification.</p>
                <div className="mt-5 rounded-xl border border-line bg-white p-4">
                  <label className="text-sm font-semibold">Account type</label>
                  <select value={role} onChange={(e) => selectRole(e.target.value as OnboardingRole)} className="mt-2 w-full rounded-xl border border-line bg-paper p-3 text-sm">
                    {accountChoices.map((choice) => <option key={choice.value} value={choice.value}>{choice.label}</option>)}
                  </select>
                  <p className="mt-2 text-xs text-muted">{accountChoices.find((x) => x.value === role)?.description}</p>
                </div>

                <Button className="mt-6 w-full" onClick={loginWithGoogle} disabled={busy}>
                  {busyMethod === 'google' ? 'Opening Google sign-in…' : 'Continue with Google'}
                </Button>
                <div className="my-3 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" /><span>or</span><span className="h-px flex-1 bg-line" /></div>
                <div className="rounded-xl border border-line bg-white p-4">
                  <label htmlFor="phenom-email" className="text-sm font-semibold">Email address</label>
                  <input id="phenom-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-2 w-full rounded-xl border border-line bg-paper p-3 text-sm" />
                  <Button className="mt-3 w-full" onClick={requestEmailOtp} disabled={busy || !email.trim()}>
                    {busyMethod === 'email' ? 'Sending verification code…' : 'Continue with email address'}
                  </Button>
                  <p className="mt-2 text-center text-xs text-muted">We will send a 6-digit verification code to this email. You only need access to this email address to receive your code.</p>
                </div>
              </>
            ) : null}

            {authStep === 'otp' ? (
              <div className="mt-5">
                <label htmlFor="phenom-otp" className="text-sm font-semibold">6-digit verification code</label>
                <input id="phenom-otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))} className="mt-2 w-full rounded-xl border border-line bg-white p-4 text-center text-2xl tracking-[.35em]" />
                <Button className="mt-4 w-full" onClick={verifyEmail} disabled={busy || otp.length !== 6}>{busyMethod === 'verify' ? 'Verifying…' : 'Verify email'}</Button>
                <button type="button" onClick={() => { setAuthStep('method'); setBusy(false); setBusyMethod(null); setMessage(''); }} className="mt-3 w-full text-sm font-semibold text-green">Use a different email or sign-in method</button>
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
                    setBusy(true); setBusyMethod('password'); setMessage('');
                    const p = await signInWithEmailPassword(email, password);
                    setProfile(p);
                    if (p) { setCategory(p.accountCategory); setRole(p.onboardingRole); }
                    setAuthStep('method');
                    setMessage('Signed in successfully.');
                  } catch (e) {
                    setMessage(e instanceof Error ? e.message : 'Email and password sign-in failed.');
                  } finally { setBusy(false); setBusyMethod(null); }
                }} disabled={busy || !email.trim() || !password}>{busyMethod === 'password' ? 'Signing in…' : 'Sign in'}</Button>
              </div>
            ) : null}

            {authStep === 'password' ? (
              <div className="mt-5">
                <label htmlFor="phenom-password" className="text-sm font-semibold">Create password</label>
                <input id="phenom-password" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-sm" />
                <label htmlFor="phenom-password-confirm" className="mt-3 block text-sm font-semibold">Confirm password</label>
                <input id="phenom-password-confirm" type="password" autoComplete="new-password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-sm" />
                <Button className="mt-4 w-full" onClick={createPassword} disabled={busy || password.length < 8 || password !== passwordConfirm}>{busyMethod === 'password' ? 'Creating password…' : 'Create password & continue'}</Button>
              </div>
            ) : null}

            {message ? <p className="mt-4 rounded-xl bg-paper p-3 text-sm text-muted">{message}</p> : null}
            {authStep !== 'method' ? <button type="button" onClick={() => { setAuthStep('method'); setBusy(false); setBusyMethod(null); setMessage(''); }} className="mt-3 w-full text-xs text-muted">Back to sign-in options</button> : null}
            <p className="mt-4 text-center text-xs text-muted">Phenom Best Academy keeps your authentication secure. Your password is never shown to the Academy.</p>
          </div>
        </div>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="rounded-3xl bg-navy-deep p-6 text-cream sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">Phenom Best Academy account centre</p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold text-white sm:text-6xl">Know what you are joining before you create your account.</h1>
        <p className="mt-5 max-w-3xl text-on-navy-muted">Your account type determines the services and workspace you are shown. No public sign-up option can create a Super Admin account.</p>

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
              <select value={locale} onChange={(e) => { const value = e.target.value as SupportedLocale; setAccountLocale(value); setLocale(value); }} className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 p-3 text-cream">
                {supportedLocales.map(([code, label]) => <option key={code} value={code} className="text-navy-deep">{label}</option>)}
              </select>
              <span className="mt-1 block text-xs font-normal text-cream/55">This becomes the default language for the Academy and Tool Hub on this device.</span>
            </label>
          </>
        ) : (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm">{profile.fullName}</span>
            <span className="rounded-full bg-white/10 px-4 py-2 text-sm">{profile.accountCategory === 'school' ? 'School account' : roleLabel}</span>
          </div>
        )}
      </div>
      </section>
    </>
  );
}
