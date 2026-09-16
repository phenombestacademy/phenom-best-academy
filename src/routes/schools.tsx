import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BarChart3, BookOpenCheck, Building2, CheckCircle2, ClipboardCheck, Coins, GraduationCap, ShieldCheck, Sparkles, Users, Vote, WalletCards } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMySchoolMembership, getSchoolDashboardSummary, createSchool, generateQuiz, type SchoolContext, type SchoolDashboardSummary } from '@/lib/school';
import { getMyProfile, type Profile } from '@/lib/platform';

export const Route = createFileRoute('/schools')({ component: SchoolsPage });

const modules = [
  ['Attendance', 'Daily arrival/departure, late/half-day/absence tracking and attendance summaries.', ClipboardCheck],
  ['Results & report cards', 'Configurable assessments, terms, cumulative results, comments and school-branded reports.', BarChart3],
  ['Students & classes', 'Student records, classes, subjects, guardians and controlled school membership.', GraduationCap],
  ['Learning & CBT', 'Assignments, learning materials, teacher-authored or generated questions and CBT.', BookOpenCheck],
  ['Finance & receipts', 'School fees, discounts, adjustments, part-payments, allocations and receipts.', Coins],
  ['HR & payroll', 'Staff records, salary structures, payroll runs, deductions and payslips.', WalletCards],
  ['School elections', 'Positions, candidates, verified voters, one vote per position and published results.', Vote],
  ['ID cards & growth', 'School ID-card templates, student identity records and configurable growth records.', Users],
] as const;

function SchoolsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [context, setContext] = useState<SchoolContext | null>(null);
  const [summary, setSummary] = useState<SchoolDashboardSummary | null>(null);
  const [schoolName, setSchoolName] = useState('');
  const [created, setCreated] = useState(false);
  const [subject, setSubject] = useState('Mathematics');
  const [topic, setTopic] = useState('Fractions');
  const [level, setLevel] = useState(1);
  const [count, setCount] = useState<10 | 20>(10);
  const [message, setMessage] = useState('');

  useEffect(() => {
    getMyProfile().then(async p => {
      setProfile(p);
      const c = await getMySchoolMembership();
      setContext(c);
      if (c) setSummary(await getSchoolDashboardSummary(c.school.id));
    }).catch(() => setMessage('The school platform could not load its connected account data.'));
  }, []);

  async function handleCreateSchool() {
    if (!schoolName.trim()) return setMessage('Enter the school name first.');
    try {
      await createSchool({ name: schoolName, primaryColor: '#c94b16' });
      setCreated(true);
      setMessage('School environment created and your account has been assigned as School Administrator.');
      const c = await getMySchoolMembership();
      setContext(c);
      if (c) setSummary(await getSchoolDashboardSummary(c.school.id));
    } catch (e) { setMessage(e instanceof Error ? e.message : 'School creation needs the connected Academy database and activation SQL.'); }
  }

  async function handlePreviewGeneration() {
    setMessage('Preparing the learning set…');
    try { await generateQuiz({ subject, topic, level, questionCount: count, language: 'English', oneAttempt: true, allowRedo: true }); setMessage('Question set prepared. Students receive the finished questions, not the generation process.'); }
    catch (e) { setMessage(e instanceof Error ? e.message : 'Connect the learning engine to generate questions.'); }
  }

  const role = context?.role || (profile?.onboardingRole === 'school_admin' ? 'school_admin' : profile?.onboardingRole);
  const canAdmin = role === 'school_admin' || profile?.role === 'staff' || profile?.role === 'admin' || profile?.role === 'super_admin';

  return <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
    <div className="rounded-3xl bg-navy-deep p-6 text-cream sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">School & Learning Management Platform</p><h1 className="mt-3 max-w-5xl font-display text-4xl font-bold sm:text-6xl">A connected school environment for administration, teaching, learning and parents.</h1><p className="mt-5 max-w-3xl text-cream/80">The modules below are the working platform map. Access is controlled by school membership and Academy-level roles; customers should only see the areas their account is authorised to use.</p><div className="mt-7 flex flex-wrap gap-3"><Button asChild><Link to="/account">Account & sign-in</Link></Button><Button asChild variant="cream"><Link to="/subscriptions">Premium access</Link></Button><Button asChild variant="cream"><Link to="/school-results">Results</Link></Button></div></div>

    {!context && <div className="mt-8 rounded-2xl border border-line bg-cream p-6"><Building2 className="text-purple"/><h2 className="mt-3 font-display text-2xl font-semibold">Start a school environment</h2><p className="mt-2 text-muted">Sign in as a School Administrator to create a school. The creation action assigns the authenticated user to that school rather than creating an unowned school record.</p><label className="mt-5 block text-sm font-semibold">School name<input value={schoolName} onChange={e=>setSchoolName(e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3" placeholder="Enter school name"/></label><Button className="mt-4" onClick={handleCreateSchool} disabled={!profile || profile.accountCategory !== 'school' || profile.onboardingRole !== 'school_admin'}>{created ? 'School environment ready' : 'Create school environment'}</Button>{!profile&&<p className="mt-3 text-xs text-muted">Please sign in first and choose School → School Administrator on the Account page.</p>}{profile&&profile.accountCategory !== 'school'&&<p className="mt-3 text-xs text-muted">This account is currently an Individual account. Choose School on your Account page to start a school workflow.</p>}{message&&<p className="mt-3 text-sm text-muted">{message}</p>}</div>}

    {context && <>
      <div className="mt-8 rounded-2xl border border-line bg-cream p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-purple">Connected school</p><h2 className="mt-1 font-display text-3xl font-semibold">{context.school.name}</h2><p className="mt-2 text-sm text-muted">Role: <strong>{context.role.replace('_',' ')}</strong> · Tenant ID: {context.school.id}</p></div><ShieldCheck className="size-8 text-green"/></div>{summary&&<div className="mt-6 grid gap-3 grid-cols-2 sm:grid-cols-4 lg:grid-cols-8">{[['Classes',summary.classes],['Students',summary.students],['Subjects',summary.subjects],['Attendance',summary.attendance],['Results',summary.results],['Staff',summary.staff],['Fee payments',summary.feePayments],['Elections',summary.elections]].map(([label,value])=><div key={String(label)} className="rounded-xl bg-paper p-4"><p className="text-xs text-muted">{label}</p><p className="mt-1 text-2xl font-bold">{value}</p></div>)}</div>}</div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{modules.map(([title,body,Icon])=><article key={title} className="rounded-2xl border border-line bg-cream p-5 shadow-card"><Icon className="text-orange"/><h2 className="mt-3 font-display text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted">{body}</p></article>)}</div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-cream p-6"><ClipboardCheck className="text-green"/><h2 className="mt-3 font-display text-2xl font-semibold">Attendance & student records</h2><p className="mt-2 text-sm leading-relaxed text-muted">The connected school schema supports configurable daily attendance checkpoints, arrival/departure, late/half-day/absent states, attendance points, student records, guardians, emergency profiles and growth records.</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-paper px-3 py-1 text-xs">Daily attendance</span><span className="rounded-full bg-paper px-3 py-1 text-xs">Arrival/departure</span><span className="rounded-full bg-paper px-3 py-1 text-xs">Guardians</span><span className="rounded-full bg-paper px-3 py-1 text-xs">Growth</span></div></div>
        <div className="rounded-2xl border border-line bg-cream p-6"><Coins className="text-gold"/><h2 className="mt-3 font-display text-2xl font-semibold">Finance, HR & school administration</h2><p className="mt-2 text-sm leading-relaxed text-muted">The school database includes fee schedules, discounts/adjustments, payments, allocations, receipts, staff records, payroll runs/items, elections and ID-card templates. The next production layer is to connect these records to role-specific management forms.</p><div className="mt-4 flex flex-wrap gap-2"><span className="rounded-full bg-paper px-3 py-1 text-xs">Fees</span><span className="rounded-full bg-paper px-3 py-1 text-xs">Receipts</span><span className="rounded-full bg-paper px-3 py-1 text-xs">Payroll</span><span className="rounded-full bg-paper px-3 py-1 text-xs">Elections</span></div></div>
      </div>

      {canAdmin && <div className="mt-8 rounded-2xl border border-purple/20 bg-purple/5 p-6"><Sparkles className="text-purple"/><h2 className="mt-3 font-display text-2xl font-semibold">Administrator workspace</h2><p className="mt-2 text-sm text-muted">School administrators manage only this school. Academy staff/super administrators retain the higher control layer. Use the results manager for assessments and the learning catalogue for Academy learning content.</p><div className="mt-4 flex flex-wrap gap-3"><Button asChild variant="outline"><Link to="/school-results">Open results manager</Link></Button><Button asChild variant="outline"><Link to="/admin-learning">Open learning manager</Link></Button></div></div>}

      <div className="mt-8 rounded-2xl border border-line bg-cream p-6"><h2 className="font-display text-2xl font-semibold">Smart assignment & quiz engine</h2><p className="mt-2 text-sm text-muted">Choose subject, topic, level, language and question count. The generation process stays server-side.</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-sm font-semibold">Subject<input value={subject} onChange={e=>setSubject(e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2"/></label><label className="text-sm font-semibold">Topic<input value={topic} onChange={e=>setTopic(e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2"/></label><label className="text-sm font-semibold">Level<select value={level} onChange={e=>setLevel(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2">{[1,2,3,4,5,6,7,8,9,10].map(x=><option key={x} value={x}>Level {x}</option>)}</select></label><label className="text-sm font-semibold">Questions<select value={count} onChange={e=>setCount(Number(e.target.value) as 10|20)} className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2"><option value={10}>10 questions</option><option value={20}>20 questions</option></select></label></div><Button variant="outline" className="mt-4" onClick={handlePreviewGeneration}>Prepare question set</Button>{message&&<p className="mt-3 text-sm text-muted">{message}</p>}</div>
    </>}

    {!context && <div className="mt-8 rounded-2xl border border-line bg-cream p-6"><h2 className="font-display text-2xl font-semibold">School platform security hierarchy</h2><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{['Phenom Super Admin','Academy Admin / Staff','School Admin','Teacher','Student / Parent'].map((x,i)=><div key={x} className="rounded-xl bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted">Level {i+1}</p><p className="mt-1 font-semibold">{x}</p><p className="mt-2 text-xs text-muted">{i<2?'Higher platform authority':i===2?'Own school only':i===3?'Assigned classes only':'Own account / linked child'}</p></div>)}</div></div>}
  </section>
}
