import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { GeneralPerformanceSheet, type GeneralPerformanceData, type PerformanceStudentRow } from '@/components/school/GeneralPerformanceSheet';
import { getSupabase } from '@/lib/cms';
import { getMySchoolMembership } from '@/lib/school';

export const Route = createFileRoute('/school-performance/$classId')({
  component: SchoolPerformancePage,
});

type SessionRow = { id: string; name: string; active: boolean; starts_on: string | null };
type TermRow = { term_no: number; name: string; results_published: boolean };
type RosterRow = { student_id: string; admission_number: string | null; full_name: string; gender: string | null };
type EntryRow = { student_id: string; subject_id: string; component_id: string; score: number };
type ComponentRow = { id: string; name: string; component_type: string; max_score: number; weight: number; sequence_no: number };

function SchoolPerformancePage() {
  const { classId } = Route.useParams();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Loading class performance…');
  const [sessions, setSessions] = useState<SessionRow[]>([]);
  const [terms, setTerms] = useState<TermRow[]>([]);
  const [sessionId, setSessionId] = useState('');
  const [termNo, setTermNo] = useState<number | null>(null);
  const [data, setData] = useState<GeneralPerformanceData | null>(null);
  const [schoolId, setSchoolId] = useState('');
  const [gradeBands, setGradeBands] = useState<GradeBand[]>(DEFAULT_GRADE_BANDS);
  const [savingBands, setSavingBands] = useState(false);
  const [bandMessage, setBandMessage] = useState('');

  const loadFor = useCallback(async (requestedSessionId?: string, requestedTermNo?: number) => {
    setLoading(true);
    setMessage('Loading class performance…');
    setData(null);
    try {
      const db = getSupabase();
      if (!db) throw new Error('The school reporting database is not configured.');
      const membership = await getMySchoolMembership();
      if (!membership || membership.role !== 'school_admin') {
        throw new Error('Only an authorised school administrator can access the general performance sheet.');
      }

      const [classResult, schoolResult, sessionsResult] = await Promise.all([
        db.from('school_classes').select('id,name').eq('school_id', membership.school.id).eq('id', classId).maybeSingle(),
        db.from('schools').select('name,report_grading_bands').eq('id', membership.school.id).maybeSingle(),
        db.from('school_academic_sessions').select('id,name,active,starts_on').eq('school_id', membership.school.id).order('starts_on', { ascending: false }),
      ]);
      if (classResult.error) throw classResult.error;
      if (schoolResult.error) throw schoolResult.error;
      if (sessionsResult.error) throw sessionsResult.error;
      if (!classResult.data) throw new Error('The selected class does not belong to your school.');

      const sessionRows = (sessionsResult.data || []) as SessionRow[];
      if (!sessionRows.length) throw new Error('Create an academic session before preparing a performance sheet.');
      const selectedSession = sessionRows.find(row => row.id === requestedSessionId)
        || sessionRows.find(row => row.active)
        || sessionRows[0];

      const { data: termData, error: termError } = await db
        .from('school_terms')
        .select('term_no,name,results_published')
        .eq('session_id', selectedSession.id)
        .order('term_no');
      if (termError) throw termError;
      const termRows = (termData || []) as TermRow[];
      if (!termRows.length) throw new Error('No terms are configured for this academic session.');
      const selectedTerm = termRows.find(row => row.term_no === requestedTermNo)
        || [...termRows].reverse().find(row => row.results_published)
        || termRows[termRows.length - 1];

      setSchoolId(membership.school.id);
      setGradeBands(normaliseGradeBands(schoolResult.data?.report_grading_bands));
      setSessions(sessionRows);
      setTerms(termRows);
      setSessionId(selectedSession.id);
      setTermNo(selectedTerm.term_no);

      const [rosterResult, classSubjectsResult, entriesResult] = await Promise.all([
        db.rpc('school_report_class_roster', { p_school: membership.school.id, p_class: classId }),
        db.from('class_subjects').select('subject_id').eq('class_id', classId).eq('active', true),
        db.from('student_result_entries').select('student_id,subject_id,component_id,score').eq('school_id', membership.school.id).eq('class_id', classId).eq('session_id', selectedSession.id).eq('term_no', selectedTerm.term_no),
      ]);
      if (rosterResult.error) throw rosterResult.error;
      if (classSubjectsResult.error) throw classSubjectsResult.error;
      if (entriesResult.error) throw entriesResult.error;

      const roster = (rosterResult.data || []) as RosterRow[];
      const entries = (entriesResult.data || []) as EntryRow[];
      const subjectIds = [...new Set([
        ...((classSubjectsResult.data || []) as Array<{ subject_id: string }>).map(row => row.subject_id),
        ...entries.map(row => row.subject_id),
      ])];
      const componentIds = [...new Set(entries.map(row => row.component_id))];

      const [subjectResult, componentResult] = await Promise.all([
        subjectIds.length
          ? db.from('school_subjects').select('id,name').eq('school_id', membership.school.id).in('id', subjectIds)
          : Promise.resolve({ data: [], error: null }),
        componentIds.length
          ? db.from('school_result_components').select('id,name,component_type,max_score,weight,sequence_no').eq('school_id', membership.school.id).eq('term_no', selectedTerm.term_no).eq('active', true).in('id', componentIds)
          : Promise.resolve({ data: [], error: null }),
      ]);
      if (subjectResult.error) throw subjectResult.error;
      if (componentResult.error) throw componentResult.error;

      const subjects = ((subjectResult.data || []) as Array<{ id: string; name: string }>)
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(subject => ({ id: subject.id, name: subject.name }));
      const components = (componentResult.data || []) as ComponentRow[];
      const componentById = new Map(components.map(component => [component.id, component] as const));
      const grouped = new Map<string, { caNumerator: number; caWeight: number; examNumerator: number; examWeight: number }>();

      for (const entry of entries) {
        const component = componentById.get(entry.component_id);
        if (!component) continue;
        const maxScore = Number(component.max_score);
        const score = Number(entry.score);
        const weight = Number(component.weight) > 0 ? Number(component.weight) : 1;
        if (!Number.isFinite(maxScore) || maxScore <= 0 || !Number.isFinite(score) || score < 0 || score > maxScore) continue;
        const key = `${entry.student_id}:${entry.subject_id}`;
        const bucket = grouped.get(key) || { caNumerator: 0, caWeight: 0, examNumerator: 0, examWeight: 0 };
        const weightedPercentage = score / maxScore * weight;
        if (/(exam|final)/i.test(component.component_type) && !/midterm/i.test(component.component_type)) {
          bucket.examNumerator += weightedPercentage;
          bucket.examWeight += weight;
        } else {
          bucket.caNumerator += weightedPercentage;
          bucket.caWeight += weight;
        }
        grouped.set(key, bucket);
      }

      const students: PerformanceStudentRow[] = roster.map(student => {
        const scores: Record<string, number | null> = {};
        const completed: number[] = [];
        for (const subject of subjects) {
          const bucket = grouped.get(`${student.student_id}:${subject.id}`);
          const ca = bucket && bucket.caWeight > 0 ? bucket.caNumerator / bucket.caWeight * 40 : null;
          const exam = bucket && bucket.examWeight > 0 ? bucket.examNumerator / bucket.examWeight * 60 : null;
          const total = ca === null || exam === null ? null : Number((ca + exam).toFixed(2));
          scores[subject.id] = total;
          if (total !== null) completed.push(total);
        }
        const total = completed.length ? Number(completed.reduce((sum, value) => sum + value, 0).toFixed(2)) : null;
        const average = completed.length ? Number((completed.reduce((sum, value) => sum + value, 0) / completed.length).toFixed(2)) : null;
        return {
          studentId: student.student_id,
          fullName: student.full_name || `Student ${student.admission_number || student.student_id.slice(0, 8)}`,
          admissionNumber: student.admission_number || '—',
          scores,
          total,
          average,
          position: null,
        };
      });

      const ranked = students.filter(student => student.average !== null).sort((a, b) => (b.average || 0) - (a.average || 0));
      let lastAverage: number | null = null;
      let lastPosition = 0;
      ranked.forEach((student, index) => {
        if (student.average !== lastAverage) lastPosition = index + 1;
        student.position = lastPosition;
        lastAverage = student.average;
      });
      const averages = students.map(student => student.average).filter((value): value is number => value !== null);
      const performance: GeneralPerformanceData = {
        schoolName: schoolResult.data?.name || membership.school.name,
        academicYear: selectedSession.name,
        term: selectedTerm.name,
        className: classResult.data.name,
        subjects,
        students,
        classAverage: averages.length ? Number((averages.reduce((sum, value) => sum + value, 0) / averages.length).toFixed(2)) : null,
        highestAverage: averages.length ? Math.max(...averages) : null,
        lowestAverage: averages.length ? Math.min(...averages) : null,
      };
      setData(performance);
      setMessage('Performance data loaded from the selected class, session and term. Missing CA or exam components remain blank rather than being treated as zero.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Could not load class performance.');
    } finally {
      setLoading(false);
    }
  }, [classId]);

  async function saveGradeBands() {
    if (!schoolId) return;
    setSavingBands(true);
    setBandMessage('');
    try {
      const db = getSupabase();
      if (!db) throw new Error('The school reporting database is not configured.');
      const { error: saveError } = await db.rpc('school_report_update_grading_bands', {
        p_school: schoolId,
        p_bands: gradeBands,
      });
      if (saveError) throw saveError;
      setBandMessage('Grading bands saved for this school.');
    } catch (error) {
      setBandMessage(error instanceof Error ? error.message : 'Could not save grading bands.');
    } finally {
      setSavingBands(false);
    }
  }

  useEffect(() => { void loadFor(); }, [loadFor]);

  return (
    <main className="mx-auto max-w-[1600px] px-4 py-8">
      <div className="mb-5 flex flex-wrap items-end gap-3 rounded-xl border border-line bg-cream p-4">
        <label className="min-w-[220px] text-sm font-semibold">Academic session
          <select value={sessionId} onChange={event => { void loadFor(event.target.value); }} disabled={loading} className="mt-1 block w-full rounded-lg border border-line bg-white p-2">
            {sessions.map(session => <option key={session.id} value={session.id}>{session.name}</option>)}
          </select>
        </label>
        <label className="min-w-[180px] text-sm font-semibold">Term
          <select value={termNo ?? ''} onChange={event => { if (event.target.value) void loadFor(sessionId, Number(event.target.value)); }} disabled={loading || !terms.length} className="mt-1 block w-full rounded-lg border border-line bg-white p-2">
            {terms.map(term => <option key={term.term_no} value={term.term_no}>{term.name}</option>)}
          </select>
        </label>
        <button onClick={() => { void loadFor(sessionId || undefined, termNo ?? undefined); }} disabled={loading} className="rounded-lg bg-navy-deep px-4 py-2 text-sm font-semibold text-cream disabled:opacity-50">Refresh</button>
      </div>
      <details className="mb-5 rounded-xl border border-line bg-cream p-4">
        <summary className="cursor-pointer font-semibold">Configure school grading bands</summary>
        <p className="mt-2 text-sm text-muted">Ranges must cover 0–100 without overlaps or gaps. Changes affect the grades shown on official and general performance sheets for this school.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {gradeBands.map((band, index) => <div key={index} className="rounded-lg border border-line bg-white p-3">
            <label className="block text-xs font-semibold">Grade
              <input value={band.grade} maxLength={8} disabled={loading || savingBands} onChange={event => setGradeBands(rows => rows.map((row, rowIndex) => rowIndex === index ? { ...row, grade: event.target.value } : row))} className="mt-1 w-full rounded border p-2"/>
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <label className="block text-xs font-semibold">Minimum
                <input type="number" min="0" max="100" step="0.01" value={band.min} disabled={loading || savingBands} onChange={event => setGradeBands(rows => rows.map((row, rowIndex) => rowIndex === index ? { ...row, min: Number(event.target.value) } : row))} className="mt-1 w-full rounded border p-2"/>
              </label>
              <label className="block text-xs font-semibold">Maximum
                <input type="number" min="0" max="100" step="0.01" value={band.max} disabled={loading || savingBands} onChange={event => setGradeBands(rows => rows.map((row, rowIndex) => rowIndex === index ? { ...row, max: Number(event.target.value) } : row))} className="mt-1 w-full rounded border p-2"/>
              </label>
            </div>
            <label className="mt-2 block text-xs font-semibold">Remark
              <input value={band.remark} maxLength={80} disabled={loading || savingBands} onChange={event => setGradeBands(rows => rows.map((row, rowIndex) => rowIndex === index ? { ...row, remark: event.target.value } : row))} className="mt-1 w-full rounded border p-2"/>
            </label>
          </div>)}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button onClick={() => { void saveGradeBands(); }} disabled={loading || savingBands} className="rounded-lg bg-navy-deep px-4 py-2 text-sm font-semibold text-cream disabled:opacity-50">{savingBands ? 'Saving…' : 'Save grading bands'}</button>
          {bandMessage ? <p className="text-sm" role="status">{bandMessage}</p> : null}
        </div>
      </details>
      {loading ? <p className="rounded-xl border border-line bg-cream p-4 text-sm" role="status">{message}</p> : null}
      {!loading && !data ? <section className="rounded-xl border border-line bg-cream p-6"><h1 className="text-xl font-bold">General Performance Sheet</h1><p className="mt-3 text-sm" role="alert">{message}</p></section> : null}
      {data ? <><p className="mb-3 text-sm text-muted" role="status">{message}</p><GeneralPerformanceSheet data={data} gradeBands={gradeBands} /></> : null}
    </main>
  );
}
