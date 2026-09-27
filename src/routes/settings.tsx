import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Camera, KeyRound, LockKeyhole, LogOut, Settings2, UserCircle, BookOpen, Languages, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero, Section } from "@/components/page-hero";
import {
  changePassword,
  getMyActiveSubscriptions,
  getMyProfile,
  removeProfileAvatar,
  saveProfileDetails,
  sendPasswordChangeOtp,
  signOut,
  uploadProfileAvatar,
  verifyPasswordChangeOtp,
  type ActiveSubscription,
  type Profile,
} from "@/lib/platform";
import { supportedLocales } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

type SettingsTab = "profile" | "programmes" | "security" | "preferences";

const programmeOptions = [
  { title: "Learning catalogue", body: "Academic support, youth learning, languages, examination pathways and other learning services.", to: "/learning", icon: GraduationCap },
  { title: "CPD", body: "Continuing professional development and professional learning pathways.", to: "/cpd", icon: BookOpen },
  { title: "Languages", body: "African and global language education for learning, work and international engagement.", to: "/programmes", icon: Languages },
];

function initials(profile: Profile | null) {
  if (!profile) return "P";
  const source = profile.fullName || profile.email || "Phenom";
  return source.split(/\s+/).filter(Boolean).slice(0, 2).map((x) => x[0]).join("").toUpperCase();
}

