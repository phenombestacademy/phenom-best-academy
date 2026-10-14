import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/cms';
import { getMySchoolMembership, type SchoolContext } from '@/lib/school';

export const Route = createFileRoute('/school-cbt')({ component: SchoolCbtPage });
type Assessment = { id: string; title: string; assessment_type: string; academic_session: string; term_no: number; status: string; duration_minutes: number; contributes_to_report: boolean };
type Option = { id: string; name: string };

function SchoolCbtPage() {
  const [context, setContext] = useState<SchoolContext | null>(null);
  const [classes, setClasses] = useState<Option[]>([]);
  const [subjects, setSubjects] = useState<Option[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [session, setSession] = useState('');
  const [term, setTerm] = useState('1');
  const [duration, setDuration] = useState(30);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  async function refresh(schoolId: string) {
    const db = getSupabase();
    if (!db) throw new Error('Supabase is not configured.');
    const [c, s, a] = await Promise.all([
      db.from('school_classes').select('id,name').eq('school_id', schoolId).order('name'),
      db.from('school_subjects').select('id,name').eq('school_id', schoolId).order('name'),
      db.from('school_assessments').select('id,title,assessment_type,academic_session,term_no,status,duration_minutes,contributes_to_report').eq('school_id', schoolId).order('created_at', { ascending: false }),
    ]);
    if (c.error) throw c.error;
    if (s.error) throw s.error;
    if (a.error) throw a.error;
    setClasses((c.data || []) as Option[]);
    setSubjects((s.data || []) as Option[]);
    setAssessments((a.data || []) as Assessment[]);
    setClassId(v => v || c.data?.[0]?.id || '');
    setSubjectId(v => v || s.data?.[0]?.id || '');
  }

  useEffect(() => {
    let alive = true;
    getMySchoolMembership().then(async value => {
      if (!alive) return;
      if (!value) { setError('Sign in with an authorised school account to access CBT.'); return; }
      setContext(value);
      try { await refresh(value.school.id); } catch (e) { if (alive) setError(e instanceof Error ? e.message : 'Could not load school CBT.'); }
    }).catch(e => { if (alive) setError(e instanceof Error ? e.message : 'Could not load school membership.'); });
    return () => { alive = false; };
  }, []);

  async function createAssessment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!context) return;
    const db = getSupabase();
    if (!db) { setError('Supabase is not configured.'); return; }
    if (!title.trim() || !classId || !subjectId || !session.trim()) { setError('Complete the title, class, subject and academic session.'); return; }
    setBusy(true); setError(''); setNotice('');
    try {
      const { data: auth } = await db.auth.getUser();
      if (!auth.user) throw new Error('Please sign in again.');
      const { error: insertError } = await db.from('school_assessments').insert({
        school_id: context.school.id, class_id: classId, subject_id: subjectId, teacher_id: auth.user.id,
        title: title.trim(), assessment_type: 'cbt', academic_session: session.trim(), term_no: Number(term),
        duration_minutes: duration, status: 'draft', contributes_to_report: false,
      });
      if (insertError) throw insertError;
      setTitle('');
      setNotice('Draft created. Add questions and verify settings before opening the assessment to students.');
      await refresh(context.school.id);
    } catch (e) { setError(e instanceof Error ? e.message : 'Assessment could not be created.'); }
    finally { setBusy(false); }
  }

  async function changeStatus(item: Assessment, status: string) {
    const db = getSupabase();
    if (!db || !context) return;
    setError(''); setNotice('');
    const { error: updateError } = await db.from('school_assessments').update({ status }).eq('id', item.id).eq('school_id', context.school.id);
    if (updateError) setError(updateError.message);
    else { setNotice(`Assessment status updated to ${status}.`); await refresh(context.school.id); }
  }

  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <header className="rounded-3xl bg-navy-deep p-7 text-cream sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">Phenom Best LMS · School workspace</p>
      <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">CBT & Assessment</h1>
      <p className="mt-4 max-w-3xl text-on-navy">A subscribable assessment capability inside the existing LMS. Schools may subscribe to CBT independently; no second LMS, school tenant or student database is created.</p>
      {context && <p className="mt-5 text-sm text-cream/80">Workspace: <strong>{context.school.name}</strong></p>}
    </header>
    {error && <p role="alert" className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    {notice && <p role="status" className="mt-5 rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-green-900">{notice}</p>}
    <div className="mt-8 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
      <section className="rounded-2xl border border-line bg-cream p-6">
        <h2 className="font-display text-2xl font-semibold">Create an assessment</h2>
        <p className="mt-2 text-sm text-muted">Drafts do not contribute to official reports unless authorised school configuration enables that explicitly.</p>
        <form className="mt-5 space-y-4" onSubmit={createAssessment}>
          <label className="block text-sm font-semibold">Assessment title<input required maxLength={180} value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white p-3" placeholder="Mathematics — Algebra Test"/></label>
          <label className="block text-sm font-semibold">Class<select required value={classId} onChange={e=>setClassId(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white p-3"><option value="">Choose class</option>{classes.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
          <label className="block text-sm font-semibold">Subject<select required value={subjectId} onChange={e=>setSubjectId(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white p-3"><option value="">Choose subject</option>{subjects.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
          <label className="block text-sm font-semibold">Academic session<input required value={session} onChange={e=>setSession(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white p-3" placeholder="2026/2027"/></label>
          <div className="grid grid-cols-2 gap-3"><label className="block text-sm font-semibold">Term<select value={term} onChange={e=>setTerm(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white p-3"><option value="1">First</option><option value="2">Second</option><option value="3">Third</option><option value="4">Other</option></select></label><label className="block text-sm font-semibold">Duration (minutes)<input type="number" min={1} max={600} value={duration} onChange={e=>setDuration(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-line bg-white p-3"/></label></div>
          <button disabled={busy || !context} className="w-full rounded-xl bg-navy-deep px-4 py-3 font-semibold text-white disabled:opacity-50">{busy?'Creating…':'Create draft assessment'}</button>
        </form>
      </section>
      <section className="rounded-2xl border border-line bg-cream p-6">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><h2 className="font-display text-2xl font-semibold">School assessments</h2><p className="mt-1 text-sm text-muted">School access is enforced by Supabase row-level security.</p></div><span className="rounded-full bg-purple/10 px-3 py-1 text-xs font-semibold">{assessments.length} total</span></div>
        <div className="mt-5 space-y-3">{assessments.length===0?<p className="rounded-xl border border-dashed border-line p-6 text-sm text-muted">No assessments yet. Create a draft to begin.</p>:assessments.map(item=><article key={item.id} className="rounded-xl border border-line bg-white p-4">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{item.title}</h3><p className="mt-1 text-xs text-muted">{item.academic_session} · Term {item.term_no} · {item.duration_minutes} min</p></div><span className="rounded-full bg-paper px-3 py-1 text-xs font-semibold capitalize">{item.status}</span></div>
          <div className="mt-3 flex flex-wrap gap-2">{item.status==='draft'&&<button onClick={()=>changeStatus(item,'scheduled')} className="rounded-lg border border-line px-3 py-2 text-xs font-semibold">Schedule</button>}{item.status==='scheduled'&&<button onClick={()=>changeStatus(item,'open')} className="rounded-lg bg-green/10 px-3 py-2 text-xs font-semibold">Open CBT</button>}{item.status==='open'&&<button onClick={()=>changeStatus(item,'closed')} className="rounded-lg border border-line px-3 py-2 text-xs font-semibold">Close CBT</button>}</div>
        </article>)}</div>
      </section>
    </div>
    <section className="mt-8 rounded-2xl border border-line bg-purple/5 p-6"><h2 className="font-display text-xl font-semibold">Integrated, not duplicated</h2><p className="mt-2 text-sm leading-6 text-muted">Student and staff identities, classes, subjects and school records remain in their existing LMS modules. Continuous Learning continues to host learning resources; admissions, databases, payroll, receipts and other administration remain in their existing areas. Report contribution is configurable and opt-in. Essays and short answers require manual marking.</p></section>
  </main>;
}
