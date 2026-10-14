import { DEFAULT_GRADE_BANDS, type GradeBand } from '@/components/school/OfficialReportSheet';

export type PerformanceSubject = { id: string; name: string };
export type PerformanceStudentRow = {
  studentId: string;
  fullName: string;
  admissionNumber: string;
  scores: Record<string, number | null>;
  total: number | null;
  average: number | null;
  grade: string;
  position: number | null;
};
export type GeneralPerformanceData = {
  schoolName: string;
  academicYear: string;
  term: string;
  className: string;
  subjects: PerformanceSubject[];
  students: PerformanceStudentRow[];
  classAverage: number | null;
  highestAverage: number | null;
  lowestAverage: number | null;
};
type Props = { data: GeneralPerformanceData; gradeBands?: GradeBand[] };

function formatMark(value: number | null | undefined) {
  return value === null || value === undefined || !Number.isFinite(value)
    ? '—'
    : Number.isInteger(value) ? String(value) : value.toFixed(2);
}

export function GeneralPerformanceSheet({ data, gradeBands = DEFAULT_GRADE_BANDS }: Props) {
  const bands = [...gradeBands].sort((a, b) => b.min - a.min);
  const gradeByAverage = (average: number | null) => {
    if (average === null) return '—';
    const rounded = Math.round(average * 100) / 100;
    return bands.find(band => rounded >= band.min && rounded <= band.max)?.grade || '—';
  };

  return (
    <article className="mx-auto w-full max-w-7xl bg-white p-4 text-black print:max-w-none print:p-0 sm:p-7">
      <header className="border-b-2 border-black pb-4 text-center">
        <h1 className="text-2xl font-bold uppercase">{data.schoolName}</h1>
        <h2 className="mt-3 text-lg font-bold uppercase">General Performance Sheet</h2>
        <p className="mt-1 text-sm">{data.academicYear} · {data.term} · {data.className}</p>
      </header>
      <section className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <p className="border border-black p-2">Students: <strong>{data.students.length}</strong></p>
        <p className="border border-black p-2">Class average: <strong>{formatMark(data.classAverage)}{data.classAverage === null ? '' : '%'}</strong></p>
        <p className="border border-black p-2">Highest / lowest: <strong>{formatMark(data.highestAverage)} / {formatMark(data.lowestAverage)}</strong></p>
      </section>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-max border-collapse text-xs sm:text-sm">
          <thead><tr className="bg-gray-100">
            <th className="border border-black px-2 py-2 text-left">Position</th>
            <th className="border border-black px-2 py-2 text-left">Admission No.</th>
            <th className="border border-black px-2 py-2 text-left">Student</th>
            {data.subjects.map(subject => <th key={subject.id} className="border border-black px-2 py-2 text-center">{subject.name}</th>)}
            <th className="border border-black px-2 py-2 text-center">Total</th>
            <th className="border border-black px-2 py-2 text-center">Average</th>
            <th className="border border-black px-2 py-2 text-center">Grade</th>
          </tr></thead>
          <tbody>
            {data.students.map(student => <tr key={student.studentId}>
              <td className="border border-black px-2 py-2 text-center">{student.position ?? '—'}</td>
              <td className="border border-black px-2 py-2">{student.admissionNumber || '—'}</td>
              <td className="border border-black px-2 py-2">{student.fullName}</td>
              {data.subjects.map(subject => <td key={subject.id} className="border border-black px-2 py-2 text-center">{formatMark(student.scores[subject.id])}</td>)}
              <td className="border border-black px-2 py-2 text-center">{formatMark(student.total)}</td>
              <td className="border border-black px-2 py-2 text-center">{student.average === null ? '—' : formatMark(student.average) + '%'}</td>
              <td className="border border-black px-2 py-2 text-center">{gradeByAverage(student.average)}</td>
            </tr>)}
            {!data.students.length ? <tr><td colSpan={data.subjects.length + 6} className="border border-black px-3 py-6 text-center">No students are enrolled in this class.</td></tr> : null}
          </tbody>
        </table>
      </div>
      <p className="mt-5 text-xs">Internal school performance view. Confirm that all subject marks have been entered and reviewed before publishing student reports.</p>
    </article>
  );
}
