import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Building2, GraduationCap, LogOut, ShieldCheck, UsersRound, HeartHandshake, Settings, Compass, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getSupabase } from '@/lib/cms';
import { getMyProfile, getPendingAccountChoice, saveAccountChoice, saveChildSafetySettings, saveLearningLanguage, savePreferredLocale, sendEmailOtp, sendWelcomeEmail, setAccountPassword, signInWithEmailPassword, signInWithGoogle, verifyEmailOtp, signOut, type AccountCategory, type OnboardingRole, type Profile } from '@/lib/platform';
import { getLocale, setLocale, supportedLocales, type SupportedLocale } from '@/lib/i18n';

export const Route = createFileRoute('/account')({ component: AccountPage });

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
  const pending: { category: AccountCategory; role: OnboardingRole } = getPendingAccountChoice();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [category, setCategory] = useState<AccountCategory>(pending.category);
  const [role, setRole] = useState<OnboardingRole>(pending.role);
  const [accountType, setAccountType] = useState<'adult' | 'teen' | 'child'>('adult');
  const [parentEmail, setParentEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [authStep, setAuthStep] = useState<'method' | 'password' | 'otp' | 'emailPassword' | 'forgotOtp' | 'forgotPassword'>('method');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [locale, setAccountLocale] = useState<SupportedLocale>(() => getLocale());
  const [learningLocale, setLearningLocale] = useState<SupportedLocale | ''>('');
  const [supportLocale, setSupportLocale] = useState<SupportedLocale>(() => getLocale());

  useEffect(() => {
    getMyProfile().then((p) => {
      setProfile(p);
      if (p) {
        setCategory(p.accountCategory);
        setRole(p.onboardingRole);
        setAccountType(p.accountType);
        setParentEmail(p.parentEmail || '');
        setLearningLocale((p.learningLocale as SupportedLocale | null) || '');
        setSupportLocale((p.supportLocale as SupportedLocale | null) || getLocale());
      }
    }).catch((error) => {
      const text = error instanceof Error ? error.message : 'We could not load your account information.';
      setMessage(text.includes('Connect Supabase') ? text : `Account connection error: ${text}`);
    });
  }, []);

  const selectRole = (r: OnboardingRole) => {
    const choice = accountChoices.find((x) => x.value === r);
    const nextCategory = choice?.category ?? 'individual';
    setCategory(nextCategory); setRole(r); void saveAccountChoice(nextCategory, r);
  };

  const loginWithGoogle = async () => {
    try { setBusy(true); saveAccountChoice(category, role).catch(() => undefined); await signInWithGoogle(); }
    catch (e) { setMessage(e instanceof Error ? e.message : 'Google sign-in could not start.'); setBusy(false); }
  };

  const requestEmailOtp = async () => {
    try {
      setBusy(true); setMessage(''); saveAccountChoice(category, role).catch(() => undefined); await sendEmailOtp(email); setAuthStep('otp'); setMessage('A 6-digit verification code has been sent to your email address.');
    } catch (e) {
      const text = e instanceof Error ? e.message : 'We could not send the verification code.';
      if (text === 'You already have a Phenom account. Please sign in instead.') {
        setAuthStep('emailPassword');
        setMessage(text);
      } else {
        setMessage(text);
      }
    } finally { setBusy(false); }
  };

  const verifyEmail = async () => {
    try {
      setBusy(true); setMessage(''); await verifyEmailOtp(email, otp); setAuthStep('password'); setMessage('Email verified. Create your password now. Next time you can sign in with your Phenom User ID or email address and this password.'); setBusy(false);
      void getMyProfile().then((p) => { setProfile(p); if (p) { setCategory(p.accountCategory); setRole(p.onboardingRole); setAccountType(p.accountType); setParentEmail(p.parentEmail || ''); } }).catch(() => undefined);
    } catch (e) { setMessage(e instanceof Error ? e.message : 'The verification code could not be accepted.'); setBusy(false); }
  };

  const createPassword = async () => {
    try {
      setBusy(true); setMessage(''); if (password !== passwordConfirm) throw new Error('The passwords do not match.'); await setAccountPassword(password); setAuthStep('method'); setMessage('Your Phenom account is ready. You can now sign in with your Phenom User ID or email address and your password.'); setBusy(false); void sendWelcomeEmail().catch(() => undefined); void getMyProfile().then((p) => setProfile(p)).catch(() => undefined);
    } catch (e) { setMessage(e instanceof Error ? e.message : 'Your password could not be created.'); setBusy(false); }
  };

  const startForgotPassword = async () => {
    try {
      setBusy(true); setMessage('');
      const supabase = getSupabase();
      if (!supabase) throw new Error('Connect Supabase before enabling password recovery.');
      let recoveryEmail = email.trim().toLowerCase();
      if (!recoveryEmail) throw new Error('Enter your Phenom User ID or email address first.');
      if (!recoveryEmail.includes('@')) {
        const { data: lookup, error: lookupError } = await supabase.rpc('lookup_phenom_profile', { p_email: null, p_user_id: recoveryEmail });
        if (lookupError) throw lookupError;
        const result = lookup as { found?: boolean; email?: string } | null;
        if (!result?.found || !result.email) throw new Error('We could not find that Phenom User ID. Check the ID and try again.');
        recoveryEmail = result.email.trim().toLowerCase();
      }
      const { data: lookup, error: lookupError } = await supabase.rpc('lookup_phenom_profile', { p_email: recoveryEmail, p_user_id: null });
      if (lookupError) throw lookupError;
      if (!Boolean((lookup as { exists?: boolean } | null)?.exists)) throw new Error('We could not find a Phenom account for that email address. Please check the details and try again.');
      const { error } = await supabase.auth.signInWithOtp({ email: recoveryEmail, options: { shouldCreateUser: false } });
      if (error) throw error;
      setEmail(recoveryEmail);
      setOtp('');
      setPassword('');
      setPasswordConfirm('');
      setAuthStep('forgotOtp');
      setMessage('A 6-digit password recovery code has been sent to your email address. Enter it here.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'We could not start password recovery.');
    } finally { setBusy(false); }
  };

  const verifyForgotPasswordOtp = async () => {
    try {
      setBusy(true); setMessage('');
      const supabase = getSupabase();
      if (!supabase) throw new Error('Connect Supabase before enabling password recovery.');
      const { data, error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: otp.replace(/\D/g, ''), type: 'email' });
      if (error) throw error;
      if (!data.session) throw new Error('The recovery code was accepted, but a secure session was not created. Please try again.');
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
      if (sessionError) throw sessionError;
      setPassword(''); setPasswordConfirm(''); setShowPassword(false); setAuthStep('forgotPassword'); setMessage('Your recovery code has been verified. Create and confirm your new password.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'The recovery code could not be accepted.');
    } finally { setBusy(false); }
  };

  const createNewPassword = async () => {
    try {
      setBusy(true); setMessage('');
      if (password.length < 8) throw new Error('Use at least 8 characters for your new password.');
      if (password !== passwordConfirm) throw new Error('The passwords do not match.');
      const supabase = getSupabase();
      if (!supabase) throw new Error('Connect Supabase before enabling password recovery.');
      const currentSession = await supabase.auth.getSession();
      if (!currentSession.data.session) throw new Error('Your recovery session is no longer active. Please verify the recovery code again.');
      const { data: userCheck, error: userCheckError } = await supabase.auth.getUser();
      if (userCheckError || !userCheck.user) throw new Error('Your recovery session is no longer active. Please verify the recovery code again.');
      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError || !refreshed.session) throw new Error('Your recovery session could not be refreshed. Please verify the recovery code again.');
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      let p = null;
      try {
        p = await getMyProfile();
      } catch {
        // Password reset has already succeeded; profile loading must not turn success into a false failure.
      }
      const userId = p?.phenomUserId || 'Being prepared';
      window.alert(`Welcome back! You have successfully created a new password.\n\nYour Phenom User ID is: ${userId}\n\nClick OK to continue.`);
      setProfile(p);
      setAuthStep('method');
      setMessage('Welcome back! You are signed in.');
      setPassword(''); setPasswordConfirm(''); setOtp('');
      window.location.assign('/');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Your new password could not be created.');
    } finally { setBusy(false); }
  };

  const saveSafety = async () => {
    try { await saveChildSafetySettings({ accountType, parentEmail }); setMessage('Safety settings saved.'); }
    catch (e) { setMessage(e instanceof Error ? e.message : 'Could not save settings.'); }
  };

  const roleLabel = accountChoices.find((x) => x.value === profile?.onboardingRole)?.label || 'Individual';

  return (
    <>
      {!profile ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-deep/70 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="phenom-auth-title" className="w-full max-w-md rounded-3xl bg-cream p-6 text-ink shadow-card sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[.18em] text-orange">Phenom Best Academy</p>
            <h2 id="phenom-auth-title" className="mt-2 font-display text-3xl font-bold">{authStep === 'method' ? 'Sign in to your account' : authStep === 'otp' ? 'Verify your email' : authStep === 'emailPassword' ? 'Sign in with password' : authStep === 'forgotOtp' ? 'Enter password recovery code' : authStep === 'forgotPassword' ? 'Create new password' : 'Create your password'}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {authStep === 'method' ? 'Sign in with your Phenom User ID or registered email address and password.' : authStep === 'otp' ? <>We sent a 6-digit code to <strong>{email}</strong>. Enter it here to continue.</> : authStep === 'emailPassword' ? 'Use your Phenom User ID or the email address registered to your Phenom account, together with your password.' : authStep === 'forgotOtp' ? <>We sent a 6-digit password recovery code to <strong>{email}</strong>. Enter it here to verify your identity.</> : authStep === 'forgotPassword' ? 'Your recovery code has been verified. Create and confirm your new password.' : 'Your email has been verified. Create your password now. Next time, you can sign in with your Phenom User ID or email address and this password.'}
            </p>

            {authStep === 'method' ? <>
              <div className="mt-5 rounded-xl border border-green/30 bg-green/5 p-4">
                <p className="text-sm font-semibold text-green">Sign in to your existing Phenom account</p>
                <label htmlFor="phenom-login-identifier" className="mt-3 block text-sm font-semibold">Phenom User ID or email address</label>
                <input id="phenom-login-identifier" type="text" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Phenom User ID or email address" className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-sm" />
                <label htmlFor="phenom-login-password" className="mt-3 block text-sm font-semibold">Password</label>
                <div className="relative mt-2">
                  <input id="phenom-login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-line bg-white p-3 pr-16 text-sm" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-green">{showPassword ? 'Hide' : 'Show'}</button>
                </div>
                <Button className="mt-4 w-full" onClick={async () => {
                  try {
                    setBusy(true); setMessage('');
                    const p = await signInWithEmailPassword(email, password);
                    setProfile(p);
                    if (p) { setCategory(p.accountCategory); setRole(p.onboardingRole); setAccountType(p.accountType); setParentEmail(p.parentEmail || ''); }
                    window.location.assign('/');
                  } catch (e) {
                    setMessage(e instanceof Error ? e.message : 'Phenom User ID/email and password sign-in failed.');
                  } finally { setBusy(false); }
                }} disabled={busy || !email.trim() || !password}>
                  {busy ? 'Signing in…' : 'Sign in'}
                </Button>
                <button type="button" onClick={startForgotPassword} disabled={busy || !email.trim()} className="mt-3 w-full text-sm font-semibold text-green disabled:opacity-50">Forgot password or Phenom User ID?</button>
              </div>
            </> : null}

            {authStep === 'otp' ? <div className="mt-5">
              <label htmlFor="phenom-otp" className="text-sm font-semibold">6-digit verification code</label>
              <input id="phenom-otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="mt-2 w-full rounded-xl border border-line bg-white p-4 text-center text-2xl tracking-[.35em]" />
              <Button className="mt-4 w-full" onClick={verifyEmail} disabled={busy || otp.length !== 6}>{busy ? 'Verifying…' : 'Verify email'}</Button>
              <button type="button" onClick={() => setAuthStep('method')} className="mt-3 w-full text-sm font-semibold text-green">Use a different email or sign-in method</button>
            </div> : null}

            {authStep === 'emailPassword' ? <div className="mt-5">
              <label htmlFor="phenom-login-identifier" className="text-sm font-semibold">Phenom User ID or email address</label>
              <input id="phenom-login-identifier" type="text" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Phenom User ID or email address" className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-sm" />
              <label htmlFor="phenom-login-password" className="mt-3 block text-sm font-semibold">Password</label>
              <input id="phenom-login-password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-sm" />
              <Button className="mt-4 w-full" onClick={async () => {
                try { setBusy(true); setMessage(''); const p = await signInWithEmailPassword(email, password); setProfile(p); if (p) { setCategory(p.accountCategory); setRole(p.onboardingRole); } window.location.assign('/'); }
                catch (e) { setMessage(e instanceof Error ? e.message : 'Use correct Phenom User ID or email address and password and try again.'); }
                finally { setBusy(false); }
              }} disabled={busy || !email.trim() || !password}>{busy ? 'Signing in…' : 'Sign in'}</Button>
              <button type="button" onClick={startForgotPassword} disabled={busy || !email.trim()} className="mt-4 w-full text-sm font-semibold text-green disabled:opacity-50">Forgot password or Phenom User ID?</button>
              <p className="mt-1 text-center text-xs text-muted">We will send a 6-digit recovery code to the email registered to your Phenom account.</p>
            </div> : null}

            {authStep === 'forgotOtp' ? <div className="mt-5">
              <label htmlFor="phenom-forgot-otp" className="text-sm font-semibold">6-digit password recovery code</label>
              <input id="phenom-forgot-otp" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="mt-2 w-full rounded-xl border border-line bg-white p-4 text-center text-2xl tracking-[.35em]" />
              <Button className="mt-4 w-full" onClick={verifyForgotPasswordOtp} disabled={busy || otp.length !== 6}>{busy ? 'Verifying…' : 'Verify recovery code'}</Button>
              <button type="button" onClick={() => { setMessage(''); setAuthStep('emailPassword'); }} className="mt-3 w-full text-sm font-semibold text-green">Back to sign in</button>
            </div> : null}

            {authStep === 'forgotPassword' ? <div className="mt-5">
              <label htmlFor="phenom-new-password" className="text-sm font-semibold">Create new password</label>
              <div className="relative mt-2"><input id="phenom-new-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-line bg-white p-3 pr-20 text-sm" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-green">{showPassword ? 'Hide' : 'Show'}</button></div>
              <label htmlFor="phenom-new-password-confirm" className="mt-3 block text-sm font-semibold">Confirm new password</label>
              <div className="relative mt-2"><input id="phenom-new-password-confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="w-full rounded-xl border border-line bg-white p-3 pr-20 text-sm" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-green">{showPassword ? 'Hide' : 'Show'}</button></div>
              <Button className="mt-4 w-full" onClick={createNewPassword} disabled={busy || password.length < 8 || password !== passwordConfirm}>{busy ? 'Creating new password…' : 'Create new password'}</Button>
              {password && password !== passwordConfirm ? <p className="mt-2 text-xs text-orange">The passwords do not match.</p> : null}
            </div> : null}

            {authStep === 'password' ? <div className="mt-5">
              <label htmlFor="phenom-password" className="text-sm font-semibold">Create password</label>
              <div className="relative mt-2"><input id="phenom-password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-xl border border-line bg-white p-3 pr-20 text-sm" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-green">{showPassword ? 'Hide' : 'Show'}</button></div>
              <label htmlFor="phenom-password-confirm" className="mt-3 block text-sm font-semibold">Confirm password</label>
              <div className="relative mt-2"><input id="phenom-password-confirm" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} className="w-full rounded-xl border border-line bg-white p-3 pr-20 text-sm" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-green">{showPassword ? 'Hide' : 'Show'}</button></div>
              <Button className="mt-4 w-full" onClick={createPassword} disabled={busy || password.length < 8 || password !== passwordConfirm}>{busy ? 'Creating password…' : 'Create password & continue'}</Button>
            </div> : null}

            {message ? <p className="mt-4 rounded-xl bg-paper p-3 text-sm text-muted">{message}</p> : null}
            {authStep !== 'method' && authStep !== 'forgotOtp' && authStep !== 'forgotPassword' ? <button type="button" onClick={() => setAuthStep('method')} className="mt-3 w-full text-xs text-muted">Back to sign-in options</button> : null}
            <p className="mt-4 text-center text-xs text-muted">Phenom Best Academy keeps your authentication secure. Your password is never shown to the Academy.</p>
          </div>
        </div>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-3xl bg-navy-deep p-6 text-cream sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">Phenom Best Academy account centre</p>
          <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold text-white sm:text-6xl">Know what you are joining before you create your account.</h1>
          <p className="mt-5 max-w-3xl text-on-navy-muted">Your account type determines the services and workspace you are shown. No public sign-up option can create a Super Admin account.</p>
          {!profile ? <>
            <div className="mt-7 rounded-2xl border border-white/15 bg-white/5 p-5"><label className="text-sm font-semibold text-cream">Choose account type</label><select value={role} onChange={(e) => selectRole(e.target.value as OnboardingRole)} className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 p-3 text-cream">{accountChoices.map((choice) => <option key={choice.value} value={choice.value} className="text-navy-deep">{choice.label}</option>)}</select><p className="mt-2 text-sm text-cream/60">{accountChoices.find((x) => x.value === role)?.description}</p><p className="mt-3 text-xs text-cream/50">Choosing School registers you as the administrator for that school workspace. It never creates or grants Super Admin access.</p></div>
            <label className="mt-6 block max-w-sm text-sm font-semibold text-cream">Academy language<select value={locale} onChange={(e) => { const value = e.target.value as SupportedLocale; setAccountLocale(value); setLocale(value); }} className="mt-2 w-full rounded-xl border border-white/15 bg-white/10 p-3 text-cream">{supportedLocales.map(([code, label]) => <option key={code} value={code} className="text-navy-deep">{label}</option>)}</select><span className="mt-1 block text-xs font-normal text-cream/55">This becomes the default language for the Academy and Tool Hub on this device.</span></label>
          </> : <div className="mt-6 flex flex-wrap items-center gap-3"><span className="rounded-full bg-white/10 px-4 py-2 text-sm">{profile.fullName}</span><span className="rounded-full bg-white/10 px-4 py-2 text-sm">{profile.accountCategory === 'school' ? `School · ${roleLabel}` : 'Individual'}</span><span className="rounded-full bg-white/10 px-4 py-2 text-sm">Phenom User ID: {profile.phenomUserId || 'Being prepared'}</span><Button variant="cream" onClick={async () => { const confirmed = window.confirm("Are you sure you want to sign out?\n\nYour Phenom Best Academy account and profile will remain saved. Only this active session will be signed out."); if (!confirmed) return; await signOut(); location.reload(); }}><LogOut className="mr-2 size-4" />Sign out</Button></div>}
        </div>

        {profile ? <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-green/30 bg-cream p-6 lg:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-green">Your Phenom access</p><h2 className="mt-1 font-display text-2xl font-semibold">Your Phenom Entry Points</h2><p className="mt-2 max-w-3xl text-sm text-muted">These are the Academy areas you can enter from your account. Each entry point means a specific workspace, service or control area available to you based on your account type, authorised role and access entitlement.</p></div><span className="rounded-full border border-green/30 bg-green/10 px-3 py-1 text-xs font-semibold text-green">{profile.accountCategory === 'school' ? 'School · ' + roleLabel : 'Individual account'}</span></div>
            <Link className="group rounded-2xl border-2 border-green bg-green/5 p-5 font-semibold text-green transition-colors hover:bg-green/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green sm:col-span-2 lg:col-span-4" to={profile.accountCategory === 'school' ? '/schools' : '/learning'}><div className="flex items-center justify-between gap-4"><div><span className="block text-lg">Phenom Best Academy Access</span><span className="mt-2 inline-flex rounded-full border border-green/40 bg-green/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green">{profile.role === 'super_admin' ? 'SUPER ADMIN' : profile.onboardingRole === 'school_admin' ? 'SCHOOL ADMINISTRATOR' : profile.onboardingRole === 'teacher' ? 'TEACHER' : profile.onboardingRole === 'student' ? 'STUDENT' : profile.role === 'staff' ? 'STAFF' : 'FREE'}</span></div><span className="text-sm font-semibold">Enter →</span></div></Link>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link className="group rounded-xl border border-green/25 bg-white p-4 font-semibold text-green transition-colors hover:border-green hover:bg-green/5" to="/learning"><GraduationCap className="mb-2 size-5 text-green" />Learning Centre<span className="mt-1 block text-xs font-normal text-muted">Free learning and authorised premium learning.</span></Link>
              <Link className="group rounded-xl border border-green/25 bg-white p-4 font-semibold text-green transition-colors hover:border-green hover:bg-green/5" to="/tools"><Compass className="mb-2 size-5 text-green" />Phenom Tool Hub<span className="mt-1 block text-xs font-normal text-muted">Free tools with premium features controlled by entitlement.</span></Link>
              <Link className="group rounded-xl border border-green/25 bg-white p-4 font-semibold text-green transition-colors hover:border-green hover:bg-green/5" to="/subscriptions"><ShieldCheck className="mb-2 size-5 text-green" />Plans & Premium<span className="mt-1 block text-xs font-normal text-muted">View plans and your current access status.</span></Link>
              <Link className="group rounded-xl border border-green/25 bg-white p-4 font-semibold text-green transition-colors hover:border-green hover:bg-green/5" to="/enquire"><Send className="mb-2 size-5 text-green" />Request a Service<span className="mt-1 block text-xs font-normal text-muted">Consultancy, training and other Academy services.</span></Link>
              {profile.accountCategory === 'school' || profile.role === 'super_admin' ? <Link className="group rounded-xl border border-green/25 bg-white p-4 font-semibold text-green transition-colors hover:border-green hover:bg-green/5" to="/schools"><Building2 className="mb-2 size-5 text-green" />School Platform<span className="mt-1 block text-xs font-normal text-muted">Available to authorised school users and Super Admin.</span></Link> : null}
              {profile.role === 'super_admin' ? <><Link className="rounded-xl border border-green/30 bg-green/5 p-4 font-semibold text-green" to="/admin"><Settings className="mb-2 size-5 text-green" />Super Admin Studio<span className="mt-1 block text-xs font-normal text-muted">Private control centre for platform administration.</span></Link><Link className="rounded-xl border border-green/30 bg-green/5 p-4 font-semibold text-green" to="/schools"><UsersRound className="mb-2 size-5 text-green" />All School Workspaces<span className="mt-1 block text-xs font-normal text-muted">Super Admin can enter authorised school environments.</span></Link></> : null}
            </div>
            {profile.role === 'super_admin' ? <div className="mt-5 rounded-2xl border border-purple/25 bg-purple/5 p-5"><div className="flex items-start gap-3"><Settings className="mt-0.5 size-5 text-purple" /><div><h3 className="font-display text-lg font-semibold">Super Admin access</h3><p className="mt-1 text-sm text-muted">This private entry point is shown only to the authenticated Super Admin profile.</p><Button asChild className="mt-4"><Link to="/admin">Open Super Admin Studio</Link></Button></div></div></div> : null}
          </div>
          <div className="rounded-2xl border border-green/30 bg-cream p-6 lg:col-span-2"><p className="text-xs font-semibold uppercase tracking-[.16em] text-green">Language learning settings</p><h2 className="mt-2 font-display text-2xl font-semibold">Interface language and learning language are separate</h2><p className="mt-2 text-sm text-muted">Your interface language controls Phenom. Your learning language is the language you are studying. Explanations and support can remain in your familiar language.</p><div className="mt-4 grid gap-4 md:grid-cols-3"><label className="block text-sm font-semibold">Interface language<select value={locale} onChange={(e) => { const v=e.target.value as SupportedLocale; setAccountLocale(v); setLocale(v); setSupportLocale(v); void savePreferredLocale(v).catch(()=>undefined); }} className="mt-1 w-full rounded-xl border border-line bg-white p-3">{supportedLocales.map(([code,label]) => <option key={code} value={code}>{label}</option>)}</select></label><label className="block text-sm font-semibold">Language I am studying<select value={learningLocale} onChange={(e) => { const v=e.target.value as SupportedLocale | ''; setLearningLocale(v); void saveLearningLanguage(v || null, supportLocale); }} className="mt-1 w-full rounded-xl border border-line bg-white p-3"><option value="">Not selected</option>{supportedLocales.map(([code,label]) => <option key={code} value={code}>{label}</option>)}</select></label><label className="block text-sm font-semibold">Support / explanation language<select value={supportLocale} onChange={(e) => { const v=e.target.value as SupportedLocale; setSupportLocale(v); void saveLearningLanguage(learningLocale || null, v); }} className="mt-1 w-full rounded-xl border border-line bg-white p-3">{supportedLocales.map(([code,label]) => <option key={code} value={code}>{label}</option>)}</select></label></div></div>
          <div className="rounded-2xl border border-line bg-cream p-6"><ShieldCheck className="text-green" /><h2 className="mt-3 font-display text-xl font-semibold">Safety & family connection</h2><label className="mt-4 block text-sm font-semibold">Account safety type<select className="mt-1 w-full rounded-xl border border-line bg-white p-3" value={accountType} onChange={(e) => setAccountType(e.target.value as typeof accountType)}><option value="adult">Adult</option><option value="teen">Teenager</option><option value="child">Child</option></select></label><label className="mt-3 block text-sm font-semibold">Parent/guardian email<input type="email" className="mt-1 w-full rounded-xl border border-line bg-white p-3" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="parent@example.com" /></label><Button className="mt-4" onClick={saveSafety}>Save safety settings</Button></div>
          <div className="rounded-2xl border border-line bg-cream p-6"><HeartHandshake className="text-purple" /><h2 className="mt-3 font-display text-xl font-semibold">Super Admin is separate</h2><p className="mt-2 text-sm text-muted">Public registration never offers Super Admin. The Academy owner account is designated privately through the protected database administration process.</p></div>
        </div> : null}
        {message && <p className="mt-5 rounded-xl bg-orange/10 p-4 text-sm">{message}</p>}
      </section>
    </>
  );
}
