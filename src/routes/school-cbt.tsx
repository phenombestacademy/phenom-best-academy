import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSupabase } from '@/lib/cms';
import { getMySchoolMembership, type SchoolContext } from '@/lib/school';

export const Route = createFileRoute('/school-cbt')({ component: SchoolCbtPage });

type Exam = {
  id: string; school_id: string; class_id: string; teacher_id: string; title: string;
  subject: string; topic: string | null; question_count: number; duration_minutes: number | null;
  starts_at: string | null; ends_at: string | null; one_attempt: boolean; allow_redo: boolean;
  results_visible_to_students: boolean; status: string; instructions: string | null;
};
type Row = { id: string; name: string };
type Question = {
  id?: string; exam_id: string; position: number; question_text: string;
  options: Record<string, string> | null; correct_answer: string | null;
  explanation: string | null; marks: number; resource_notes: string | null;
};
const emptyQuestion = (examId: string, position: number): Question => ({
  exam_id: examId, position, question_text: '', options: { A: '', B: '', C: '', D: '' },
  correct_answer: 'A', explanation: null, marks: 1, resource_notes: null,
});
const csvCell = (value: unknown) => {
  const s = value == null ? '' : typeof value === 'string' ? value : JSON.stringify(value);
  return '"' + s.replaceAll('"', '""') + '"';
};
const download = (name: string, text: string, type = 'text/csv;charset=utf-8') => {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click(); URL.revokeObjectURL(url);
};

