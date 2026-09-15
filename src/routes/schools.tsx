import { createFileRoute, Link } from '@tanstack/react-router';
import { useState } from 'react';
import { BarChart3, BookOpenCheck, Building2, CheckCircle2, GraduationCap, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createSchool, generateQuiz } from '@/lib/school';

export const Route = createFileRoute('/schools')({ component: SchoolsPage });

const roleCards = [
  ['School admin', 'Manage only your school, staff, classes, branding, activity and reports.', Building2],
  ['Teachers', 'Create or select work, assign it to their classes, review attempts and see learning feedback.', Users],
  ['Students', 'Choose a subject and topic, complete assignments or one-attempt quizzes, then learn from the feedback.', GraduationCap],
  ['Parents', 'Receive clear assignment notifications, scores and improvement guidance without unnecessary private surveillance.', ShieldCheck],
] as const;

function SchoolsPage() {
  const [schoolName, setSchoolName] = useState('');
  const [created, setCreated] = useState(false);
  const [subject, setSubject] = useState('Mathematics');
  const [topic, setTopic] = useState('Fractions');
  const [level, setLevel] = useState(1);
  const [count, setCount] = useState<10 | 20>(10);
  const [message, setMessage] = useState('');

  async function handleCreateSchool() {
    if (!schoolName.trim()) return setMessage('Enter the school name first.');
    try {
      await createSchool({ name: schoolName, primaryColor: '#c94b16' });
      setCreated(true);
      setMessage('School environment created. Branding, classes and access roles can now be configured.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'School creation needs the connected Academy database.');
    }
  }

  async function handlePreviewGeneration() {
    setMessage('Preparing the learning set…');
    try {
      await generateQuiz({ subject, topic, level, questionCount: count, language: 'English', oneAttempt: true, allowRedo: true });
      setMessage('Question set prepared. Students receive the finished questions, not the generation process.');
    } catch (e) {
      setMessage(e instanceof Error ? e.message : 'Connect the learning engine to generate questions.');
    }
  }

  return <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <div className="rounded-3xl bg-navy-deep p-6 text-cream sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">School & Learning Platform</p>
      <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold sm:text-6xl">One connected learning environment for the school, teachers, students and parents.</h1>
      <p className="mt-5 max-w-3xl text-cream/80">Each school gets its own controlled environment under Phenom Best Academy. The school manages its own people and classes; Academy administrators retain the higher level of control across the platform.</p>
      <div className="mt-7 flex flex-wrap gap-3"><Button asChild><Link to="/account">Sign in</Link></Button><Button asChild variant="cream"><Link to="/support">Platform support</Link></Button><Button asChild variant="cream"><Link to="/school-results">School results</Link></Button></div>
    </div>

    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {roleCards.map(([title, text, Icon]) => <article key={title} className="rounded-2xl border border-line bg-cream p-5 shadow-card"><Icon className="text-orange"/><h2 className="mt-3 font-display text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted">{text}</p></article>)}
    </div>

    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-line bg-cream p-6">
        <Building2 className="text-purple"/><h2 className="mt-3 font-display text-2xl font-semibold">School customisation</h2>
        <p className="mt-2 text-muted">School name, a small lightweight logo, approved colour accents, country/currency settings, grade/class structure and staff roles. Large media stays in cloud storage rather than inside the website bundle.</p>
        <label className="mt-5 block text-sm font-semibold">School name<input value={schoolName} onChange={e=>setSchoolName(e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-white px-4 py-3" placeholder="Enter school name"/></label>
        <div className="mt-3 flex items-center gap-3"><span className="text-sm font-semibold">Logo</span><span className="rounded-lg border border-line bg-white px-3 py-2 text-xs text-muted">Small / lightweight upload</span></div>
        <Button className="mt-4" onClick={handleCreateSchool}>{created ? 'School environment ready' : 'Create school environment'}</Button>
        {message && <p className="mt-3 text-sm text-muted">{message}</p>}
      </div>

      <div className="rounded-2xl border border-line bg-cream p-6">
        <Sparkles className="text-gold"/><h2 className="mt-3 font-display text-2xl font-semibold">Smart assignment & quiz engine</h2>
        <p className="mt-2 text-muted">A teacher can choose any subject, topic, class/level, language and question count. The finished questions are presented as normal Academy learning work; generation details are not shown to the child.</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <label className="text-sm font-semibold">Subject<input value={subject} onChange={e=>setSubject(e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2"/></label>
          <label className="text-sm font-semibold">Topic<input value={topic} onChange={e=>setTopic(e.target.value)} className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2"/></label>
          <label className="text-sm font-semibold">Level<select value={level} onChange={e=>setLevel(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2">{[1,2,3,4,5,6,7,8,9,10].map(x=><option key={x} value={x}>Level {x}</option>)}</select></label>
          <label className="text-sm font-semibold">Questions<select value={count} onChange={e=>setCount(Number(e.target.value) as 10|20)} className="mt-2 w-full rounded-xl border border-line bg-white px-3 py-2"><option value={10}>10 questions</option><option value={20}>20 questions</option></select></label>
        </div>
        <Button variant="outline" className="mt-4" onClick={handlePreviewGeneration}>Prepare question set</Button>
        <p className="mt-3 text-xs text-muted">Images/diagrams can be included when a question genuinely requires them. Loading states can be brief and professional.</p>
      </div>
    </div>

    <div className="mt-8 grid gap-6 md:grid-cols-3">
      <article className="rounded-2xl border border-line bg-cream p-6"><BookOpenCheck className="text-blue"/><h2 className="mt-3 font-display text-xl font-semibold">One-attempt learning</h2><p className="mt-2 text-sm text-muted">Each submitted attempt is locked as a recorded attempt. A student may redo the work after reviewing feedback, but a redo is recorded as another attempt rather than silently replacing the first result.</p></article>
      <article className="rounded-2xl border border-line bg-cream p-6"><BarChart3 className="text-green"/><h2 className="mt-3 font-display text-xl font-semibold">Useful results</h2><p className="mt-2 text-sm text-muted">Students see what they got right and where they need improvement. Teachers and authorised school/Academy staff can see appropriate performance data and trends.</p></article>
      <article className="rounded-2xl border border-line bg-cream p-6"><CheckCircle2 className="text-purple"/><h2 className="mt-3 font-display text-xl font-semibold">Parent feedback</h2><p className="mt-2 text-sm text-muted">Parents can receive the child’s assignment/topic, score and practical improvement guidance. The system avoids exposing ordinary private conversations unnecessarily.</p></article>
    </div>

    <div className="mt-8 rounded-2xl border border-line bg-cream p-6">
      <h2 className="font-display text-2xl font-semibold">Professional school result management</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">Schools can configure subjects, classes, Continuous Assessment, tests, midterm and final examinations, enter and moderate marks privately, publish results when ready, carry previous terms forward and generate branded report cards. Teachers see only authorised classes/subjects; students see their own published results; parents see linked-child results.</p>
      <Button asChild variant="outline" className="mt-4"><Link to="/school-results">Explore the result system</Link></Button>
    </div>

    <div className="mt-8 rounded-2xl border border-line bg-cream p-6">
      <h2 className="font-display text-2xl font-semibold">Access hierarchy</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {['Phenom Super Admin','Academy Admin / Staff','School Admin','Teacher','Student / Parent'].map((x,i)=><div key={x} className="rounded-xl bg-white p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted">Level {i+1}</p><p className="mt-1 font-semibold">{x}</p><p className="mt-2 text-xs text-muted">{i<2?'Higher platform authority':i===2?'Own school only':i===3?'Assigned classes only':'Own account / linked child'}</p></div>)}
      </div>
      <p className="mt-4 text-sm text-muted">Teachers only see students/classes they are authorised to teach or assess. A teacher cannot see another teacher’s unrelated class results. School administrators manage their own school. Phenom Best Academy retains the master control layer and can moderate, audit and support the platform. Self-directed personal learning remains private from school/Academy result reporting unless it is deliberately assigned into a school workflow.</p>
    </div>
  </section>
}