function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscriptions, setSubscriptions] = useState<ActiveSubscription[]>([]);
  const [tab, setTab] = useState<SettingsTab>("profile");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [securityStep, setSecurityStep] = useState<"ready" | "otp" | "newPassword">("ready");
  const fileInput = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    firstName: "", middleName: "", surname: "", phone: "", dateOfBirth: "", gender: "", country: "Nigeria", stateRegion: "", city: "", address: "",
  });

  useEffect(() => {
    Promise.all([getMyProfile(), getMyActiveSubscriptions()])
      .then(([p, subs]) => {
        if (!p) {
          window.location.assign("/account");
          return;
        }
        setProfile(p);
        setSubscriptions(subs);
        setForm({
          firstName: p.firstName || "",
          middleName: p.middleName || "",
          surname: p.surname || "",
          phone: p.phone || "",
          dateOfBirth: p.dateOfBirth || "",
          gender: p.gender || "",
          country: p.country || "Nigeria",
          stateRegion: p.stateRegion || "",
          city: p.city || "",
          address: p.address || "",
        });
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Could not load your account settings."));
  }, []);

  const saveProfile = async () => {
    try {
      setBusy(true); setMessage("");
      const updated = await saveProfileDetails(form);
      setProfile(updated);
      setMessage("Profile saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Profile could not be saved.");
    } finally { setBusy(false); }
  };

  const chooseAvatar = async (file: File) => {
    try {
      setBusy(true); setMessage("");
      const url = await uploadProfileAvatar(file);
      setProfile((current) => current ? { ...current, avatarUrl: url } : current);
      setMessage("Profile picture updated successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Profile picture could not be uploaded.");
    } finally { setBusy(false); }
  };

  const removeAvatar = async () => {
    try {
      setBusy(true); setMessage("");
      await removeProfileAvatar();
      setProfile((current) => current ? { ...current, avatarUrl: null } : current);
      setMessage("Profile picture removed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Profile picture could not be removed.");
    } finally { setBusy(false); }
  };

  const startPasswordChange = async () => {
    try {
      setBusy(true); setMessage("");
      await sendPasswordChangeOtp();
      setOtp(""); setSecurityStep("otp");
      setMessage(`A 6-digit verification code has been sent to ${profile?.email || "your email address"}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "We could not send the verification code.");
    } finally { setBusy(false); }
  };

  const verifyPasswordOtp = async () => {
    try {
      setBusy(true); setMessage("");
      await verifyPasswordChangeOtp(otp);
      setPassword(""); setPasswordConfirm(""); setShowPassword(false); setSecurityStep("newPassword");
      setMessage("Verification successful. Create your new password.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The verification code could not be accepted.");
    } finally { setBusy(false); }
  };

  const saveNewPassword = async () => {
    try {
      setBusy(true); setMessage("");
      await changePassword(password, passwordConfirm);
      setPassword(""); setPasswordConfirm(""); setOtp(""); setSecurityStep("ready");
      setMessage(`Password changed successfully. Your Phenom User ID is ${profile?.phenomUserId || "available in your profile"}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Your password could not be changed.");
    } finally { setBusy(false); }
  };

  if (!profile) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted">Loading your Phenom account…</div>;
  }

  return (
    <>
      <PageHero
        kicker="Phenom Account Centre"
        title="Your profile, settings and programmes."
        lede="Manage your Phenom identity, profile picture, personal information, security and learning programmes from one place."
      />

      <Section>
        <div className="grid gap-6 lg:grid-cols-[18rem_1fr]">
          <aside className="rounded-3xl bg-cream p-5 shadow-card">
            <div className="flex flex-col items-center text-center">
              <button type="button" onClick={() => fileInput.current?.click()} className="group relative flex size-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-navy-deep text-2xl font-bold text-cream shadow-card" aria-label="Change profile picture">
                {profile.avatarUrl ? <img src={profile.avatarUrl} alt="Profile" className="size-full object-cover" /> : initials(profile)}
                <span className="absolute inset-0 hidden items-center justify-center bg-navy-deep/65 text-xs font-semibold group-hover:flex"><Camera className="mr-1 size-4" /> Change</span>
              </button>
              <input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) void chooseAvatar(file); e.currentTarget.value = ""; }} />
              <p className="mt-3 font-display text-xl font-semibold">{profile.fullName || "Phenom User"}</p>
              <p className="mt-1 text-xs text-muted">Phenom User ID</p>
              <p className="font-semibold text-green">{profile.phenomUserId || "Being prepared"}</p>
              <p className="mt-1 break-all text-xs text-muted">{profile.email}</p>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" onClick={() => fileInput.current?.click()} disabled={busy}>Change picture</Button>
                {profile.avatarUrl ? <Button size="sm" variant="outline" onClick={() => void removeAvatar()} disabled={busy}>Remove</Button> : null}
              </div>
            </div>

            <nav className="mt-6 space-y-1" aria-label="Account settings">
              {(["profile", "programmes", "security", "preferences"] as const).map((id) => (
                <button key={id} type="button" onClick={() => setTab(id)} className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold ${tab === id ? "bg-navy-deep text-cream" : "text-ink hover:bg-paper"}`}>
                  {id === "profile" ? <UserCircle className="size-4" /> : id === "programmes" ? <BookOpen className="size-4" /> : id === "security" ? <LockKeyhole className="size-4" /> : <Settings2 className="size-4" />}
                  {id === "profile" ? "Profile" : id === "programmes" ? "My Programmes" : id === "security" ? "Security" : "Preferences"}
                </button>
              ))}
            </nav>

            <button type="button" onClick={async () => { const ok = window.confirm("Sign out of your Phenom account?"); if (ok) await signOut(); }} className="mt-5 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-700 hover:bg-red-50"><LogOut className="size-4" /> Sign out</button>
          </aside>

          <div className="min-w-0 rounded-3xl bg-cream p-5 shadow-card sm:p-7">
            {message ? <div className="mb-5 rounded-xl border border-line bg-paper p-4 text-sm" role="status">{message}</div> : null}

            {tab === "profile" ? <div>
              <div className="flex items-center gap-3"><UserCircle className="size-6 text-green" /><div><h2 className="font-display text-2xl font-semibold">Profile</h2><p className="text-sm text-muted">Keep your Phenom identity and personal information current.</p></div></div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[['firstName','First name'],['middleName','Middle name'],['surname','Surname'],['phone','Phone number'],['dateOfBirth','Date of birth'],['gender','Gender'],['country','Country'],['stateRegion','State / region'],['city','City']].map(([key,label]) => <label key={key} className="text-sm font-semibold">{label}<input type={key === 'dateOfBirth' ? 'date' : key === 'phone' ? 'tel' : 'text'} value={form[key as keyof typeof form]} onChange={(e) => setForm((x) => ({ ...x, [key]: e.target.value }))} className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-sm font-normal" /></label>)}
                <label className="text-sm font-semibold sm:col-span-3">Address<textarea value={form.address} onChange={(e) => setForm((x) => ({ ...x, address: e.target.value }))} rows={3} className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-sm font-normal" /></label>
              </div>
              <div className="mt-6 rounded-xl border border-line bg-paper p-4"><p className="text-xs uppercase tracking-[.14em] text-muted">Account identity</p><p className="mt-2 text-sm"><strong>Email:</strong> {profile.email}</p><p className="mt-1 text-sm"><strong>Phenom User ID:</strong> {profile.phenomUserId || "Being prepared"}</p><p className="mt-1 text-sm"><strong>Account type:</strong> {profile.onboardingRole.replaceAll('_', ' ')}</p></div>
              <Button className="mt-6" onClick={() => void saveProfile()} disabled={busy}>Save profile</Button>
            </div> : null}

            {tab === "programmes" ? <div>
              <div className="flex items-center gap-3"><BookOpen className="size-6 text-green" /><div><h2 className="font-display text-2xl font-semibold">My Programmes</h2><p className="text-sm text-muted">Explore programmes available to your account and manage active access.</p></div></div>
              <div className="mt-6 rounded-2xl border border-line bg-paper p-4"><p className="font-semibold">Current access</p>{subscriptions.length ? <ul className="mt-3 space-y-2">{subscriptions.map((sub) => <li key={sub.id} className="rounded-xl bg-cream p-3 text-sm"><strong>{sub.planCode}</strong> · {sub.status}</li>)}</ul> : <p className="mt-2 text-sm text-muted">No active paid/trial programme is currently recorded on your account.</p>}</div>
              <div className="mt-5 grid gap-4 md:grid-cols-3">{programmeOptions.map((option) => { const Icon = option.icon; return <article key={option.title} className="rounded-2xl border border-line bg-white p-5"><Icon className="size-6 text-green" /><h3 className="mt-3 font-display text-xl font-semibold">{option.title}</h3><p className="mt-2 text-sm text-muted">{option.body}</p><Button asChild className="mt-5"><Link to={option.to}>{option.title === 'CPD' ? 'Explore CPD' : option.title === 'Languages' ? 'Explore languages' : 'Open catalogue'}</Link></Button></article>; })}</div>
              <p className="mt-5 text-xs text-muted">Programme eligibility and payment requirements are applied by the relevant programme service. This settings page is the account-level starting point for selecting additional programmes.</p>
            </div> : null}

            {tab === "security" ? <div>
              <div className="flex items-center gap-3"><KeyRound className="size-6 text-green" /><div><h2 className="font-display text-2xl font-semibold">Security</h2><p className="text-sm text-muted">Change your password securely using email verification.</p></div></div>
              {securityStep === "ready" ? <div className="mt-6 rounded-2xl border border-line bg-paper p-5"><p className="text-sm">To change your password, Phenom will send a 6-digit OTP to your registered email address. After verification, you will create and confirm your new password.</p><Button className="mt-5" onClick={() => void startPasswordChange()} disabled={busy}>Change password</Button></div> : null}
              {securityStep === "otp" ? <div className="mt-6 rounded-2xl border border-line bg-paper p-5"><p className="text-sm">Enter the 6-digit OTP sent to <strong>{profile.email}</strong>.</p><input inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="mt-4 w-full rounded-xl border border-line bg-white p-4 text-center text-2xl tracking-[.35em]" /><Button className="mt-4 w-full" onClick={() => void verifyPasswordOtp()} disabled={busy || otp.length !== 6}>{busy ? 'Verifying…' : 'Verify OTP'}</Button></div> : null}
              {securityStep === "newPassword" ? <div className="mt-6 rounded-2xl border border-line bg-paper p-5"><p className="text-sm">Create and confirm your new password.</p><div className="relative mt-4"><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New password" className="w-full rounded-xl border border-line bg-white p-3 pr-24" /><button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-2.5 text-xs font-semibold text-green">{showPassword ? 'Hide' : 'Show'}</button></div><div className="relative mt-3"><input type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} placeholder="Confirm new password" className="w-full rounded-xl border border-line bg-white p-3 pr-24" /></div><Button className="mt-4 w-full" onClick={() => void saveNewPassword()} disabled={busy || !password || !passwordConfirm}>{busy ? 'Saving…' : 'Create new password'}</Button></div> : null}
            </div> : null}

            {tab === "preferences" ? <div>
              <div className="flex items-center gap-3"><Settings2 className="size-6 text-green" /><div><h2 className="font-display text-2xl font-semibold">Preferences</h2><p className="text-sm text-muted">Manage account-level preferences. Language is also available in the site header.</p></div></div>
              <div className="mt-6 rounded-2xl border border-line bg-paper p-5"><label className="text-sm font-semibold">Academy language<select value={profile.preferredLocale || 'en-NG'} onChange={(e) => setProfile((p) => p ? { ...p, preferredLocale: e.target.value } : p)} className="mt-2 w-full rounded-xl border border-line bg-white p-3 text-sm">{supportedLocales.map(([code,label]) => <option key={code} value={code}>{label}</option>)}</select></label><p className="mt-2 text-xs text-muted">Your selected language is saved with your Phenom profile when changed through the main site language control.</p></div>
            </div> : null}
          </div>
        </div>
      </Section>
    </>
  );
}
