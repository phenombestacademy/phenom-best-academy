import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ShieldCheck, LogOut, UserRound, UsersRound, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMyProfile, getSession, logAnalytics, saveChildSafetySettings, signInWithGoogle, signOut, submitSuggestion, type Profile } from '@/lib/platform';

export const Route = createFileRoute('/account')({ component: AccountPage });

function AccountPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [connected, setConnected] = useState(true);
  const [accountType, setAccountType] = useState<'adult'|'teen'|'child'>('adult');
  const [parentEmail, setParentEmail] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => { getMyProfile().then((p) => { setProfile(p); if (p) { setAccountType(p.accountType); setParentEmail(p.parentEmail || ''); } }).catch(() => setConnected(false)); }, []);

  const login = async () => { try { await signInWithGoogle(); } catch (e) { setMessage(e instanceof Error ? e.message : 'Sign-in could not start.'); } };
  const save = async () => { try { await saveChildSafetySettings({ accountType, parentEmail }); setMessage('Account safety settings saved.'); await logAnalytics('account_safety_updated', { accountType }); } catch (e) { setMessage(e instanceof Error ? e.message : 'Could not save settings.'); } };
  const suggest = async () => { if (!suggestion.trim()) return; try { await submitSuggestion('Platform suggestion', suggestion); setSuggestion(''); setMessage('Thank you. Your suggestion has been received.'); } catch (e) { setMessage(e instanceof Error ? e.message : 'Could not send suggestion.'); } };

  return <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
    <div className="rounded-3xl bg-navy-deep p-6 text-cream sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Phenom account</p>
      <h1 className="mt-3 font-display text-3xl font-bold sm:text-5xl">Your Academy space</h1>
      <p className="mt-4 max-w-2xl text-cream/75">Use the Academy without an account, or sign in securely when you want saved learning progress, services, community features and personalised tools.</p>
      {!profile ? <Button className="mt-6" onClick={login} disabled={!connected}><UserRound className="mr-2 size-4"/> Continue with Google</Button> : <div className="mt-6 flex flex-wrap items-center gap-3"><span className="rounded-full bg-cream/10 px-4 py-2 text-sm">{profile.fullName}</span><Button variant="cream" onClick={() => signOut().then(() => location.reload())}><LogOut className="mr-2 size-4"/> Sign out</Button></div>}
    </div>

    {profile && <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-line bg-cream p-6">
        <div className="flex items-start gap-3"><ShieldCheck className="mt-1 size-6 text-green"/><div><h2 className="font-display text-xl font-semibold">Safety & family connection</h2><p className="mt-2 text-sm text-muted">Children and teenagers can use the platform with stronger safeguards and a parent/guardian connection.</p></div></div>
        <label className="mt-5 block text-sm font-semibold">Account type<select className="mt-2 w-full rounded-xl border border-line bg-white p-3" value={accountType} onChange={(e) => setAccountType(e.target.value as typeof accountType)}><option value="adult">Adult</option><option value="teen">Teenager</option><option value="child">Child</option></select></label>
        <label className="mt-4 block text-sm font-semibold">Parent/guardian email{accountType !== 'adult' ? <span className="font-normal text-muted"> (required for protected youth accounts)</span> : null}<input type="email" className="mt-2 w-full rounded-xl border border-line bg-white p-3" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="parent@example.com" /></label>
        <Button className="mt-4" onClick={save}>Save safety settings</Button>
        <p className="mt-3 text-xs text-muted">Parents should receive safety summaries and controls. Private content should not be exposed indiscriminately; serious safety signals can be escalated for review.</p>
      </div>
      <div className="rounded-2xl border border-line bg-cream p-6">
        <div className="flex items-start gap-3"><UsersRound className="mt-1 size-6 text-purple"/><div><h2 className="font-display text-xl font-semibold">Academy services</h2><p className="mt-2 text-sm text-muted">Mentorship and counselling remain Academy-controlled services. A user requests help from Phenom Best Academy; the Academy assigns the appropriate professional.</p></div></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2"><a className="rounded-xl border border-line p-4 hover:border-purple" href="/enquire">Request a service</a><a className="rounded-xl border border-line p-4 hover:border-purple" href="/tools">Open Smart Tools</a></div>
      </div>
      <div className="rounded-2xl border border-line bg-cream p-6 lg:col-span-2">
        <div className="flex items-start gap-3"><Lightbulb className="mt-1 size-6 text-orange"/><div className="w-full"><h2 className="font-display text-xl font-semibold">Suggest an improvement</h2><textarea className="mt-3 min-h-32 w-full rounded-xl border border-line bg-white p-3" value={suggestion} onChange={(e) => setSuggestion(e.target.value)} placeholder="Tell Phenom Best Academy what would make the platform more useful..."/><Button className="mt-3" onClick={suggest}>Send suggestion</Button></div></div>
      </div>
    </div>}
    {message && <p className="mt-5 rounded-xl bg-green/10 p-4 text-sm text-ink">{message}</p>}
  </section>
}
