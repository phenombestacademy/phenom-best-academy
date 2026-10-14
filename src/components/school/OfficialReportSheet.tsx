import type { ReactNode } from "react";

export type GradeBand = { grade: string; min: number; max: number; remark: string };
export const DEFAULT_GRADE_BANDS: GradeBand[] = [
  { grade: "A1", min: 75, max: 100, remark: "Excellent" },
  { grade: "B2", min: 70, max: 74.99, remark: "Very Good" },
  { grade: "B3", min: 65, max: 69.99, remark: "Good" },
  { grade: "C4", min: 60, max: 64.99, remark: "Credit" },
  { grade: "C5", min: 55, max: 59.99, remark: "Credit" },
  { grade: "C6", min: 50, max: 54.99, remark: "Credit" },
  { grade: "D7", min: 45, max: 49.99, remark: "Pass" },
  { grade: "E8", min: 40, max: 44.99, remark: "Pass" },
  { grade: "F9", min: 0, max: 39.99, remark: "Fail" },
];
export type SubjectResult = { subject: string; ca: number | null; exam: number | null; total?: number | null; grade?: string | null; remark?: string | null };
export type RatedTrait = { label: string; rating: string | number | null };
export type OfficialReportData = {
  schoolName: string; schoolAddress?: string; reportTitle?: string; schoolMotto?: string; reportHeader?: string; reportFooter?: string; teacherSignatureUrl?: string; headTeacherSignatureUrl?: string; academicYear: string; term: string; className: string;
  student: { fullName: string; admissionNumber: string; gender?: string; dateOfBirth?: string };
  subjects: SubjectResult[];
  attendance?: { schoolDays?: number | null; daysPresent?: number | null; daysAbsent?: number | null };
  affectiveTraits?: RatedTrait[]; psychomotorSkills?: RatedTrait[];
  teacherComment?: string; headTeacherComment?: string; teacherName?: string; headTeacherName?: string; date?: string;
};
type Props = { data: OfficialReportData; gradeBands?: GradeBand[]; caMaximum?: number; examMaximum?: number };
function totalFor(s: SubjectResult): number | null {
  if (s.total !== undefined && s.total !== null) return s.total;
  return s.ca === null || s.exam === null ? null : s.ca + s.exam;
}
function gradeFor(score: number, maximum: number, bands: GradeBand[]) {
  const percentage = maximum > 0 ? score / maximum * 100 : 0;
  const band = [...bands].sort((a, b) => b.min - a.min).find((b) => percentage >= b.min && percentage <= b.max);
  return { grade: band?.grade ?? "—", remark: band?.remark ?? "—" };
}
function mark(value: number | null | undefined) {
  return value === null || value === undefined || !Number.isFinite(value) ? "—" : Number.isInteger(value) ? String(value) : value.toFixed(2);
}
function TraitTable({ title, traits }: { title: string; traits: RatedTrait[] }) {
  if (!traits.length) return null;
  return <section className="mt-5 break-inside-avoid"><h3 className="border-b border-black pb-1 text-sm font-bold uppercase">{title}</h3>
    <table className="mt-2 w-full border-collapse text-sm"><tbody>{traits.map((t) => <tr key={t.label}>
      <td className="border border-black px-2 py-1">{t.label}</td><td className="w-32 border border-black px-2 py-1 text-center">{t.rating ?? "—"}</td>
    </tr>)}</tbody></table></section>;
}
export function OfficialReportSheet({ data, gradeBands = DEFAULT_GRADE_BANDS, caMaximum = 40, examMaximum = 60 }: Props) {
  const maximum = caMaximum + examMaximum;
  const rows = data.subjects.map((s) => {
    const total = totalFor(s);
    const computed = total === null ? null : gradeFor(total, maximum, gradeBands);
    return { ...s, total, grade: s.grade || computed?.grade || "—", remark: s.remark || computed?.remark || "—" };
  });
  const completed = rows.filter((s) => s.total !== null);
  const obtained = completed.reduce((sum, s) => sum + (s.total ?? 0), 0);
  const obtainable = completed.length * maximum;
  const average = obtainable ? obtained / obtainable * 100 : null;
  const overall = average === null ? null : gradeFor(average, 100, gradeBands);
  const meta = (label: string, value?: string) => <div className="flex gap-2"><span className="font-semibold">{label}:</span><span>{value || "—"}</span></div>;
  const signature = (label: string, name?: string, signatureUrl?: string): ReactNode => <div className="min-w-0 flex-1 border-t border-black pt-2 text-center text-sm"><div className="flex h-10 items-end justify-center">{signatureUrl ? <img src={signatureUrl} alt={label + " signature"} className="max-h-10 max-w-full object-contain" /> : null}</div><div className="font-semibold">{name || " "}</div><div>{label}</div></div>;
  return <article className="mx-auto w-full max-w-4xl bg-white p-5 text-black print:max-w-none print:p-0 sm:p-8">
    <header className="border-b-2 border-black pb-4 text-center"><h1 className="text-2xl font-bold uppercase">{data.schoolName}</h1>
      {data.schoolAddress ? <p className="mt-1 text-sm">{data.schoolAddress}</p> : null}
      <h2 className="mt-3 text-lg font-bold uppercase">{data.reportTitle || "Official School Report Sheet"}</h2>{data.schoolMotto ? <p className="mt-1 text-sm italic">{data.schoolMotto}</p> : null}{data.reportHeader ? <p className="mt-2 text-sm">{data.reportHeader}</p> : null}<p className="mt-1 text-sm">Academic Year: {data.academicYear} · {data.term}</p>
    </header>
    <section className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
      {meta("Student", data.student.fullName)}{meta("Admission Number", data.student.admissionNumber)}{meta("Class", data.className)}
      {meta("Gender", data.student.gender)}{meta("Date of Birth", data.student.dateOfBirth)}
    </section>
    <div className="mt-5 overflow-x-auto"><table className="w-full border-collapse text-sm"><thead><tr className="bg-gray-100">
      {["Subject", "CA", "Exam", "Total", "Grade", "Remarks"].map((h) => <th key={h} className="border border-black px-2 py-2 text-left">{h}</th>)}
    </tr></thead><tbody>
      {rows.map((s) => <tr key={s.subject}><td className="border border-black px-2 py-2">{s.subject}</td><td className="border border-black px-2 py-2 text-center">{mark(s.ca)}</td>
        <td className="border border-black px-2 py-2 text-center">{mark(s.exam)}</td><td className="border border-black px-2 py-2 text-center">{mark(s.total)}</td>
        <td className="border border-black px-2 py-2 text-center">{s.grade}</td><td className="border border-black px-2 py-2">{s.remark}</td></tr>)}
      {!rows.length ? <tr><td colSpan={6} className="border border-black px-2 py-4 text-center">No subject results available.</td></tr> : null}
    </tbody></table></div>
    <section className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
      <div className="border border-black p-3"><p>Subjects with scores: <strong>{completed.length}</strong> / {rows.length}</p><p className="mt-1">Obtainable marks: <strong>{mark(obtainable)}</strong></p><p className="mt-1">Obtained marks: <strong>{mark(obtained)}</strong></p></div>
      <div className="border border-black p-3"><p>Average: <strong>{average === null ? "—" : String(average.toFixed(2)) + "%"}</strong></p><p className="mt-1">Overall Grade: <strong>{overall?.grade ?? "—"}</strong></p><p className="mt-1">Overall Remark: <strong>{overall?.remark ?? "—"}</strong></p></div>
    </section>
    {data.attendance ? <section className="mt-5 break-inside-avoid"><h3 className="border-b border-black pb-1 text-sm font-bold uppercase">Attendance</h3><div className="mt-2 grid grid-cols-3 gap-2 text-sm">
      <p>School days: <strong>{mark(data.attendance.schoolDays)}</strong></p><p>Days present: <strong>{mark(data.attendance.daysPresent)}</strong></p><p>Days absent: <strong>{mark(data.attendance.daysAbsent)}</strong></p>
    </div></section> : null}
    <TraitTable title="Affective Traits" traits={data.affectiveTraits ?? []}/><TraitTable title="Psychomotor Skills" traits={data.psychomotorSkills ?? []}/>
    <section className="mt-5 space-y-4 break-inside-avoid text-sm"><div><h3 className="font-bold uppercase">Class Teacher’s Comment</h3><p className="mt-1 min-h-8 border-b border-black pb-2">{data.teacherComment || " "}</p></div>
      <div><h3 className="font-bold uppercase">Head Teacher’s Comment</h3><p className="mt-1 min-h-8 border-b border-black pb-2">{data.headTeacherComment || " "}</p></div></section>
    <footer className="mt-10 flex gap-8 break-inside-avoid">{signature("Class Teacher", data.teacherName, data.teacherSignatureUrl)}{signature("Head Teacher / Principal", data.headTeacherName, data.headTeacherSignatureUrl)}{signature("Date", data.date)}</footer>
    <p className="mt-6 text-center text-xs">{data.reportFooter || "Report view only — verify marks and authorise publication before official use."}</p>
  </article>;
}
