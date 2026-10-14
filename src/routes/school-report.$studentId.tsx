import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { OfficialReportSheet, type OfficialReportData, type RatedTrait } from '@/components/school/OfficialReportSheet';
import { getSupabase } from '@/lib/cms';
import { getMySchoolMembership } from '@/lib/school';

export const Route = createFileRoute('/school-report/$studentId')({
  component: SchoolReportPage,
});

type ResultEntry = { subject_id: string; component_id: string; score: number; teacher_comment: string | null };
type ResultSubject = { id: string; name: string };
type ResultComponent = { id: string; name: string; component_type: string; max_score: number; weight: number | null; sequence_no: number };
type TraitAssessment = { trait_id: string; score: number | null; comment: string | null };
type TraitDefinition = { id: string; name: string; category: string };

function SchoolReportPage() {
  const { studentId } = Route.useParams();
  const [data, setData] = useState<OfficialReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('Checking school access…');

  useEffect(() => {
    let cancelled = false;

    async function loadReport() {
      setLoading(true);
      setMessage('Checking school access…');
      setData(null);
      try {
        const db = getSupabase();
        if (!db) throw new Error('The school reporting database is not configured.');

        const membership = await getMySchoolMembership();
        if (!membership || membership.role !== 'school_admin') {
          throw new Error('Only an authorised school administrator can access the official report sheet.');
        }
        if (!studentId) throw new Error('A student identifier is required.');

        const { data: publication, error: publicationError } = await db
          .from('school_result_publications')
          .select('school_id,session_id,term_no,class_id,published_at')
          .eq('school_id', membership.school.id)
          .eq('student_id', studentId)
          .eq('published', true)
          .order('published_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        if (publicationError) throw publicationError;
        if (!publication) throw new Error('No published result is available for this student in your school.');

        const [schoolResult, recordResult, profileResult, sessionResult, termResult, classResult, entriesResult, attendanceResult, summariesResult, traitsResult] = await Promise.all([
          db.from('schools').select('name,address,report_card_title,motto').eq('id', membership.school.id).maybeSingle(),
          db.from('student_school_records').select('admission_number,gender,date_of_birth,psychomotor').eq('school_id', membership.school.id).eq('student_id', studentId).maybeSingle(),
          db.from('profiles').select('full_name,first_name,middle_name,surname,gender,date_of_birth').eq('id', studentId).maybeSingle(),
          db.from('school_academic_sessions').select('name').eq('id', publication.session_id).maybeSingle(),
          db.from('school_terms').select('name').eq('session_id', publication.session_id).eq('term_no', publication.term_no).maybeSingle(),
          db.from('school_classes').select('name').eq('school_id', membership.school.id).eq('id', publication.class_id).maybeSingle(),
          db.from('student_result_entries').select('subject_id,component_id,score,teacher_comment').eq('school_id', membership.school.id).eq('student_id', studentId).eq('session_id', publication.session_id).eq('term_no', publication.term_no).eq('class_id', publication.class_id),
          db.from('student_attendance').select('attendance_date,status').eq('school_id', membership.school.id).eq('student_id', studentId).eq('session_id', publication.session_id).eq('term_no', publication.term_no).eq('class_id', publication.class_id),
          db.from('student_term_summaries').select('performance_note,class_average,term_total,term_percentage').eq('school_id', membership.school.id).eq('student_id', studentId).eq('session_id', publication.session_id).eq('term_no', publication.term_no).eq('class_id', publication.class_id),
          db.from('student_trait_assessments').select('trait_id,score,comment').eq('school_id', membership.school.id).eq('student_id', studentId).eq('session_id', publication.session_id).eq('term_no', publication.term_no),
        ]);

        for (const result of [schoolResult, recordResult, profileResult, sessionResult, termResult, classResult, entriesResult, attendanceResult, summariesResult, traitsResult]) {
          if (result.error) throw result.error;
        }
        if (!recordResult.data) throw new Error('The student has no school record in this school.');

        const entries = (entriesResult.data || []) as ResultEntry[];
        const subjectIds = [...new Set(entries.map(entry => entry.subject_id))];
        const componentIds = [...new Set(entries.map(entry => entry.component_id))];
        const traitIds = [...new Set(((traitsResult.data || []) as TraitAssessment[]).map(trait => trait.trait_id))];

        const [subjectResult, componentResult, traitResult] = await Promise.all([
          subjectIds.length
            ? db.from('school_subjects').select('id,name').eq('school_id', membership.school.id).in('id', subjectIds)
            : Promise.resolve({ data: [], error: null }),
          componentIds.length
            ? db.from('school_result_components').select('id,name,component_type,max_score,weight,sequence_no').eq('school_id', membership.school.id).in('id', componentIds)
            : Promise.resolve({ data: [], error: null }),
          traitIds.length
            ? db.from('school_assessment_traits').select('id,name,category').eq('school_id', membership.school.id).in('id', traitIds)
            : Promise.resolve({ data: [], error: null }),
        ]);
        if (subjectResult.error) throw subjectResult.error;
        if (componentResult.error) throw componentResult.error;
        if (traitResult.error) throw traitResult.error;

        const subjects = (subjectResult.data || []) as ResultSubject[];
        const components = (componentResult.data || []) as ResultComponent[];
        const traitDefinitions = (traitResult.data || []) as TraitDefinition[];
        const subjectById = new Map(subjects.map(subject => [subject.id, subject]));
        const componentById = new Map(components.map(component => [component.id, component]));
        const grouped = new Map<string, { caNumerator: number; caWeight: number; examNumerator: number; examWeight: number; comments: string[] }>();

        for (const entry of entries) {
          const component = componentById.get(entry.component_id);
          if (!component || !subjectById.has(entry.subject_id)) continue;
          const maxScore = Number(component.max_score);
          const score = Number(entry.score);
          const weight = Number(component.weight) > 0 ? Number(component.weight) : 1;
          if (!Number.isFinite(maxScore) || maxScore <= 0 || !Number.isFinite(score) || score < 0 || score > maxScore) continue;

          const bucket = grouped.get(entry.subject_id) || { caNumerator: 0, caWeight: 0, examNumerator: 0, examWeight: 0, comments: [] };
          const weightedPercentage = (score / maxScore) * weight;
          if (/(exam|final)/i.test(component.component_type) && !/midterm/i.test(component.component_type)) {
            bucket.examNumerator += weightedPercentage;
            bucket.examWeight += weight;
          } else {
            bucket.caNumerator += weightedPercentage;
            bucket.caWeight += weight;
          }
          if (entry.teacher_comment?.trim()) bucket.comments.push(entry.teacher_comment.trim());
          grouped.set(entry.subject_id, bucket);
        }

        const reportSubjects = subjects
          .filter(subject => grouped.has(subject.id))
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(subject => {
            const group = grouped.get(subject.id)!;
            const ca = group.caWeight > 0 ? (group.caNumerator / group.caWeight) * 40 : null;
            const exam = group.examWeight > 0 ? (group.examNumerator / group.examWeight) * 60 : null;
            return {
              subject: subject.name,
              ca: ca === null ? null : Number(ca.toFixed(2)),
              exam: exam === null ? null : Number(exam.toFixed(2)),
              total: ca === null || exam === null ? null : Number((ca + exam).toFixed(2)),
              remark: [...new Set(group.comments)].join(' · ') || undefined,
            };
          });

        const traitRows = (traitsResult.data || []) as TraitAssessment[];
        const traitsById = new Map(traitDefinitions.map(trait => [trait.id, trait]));
        const affectiveTraits: RatedTrait[] = [];
        const psychomotorSkills: RatedTrait[] = [];
        for (const trait of traitRows) {
          const definition = traitsById.get(trait.trait_id);
          if (!definition) continue;
          const item = { label: definition.name, rating: trait.score === null ? (trait.comment || null) : trait.score };
          if (/psychomotor/i.test(definition.category)) psychomotorSkills.push(item);
          else if (/affective/i.test(definition.category)) affectiveTraits.push(item);
        }

        const attendanceRows = (attendanceResult.data || []) as Array<{ attendance_date: string; status: string }>;
        const dayStatuses = new Map<string, string[]>();
        for (const row of attendanceRows) dayStatuses.set(row.attendance_date, [...(dayStatuses.get(row.attendance_date) || []), row.status.toLowerCase()]);
        const daysPresent = [...dayStatuses.values()].filter(statuses => statuses.some(status => ['present', 'late', 'half_day'].includes(status))).length;
        const daysAbsent = [...dayStatuses.values()].filter(statuses => !statuses.some(status => ['present', 'late', 'half_day'].includes(status)) && statuses.includes('absent')).length;
        const attendance = dayStatuses.size ? { schoolDays: dayStatuses.size, daysPresent, daysAbsent } : undefined;

        const profile = profileResult.data as { full_name?: string | null; first_name?: string | null; middle_name?: string | null; surname?: string | null; gender?: string | null; date_of_birth?: string | null } | null;
        const record = recordResult.data as { admission_number?: string | null; gender?: string | null; date_of_birth?: string | null; psychomotor?: Record<string, unknown> | null };
        const fullName = profile?.full_name?.trim() || [profile?.first_name, profile?.middle_name, profile?.surname].filter(Boolean).join(' ').trim();
        const summaryRows = (summariesResult.data || []) as Array<{ performance_note: string | null }>;
        const headComment = [...new Set(summaryRows.map(row => row.performance_note?.trim()).filter((value): value is string => Boolean(value)))].join(' · ');
        const school = schoolResult.data as { name?: string; address?: string | null; report_card_title?: string | null; motto?: string | null } | null;

        const reportData: OfficialReportData = {
          schoolName: school?.name || membership.school.name,
          schoolAddress: school?.address || undefined,
          academicYear: sessionResult.data?.name || 'Academic session',
          term: termResult.data?.name || `Term ${publication.term_no}`,
          className: classResult.data?.name || 'Class',
          student: {
            fullName: fullName || `Student ${record.admission_number || studentId.slice(0, 8)}`,
            admissionNumber: record.admission_number || '—',
            gender: record.gender || profile?.gender || undefined,
            dateOfBirth: record.date_of_birth || profile?.date_of_birth || undefined,
          },
          subjects: reportSubjects,
          attendance,
          affectiveTraits,
          psychomotorSkills: psychomotorSkills.length ? psychomotorSkills : Object.entries(record.psychomotor || {}).map(([label, rating]) => ({ label, rating: typeof rating === 'string' || typeof rating === 'number' ? rating : null })),
          teacherComment: [...new Set(entries.map(entry => entry.teacher_comment?.trim()).filter((value): value is string => Boolean(value)))].join(' · '),
          headTeacherComment: headComment || undefined,
          date: new Date().toLocaleDateString('en-GB'),
        };
        if (!cancelled) {
          setData(reportData);
          setMessage(school?.report_card_title || 'Official report loaded from the published school result records.');
        }
      } catch (error) {
        if (!cancelled) setMessage(error instanceof Error ? error.message : 'Could not load the official report.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadReport();
    return () => { cancelled = true; };
  }, [studentId]);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      {loading ? <p className="rounded-xl border border-line bg-cream p-4 text-sm" role="status">{message}</p> : null}
      {!loading && !data ? <section className="rounded-xl border border-line bg-cream p-6"><h1 className="text-2xl font-bold">Official School Report</h1><p className="mt-3 text-sm" role="alert">{message}</p></section> : null}
      {data ? <><p className="mb-4 text-sm text-muted" role="status">{message}</p><OfficialReportSheet data={data} /></> : null}
    </main>
  );
}
