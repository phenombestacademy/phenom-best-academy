import { createFileRoute, Link } from '@tanstack/react-router';
import { BarChart3, ClipboardList, Download, LockKeyhole, Settings2, UsersRound } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const Route = createFileRoute('/school-results')({ component: SchoolResultsPage });

const terms = [
  { name: 'First Term', flow: 'First CA → Second CA → Midterm Test → Third CA → Final Exam → Term Total' },
  { name: 'Second Term', flow: 'Brought Forward → First Test/CA → Midterm Test → Post-Midterm Assessment → Final Exam → Cumulative' },
  { name: 'Third Term', flow: 'Brought Forward → First Test/CA → Midterm Test → Post-Midterm Assessment → Final Exam → Three-Term Cumulative' },
];

function SchoolResultsPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="rounded-3xl bg-navy-deep p-6 text-cream sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">School Results & Report Cards</p>
        <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold sm:text-6xl">A complete, configurable result system for every class and subject.</h1>
        <p className="mt-5 max-w-3xl text-on-navy">Schools control the assessment structure, maximum marks, columns, attendance and publication. The master setup can apply consistently across the class and future academic sessions, while scores remain private until the school publishes them.</p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild><Link to="/schools">School platform</Link></Button>
          <Button asChild variant="cream"><Link to="/account">Sign in</Link></Button>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {terms.map((term, i) => (
          <article key={term.name} className="rounded-2xl border border-line bg-cream p-5 shadow-card">
            <ClipboardList className="text-orange" />
            <h2 className="mt-3 font-display text-xl font-semibold">{term.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{term.flow}</p>
            {i === 0 && <p className="mt-3 text-xs font-semibold text-purple">School can customise the component marks and weights.</p>}
          </article>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-line bg-cream p-6">
          <Settings2 className="text-purple" />
          <h2 className="mt-3 font-display text-2xl font-semibold">Flexible school setup</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>• Create any number of subjects for each school.</li>
            <li>• Apply subjects to individual classes.</li>
            <li>• Create First CA, Second CA, Midterm Test, Third CA, Final Exam and any custom components.</li>
            <li>• Use the same flexible assessment pattern in Terms 2 and 3, including pre-midterm and post-midterm assessments.</li>
            <li>• Set the maximum marks and optional weighting for each component.</li>
            <li>• Lock entries when moderation is complete.</li>
            <li>• Keep separate First, Second and Third Term records.</li>
            <li>• Carry approved previous-term results forward automatically into cumulative calculations.</li>
            <li>• Remove any assessment column the school does not use and set its own maximum marks/weights.</li>
            <li>• Save master-sheet changes across the applicable classes and future academic sessions.</li>
            <li>• Remove any assessment column the school does not use and set its own maximum marks/weights.</li>
            <li>• Save master-sheet changes across the applicable classes and future academic sessions.</li>
          </ul>
        </article>

        <article className="rounded-2xl border border-line bg-cream p-6">
          <LockKeyhole className="text-green" />
          <h2 className="mt-3 font-display text-2xl font-semibold">Controlled visibility</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>• Teacher: only assigned class/subject students.</li>
            <li>• School admin: the school's authorised records.</li>
            <li>• Student: own results after publication.</li>
            <li>• Parent: linked child's authorised results.</li>
            <li>• Phenom Academy staff: appropriate school oversight, auditing and support.</li>
            <li>• Self-directed personal learning remains outside school-result reporting unless deliberately assigned into a school workflow.</li>
          </ul>
        </article>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-cream p-6">
        <div className="flex items-start gap-4">
          <UsersRound className="mt-1 shrink-0 text-blue" />
          <div>
            <h2 className="font-display text-2xl font-semibold">Automatic class and subject analysis</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">The system can calculate each student's subject percentage, term performance, cumulative performance, class averages and progress. Teachers and authorised administrators can use those patterns to identify strengths, learning gaps and areas for intervention.</p>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-line bg-cream p-6">
          <Settings2 className="text-gold" />
          <h2 className="mt-3 font-display text-2xl font-semibold">Automatic performance comments</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">The system can prepare an individual subject comment from the child’s current performance, previous results and the teacher’s earlier assessment context. The generated comment is only a starting point: the teacher can edit, replace or approve it before publication.</p>
          <p className="mt-3 text-xs font-semibold text-purple">Generated comment → teacher review/edit → final approved comment.</p>
        </article>

        <article className="rounded-2xl border border-line bg-cream p-6">
          <BarChart3 className="text-orange" />
          <h2 className="mt-3 font-display text-2xl font-semibold">Professional report-card output</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">Each school's approved name, lightweight logo and colours can brand its report card. Schools can upload authorised teacher and head-of-school signatures, publish when ready, and allow authorised downloads/printing. Premium export can be tied to the school's subscription.</p>
        </article>
        <article className="rounded-2xl border border-line bg-cream p-6">
          <UsersRound className="text-blue" />
          <h2 className="mt-3 font-display text-2xl font-semibold">Anonymous class statistics</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">For the selected period, authorised school users can see the class average, cumulative class average, highest score and lowest score without displaying the names of the students who hold those highest or lowest scores.</p>
        </article>
      </div>

      <div className="mt-8 rounded-2xl border border-line bg-cream p-6">
        <div className="flex items-start gap-4">
          <ClipboardList className="mt-1 shrink-0 text-green" />
          <div>
            <h2 className="font-display text-2xl font-semibold">Configurable daily attendance</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">Schools can enable or remove attendance from their report structure, set resumption, half-day and closing times, and let teachers record attendance daily. Each child can have an arrival and departure checkpoint: two completed checkpoints represent a full day, while one completed checkpoint represents half attendance. An open checkpoint can be closed as absent at the end of the day, with authorised manual correction where the school permits it.</p>
            <p className="mt-3 text-xs font-semibold text-purple">Midterm attendance can be summarised, carried forward into final-term reporting, and included in the child’s report card.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