function SchoolCbtPage() {
  const [context, setContext] = useState<SchoolContext | null>(null);
  const [classes, setClasses] = useState<Row[]>([]);
  const [subjects, setSubjects] = useState<Row[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [selected, setSelected] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [classId, setClassId] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(30);
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [instructions, setInstructions] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const db = getSupabase();

  const refresh = useCallback(async (schoolId: string) => {
    if (!db) throw new Error('Supabase is not configured.');
    const [c, s, e] = await Promise.all([
      db.from('school_classes').select('id,name').eq('school_id', schoolId).order('name'),
      db.from('school_subjects').select('id,name').eq('school_id', schoolId).order('name'),
      db.from('school_cbt_exams').select('id,school_id,class_id,teacher_id,title,subject,topic,question_count,duration_minutes,starts_at,ends_at,one_attempt,allow_redo,results_visible_to_students,status,instructions').eq('school_id', schoolId).order('created_at', { ascending: false }),
    ]);
    if (c.error) throw c.error; if (s.error) throw s.error; if (e.error) throw e.error;
    setClasses((c.data || []) as Row[]); setSubjects((s.data || []) as Row[]); setExams((e.data || []) as Exam[]);
    setClassId(v => v || c.data?.[0]?.id || ''); setSubjectId(v => v || s.data?.[0]?.id || '');
  }, [db]);

  const loadQuestions = useCallback(async (examId: string) => {
    if (!db) return;
    const { data, error: e } = await db.from('school_cbt_exam_questions').select('id,exam_id,position,question_text,options,correct_answer,explanation,marks,resource_notes').eq('exam_id', examId).order('position');
    if (e) throw e;
    setQuestions((data || []) as Question[]);
  }, [db]);

  useEffect(() => {
    let alive = true;
    getMySchoolMembership().then(async value => {
      if (!alive) return;
      if (!value) { setError('Sign in with an authorised school account to access CBT.'); return; }
      setContext(value);
      try { await refresh(value.school.id); } catch (e) { if (alive) setError(e instanceof Error ? e.message : 'Could not load school CBT.'); }
    }).catch(e => { if (alive) setError(e instanceof Error ? e.message : 'Could not load school membership.'); });
    return () => { alive = false; };
  }, [refresh]);

  const chosen = useMemo(() => exams.find(e => e.id === selected) || null, [exams, selected]);
  useEffect(() => { if (selected) loadQuestions(selected).catch(e => setError(e instanceof Error ? e.message : 'Could not load questions.')); else setQuestions([]); }, [selected, loadQuestions]);

  async function createExam(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!context || !db) return;
    const subject = subjects.find(s => s.id === subjectId);
    if (!title.trim() || !classId || !subject) { setError('Complete the title, class and subject.'); return; }
    if (startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) { setError('The closing time must be later than the opening time.'); return; }
    setBusy(true); setError(''); setNotice('');
    try {
      const { data: auth } = await db.auth.getUser(); if (!auth.user) throw new Error('Please sign in again.');
      const { data, error: e } = await db.from('school_cbt_exams').insert({
        school_id: context.school.id, class_id: classId, teacher_id: auth.user.id, created_by: auth.user.id,
        title: title.trim(), subject: subject.name, topic: topic.trim() || null, question_count: 0,
        duration_minutes: duration, starts_at: startsAt ? new Date(startsAt).toISOString() : null,
        ends_at: endsAt ? new Date(endsAt).toISOString() : null, one_attempt: true, allow_redo: false,
        results_visible_to_students: false, status: 'draft', instructions: instructions.trim() || null,
      }).select('id').single();
      if (e) throw e;
      setTitle(''); setTopic(''); setInstructions(''); setSelected(data.id);
      setNotice('Draft saved in the existing LMS CBT tables. Add and review questions before scheduling it.');
      await refresh(context.school.id);
    } catch (e) { setError(e instanceof Error ? e.message : 'Exam could not be created.'); }
    finally { setBusy(false); }
  }

  async function saveQuestion(q: Question) {
    if (!db || !chosen) return;
    if (!q.question_text.trim()) { setError('Question text is required.'); return; }
    if (q.options && (!q.correct_answer || !(q.correct_answer in q.options))) { setError('Select a valid correct option.'); return; }
    setBusy(true); setError(''); setNotice('');
    try {
      const payload = { exam_id: chosen.id, position: q.position, question_text: q.question_text.trim(), options: q.options,
        correct_answer: q.correct_answer, explanation: q.explanation, marks: Math.max(0.01, Number(q.marks) || 1), resource_notes: q.resource_notes };
      const result = q.id
        ? await db.from('school_cbt_exam_questions').update(payload).eq('id', q.id).eq('exam_id', chosen.id)
        : await db.from('school_cbt_exam_questions').insert(payload);
      if (result.error) throw result.error;
      await loadQuestions(chosen.id);
      setNotice('Question saved to the existing LMS question bank.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Question could not be saved.'); }
    finally { setBusy(false); }
  }

  async function removeQuestion(q: Question) {
    if (!db || !chosen || !q.id || !window.confirm('Delete this question? This is allowed only while the exam remains a draft.')) return;
    setBusy(true); setError('');
    try {
      const { error: e } = await db.from('school_cbt_exam_questions').delete().eq('id', q.id).eq('exam_id', chosen.id);
      if (e) throw e; await loadQuestions(chosen.id); setNotice('Question removed.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Question could not be deleted.'); }
    finally { setBusy(false); }
  }

  async function importCsv(file?: File) {
    if (!file || !chosen) return;
    setError('');
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(line => line.trim());
      const parse = (line: string) => {
        const cells: string[] = []; let cell = ''; let quoted = false;
        for (let i = 0; i < line.length; i++) { const ch = line[i]; if (ch === '"' && quoted && line[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') quoted = !quoted; else if (ch === ',' && !quoted) { cells.push(cell); cell = ''; } else cell += ch; }
        cells.push(cell); return cells;
      };
      const headers = parse(lines.shift() || '').map(x => x.trim().toLowerCase());
      const idx = (name: string) => headers.indexOf(name);
      for (const required of ['question_text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct_answer', 'marks']) if (idx(required) < 0) throw new Error('CSV must include: question_text, option_a, option_b, option_c, option_d, correct_answer, marks.');
      const records = lines.map((line, i) => {
        const cells = parse(line); const options = { A: cells[idx('option_a')] || '', B: cells[idx('option_b')] || '', C: cells[idx('option_c')] || '', D: cells[idx('option_d')] || '' };
        const answer = (cells[idx('correct_answer')] || '').trim().toUpperCase();
        if (!cells[idx('question_text')]?.trim() || !['A','B','C','D'].includes(answer) || !options[answer as keyof typeof options]) throw new Error('Invalid question/answer in CSV data row ' + (i + 2) + '.');
        return { exam_id: chosen.id, position: questions.length + i + 1, question_text: cells[idx('question_text')].trim(), options, correct_answer: answer,
          marks: Math.max(0.01, Number(cells[idx('marks')]) || 1), explanation: idx('explanation') >= 0 ? cells[idx('explanation')] || null : null,
          resource_notes: idx('topic') >= 0 ? cells[idx('topic')] || null : null };
      });
      if (!records.length) throw new Error('The CSV contains no question rows.');
      const { error: e } = await db!.from('school_cbt_exam_questions').insert(records); if (e) throw e;
      await loadQuestions(chosen.id); setNotice(records.length + ' questions imported. Review the answer keys and marks before scheduling.');
    } catch (e) { setError(e instanceof Error ? e.message : 'CSV import failed.'); }
  }

  async function setExamStatus(status: 'draft' | 'scheduled' | 'active' | 'closed') {
    if (!db || !chosen) return;
    if (status !== 'draft' && questions.length === 0) { setError('Add at least one question before scheduling or opening the exam.'); return; }
    if (status !== 'draft' && (!chosen.starts_at || !chosen.ends_at || !chosen.duration_minutes)) { setError('Set opening time, closing time and duration before scheduling.'); return; }
    setBusy(true); setError('');
    try {
      const { error: e } = await db.from('school_cbt_exams').update({ status, question_count: questions.length, updated_at: new Date().toISOString() }).eq('id', chosen.id).eq('school_id', context!.school.id);
      if (e) throw e; await refresh(context!.school.id); setNotice('Exam status changed to ' + status + '.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Status update failed.'); }
    finally { setBusy(false); }
  }

  function exportQuestions() {
    if (!chosen) return;
    const headers = ['question_text','option_a','option_b','option_c','option_d','correct_answer','marks','explanation','topic'];
    const rows = questions.map(q => [q.question_text, q.options?.A, q.options?.B, q.options?.C, q.options?.D, q.correct_answer, q.marks, q.explanation, q.resource_notes]);
    download('cbt-questions-' + chosen.id + '.csv', [headers, ...rows].map(row => row.map(csvCell).join(',')).join('\r\n'));
  }

  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
    <header className="rounded-3xl bg-navy-deep p-7 text-cream sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">Phenom Best LMS · Existing school workspace</p>
      <h1 className="mt-3 font-display text-4xl font-bold sm:text-5xl">CBT & Assessment</h1>
      <p className="mt-4 max-w-3xl text-on-navy">Uses the LMS school, class, subject, teacher and CBT records. No duplicate assessment database is created.</p>
      {context && <p className="mt-5 text-sm text-cream/80">Workspace: <strong>{context.school.name}</strong></p>}
    </header>
    {error && <p role="alert" className="mt-5 rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
    {notice && <p role="status" className="mt-5 rounded-xl border border-green-300 bg-green-50 p-4 text-sm text-green-900">{notice}</p>}
    <div className="mt-8 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
      <section className="rounded-2xl border border-line bg-cream p-6">
        <h2 className="font-display text-2xl font-semibold">Create an exam</h2>
        <form className="mt-5 space-y-4" onSubmit={createExam}>
          <label className="block text-sm font-semibold">Title<input required maxLength={180} value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white p-3"/></label>
          <label className="block text-sm font-semibold">Class<select required value={classId} onChange={e=>setClassId(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white p-3"><option value="">Choose class</option>{classes.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
          <label className="block text-sm font-semibold">Subject<select required value={subjectId} onChange={e=>setSubjectId(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white p-3"><option value="">Choose subject</option>{subjects.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
          <label className="block text-sm font-semibold">Topic<input value={topic} onChange={e=>setTopic(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white p-3"/></label>
          <label className="block text-sm font-semibold">Duration (minutes)<input type="number" min={1} max={600} required value={duration} onChange={e=>setDuration(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-line bg-white p-3"/></label>
          <label className="block text-sm font-semibold">Opens at<input type="datetime-local" value={startsAt} onChange={e=>setStartsAt(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white p-3"/></label>
          <label className="block text-sm font-semibold">Closes at<input type="datetime-local" value={endsAt} onChange={e=>setEndsAt(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white p-3"/></label>
          <label className="block text-sm font-semibold">Instructions<textarea value={instructions} onChange={e=>setInstructions(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white p-3"/></label>
          <button disabled={busy} className="w-full rounded-xl bg-navy-deep px-4 py-3 font-semibold text-cream disabled:opacity-50">{busy ? 'Saving…' : 'Save draft exam'}</button>
        </form>
      </section>
      <section className="rounded-2xl border border-line bg-white p-6">
        <h2 className="font-display text-2xl font-semibold">Existing LMS exams</h2>
        <div className="mt-4 space-y-2">{exams.map(e=><button key={e.id} onClick={()=>setSelected(e.id)} className={'block w-full rounded-xl border p-4 text-left '+(selected===e.id?'border-navy-deep bg-cream':'border-line')}><span className="font-semibold">{e.title}</span><span className="mt-1 block text-sm text-muted">{e.subject} · {e.status} · {e.duration_minutes || '—'} min</span></button>)}{!exams.length&&<p className="text-sm text-muted">No CBT exams have been created in this school yet.</p>}</div>
        {chosen && <div className="mt-6 border-t border-line pt-5">
          <h3 className="text-xl font-semibold">{chosen.title}: Question Bank</h3>
          <p className="mt-1 text-sm text-muted">Answer keys are stored in the existing staff-managed question table. Verify student-safe views and server-side marking before live use.</p>
          <div className="mt-3 flex flex-wrap gap-2"><button onClick={()=>setQuestions(q=>[...q,emptyQuestion(chosen.id,q.length+1)])} className="rounded-lg border px-3 py-2 text-sm">Add question</button><button onClick={exportQuestions} className="rounded-lg border px-3 py-2 text-sm">Export CSV</button><label className="cursor-pointer rounded-lg border px-3 py-2 text-sm">Import CSV<input type="file" accept=".csv,text/csv" className="hidden" onChange={e=>importCsv(e.target.files?.[0])}/></label><button onClick={()=>download('cbt-question-template.csv','question_text,option_a,option_b,option_c,option_d,correct_answer,marks,explanation,topic\r\n"Example question","Option A","Option B","Option C","Option D","A",1,"Explanation","Topic"')} className="rounded-lg border px-3 py-2 text-sm">Download template</button></div>
          <div className="mt-4 space-y-4">{questions.map((q,i)=><article key={q.id || 'new-'+i} className="rounded-xl border border-line p-4">
            <div className="flex items-start justify-between gap-3"><h4 className="font-semibold">Question {i+1}</h4>{q.id&&<button onClick={()=>removeQuestion(q)} className="text-sm text-red-700">Delete</button>}</div>
            <textarea value={q.question_text} onChange={e=>setQuestions(old=>old.map((x,j)=>j===i?{...x,question_text:e.target.value}:x))} placeholder="Question text" className="mt-2 w-full rounded-lg border p-3"/>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">{(['A','B','C','D'] as const).map(k=><label key={k} className="text-sm">{'Option '+k}<input value={q.options?.[k] || ''} onChange={e=>setQuestions(old=>old.map((x,j)=>j===i?{...x,options:{...(x.options||{}),[k]:e.target.value}}:x))} className="mt-1 w-full rounded-lg border p-2"/></label>)}</div>
            <div className="mt-2 grid gap-2 sm:grid-cols-2"><label className="text-sm">Correct option<select value={q.correct_answer || 'A'} onChange={e=>setQuestions(old=>old.map((x,j)=>j===i?{...x,correct_answer:e.target.value}:x))} className="mt-1 w-full rounded-lg border p-2">{(['A','B','C','D'] as const).map(k=><option key={k} value={k}>{k}</option>)}</select></label><label className="text-sm">Marks<input type="number" min=".01" step=".01" value={q.marks} onChange={e=>setQuestions(old=>old.map((x,j)=>j===i?{...x,marks:Number(e.target.value)}:x))} className="mt-1 w-full rounded-lg border p-2"/></label></div>
            <label className="mt-2 block text-sm">Explanation (optional)<textarea value={q.explanation || ''} onChange={e=>setQuestions(old=>old.map((x,j)=>j===i?{...x,explanation:e.target.value}:x))} className="mt-1 w-full rounded-lg border p-2"/></label>
            <button disabled={busy} onClick={()=>saveQuestion(q)} className="mt-3 rounded-lg bg-navy-deep px-4 py-2 text-sm font-semibold text-cream disabled:opacity-50">Save question</button>
          </article>)}</div>
          <div className="mt-5 flex flex-wrap gap-2">{(['draft','scheduled','active','closed'] as const).map(s=><button key={s} disabled={busy} onClick={()=>setExamStatus(s)} className="rounded-lg border px-3 py-2 text-sm disabled:opacity-50">{s[0].toUpperCase()+s.slice(1)}</button>)}</div>
          <p className="mt-3 text-xs text-muted">Scheduling here sets exam metadata and status. Production release still requires the server-side start/save/submit and attempt-limit workflow; do not use this UI as a substitute for those protections.</p>
        </div>}
      </section>
    </div>
  </main>;
}
