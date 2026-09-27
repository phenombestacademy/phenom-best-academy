import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { getSupabase } from '@/lib/cms';
import { signInWithEmailPassword } from '@/lib/platform';

export const Route = createFileRoute('/signin')({ component: SignInPage });

function SignInPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const signIn = async () => {
    try {
      setBusy(true);
      setMessage('');
      const value = identifier.trim();
      let email = value.toLowerCase();
      if (!value.includes('@')) {
        const supabase = getSupabase();
        if (!supabase) throw new Error('Connect Supabase before enabling accounts.');
        const { data, error } = await supabase.rpc('lookup_auth_email_by_phenom_user_id', {
          p_phenom_user_id: value,
        });
        if (error) throw error;
        if (!data) throw new Error('Phenom User ID was not found. Check the ID and try again.');
        email = String(data).toLowerCase();
      }

      const profile = await signInWithEmailPassword(email, password);
      setMessage(profile?.phenomUserId ? `Signed in. Phenom User ID: ${profile.phenomUserId}` : 'Signed in successfully.');
      setTimeout(() => navigate({ to: '/' }), 250);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream px-4 py-12 text-ink">
      <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-card sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[.18em] text-orange">Phenom Best Academy</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Sign in to your Phenom account</h1>
        <p className="mt-3 text-sm text-muted">Use your Phenom User ID or the email address used to create your account, together with your password.</p>

        <label className="mt-6 block text-sm font-semibold" htmlFor="signin-id">Phenom User ID or email address</label>
        <input id="signin-id" value={identifier} onChange={e => setIdentifier(e.target.value)} autoComplete="username" className="mt-2 w-full rounded-xl border border-line bg-paper p-3 text-sm" placeholder="PBA-XXXXXXXX or you@example.com" />

        <label className="mt-4 block text-sm font-semibold" htmlFor="signin-password">Password</label>
        <div className="relative mt-2">
          <input id="signin-password" type={show ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" className="w-full rounded-xl border border-line bg-paper p-3 pr-20 text-sm" />
          <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-green">{show ? 'Hide' : 'Show'}</button>
        </div>

        <Button className="mt-5 w-full" onClick={signIn} disabled={busy || !identifier.trim() || !password}>{busy ? 'Signing in…' : 'Sign in'}</Button>
        {message && <p className="mt-4 rounded-xl bg-paper p-3 text-sm text-muted">{message}</p>}
      </div>
    </div>
  );
}
