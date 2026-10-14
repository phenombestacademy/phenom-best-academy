import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { Award, Download, Printer } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { listProgrammes, type LearningProgramme } from '@/lib/learning';

export const Route = createFileRoute('/cpd')({ component: CPDPage });

const certKey = (id:string) => `phenom-cert-${id}`;

function CPDPage(){
  const [items,setItems]=useState<LearningProgramme[]>([]);
  const [selected,setSelected]=useState('');
  const [done,setDone]=useState<string[]>([]);
  const [score,setScore]=useState<number|null>(null);
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [feedback,setFeedback]=useState<string[]>([]);

  useEffect(()=>{listProgrammes().then(x=>{setItems(x);setSelected(x[0]?.id||'')}).catch(()=>setItems([]))},[]);

  const p=items.find(x=>x.id===selected);
  const lessons=useMemo(()=>p?.modules.flatMap(m=>m.lessons)||[],[p]);

  type CPDQuestion = [string, string, string[], string, string];
  const questions: CPDQuestion[] = [
    ['q1','What is the purpose of structured professional learning?',['A. To avoid assessment','B. To build and demonstrate capability','C. To remove all practice'],'B','Structured learning connects knowledge, practice and demonstrated capability.'],
    ['q2','What should happen before an assessed certificate is issued?',['A. Configured completion requirements should be met','B. Any page should be opened once','C. The learner should skip the assessment'],'A','A certificate should follow the programme’s published completion and assessment rules.'],
    ['q3','What is a useful learning habit?',['A. Read, practise, assess and reflect','B. Never review corrections','C. Ignore feedback'],'A','Reviewing feedback and practising again strengthens learning.']
  ];

  const submit=()=>{
    const fb:string[]=[];
    let got=0;
    questions.forEach(q=>{
      if(answers[q[0]]===q[3])got++;
      else fb.push(`${q[1]} — ${q[4]}`)
    });
    setScore(Math.round(got/questions.length*100));
    setFeedback(fb);
  };

  const passed=(score??0)>=(p?.passMark??60);
  const completed=Boolean(p)&&lessons.length>0&&done.length>=lessons.length&&passed&&p?.credential!=='none';

  const certNo=(()=>{
    if(!p||typeof window==='undefined')return '';
    const key=certKey(p.id);
    let v=localStorage.getItem(key);
    if(!v){
      v=`PBA-${new Date().getFullYear()}-${Math.floor(100000+Math.random()*900000)}`;
      localStorage.setItem(key,v)
    }
    return v
  })();

  return <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <div className="rounded-3xl bg-navy-deep p-7 text-cream sm:p-10">
      <p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">Online learning & CPD</p>
      <h1 className="mt-3 max-w-4xl font-display text-4xl font-bold text-white sm:text-6xl">Study properly. Complete your assessments. Earn the right recognition.</h1>
      <p className="mt-5 max-w-3xl text-on-navy">Programmes are structured as modules and lessons with reading, media, resources, progress, assessments, corrections and configured completion recognition.</p>
      <p className="mt-4 max-w-3xl rounded-xl bg-white/10 p-3 text-sm text-on-navy">CPD and Tools Premium are separate. If a particular CPD programme requires a Tool capability such as speech, the relevant capability may be enabled for the active learning period without granting unrelated Tool Premium services.</p>
    </div>

    <div className="mt-8 grid gap-6 lg:grid-cols-[.8fr_1.2fr]">
      <aside className="rounded-2xl border border-line bg-cream p-5">
        <h2 className="font-display text-xl font-semibold">Programme catalogue</h2>
        <div className="mt-4 max-h-[65vh] space-y-2 overflow-auto pr-1">
          {items.map(x=><button key={x.id} onClick={()=>{setSelected(x.id);setDone([]);setScore(null);setAnswers({});setFeedback([])}} className={`w-full rounded-xl border p-4 text-left ${x.id===selected?'border-purple bg-purple/5':'border-line bg-white'}`}>
            <strong className="block">{x.title}</strong>
            <span className="text-xs text-muted">{x.category} · {x.durationMonths} months · {x.level==='free'?'Free':'Premium'} · {x.credential}</span>
          </button>)}
        </div>
        <Button asChild variant="outline" className="mt-4 w-full"><Link to="/subscriptions">View subscriptions</Link></Button>
      </aside>

      {p?<main className="rounded-2xl border border-line bg-cream p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge>{p.level==='free'?'Free programme':'Premium programme'}</Badge>
            <h2 className="mt-3 font-display text-3xl font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm text-muted">{p.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-paper px-3 py-1">{p.durationMonths} months</span>
              <span className="rounded-full bg-paper px-3 py-1">{p.credential === 'none' ? 'No certificate' : p.credential}</span>
              <span className="rounded-full bg-paper px-3 py-1">{p.awardTitle}</span>
            </div>
          </div>
          <Award className="size-8 text-gold"/>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-paper p-4"><b>{p.modules.length}</b><span className="block text-xs text-muted">Modules</span></div>
          <div className="rounded-xl bg-paper p-4"><b>{lessons.length}</b><span className="block text-xs text-muted">Lessons</span></div>
          <div className="rounded-xl bg-paper p-4"><b>{done.length}/{lessons.length}</b><span className="block text-xs text-muted">Progress</span></div>
          <div className="rounded-xl bg-paper p-4"><b>{p.passMark}%</b><span className="block text-xs text-muted">Pass mark</span></div>
        </div>

        <h3 className="mt-8 font-display text-2xl font-semibold">1. Study the programme</h3>

        <div className="mt-4 space-y-3">
          {p.modules.map(m=><div key={m.id} className="rounded-xl border border-line bg-white p-4">
            <h4 className="font-semibold">{m.title}</h4>
            <p className="mt-1 text-sm text-muted">{m.description}</p>
            <div className="mt-3 space-y-2">
              {m.lessons.map(l=><div key={l.id} className="rounded-lg bg-paper p-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <strong className="text-sm">{l.title}</strong>
                    <span className="ml-2 text-xs text-muted">{l.type}</span>
                    {l.body&&<p className="mt-1 text-xs leading-5 text-muted">{l.body}</p>}
                    {l.url&&<a className="mt-1 block text-xs font-semibold text-blue" href={l.url} target="_blank" rel="noreferrer">Open learning resource</a>}
                  </div>
                  <Button size="sm" variant={done.includes(l.id)?'outline':'default'} onClick={()=>setDone(x=>x.includes(l.id)?x:x.concat(l.id))}>{done.includes(l.id)?'Completed':'Mark complete'}</Button>
                </div>
              </div>)}
            </div>
          </div>)}
        </div>

        <h3 className="mt-8 font-display text-2xl font-semibold">2. Assessment</h3>

        <div className="mt-4 space-y-4">
          {questions.map(q=><div key={q[0]} className="rounded-xl border border-line bg-white p-4">
            <p className="font-semibold">{q[1]}</p>
            <div className="mt-3 grid gap-2">
              {q[2].map(o=><label key={o} className="rounded-lg border border-line p-3 text-sm">
                <input type="radio" name={q[0]} className="mr-2" checked={answers[q[0]]===o.charAt(0)} onChange={()=>setAnswers(a=>({...a,[q[0]]:o.charAt(0)}))}/>{o}
              </label>)}
            </div>
          </div>)}
        </div>

        <Button className="mt-5" onClick={submit}>Submit assessment</Button>

        {score!==null&&<div className="mt-5 rounded-xl bg-green/5 p-5">
          <strong>Score: {score}%</strong>
          <p className="mt-2 text-sm text-muted">{passed?'Passed.':'Not yet passed.'}</p>
          {feedback.length>0&&<div className="mt-3">
            <strong className="text-sm">Corrections and learning feedback</strong>
            <ul className="mt-2 list-disc pl-5 text-sm text-muted">{feedback.map(x=><li key={x}>{x}</li>)}</ul>
          </div>}
        </div>}

        {completed&&<div className="mt-8 rounded-2xl border-2 border-gold/40 bg-white p-6 text-center">
          <img src="/brand/mark-clear.png" alt="Phenom Best Academy" className="mx-auto h-14 w-14 object-contain"/>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[.2em] text-purple">Phenom Best Academy</p>
          <h3 className="mt-3 font-display text-3xl font-bold">{p.awardTitle}</h3>
          <p className="mt-3 text-muted">This certifies that the learner has completed the configured programme requirements.</p>
          <p className="mt-3 text-sm text-muted">Certificate No. <strong>{certNo}</strong></p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Button onClick={()=>window.print()}><Printer className="size-4"/>Print certificate</Button>
            <Button variant="outline" onClick={()=>window.print()}><Download className="size-4"/>Save / PDF via print</Button>
          </div>
        </div>}

        {p.affiliation!=='none'&&<div className="mt-8 rounded-xl border border-purple/20 bg-purple/5 p-4 text-sm text-muted"><strong>Recognition / affiliation note:</strong> {p.affiliationNote}</div>}

        <div className="mt-8 rounded-xl border border-line bg-paper p-4 text-sm text-muted">Administrators can attach approved PDFs, documents, images, video, audio and external resources to any lesson. Downloads are controlled per resource and by applicable rights/permissions.</div>
      </main>:<main className="rounded-2xl border border-line bg-cream p-8">No published programme is available yet.</main>}
    </div>
  </section>
}
