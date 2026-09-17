import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { BookOpen, Plus, Save, ShieldCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMyProfile, type Profile } from '@/lib/platform';
import { defaultProgrammes, getLocalProgrammes, saveLocalProgrammes, saveProgramme, type LearningLesson, type LearningModule, type LearningProgramme } from '@/lib/learning';

export const Route = createFileRoute('/admin-learning')({ component: AdminLearning });

function AdminLearning() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [items, setItems] = useState<LearningProgramme[]>(getLocalProgrammes());
  const [selected, setSelected] = useState(items[0]?.id || '');
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);
  useEffect(() => { void (async () => { const p = await getMyProfile(); setProfile(p); setCheckingAccess(false); })(); }, []);
  const current = items.find(x => x.id === selected) || items[0];
  const counts = useMemo(() => current ? ({ modules: current.modules.length, lessons: current.modules.reduce((n, m) => n + m.lessons.length, 0) }) : ({ modules: 0, lessons: 0 }), [current]);
  if (checkingAccess) return <section className="mx-auto max-w-3xl px-4 py-16"><div className="rounded-3xl border border-line bg-cream p-8">Checking administrator access…</div></section>;
  if (!profile || profile.role !== 'super_admin') return <section className="mx-auto max-w-3xl px-4 py-16"><div className="rounded-3xl border border-orange/30 bg-orange/5 p-8"><h1 className="font-display text-3xl font-bold">Access restricted</h1><p className="mt-3 text-muted">Only the designated Super Admin account can manage the Academy programme catalogue.</p></div></section>;
  const update = (patch: Partial<LearningProgramme>) => {
    if (!current) return;
    const next = items.map(x => x.id === current.id ? { ...x, ...patch } : x);
    setItems(next); saveLocalProgrammes(next); setMsg('Saved locally. Use Save to publish the same changes to the connected Academy database.');
  };
  const save = async () => {
    if (!current) return;
    setSaving(true); setMsg('Saving…');
    try { await saveProgramme(current); setMsg('Programme saved.'); } catch (e) { setMsg(`Save needs the connected Academy database: ${e instanceof Error ? e.message : 'connection unavailable'}`); }
    finally { setSaving(false); }
  };
  const add = () => {
    const p: LearningProgramme = { ...defaultProgrammes[0], id: `programme-${Date.now()}`, title: 'New Academy Programme', description: 'Edit this programme completely from the control centre.', published: false, modules: [] };
    const next = [p, ...items]; setItems(next); setSelected(p.id); saveLocalProgrammes(next);
  };
  const patchModule = (moduleId: string, patch: Partial<LearningModule>) => update({ modules: current!.modules.map(m => m.id === moduleId ? { ...m, ...patch } : m) });
  const patchLesson = (moduleId: string, lessonId: string, patch: Partial<LearningLesson>) => update({ modules: current!.modules.map(m => m.id === moduleId ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...patch } : l) } : m) });
  const addModule = () => update({ modules: [...current!.modules, { id: `m${Date.now()}`, title: 'New Module', description: 'Edit module description.', order: current!.modules.length + 1, lessons: [] }] });
  const addLesson = (moduleId: string) => update({ modules: current!.modules.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, { id: `l${Date.now()}`, title: 'New Lesson', type: 'reading', body: 'Write the lesson content here.', downloadable: false, order: m.lessons.length + 1 }] } : m) });
  const removeModule = (moduleId: string) => update({ modules: current!.modules.filter(m => m.id !== moduleId) });
  const removeLesson = (moduleId: string, lessonId: string) => update({ modules: current!.modules.map(m => m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m) });

  return <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
    <div className="rounded-3xl bg-navy-deep p-7 text-cream sm:p-10"><p className="text-xs font-semibold uppercase tracking-[.18em] text-gold">Private Academy administration</p><h1 className="mt-3 font-display text-4xl font-bold sm:text-6xl">Programme catalogue & content studio</h1><p className="mt-5 max-w-3xl text-cream/75">Create, edit, price, structure, publish and certify programmes without touching website code. This area is for authorised Academy administration only.</p></div>
    <div className="mt-8 grid gap-6 lg:grid-cols-[.72fr_1.28fr]">
      <aside className="rounded-2xl border border-line bg-cream p-5"><div className="flex items-center justify-between gap-3"><h2 className="font-display text-xl font-semibold">Catalogue</h2><Button onClick={add}><Plus className="size-4"/>Add</Button></div><div className="mt-4 space-y-2">{items.map(p => <button key={p.id} onClick={() => setSelected(p.id)} className={`w-full rounded-xl border p-4 text-left ${p.id === selected ? 'border-purple bg-purple/5' : 'border-line bg-white'}`}><strong className="block">{p.title}</strong><span className="text-xs text-muted">{p.category} · {p.durationMonths} month{p.durationMonths === 1 ? '' : 's'} · {p.credential}</span><span className="mt-1 block text-xs text-muted">{p.published ? 'Published' : 'Draft'} · {p.price ? `${p.currency} ${p.price.toLocaleString()}` : 'Free'}</span></button>)}</div></aside>
      {current ? <main className="rounded-2xl border border-line bg-cream p-6">
        <div className="flex flex-wrap items-start justify-between gap-4"><div><BookOpen className="text-orange"/><h2 className="mt-2 font-display text-2xl font-semibold">Edit everything</h2><p className="mt-1 text-sm text-muted">{counts.modules} modules · {counts.lessons} lessons</p></div><Button onClick={() => void save()} disabled={saving}><Save className="size-4"/>{saving ? 'Saving…' : 'Save programme'}</Button></div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Programme title" value={current.title} onChange={v => update({ title: v })}/><Field label="Category" value={current.category} onChange={v => update({ category: v })}/><Field label="Audience" value={current.audience} onChange={v => update({ audience: v })} wide/><TextField label="Description" value={current.description} onChange={v => update({ description: v })}/>
          <Select label="Access" value={current.level} options={['free','premium']} onChange={v => update({ level: v as LearningProgramme['level'] })}/>
          <Field label="Price" type="number" value={String(current.price)} onChange={v => update({ price: Number(v) || 0 })}/>
          <Select label="Billing" value={current.billing} options={['one_time','termly','semester','annual']} onChange={v => update({ billing: v as LearningProgramme['billing'] })}/>
          <Field label="Duration (months)" type="number" value={String(current.durationMonths)} onChange={v => update({ durationMonths: Math.min(18, Math.max(1, Number(v) || 1)) })}/>
          <Select label="Credential" value={current.credential} options={['none','participation','completion','certificate','diploma']} onChange={v => update({ credential: v as LearningProgramme['credential'], certificate: v !== 'none' })}/>
          <Field label="Award / certificate title" value={current.awardTitle} onChange={v => update({ awardTitle: v })}/>
          <Select label="Affiliation requirement" value={current.affiliation} options={['none','professional_partner','university_or_polytechnic','licensed_provider','case_by_case']} onChange={v => update({ affiliation: v as LearningProgramme['affiliation'] })}/>
          <TextField label="Affiliation / certification note" value={current.affiliationNote} onChange={v => update({ affiliationNote: v })}/>
          <Field label="Pass mark (%)" type="number" value={String(current.passMark)} onChange={v => update({ passMark: Math.min(100, Math.max(0, Number(v) || 0)) })}/>
          <Field label="Brand name" value={current.brandName} onChange={v => update({ brandName: v })}/>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3"><Toggle title={current.published ? 'Published' : 'Draft'} body="Control whether the programme is publicly available." onClick={() => update({ published: !current.published })}/><Toggle title={current.certificate ? 'Certification enabled' : 'Certification disabled'} body="Certificates are issued only after configured completion and assessment rules are met." onClick={() => update({ certificate: !current.certificate, credential: current.certificate ? 'none' : 'completion' })}/><div className="rounded-xl border border-line bg-white p-4"><ShieldCheck className="text-green"/><strong className="mt-2 block">Internal controls</strong><span className="text-xs text-muted">Pricing, content, certification and affiliation settings remain private administration data.</span></div></div>
        <div className="mt-8 flex items-center justify-between gap-3"><div><h3 className="font-display text-2xl font-semibold">Modules & lessons</h3><p className="text-sm text-muted">Edit lesson text, add video/audio/external resources, make materials downloadable, or build a new module.</p></div><Button variant="outline" onClick={addModule}><Plus className="size-4"/>Add module</Button></div>
        <div className="mt-5 space-y-5">{current.modules.map(m => <article key={m.id} className="rounded-2xl border border-line bg-white p-5"><div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]"><Field label="Module title" value={m.title} onChange={v => patchModule(m.id, { title: v })}/><Field label="Module description" value={m.description} onChange={v => patchModule(m.id, { description: v })}/><button aria-label="Delete module" className="mt-7 rounded-lg border border-line p-3 text-red-700" onClick={() => removeModule(m.id)}><Trash2 className="size-4"/></button></div><div className="mt-4 space-y-3">{m.lessons.map(l => <div key={l.id} className="rounded-xl bg-paper p-4"><div className="grid gap-3 sm:grid-cols-2"><Field label="Lesson title" value={l.title} onChange={v => patchLesson(m.id, l.id, { title: v })}/><Select label="Type" value={l.type} options={['reading','video','audio','resource','external']} onChange={v => patchLesson(m.id, l.id, { type: v as LearningLesson['type'] })}/><TextField label="Lesson content / description" value={l.body || ''} onChange={v => patchLesson(m.id, l.id, { body: v })}/><Field label="Media / resource URL" value={l.url || ''} onChange={v => patchLesson(m.id, l.id, { url: v })}/></div><div className="mt-3 flex flex-wrap items-center justify-between gap-3"><label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" checked={Boolean(l.downloadable)} onChange={e => patchLesson(m.id, l.id, { downloadable: e.target.checked })}/> Allow download where permitted</label><button className="inline-flex items-center gap-2 text-sm font-semibold text-red-700" onClick={() => removeLesson(m.id, l.id)}><Trash2 className="size-4"/>Remove lesson</button></div></div>)}</div><Button variant="outline" className="mt-4" onClick={() => addLesson(m.id)}><Plus className="size-4"/>Add lesson</Button></article>)}</div>
        {msg && <p className="mt-5 rounded-xl bg-green/10 p-4 text-sm">{msg}</p>}
      </main> : <div className="rounded-2xl border border-line bg-cream p-8">No programme selected.</div>}
    </div>
    <section className="mt-8 rounded-2xl border border-purple/20 bg-purple/5 p-6"><h2 className="font-display text-2xl font-semibold">Programme policy built into the catalogue</h2><p className="mt-2 text-sm text-muted">Short programmes may use Academy-issued participation or completion recognition. Assessed certificate programmes require the configured pass mark and completion requirements. The 18-month language diploma pathway is explicitly marked for a formal university/polytechnic partnership; the Academy must not describe an external diploma as its own award.</p></section>
  </section>;
}

function Field({ label, value, onChange, type = 'text', wide = false }: { label: string; value: string; onChange: (v: string) => void; type?: string; wide?: boolean }) { return <label className={`text-sm font-semibold ${wide ? 'sm:col-span-2' : ''}`}>{label}<input type={type} className="mt-2 w-full rounded-xl border border-line bg-white p-3" value={value} onChange={e => onChange(e.target.value)}/></label>; }
function TextField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) { return <label className="text-sm font-semibold sm:col-span-2">{label}<textarea className="mt-2 min-h-28 w-full rounded-xl border border-line bg-white p-3" value={value} onChange={e => onChange(e.target.value)}/></label>; }
function Select({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) { return <label className="text-sm font-semibold">{label}<select className="mt-2 w-full rounded-xl border border-line bg-white p-3" value={value} onChange={e => onChange(e.target.value)}>{options.map(x => <option key={x} value={x}>{x}</option>)}</select></label>; }
function Toggle({ title, body, onClick }: { title: string; body: string; onClick: () => void }) { return <button className="rounded-xl border border-line bg-white p-4 text-left" onClick={onClick}><strong className="block">{title}</strong><span className="mt-1 block text-xs text-muted">{body}</span></button>; }
