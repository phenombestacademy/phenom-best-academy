import { useEffect, useMemo, useState } from 'react';
import { getSupabase } from '@/lib/cms';

type Row={id:string;country_code:string;sector:string;qualification_level:string;programme_name:string;delivery_status:string;practical_requirement:string;duration_months:number|null};

export function TertiaryProgrammeBrowser(){
 const [rows,setRows]=useState<Row[]>([]);
 const [country,setCountry]=useState('NG');
 const [level,setLevel]=useState('nd');
 const [sector,setSector]=useState('all');
 const [loading,setLoading]=useState(true);
 useEffect(()=>{const s=getSupabase();if(!s)return;setLoading(true);s.from('lms_tertiary_programme_catalogue').select('id,country_code,sector,qualification_level,programme_name,delivery_status,practical_requirement,duration_months').eq('active',true).order('sector').order('programme_name').then(({data})=>setRows((data||[]) as Row[])).finally(()=>setLoading(false));},[]);
 const sectors=useMemo(()=>[...new Set(rows.filter(x=>x.country_code===country&&x.qualification_level===level).map(x=>x.sector))].sort(),[rows,country,level]);
 const filtered=rows.filter(x=>x.country_code===country&&x.qualification_level===level&&(sector==='all'||x.sector===sector));
 return <div className="rounded-2xl border border-line bg-cream p-5">
  <h3 className="font-display text-xl font-semibold">Tertiary and Polytechnic pathways</h3>
  <p className="mt-1 text-sm text-muted">Programmes are pre-structured as reference pathways. External admission, accreditation, licensing and awards remain with the verified awarding institution or authority.</p>
  <div className="mt-4 grid gap-3 sm:grid-cols-3">
   <label className="text-sm font-semibold">Country<select value={country} onChange={e=>{setCountry(e.target.value);setSector('all')}} className="mt-1 w-full rounded-xl border border-line bg-white p-3"><option value="NG">Nigeria</option><option value="GB">United Kingdom</option><option value="US">United States</option><option value="AU">Australia</option><option value="ZA">South Africa</option><option value="IN">India</option><option value="KE">Kenya</option></select></label>
   <label className="text-sm font-semibold">Qualification<select value={level} onChange={e=>{setLevel(e.target.value);setSector('all')}} className="mt-1 w-full rounded-xl border border-line bg-white p-3"><option value="nd">National Diploma (ND)</option><option value="hnd">Higher National Diploma (HND)</option><option value="diploma">Diploma</option><option value="bachelor">Bachelor</option><option value="master">Master</option><option value="doctorate">Doctorate</option></select></label>
   <label className="text-sm font-semibold">Category<select value={sector} onChange={e=>setSector(e.target.value)} className="mt-1 w-full rounded-xl border border-line bg-white p-3"><option value="all">All categories</option>{sectors.map(x=><option key={x}>{x}</option>)}</select></label>
  </div>
  {loading?<p className="mt-4 text-sm text-muted">Loading programme catalogue…</p>:<div className="mt-5 grid gap-3 sm:grid-cols-2">{filtered.map(x=><article key={x.id} className="rounded-xl border border-line bg-white p-4"><div className="flex items-start justify-between gap-3"><strong>{x.programme_name}</strong><span className="rounded-full bg-purple/10 px-2 py-1 text-[11px] font-semibold">{x.delivery_status.replaceAll('_',' ')}</span></div><p className="mt-2 text-xs text-muted">{x.sector} · {x.duration_months?x.duration_months+' months':''}</p><p className="mt-2 text-xs leading-5 text-muted">{x.practical_requirement}</p></article>)}{!filtered.length&&<p className="text-sm text-muted">This qualification/country combination is not yet seeded as a verified catalogue entry.</p>}</div>}
 </div>;
}
