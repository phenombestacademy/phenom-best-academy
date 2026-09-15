import { createFileRoute } from '@tanstack/react-router';
import { useMemo, useState } from 'react';
import { Calculator, Camera, Copy, FlaskConical, FunctionSquare, GraduationCap, Sigma, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { logAnalytics } from '@/lib/platform';

export const Route = createFileRoute('/tools')({ component: ToolsPage });

type Formula = { subject: string; name: string; formula: string; note: string };
const formulas: Formula[] = [
  { subject: 'Mathematics', name: 'Quadratic formula', formula: 'x = (-b ± √(b² − 4ac)) / 2a', note: 'Use for ax² + bx + c = 0.' },
  { subject: 'Mathematics', name: 'Area of a circle', formula: 'A = πr²', note: 'r is the radius.' },
  { subject: 'Mathematics', name: 'Pythagoras', formula: 'a² + b² = c²', note: 'For a right-angled triangle, c is the hypotenuse.' },
  { subject: 'Physics', name: 'Newton’s second law', formula: 'F = ma', note: 'Force equals mass multiplied by acceleration.' },
  { subject: 'Physics', name: 'Kinetic energy', formula: 'KE = ½mv²', note: 'm is mass and v is velocity.' },
  { subject: 'Physics', name: 'Ohm’s law', formula: 'V = IR', note: 'Voltage equals current multiplied by resistance.' },
  { subject: 'Chemistry', name: 'Moles', formula: 'n = m / M', note: 'n is amount in moles, m is mass, M is molar mass.' },
  { subject: 'Chemistry', name: 'Molarity', formula: 'C = n / V', note: 'n is moles and V is solution volume in litres.' },
  { subject: 'Chemistry', name: 'Ideal gas law', formula: 'PV = nRT', note: 'Relates pressure, volume, amount, gas constant and temperature.' },
];

function safeEval(expression: string) {
  const clean = expression.replace(/×/g, '*').replace(/÷/g, '/').replace(/[^0-9+\-*/().% ]/g, '');
  if (!clean.trim()) return '';
  try { const result = Function(`"use strict"; return (${clean})`)(); return Number.isFinite(result) ? String(result) : 'Error'; } catch { return 'Error'; }
}

function ToolsPage() {
  const [display, setDisplay] = useState('');
  const [subject, setSubject] = useState('All');
  const [scanName, setScanName] = useState('');
  const filtered = useMemo(() => formulas.filter((f) => subject === 'All' || f.subject === subject), [subject]);
  const press = (key: string) => setDisplay((v) => key === 'C' ? '' : key === '⌫' ? v.slice(0, -1) : key === '=' ? safeEval(v) : `${v}${key}`);
  const scan = (file: File | undefined) => { if (!file) return; setScanName(file.name); logAnalytics('question_scan_started', { type: file.type }); };
  return <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <div className="rounded-3xl bg-navy-deep p-6 text-cream sm:p-10"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">Phenom Best Smart Tools</p><h1 className="mt-3 font-display text-3xl font-bold sm:text-5xl">Calculate. Understand. Learn.</h1><p className="mt-4 max-w-3xl text-cream/75">A lightweight learning toolkit for students, professionals, business users, engineers and anyone who needs useful calculations and concise study guidance.</p></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <div className="rounded-2xl border border-line bg-cream p-5"><div className="flex items-center justify-between"><h2 className="font-display text-xl font-semibold">Smart Calculator</h2><Calculator className="text-orange"/></div><div className="mt-4 rounded-2xl bg-navy-deep p-5 text-right text-3xl font-semibold tracking-wide text-cream min-h-20 break-all">{display || '0'}</div><div className="mt-3 grid grid-cols-4 gap-2">{['C','⌫','(',')','7','8','9','÷','4','5','6','×','1','2','3','-','0','.','%','+'].map((k) => <button key={k} className="min-h-14 rounded-xl border border-line bg-white text-lg font-semibold active:scale-[.98]" onClick={() => press(k)}>{k}</button>)}<button className="col-span-4 min-h-14 rounded-xl bg-orange text-white text-lg font-bold" onClick={() => press('=')}>=</button></div><Button variant="outline" className="mt-3 w-full" onClick={() => navigator.clipboard?.writeText(display)}><Copy className="mr-2 size-4"/> Copy result</Button></div>
      <div className="rounded-2xl border border-line bg-cream p-5"><div className="flex items-center gap-3"><GraduationCap className="text-green"/><div><h2 className="font-display text-xl font-semibold">Formula & short-note library</h2><p className="text-sm text-muted">Mathematics, Physics and Chemistry.</p></div></div><div className="mt-4 flex flex-wrap gap-2">{['All','Mathematics','Physics','Chemistry'].map((s) => <button key={s} onClick={() => setSubject(s)} className={`rounded-full px-4 py-2 text-sm font-semibold ${subject===s?'bg-navy-deep text-cream':'border border-line bg-white'}`}>{s}</button>)}</div><div className="mt-4 grid gap-3">{filtered.map((f) => <article key={f.name} className="rounded-xl border border-line bg-white p-4"><div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted"><span>{f.subject}</span><span>•</span><span>{f.name}</span></div><p className="mt-2 font-mono text-lg font-bold text-purple">{f.formula}</p><p className="mt-1 text-sm text-muted">{f.note}</p></article>)}</div></div>
    </div>
    <div className="mt-6 grid gap-6 md:grid-cols-3">
      <div className="rounded-2xl border border-line bg-cream p-5 md:col-span-3"><Languages className="text-orange"/><h2 className="mt-3 font-display text-2xl font-semibold">English Language Tools</h2><p className="mt-2 text-sm leading-relaxed text-muted">Choose British English or American English for spelling and style guidance. The learning layer can check grammar, spelling, punctuation and writing clarity, then explain the correction so the learner understands it.</p><div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-xl bg-white p-4"><p className="font-semibold">British English</p><p className="mt-1 text-xs text-muted">e.g. organise, colour, programme.</p></div><div className="rounded-xl bg-white p-4"><p className="font-semibold">American English</p><p className="mt-1 text-xs text-muted">e.g. organize, color, program.</p></div><div className="rounded-xl bg-white p-4"><p className="font-semibold">Grammar & punctuation</p><p className="mt-1 text-xs text-muted">Identify errors and explain why the correction works.</p></div><div className="rounded-xl bg-white p-4"><p className="font-semibold">Writing improvement</p><p className="mt-1 text-xs text-muted">Clarity, structure, tone, vocabulary and learning notes.</p></div></div><p className="mt-4 text-xs text-muted">For production use, the checker should run through a protected server-side language service rather than exposing API keys in the browser.</p></div>
    </div>
    <div className="mt-6 grid gap-6 md:grid-cols-3">
      <div className="rounded-2xl border border-line bg-cream p-5"><FunctionSquare className="text-blue"/><h2 className="mt-3 font-display text-xl font-semibold">Scientific & graphing</h2><p className="mt-2 text-sm text-muted">Architecture is ready for trigonometry, logarithms, powers, roots, scientific notation, equations, graphs, zooming and history.</p></div>
      <div className="rounded-2xl border border-line bg-cream p-5"><Sigma className="text-purple"/><h2 className="mt-3 font-display text-xl font-semibold">Engineering & conversion</h2><p className="mt-2 text-sm text-muted">Length, area, volume, mass, pressure, energy, power, speed, angle, data and professional calculation modules can live here.</p></div>
      <div className="rounded-2xl border border-line bg-cream p-5"><FlaskConical className="text-green"/><h2 className="mt-3 font-display text-xl font-semibold">Question scanner</h2><label className="mt-3 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-white p-5 text-sm font-semibold"><Camera className="size-5"/> Capture or choose a question<input className="sr-only" type="file" accept="image/*" capture="environment" onChange={(e) => scan(e.target.files?.[0])}/></label>{scanName && <p className="mt-3 text-xs text-muted">Captured: {scanName}. The image can be sent to the connected question-analysis service when enabled.</p>}<p className="mt-3 text-xs text-muted">Camera access is optional and only requested when you choose this feature.</p></div>
    </div>
  </section>
}
