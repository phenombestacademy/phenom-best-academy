import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useState, type ReactNode } from 'react';
import { BookOpen, CalendarCheck, ClipboardCheck, Coins, GraduationCap, LayoutDashboard, Users, WalletCards, Vote, ShieldCheck, Plus, Save, Trash2, ClipboardList, Settings2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getMyProfile, type Profile } from '@/lib/platform';
import { createSchool, getMySchoolMembership, getSchoolDashboardSummary, type SchoolContext, type SchoolDashboardSummary } from '@/lib/school';
import { getSupabase, listCurriculumLibrary, type CurriculumLibraryItem } from '@/lib/cms';
import { CURRICULA, MAX_SCHOOL_CURRICULA, suggestedCurriculumIds, type CurriculumId } from '@/data/curricula';

export const Route = createFileRoute('/schools')({ component: SchoolsPage });

type Tab = 'dashboard'|'people'|'students'|'classes'|'subjects'|'attendance'|'learning'|'cbt'|'results'|'fees'|'hr'|'elections'|'settings';
const tabs:[Tab,string,typeof LayoutDashboard][]=[['dashboard','Dashboard',LayoutDashboard],['people','People',Users],['students','Students',Users],['classes','Classes',GraduationCap],['subjects','Subjects',BookOpen],['attendance','Attendance',ClipboardCheck],['learning','Assignments / LMS',ClipboardList],['cbt','CBT',Settings2],['results','Results',ClipboardList],['fees','Fees',Coins],['hr','HR & Payroll',WalletCards],['elections','Elections',Vote],['settings','School Settings',Settings2]];
const catalogStages=[['early_childhood_primary','Early Childhood & Foundation'],['secondary_core','Secondary Core'],['secondary_science','Secondary Science'],['secondary_commercial','Secondary Commercial'],['secondary_arts','Secondary Arts & Humanities'],['secondary_vocational','Vocational & Technical'],['university','University / Tertiary']] as const;

function SchoolsPage(){
 const [profile,setProfile]=useState<Profile|null>(null); const [context,setContext]=useState<SchoolContext|null>(null); const [summary,setSummary]=useState<SchoolDashboardSummary|null>(null); const [schoolId,setSchoolId]=useState(''); const [schools,setSchools]=useState<Record<string,unknown>[]>([]); const [tab,setTab]=useState<Tab>('dashboard'); const [message,setMessage]=useState(''); const [schoolName,setSchoolName]=useState(''); const [country,setCountry]=useState('NG'); const [stateOrRegion,setStateOrRegion]=useState(''); const [curricula,setCurricula]=useState<CurriculumId[]>(() => suggestedCurriculumIds('NG') as CurriculumId[]); 
 const canManage=profile?.role==='super_admin'||context?.role==='school_admin';
 const canTeach=profile?.role==='super_admin'||context?.role==='teacher';
 const canStructure=canManage;
 useEffect(()=>{void load()},[]);
 async function load(){try{const p=await getMyProfile();setProfile(p);const c=await getMySchoolMembership();setContext(c);if(c){setSchoolId(c.school.id);setSummary(await getSchoolDashboardSummary(c.school.id));} if(p?.role==='super_admin'){const s=getSupabase();if(s){const {data}=await s.from('schools').select('id,name').order('name');setSchools((data||[]) as Record<string,unknown>[]);}}}catch(e){setMessage(e instanceof Error?e.message:'Could not load school platform.')}}
 async function selectSchool(id:string){setSchoolId(id);const s=getSupabase();if(!s)return;const {data}=await s.from('schools').select('id,name,logo_url,primary_color,country,currency').eq('id',id).single();if(data)setContext({school:{id:String(data.id),name:String(data.name),logoUrl:data.logo_url?String(data.logo_url):null,primaryColor:data.primary_color?String(data.primary_color):null,country:data.country?String(data.country):null,currency:data.currency?String(data.currency):null},role:'school_admin',membershipId:'super-admin-access'});setSummary(await getSchoolDashboardSummary(id));}
 async function handleCreate(){try{setMessage('Creating school…');await createSchool({name:schoolName,country,curricula,stateOrRegion});setSchoolName('');setMessage('School created.');await load()}catch(e){setMessage(e instanceof Error?e.message:'Could not create school.')}}
 if(!profile)return <Shell title="School Management Platform"><p>Please sign in to access the school platform.</p><Button asChild className="mt-4"><Link to="/account">Open account</Link></Button></Shell>;
 if(!context&&!schoolId)return <Shell title="School Management Platform"><div className="rounded-2xl border border-line bg-cream p-6"><h2 className="font-display text-2xl font-semibold">Create or select a school</h2><p className="mt-2 text-sm text-muted">The Super Admin can open any school. A school administrator creates and controls their own school workspace.</p><div className="mt-4 grid gap-3 md:grid-cols-2"><input value={schoolName} onChange={e=>setSchoolName(e.target.value)} className="rounded-xl border border-line bg-white p-3" placeholder="School name"/><select value={country} onChange={e=>{setCountry(e.target.value);const s=suggestedCurriculumIds(e.target.value);setCurricula(prev=>prev.length?prev:s as CurriculumId[])}} className="rounded-xl border border-line bg-white p-3"><option value="NG">Nigeria</option><option value="GB">United Kingdom</option><option value="US">United States</option><option value="AU">Australia</option><option value="IN">India</option><option value="SG">Singapore</option><option value="KE">Kenya</option><option value="ZA">South Africa</option><option value="GH">Ghana</option><option value="RW">Rwanda</option><option value="NZ">New Zealand</option><option value="JP">Japan</option><option value="CN">China</option><option value="BR">Brazil</option><option value="FR">France</option><option value="AE">United Arab Emirates</option><option value="IE">Ireland</option><option value="OTHER">Other country</option></select><input value={stateOrRegion} onChange={e=>setStateOrRegion(e.target.value)} className="rounded-xl border border-line bg-white p-3" placeholder="State / region (where relevant)"/><div className="rounded-xl border border-line bg-white p-4"><p className="text-sm font-semibold">Curriculum frameworks — choose up to {MAX_SCHOOL_CURRICULA}</p><p className="mt-1 text-xs text-muted">The school workspace will use the selected framework(s) for subjects, stages and learning references.</p><div className="mt-3 grid gap-2">{CURRICULA.map(c=><label key={c.id} className="flex items-start gap-2 text-sm"><input type="checkbox" checked={curricula.includes(c.id)} disabled={!curricula.includes(c.id)&&curricula.length>=MAX_SCHOOL_CURRICULA} onChange={e=>setCurricula(prev=>e.target.checked?[...prev,c.id]:prev.filter(x=>x!==c.id))}/><span><strong>{c.name}</strong><span className="block text-xs text-muted">{c.description}</span></span></label>)}</div></div><Button onClick={handleCreate} disabled={!schoolName.trim()||curricula.length===0}>Create school</Button></div>{schools.length>0&&<div className="mt-6 grid gap-2">{schools.map(s=><Button key={String(s.id)} variant="outline" onClick={()=>void selectSchool(String(s.id))}>{String(s.name)}</Button>)}</div>}</div></Shell>;
 if(!schoolId)return <Shell title="School Management Platform"><p>No school is connected to this account.</p></Shell>;
 return <Shell title={context?.school.name||'School Management'}>
  <div className="rounded-3xl bg-navy-deep p-7 text-cream sm:p-10"><p className="text-xs uppercase tracking-[.18em] text-gold">{profile.role==='super_admin'?'Super Admin · Full School Control':'School Management System'}</p><h1 className="mt-2 font-display text-3xl font-bold sm:text-5xl">{context?.school.name||'School workspace'}</h1><p className="mt-3 max-w-4xl text-on-navy">Manage the complete school environment: people, classes, curriculum, attendance, assignments, CBT, results, fees, HR/payroll and elections. The Phenom Best LMS Super Admin has the higher control layer.</p></div>
  {message&&<p className="mt-4 rounded-xl border border-line bg-cream p-4 text-sm">{message}</p>}
  <div className="mt-6 flex gap-2 overflow-x-auto pb-2">{tabs.map(([id,label,Icon])=><button key={id} onClick={()=>setTab(id)} className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${tab===id?'bg-navy-deep text-cream':'border border-line bg-cream'}`}><Icon className="size-4"/>{label}</button>)}</div>
  <div className="mt-6">{tab==='dashboard'&&<Dashboard summary={summary} canManage={canManage}/>} {tab==='people'&&<People schoolId={schoolId} editable={canManage} superAdmin={profile.role==='super_admin'}/>} {tab==='students'&&<Students schoolId={schoolId} editable={canStructure}/>} {tab==='classes'&&<Classes schoolId={schoolId} editable={canStructure}/>} {tab==='subjects'&&<Subjects schoolId={schoolId} editable={canStructure}/>} {tab==='attendance'&&<Attendance schoolId={schoolId} editable={canTeach} superAdmin={profile.role==='super_admin'}/>} {tab==='learning'&&<Learning schoolId={schoolId} editable={canTeach||canManage}/>} {tab==='cbt'&&<CBT schoolId={schoolId} editable={canTeach||canManage}/>} {tab==='results'&&<Results schoolId={schoolId} editable={canManage} canEnterScores={canTeach} superAdmin={profile.role==='super_admin'}/>} {tab==='fees'&&<Fees schoolId={schoolId} editable={canStructure}/>} {tab==='hr'&&<HR schoolId={schoolId} editable={canStructure}/>} {tab==='elections'&&<Elections schoolId={schoolId} editable={canStructure}/>} {tab==='settings'&&<SchoolSettings schoolId={schoolId} editable={canManage}/>} </div>
 </Shell>
}
function Shell({title,children}:{title:string;children:ReactNode}){return <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6"><div className="mb-6 flex items-center gap-3"><ShieldCheck className="text-green"/><div><p className="text-xs uppercase tracking-[.16em] text-purple">Phenom Best LMS</p><p className="font-display text-xl font-semibold">{title}</p></div></div>{children}</section>}
function SchoolSettings({schoolId,editable}:{schoolId:string;editable:boolean}){const [form,setForm]=useState<Record<string,string>>({name:'',legal_name:'',address:'',phone:'',email:'',website:'',motto:'',report_header:'',logo_url:''});const [notice,setNotice]=useState('');useEffect(()=>{(async()=>{const s=getSupabase();if(!s)return;const {data,error}=await s.from('schools').select('name,legal_name,address,phone,email,website,motto,report_header,logo_url').eq('id',schoolId).single();if(error)setNotice(error.message);else setForm(Object.fromEntries(Object.entries(data||{}).map(([k,v])=>[k,String(v??'')])));})()},[schoolId]);async function save(){const s=getSupabase();if(!s||!editable)return;const {error}=await s.from('schools').update(form).eq('id',schoolId);setNotice(error?error.message:'School identity and report-header settings saved.');}async function upload(file:File){const s=getSupabase();if(!s||!editable)return;const path=`schools/${schoolId}/logo-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g,'-')}`;const {error}=await s.storage.from('school-cbt-media').upload(path,file,{upsert:true,contentType:file.type});if(error){setNotice(error.message);return;}const {data}=s.storage.from('media').getPublicUrl(path);setForm(v=>({...v,logo_url:data.publicUrl}));setNotice('Logo uploaded. Save the school settings to apply it.');}return <Panel title="School identity & document header"><p className="mt-2 text-sm text-muted">The school controls its own identity. The full school name, logo, address and contacts are reused in the school workspace, letters, notices and report headers.</p>{editable&&<div className="mt-4 grid gap-2 md:grid-cols-2">{(['name','legal_name','address','phone','email','website','motto','report_header'] as const).map(k=><input key={k} value={form[k]} onChange={e=>setForm(v=>({...v,[k]:e.target.value}))} placeholder={k.replaceAll('_',' ')} className="rounded-xl border border-line p-3"/>)}<div className="rounded-xl border border-line p-3"><label className="text-sm font-semibold">School logo</label><input type="file" accept="image/*" onChange={e=>{const file=e.target.files?.[0];if(file)void upload(file)}} className="mt-2 block w-full text-sm"/>{form.logo_url&&<img src={form.logo_url} alt="School logo preview" className="mt-3 h-20 w-20 rounded-xl object-contain"/>}</div><Button onClick={()=>void save()}><Save className="mr-2 size-4"/>Save school identity</Button></div>}</Panel>}
function Dashboard({summary,canManage}:{summary:SchoolDashboardSummary|null;canManage:boolean}){return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[['Classes',summary?.classes],['Students',summary?.students],['Subjects',summary?.subjects],['Attendance records',summary?.attendance],['Results',summary?.results],['Staff',summary?.staff],['Fee payments',summary?.feePayments],['Elections',summary?.elections]].map(([a,b])=><div key={String(a)} className="rounded-2xl border border-line bg-cream p-5"><p className="text-sm text-muted">{a}</p><p className="mt-2 text-3xl font-bold">{b??0}</p></div>)}<div className="rounded-2xl border border-purple/20 bg-purple/5 p-6 sm:col-span-2 lg:col-span-4"><h2 className="font-display text-2xl font-semibold">Access hierarchy</h2><p className="mt-2 text-sm text-muted">Super Admin controls every school and can add/edit school structures. School Admin controls its tenant. Teachers control assigned teaching records; students and parents see only authorised records.</p>{canManage&&<p className="mt-3 text-sm font-semibold text-green">Management controls are enabled for this account.</p>}</div></div>}

type Row=Record<string,any>;
function Panel({title,children}:{title:string;children:ReactNode}){return <section className="rounded-2xl border border-line bg-cream p-6"><h2 className="font-display text-2xl font-semibold">{title}</h2>{children}</section>}
function useTable(table:string,schoolId:string,select='*'){const [rows,setRows]=useState<Row[]>([]);const [busy,setBusy]=useState(false);async function refresh(){const s=getSupabase();if(!s)return;setBusy(true);const {data,error}=await s.from(table).select(select).eq('school_id',schoolId).order('created_at',{ascending:false}).limit(100);setBusy(false);if(error)throw error;setRows((data||[]) as Row[]);}useEffect(()=>{void refresh().catch(()=>undefined)},[table,schoolId]);return {rows,busy,refresh,setRows};}
function People({schoolId,editable,superAdmin}:{schoolId:string;editable:boolean;superAdmin:boolean}){
 const [members,setMembers]=useState<Row[]>([]); const [profiles,setProfiles]=useState<Record<string,unknown>[]>([]); const [name,setName]=useState(''); const [email,setEmail]=useState(''); const [role,setRole]=useState<'teacher'|'non_teaching_staff'|'student'|'parent'|'school_admin'>('teacher'); const [message,setMessage]=useState('');
 async function load(){const s=getSupabase();if(!s)return;const {data,error}=await s.from('school_members').select('id,user_id,role,status,created_at').eq('school_id',schoolId).order('created_at',{ascending:false});if(error){setMessage(error.message);return;}setMembers((data||[]) as Row[]); const ids=(data||[]).map((x:any)=>x.user_id); if(ids.length){const {data:ps}=await s.from('profiles').select('id,full_name,avatar_url,email').in('id',ids);setProfiles((ps||[]) as Record<string,unknown>[]);}}
 useEffect(()=>{void load()},[schoolId]);
 async function add(){const s=getSupabase();if(!s||!name.trim()||!email.trim())return;setMessage('Checking account and sending invitation if needed…');const {data,error}=await s.functions.invoke('school-member-invite',{body:{school_id:schoolId,full_name:name.trim(),email:email.trim().toLowerCase(),requested_role:role}});if(error){setMessage(error.message);return;}setMessage(data?.status==='linked'?'Existing Phenom account linked to this school.':'Invitation sent. The person can accept it and complete their account.');setName('');setEmail('');await load();}
 async function setStatus(id:string,status:string){const s=getSupabase();if(!s)return;const {error}=await s.from('school_members').update({status}).eq('id',id);if(error)setMessage(error.message);else await load();}
 async function remove(id:string){const s=getSupabase();if(!s)return;const {error}=await s.from('school_members').delete().eq('id',id);if(error)setMessage(error.message);else await load();}
 return <Panel title="People & Membership"><p className="mt-2 text-sm text-muted">The school administrator records each person's name and the same email they use for Phenom. Existing accounts are linked immediately; people without accounts receive a secure invitation. No school member can become a platform Super Admin.</p>
 {editable&&<div className="mt-4 grid gap-2 md:grid-cols-4"><input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="rounded-xl border border-line p-3"/><input value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="Email used for Phenom account" className="rounded-xl border border-line p-3"/><select value={role} onChange={e=>setRole(e.target.value as typeof role)} className="rounded-xl border border-line p-3"><option value="teacher">Teacher</option><option value="non_teaching_staff">Non-teaching staff</option><option value="student">Student</option><option value="parent">Parent / Guardian</option><option value="school_admin">School Administrator</option></select><Button onClick={()=>void add()}><Send className="mr-2 size-4"/>Add / Invite</Button></div>}
 {message&&<p className="mt-3 rounded-xl bg-paper p-3 text-sm">{message}</p>}
 <div className="mt-5 space-y-2">{members.length===0?<p className="rounded-xl bg-paper p-4 text-sm text-muted">No school members yet.</p>:members.map(m=><div key={String(m.id)} className="rounded-xl border border-line bg-white p-4"><div className="grid gap-3 md:grid-cols-[1fr_auto]"><div><div className="flex items-center gap-3">{profiles.find(p=>String(p.id)===String(m.user_id))?.avatar_url?<img src={String(profiles.find(p=>String(p.id)===String(m.user_id))?.avatar_url)} alt="" className="h-10 w-10 rounded-full object-cover"/>:<div className="h-10 w-10 rounded-full bg-paper"/>}<div><p className="font-semibold">{String(profiles.find(p=>String(p.id)===String(m.user_id))?.full_name||'Unnamed user')}</p><p className="text-xs text-muted">{String(m.role)} · {String(m.status)}</p>{superAdmin&&<p className="text-xs text-muted">{String(profiles.find(p=>String(p.id)===String(m.user_id))?.email||'')}</p>}</div></div></div>{editable&&<div className="flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={()=>void setStatus(String(m.id),m.status==='suspended'?'active':'suspended')}>{m.status==='suspended'?'Reactivate':'Suspend'}</Button><Button variant="outline" size="sm" onClick={()=>void remove(String(m.id))}>Remove</Button></div>}</div></div>)}</div>
 </Panel>
}
function Students({schoolId,editable}:{schoolId:string;editable:boolean}){const t=useTable('student_school_records',schoolId);const [profiles,setProfiles]=useState<Record<string,unknown>[]>([]);useEffect(()=>{(async()=>{const s=getSupabase();if(!s)return;const ids=t.rows.map(r=>String(r.student_id));if(ids.length){const {data}=await s.from('profiles').select('id,full_name,avatar_url').in('id',ids);setProfiles((data||[]) as Record<string,unknown>[]);}})()},[t.rows.length]);const [admission,setAdmission]=useState('');const [studentId,setStudentId]=useState('');const [dob,setDob]=useState('');const [height,setHeight]=useState('');const [weight,setWeight]=useState('');const [classId,setClassId]=useState('');const [newClassId,setNewClassId]=useState('');const [action,setAction]=useState('promotion');const [reason,setReason]=useState('');const [status,setStatus]=useState('active');const [guardianName,setGuardianName]=useState('');const [guardianRelationship,setGuardianRelationship]=useState('');const [guardianPhone,setGuardianPhone]=useState('');const [guardianEmail,setGuardianEmail]=useState('');const [guardianAddress,setGuardianAddress]=useState('');
async function save(){const s=getSupabase();if(!s||!studentId)return;const payload={school_id:schoolId,student_id:studentId,admission_number:admission||null,date_of_birth:dob||null,height_cm:Number(height)||null,weight_kg:Number(weight)||null,status};const {error}=await s.from('student_school_records').upsert(payload,{onConflict:'school_id,student_id'});if(error)throw error;if(classId)await s.from('class_members').upsert({class_id:classId,user_id:studentId,role:'student'},{onConflict:'class_id,user_id'});if(guardianName.trim()){await s.from('student_guardians').delete().eq('school_id',schoolId).eq('student_id',studentId);await s.from('student_guardians').insert({school_id:schoolId,student_id:studentId,guardian_name:guardianName.trim(),relationship:guardianRelationship.trim()||'Guardian',phone:guardianPhone.trim(),email:guardianEmail.trim()||null,address:guardianAddress.trim()||null,pickup_authorised:false});}setStudentId('');setAdmission('');setDob('');setHeight('');setWeight('');setClassId('');setGuardianName('');setGuardianRelationship('');setGuardianPhone('');setGuardianEmail('');setGuardianAddress('');await t.refresh();}
async function promote(){const s=getSupabase();if(!s||!studentId||!newClassId)return;const {error}=await s.rpc('promote_student',{p_school_id:schoolId,p_student_id:studentId,p_new_class_id:newClassId,p_action:action,p_reason:reason||null});if(error)throw error;setReason('');setNewClassId('');await t.refresh();}
async function changeStatus(id:string,next:string){const s=getSupabase();if(!s)return;const {error}=await s.from('student_school_records').update({status:next}).eq('id',id);if(error)throw error;await t.refresh();}
return <Panel title="Students & learner records"><p className="mt-2 text-sm text-muted">The school captures the learner once, assigns the current class, and preserves all historical results. Promotion changes the current class only; previous class results remain attached to the old class and are never mixed into the new class.</p>{editable&&<><div className="mt-4 grid gap-2 md:grid-cols-6"><input value={studentId} onChange={e=>setStudentId(e.target.value)} placeholder="Student user ID" className="rounded-xl border border-line p-3"/><input value={admission} onChange={e=>setAdmission(e.target.value)} placeholder="Admission number" className="rounded-xl border border-line p-3"/><input type="date" value={dob} onChange={e=>setDob(e.target.value)} className="rounded-xl border border-line p-3"/><input value={height} onChange={e=>setHeight(e.target.value)} placeholder="Height cm" className="rounded-xl border border-line p-3"/><input value={weight} onChange={e=>setWeight(e.target.value)} placeholder="Weight kg" className="rounded-xl border border-line p-3"/><input value={classId} onChange={e=>setClassId(e.target.value)} placeholder="Current class ID" className="rounded-xl border border-line p-3"/><select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-xl border border-line p-3"><option value="active">Active</option><option value="suspended">Suspended</option><option value="withdrawn">Withdrawn</option><option value="transferred">Transferred</option><option value="graduated">Graduated</option><option value="archived">Archived</option></select><Button onClick={()=>void save()}>Save learner</Button></div><div className="mt-2 grid gap-2 md:grid-cols-5"><input value={guardianName} onChange={e=>setGuardianName(e.target.value)} placeholder="Parent / guardian name" className="rounded-xl border border-line p-3"/><input value={guardianRelationship} onChange={e=>setGuardianRelationship(e.target.value)} placeholder="Relationship" className="rounded-xl border border-line p-3"/><input value={guardianPhone} onChange={e=>setGuardianPhone(e.target.value)} placeholder="Guardian phone" className="rounded-xl border border-line p-3"/><input value={guardianEmail} onChange={e=>setGuardianEmail(e.target.value)} placeholder="Guardian email" className="rounded-xl border border-line p-3"/><input value={guardianAddress} onChange={e=>setGuardianAddress(e.target.value)} placeholder="Guardian address" className="rounded-xl border border-line p-3"/></div><div className="mt-4 rounded-xl border border-purple/20 bg-purple/5 p-4"><h3 className="font-semibold">Promotion / readmission</h3><div className="mt-3 grid gap-2 md:grid-cols-4"><input value={newClassId} onChange={e=>setNewClassId(e.target.value)} placeholder="New class ID" className="rounded-xl border border-line p-3"/><select value={action} onChange={e=>setAction(e.target.value)} className="rounded-xl border border-line p-3"><option value="promotion">Promotion</option><option value="double_promotion">Double promotion</option><option value="readmission">Readmission</option><option value="transfer_in">Transfer in</option><option value="graduation">Graduation</option></select><input value={reason} onChange={e=>setReason(e.target.value)} placeholder="Reason / decision note" className="rounded-xl border border-line p-3"/><Button onClick={()=>void promote()}>Apply progression</Button></div></div></>}{t.rows.map(r=><div key={String(r.id)} className="mt-3 rounded-xl border border-line bg-white p-4"><div className="grid gap-2 md:grid-cols-6">{[['student_id','Learner'],['admission_number','Admission no.'],['date_of_birth','Date of birth'],['height_cm','Height cm'],['weight_kg','Weight kg'],['status','Status']].map(([f,label])=><div key={f}>{f==='student_id'?<div className="flex items-center gap-2">{profiles.find(p=>String(p.id)===String(r[f]))?.avatar_url?<img src={String(profiles.find(p=>String(p.id)===String(r[f]))?.avatar_url)} alt="" className="h-8 w-8 rounded-full object-cover"/>:<div className="h-8 w-8 rounded-full bg-paper"/>}<div><span className="text-[11px] uppercase tracking-wide text-muted">{label}</span><p className="break-words text-sm font-medium">{String(profiles.find(p=>String(p.id)===String(r[f]))?.full_name||'Unnamed learner')}</p></div></div>:<div><span className="text-[11px] uppercase tracking-wide text-muted">{label}</span><p className="break-words text-sm font-medium">{r[f]===null||r[f]===undefined?'—':String(r[f])}</p></div>}</div>)}</div>{editable&&<div className="mt-3 flex flex-wrap gap-2"><Button variant="outline" size="sm" onClick={()=>void changeStatus(String(r.id),r.status==='suspended'?'active':'suspended')}>{r.status==='suspended'?'Reactivate':'Suspend'}</Button></div>}</div>)}</Panel>}
function Classes({schoolId,editable}:{schoolId:string;editable:boolean}){const t=useTable('school_classes',schoolId);const [name,setName]=useState('');const [level,setLevel]=useState('');const [classTeacher,setClassTeacher]=useState('');const [teachers,setTeachers]=useState<Record<string,unknown>[]>([]);useEffect(()=>{(async()=>{const s=getSupabase();if(!s)return;const {data:ms}=await s.from('school_members').select('user_id').eq('school_id',schoolId).eq('role','teacher').eq('status','active');const ids=(ms||[]).map((x:any)=>x.user_id);if(ids.length){const {data}=await s.from('profiles').select('id,full_name,avatar_url').in('id',ids);setTeachers((data||[]) as Record<string,unknown>[]);}})()},[schoolId]);async function save(){const s=getSupabase();if(!s||!name.trim())return;const {error}=await s.from('school_classes').insert({school_id:schoolId,name,level_label:level||null,class_teacher_id:classTeacher||null});if(error)throw error;setName('');setLevel('');setClassTeacher('');await t.refresh();}return <Panel title="Classes & class teachers"><p className="mt-2 text-sm text-muted">Each class may have one designated class teacher. Subject teachers can be assigned separately for each class/subject combination.</p><div className="mt-4 grid gap-2 md:grid-cols-4">{editable&&<><input value={name} onChange={e=>setName(e.target.value)} placeholder="Class name" className="rounded-xl border border-line p-3"/><input value={level} onChange={e=>setLevel(e.target.value)} placeholder="Level label" className="rounded-xl border border-line p-3"/><select value={classTeacher} onChange={e=>setClassTeacher(e.target.value)} className="rounded-xl border border-line p-3"><option value="">Class teacher</option>{teachers.map(t=><option key={String(t.id)} value={String(t.id)}>{String(t.full_name||t.id)}</option>)}</select><Button onClick={()=>void save()}><Plus className="mr-2 size-4"/>Add class</Button></>}</div><List rows={t.rows} fields={['name','level_label']} onDelete={editable?async id=>{await getSupabase()?.from('school_classes').delete().eq('id',id);await t.refresh()}:undefined}/></Panel>}
function Subjects({schoolId,editable}:{schoolId:string;editable:boolean}){const t=useTable('school_subjects',schoolId);const [name,setName]=useState('');const [code,setCode]=useState('');const [stage,setStage]=useState('secondary_core');const [catalog,setCatalog]=useState<Row[]>([]);const [schoolCurricula,setSchoolCurricula]=useState<string[]>([]);useEffect(()=>{const s=getSupabase();if(!s)return;void s.from('academic_subject_catalog').select('*').eq('active',true).order('stage').order('name').then(({data})=>setCatalog((data||[]) as Row[]));void s.from('school_curricula').select('curriculum_id').eq('school_id',schoolId).eq('enabled',true).order('priority').then(({data})=>setSchoolCurricula((data||[]).map(x=>String(x.curriculum_id))) )},[schoolId]);const selectedFrameworks=CURRICULA.filter(c=>schoolCurricula.includes(c.id));const frameworkSubjects=[...new Set(selectedFrameworks.flatMap(c=>c.subjects))];async function save(){const s=getSupabase();if(!s||!name.trim())return;const {error}=await s.from('school_subjects').upsert({school_id:schoolId,name,code:code||null},{onConflict:'school_id,name'});if(error)throw error;setName('');setCode('');await t.refresh();}return <Panel title="Curriculum & subjects"><p className="mt-2 text-sm text-muted">Subjects and learning references are aligned to the school’s selected curriculum frameworks. A school may use up to three frameworks together.</p>{selectedFrameworks.length>0&&<div className="mt-3 flex flex-wrap gap-2">{selectedFrameworks.map(c=><span key={c.id} className="rounded-full bg-purple/10 px-3 py-1 text-xs font-semibold text-purple">{c.name}</span>)}</div>}{editable&&<div className="mt-4 grid gap-2 md:grid-cols-4"><select value={stage} onChange={e=>setStage(e.target.value)} className="rounded-xl border border-line p-3">{catalogStages.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select><input value={name} onChange={e=>setName(e.target.value)} placeholder="Subject" className="rounded-xl border border-line p-3"/><input value={code} onChange={e=>setCode(e.target.value)} placeholder="Code" className="rounded-xl border border-line p-3"/><Button onClick={()=>void save()}><Plus className="mr-2 size-4"/>Add subject</Button></div>}<div className="mt-5 max-h-72 overflow-auto rounded-xl border border-line bg-white p-3"><p className="mb-2 text-sm font-semibold">Selected curriculum subject catalogue</p>{frameworkSubjects.map(x=><button key={x} onClick={()=>setName(x)} className="mr-2 mb-2 rounded-full bg-purple/10 px-3 py-2 text-xs">{x}</button>)}<p className="mb-2 mt-4 text-sm font-semibold">Academy comprehensive catalogue</p>{catalog.filter(x=>x.stage===stage).map(x=><button key={String(x.id)} onClick={()=>{setName(String(x.name));setCode(String(x.code||''))}} className="mr-2 mb-2 rounded-full bg-paper px-3 py-2 text-xs">{String(x.name)}</button>)}</div><List rows={t.rows} fields={['name','code','active']} onDelete={editable?async id=>{await getSupabase()?.from('school_subjects').delete().eq('id',id);await t.refresh()}:undefined}/></Panel>}
function Attendance({schoolId,editable,superAdmin}:{schoolId:string;editable:boolean;superAdmin:boolean}){const t=useTable('student_attendance',schoolId);const [canEnter,setCanEnter]=useState(false);const [student,setStudent]=useState('');const [date,setDate]=useState(new Date().toISOString().slice(0,10));const [status,setStatus]=useState('present');const [classId,setClassId]=useState('');const [sessionId,setSessionId]=useState('');const [checkpoint,setCheckpoint]=useState('arrival');const [termNo,setTermNo]=useState(1);useEffect(()=>{(async()=>{const s=getSupabase();if(!s||!classId){setCanEnter(false);return;}const {data}=await s.rpc('is_class_teacher_for',{p_class:classId});setCanEnter(Boolean(data)||superAdmin);})()},[classId,superAdmin]);async function save(){const s=getSupabase();if(!s||!student||!classId||!sessionId)return;const dbStatus=status==='late'?'present':status==='half_day'?'half':status==='excused'?'excused':'absent';const {error}=await s.from('student_attendance').upsert({school_id:schoolId,student_id:student,class_id:classId,session_id:sessionId,term_no:1,attendance_date:date,checkpoint,status:dbStatus,recorded_by:(await s.auth.getUser()).data.user?.id},{onConflict:'class_id,student_id,attendance_date,checkpoint'});if(error)throw error;setStudent('');await t.refresh();}return <Panel title="Attendance"><p className="mt-2 text-sm text-muted">Only the designated class teacher can enter or edit attendance. School administrators can view attendance but cannot enter or edit it; Super Admin retains platform-level correction access.</p>{(editable&&canEnter)&&<div className="mt-4 grid gap-2 md:grid-cols-7"><input value={student} onChange={e=>setStudent(e.target.value)} placeholder="Student user ID" className="rounded-xl border border-line p-3"/><input value={classId} onChange={e=>setClassId(e.target.value)} placeholder="Class ID" className="rounded-xl border border-line p-3"/><input value={sessionId} onChange={e=>setSessionId(e.target.value)} placeholder="Session ID" className="rounded-xl border border-line p-3"/><input type="date" value={date} onChange={e=>setDate(e.target.value)} className="rounded-xl border border-line p-3"/><select value={checkpoint} onChange={e=>setCheckpoint(e.target.value)} className="rounded-xl border border-line p-3"><option>arrival</option><option>departure</option></select><select value={termNo} onChange={e=>setTermNo(Number(e.target.value))} className="rounded-xl border border-line p-3"><option value={1}>Term 1</option><option value={2}>Term 2</option><option value={3}>Term 3</option></select><select value={status} onChange={e=>setStatus(e.target.value)} className="rounded-xl border border-line p-3"><option>present</option><option>absent</option><option>late</option><option>half_day</option><option>excused</option></select><Button onClick={()=>void save()}>Record</Button></div>}<List rows={t.rows} fields={['student_id','class_id','attendance_date','checkpoint','status']} onDelete={canEnter?async id=>{const s=getSupabase();await s?.from('student_attendance').delete().eq('id',id);await t.refresh()}:undefined}/></Panel>}
function Learning({schoolId,editable}:{schoolId:string;editable:boolean}){
 const [classes,setClasses]=useState<Record<string,unknown>[]>([]);
 const [subjects,setSubjects]=useState<Record<string,unknown>[]>([]);
 const [teachers,setTeachers]=useState<Record<string,unknown>[]>([]);
 const [students,setStudents]=useState<Record<string,unknown>[]>([]);
 const [sources,setSources]=useState<Record<string,unknown>[]>([]);
 const [assignments,setAssignments]=useState<Record<string,unknown>[]>([]);
 const [classId,setClassId]=useState('');
 const [subjectId,setSubjectId]=useState('');
 const [teacherId,setTeacherId]=useState('');
 const [topic,setTopic]=useState('');
 const [sourceId,setSourceId]=useState('');
 const [title,setTitle]=useState('');
 const [instructions,setInstructions]=useState('');
 const [count,setCount]=useState(10);
 const [target,setTarget]=useState<'all'|'selected'|'all_except'>('all');
 const [selected,setSelected]=useState<string[]>([]);
 const [excluded,setExcluded]=useState<string[]>([]);
 const [notice,setNotice]=useState('');
 const [activeTask,setActiveTask]=useState('');
 const [studentItems,setStudentItems]=useState<Record<string,unknown>[]>([]);
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [studentResult,setStudentResult]=useState<Record<string,unknown>|null>(null);
 const [reviewTask,setReviewTask]=useState('');
 const [reviewItems,setReviewItems]=useState<Record<string,unknown>[]>([]);
 const [showAnswers,setShowAnswers]=useState(false);

 async function load(){
   const s=getSupabase(); if(!s)return;
   const [{data:cs},{data:ss},{data:ms},{data:ts}]=await Promise.all([
     s.from('school_classes').select('id,name,level_label').eq('school_id',schoolId).order('name'),
     s.from('school_subjects').select('id,name,code').eq('school_id',schoolId).eq('active',true).order('name'),
     s.from('school_members').select('user_id,role,status').eq('school_id',schoolId).in('role',['teacher','school_admin']).eq('status','active'),
     s.from('school_assignment_tasks').select('id,title,topic,status,due_at').eq('school_id',schoolId).order('created_at',{ascending:false})
   ]);
   setClasses((cs||[]) as Record<string,unknown>[]);
   setSubjects((ss||[]) as Record<string,unknown>[]);
   setAssignments((ts||[]) as Record<string,unknown>[]);
   const ids=((ms||[]) as Record<string,unknown>[]).map(x=>String(x.user_id));
   if(ids.length){
     const {data:ps}=await s.from('profiles').select('id,full_name,avatar_url').in('id',ids);
     setTeachers((ps||[]) as Record<string,unknown>[]);
   }else setTeachers([]);
 }

 useEffect(()=>{void load()},[schoolId]);

 useEffect(()=>{
   (async()=>{
     const s=getSupabase(); if(!s||!subjectId)return;
     const subj=subjects.find(x=>String(x.id)===subjectId);
     const {data,error}=await s.rpc('list_school_lms_assessment_sources',{
       p_school_id:schoolId,
       p_subject:String(subj?.name||''),
       p_topic:topic||null,
       p_level:null
     });
     if(error){setNotice(error.message);return;}
     setSources((data||[]) as Record<string,unknown>[]);
   })();
 },[schoolId,subjectId,topic,subjects]);

 useEffect(()=>{
   (async()=>{
     const s=getSupabase(); if(!s||!classId){setStudents([]);return;}
     const {data:cms}=await s.from('class_members').select('user_id').eq('class_id',classId).eq('role','student');
     const ids=(cms||[]).map((x:any)=>String(x.user_id));
     if(!ids.length){setStudents([]);return;}
     const {data:ps}=await s.from('profiles').select('id,full_name,avatar_url').in('id',ids);
     setStudents((ps||[]) as Record<string,unknown>[]);
   })();
 },[classId]);

 async function startTask(taskId:string){
   const s=getSupabase(); if(!s)return;
   const {data,error}=await s.rpc('get_student_assignment_items',{p_task_id:taskId});
   if(error){setNotice(error.message);return;}
   setActiveTask(taskId);
   setStudentItems((data||[]) as Record<string,unknown>[]);
   setAnswers({});
   setStudentResult(null);
 }

 async function submitTask(){
   const s=getSupabase(); if(!s||!activeTask)return;
   const {data,error}=await s.rpc('submit_school_assignment',{p_task_id:activeTask,p_answers:answers});
   if(error){setNotice(error.message);return;}
   setStudentResult(data as Record<string,unknown>);
   setNotice('Submitted. Your result has been calculated automatically.');
   await load();
 }

 async function review(taskId:string){
   const s=getSupabase(); if(!s)return;
   const {data,error}=await s.rpc('get_teacher_assignment_items',{p_task_id:taskId});
   if(error){setNotice(error.message);return;}
   setReviewTask(taskId);
   setReviewItems((data||[]) as Record<string,unknown>[]);
   setShowAnswers(false);
 }

 async function saveQuestion(item:Record<string,unknown>){
   const s=getSupabase(); if(!s)return;
   const {error}=await s.rpc('update_school_assignment_item',{
     p_item_id:String(item.id),
     p_question_text:String(item.question_text||''),
     p_options:item.options||[],
     p_correct_answer:String(item.correct_answer||''),
     p_explanation:String(item.explanation||''),
     p_marks:Number(item.marks||1)
   });
   setNotice(error?error.message:'Question corrected. Existing submitted scores have been recalculated automatically.');
   if(!error)await review(reviewTask);
 }

 async function create(){
   const s=getSupabase();
   if(!s||!classId||!subjectId||!teacherId||!sourceId){
     setNotice('Select the class, subject, teacher and Phenom LMS assessment.');
     return;
   }
   const {data,error}=await s.rpc('create_school_assignment_from_lms_quiz',{
     p_school_id:schoolId,
     p_class_id:classId,
     p_subject_id:subjectId,
     p_teacher_id:teacherId,
     p_quiz_id:sourceId,
     p_title:title||String(sources.find(x=>String(x.id)===sourceId)?.topic||'Phenom LMS Assessment'),
     p_instructions:instructions,
     p_due_at:null,
     p_question_count:count,
     p_randomise:true,
     p_all_students:target!=='selected',
     p_include_students:selected,
     p_exclude_students:target==='all_except'?excluded:[]
   });
   if(error){setNotice(error.message);return;}
   setNotice('Assignment created and assigned. Students receive automatic marking on submission, with result notifications to the teacher and linked parents.');
   setTitle('');setInstructions('');setSourceId('');setSelected([]);setExcluded([]);
   await load();
 }

 return (
   <Panel title="Assignments / Phenom LMS Assessments">
     <p className="mt-2 text-sm text-muted">
       Teachers select a Phenom LMS assessment by subject and topic, choose the number of questions, assign it to all students, selected students, or all except selected students, and the system marks submissions automatically.
     </p>

     {editable ? (
       <div className="mt-4 rounded-2xl border border-line bg-paper p-4">
         <div className="grid gap-2 md:grid-cols-4">
           <select value={teacherId} onChange={e=>setTeacherId(e.target.value)} className="rounded-xl border border-line p-3">
             <option value="">Teacher</option>
             {teachers.map(x=><option key={String(x.id)} value={String(x.id)}>{String(x.full_name||x.id)}</option>)}
           </select>
           <select value={classId} onChange={e=>setClassId(e.target.value)} className="rounded-xl border border-line p-3">
             <option value="">Class</option>
             {classes.map(x=><option key={String(x.id)} value={String(x.id)}>{String(x.name)}</option>)}
           </select>
           <select value={subjectId} onChange={e=>setSubjectId(e.target.value)} className="rounded-xl border border-line p-3">
             <option value="">Subject</option>
             {subjects.map(x=><option key={String(x.id)} value={String(x.id)}>{String(x.name)}</option>)}
           </select>
           <input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic (optional)" className="rounded-xl border border-line p-3"/>
         </div>

         <div className="mt-2 grid gap-2 md:grid-cols-3">
           <select value={sourceId} onChange={e=>setSourceId(e.target.value)} className="rounded-xl border border-line p-3">
             <option value="">Choose Phenom LMS assessment</option>
             {sources.map(x=><option key={String(x.id)} value={String(x.id)}>{String(x.subject)} — {String(x.topic)} ({String(x.question_count)} questions)</option>)}
           </select>
           <input type="number" min={1} value={count} onChange={e=>setCount(Number(e.target.value)||1)} placeholder="Number of questions" className="rounded-xl border border-line p-3"/>
           <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Assignment title" className="rounded-xl border border-line p-3"/>
         </div>

         <textarea value={instructions} onChange={e=>setInstructions(e.target.value)} placeholder="Instructions" className="mt-2 min-h-20 w-full rounded-xl border border-line p-3"/>

         <div className="mt-3 flex flex-wrap gap-2">
           <Button variant={target==='all'?'primary':'outline'} onClick={()=>setTarget('all')}>All students</Button>
           <Button variant={target==='selected'?'primary':'outline'} onClick={()=>setTarget('selected')}>Selected students</Button>
           <Button variant={target==='all_except'?'primary':'outline'} onClick={()=>setTarget('all_except')}>All except selected</Button>
         </div>

         {(target==='selected'||target==='all_except') ? (
           <div className="mt-3 grid gap-2 sm:grid-cols-2">
             {students.map(x=>(
               <label key={String(x.id)} className="flex items-center gap-2 rounded-xl border border-line bg-white p-3">
                 <input
                   type="checkbox"
                   checked={(target==='selected'?selected:excluded).includes(String(x.id))}
                   onChange={e=>{
                     const id=String(x.id);
                     if(target==='selected')setSelected(v=>e.target.checked?[...v,id]:v.filter(x=>x!==id));
                     else setExcluded(v=>e.target.checked?[...v,id]:v.filter(x=>x!==id));
                   }}
                 />
                 <span>{String(x.full_name||x.id)}</span>
               </label>
             ))}
           </div>
         ) : null}

         <Button className="mt-3" onClick={()=>void create()}>
           <Send className="mr-2 size-4"/>Assign automatically
         </Button>
         {notice ? <p className="mt-3 rounded-xl bg-white p-3 text-sm">{notice}</p> : null}
       </div>
     ) : null}

     <div className="mt-5 space-y-2">
       {assignments.map(x=>(
         <div key={String(x.id)} className="rounded-xl border border-line bg-white p-4">
           <div className="flex items-center justify-between gap-3">
             <div>
               <strong>{String(x.title)}</strong>
               <p className="text-xs text-muted">{String(x.topic||'')} · {String(x.status||'')}</p>
             </div>
             {editable ? (
               <Button size="sm" variant="outline" onClick={()=>void review(String(x.id))}>Review questions</Button>
             ) : (
               <Button size="sm" onClick={()=>void startTask(String(x.id))}>Start assessment</Button>
             )}
           </div>
         </div>
       ))}
     </div>

     {!editable && activeTask ? (
       <div className="mt-5 rounded-2xl border border-line bg-white p-5">
         <h3 className="font-semibold">Assessment</h3>
         {studentItems.map((item,ix)=>(
           <div key={String(item.id)} className="mt-4 rounded-xl border border-line p-4">
             <p className="font-medium">{ix+1}. {String(item.question_text||'')}</p>
             {Array.isArray(item.options) ? (
               <div className="mt-3 space-y-2">
                 {(item.options as unknown[]).map((opt:any)=>(
                   <label key={String(opt?.value??opt)} className="flex items-center gap-2 rounded-lg bg-paper p-2">
                     <input
                       type="radio"
                       name={String(item.id)}
                       checked={answers[String(item.id)]===String(opt?.value??opt)}
                       onChange={()=>setAnswers(v=>({...v,[String(item.id)]:String(opt?.value??opt)}))}
                     />
                     <span>{String(opt?.label??opt)}</span>
                   </label>
                 ))}
               </div>
             ) : (
               <input
                 value={answers[String(item.id)]||''}
                 onChange={e=>setAnswers(v=>({...v,[String(item.id)]:e.target.value}))}
                 className="mt-3 w-full rounded-xl border border-line p-3"
                 placeholder="Your answer"
               />
             )}
           </div>
         ))}
         <Button className="mt-4" onClick={()=>void submitTask()}>Submit and see result</Button>
         {studentResult ? (
           <div className="mt-4 rounded-xl bg-green/10 p-4">
             <p className="text-sm text-muted">Automatic result</p>
             <p className="text-3xl font-bold">{String(studentResult.score??0)}%</p>
             <p className="mt-1 text-sm">The result has also been sent to the teacher and linked parent accounts.</p>
           </div>
         ) : null}
       </div>
     ) : null}

     {reviewTask ? (
       <div className="mt-5 rounded-2xl border border-purple/20 bg-purple/5 p-4">
         <div className="flex items-center justify-between">
           <h3 className="font-semibold">Question review</h3>
           <Button variant="outline" size="sm" onClick={()=>setShowAnswers(v=>!v)}>
             {showAnswers?'Hide answer key':'Show answer key'}
           </Button>
         </div>
         {reviewItems.map((item,ix)=>(
           <div key={String(item.id)} className="mt-3 rounded-xl bg-white p-4">
             <p className="text-xs text-muted">Question {ix+1}</p>
             <textarea
               value={String(item.question_text||'')}
               onChange={e=>setReviewItems(v=>v.map(x=>x.id===item.id?{...x,question_text:e.target.value}:x))}
               className="mt-2 min-h-20 w-full rounded-xl border border-line p-3"
             />
             {showAnswers ? (
               <input
                 value={String(item.correct_answer||'')}
                 onChange={e=>setReviewItems(v=>v.map(x=>x.id===item.id?{...x,correct_answer:e.target.value}:x))}
                 className="mt-2 w-full rounded-xl border border-line p-3"
                 placeholder="Correct answer"
               />
             ) : null}
             <Button className="mt-2" size="sm" onClick={()=>void saveQuestion(item)}>Save correction</Button>
           </div>
         ))}
       </div>
     ) : null}
   </Panel>
);
}
function CBT({schoolId,editable}:{schoolId:string;editable:boolean}){
 const [exams,setExams]=useState<Row[]>([]); const [selectedExam,setSelectedExam]=useState<Row|null>(null); const [questions,setQuestions]=useState<Row[]>([]);
 const [title,setTitle]=useState(''); const [subject,setSubject]=useState(''); const [topic,setTopic]=useState(''); const [classId,setClassId]=useState(''); const [teacherId,setTeacherId]=useState('');
 const [count,setCount]=useState(10); const [duration,setDuration]=useState(''); const [instructions,setInstructions]=useState(''); const [notice,setNotice]=useState(''); const [saving,setSaving]=useState(false);
 const [questionText,setQuestionText]=useState(''); const [questionType,setQuestionType]=useState<'mcq'|'short'>('mcq'); const [options,setOptions]=useState(['','','','']); const [correctAnswer,setCorrectAnswer]=useState(''); const [marks,setMarks]=useState('1');
 const [media,setMedia]=useState<Row[]>([]); const [library,setLibrary]=useState<CurriculumLibraryItem[]>([]); const [libraryQuery,setLibraryQuery]=useState(''); const [assignStudents,setAssignStudents]=useState('');
 async function loadExams(){const s=getSupabase();if(!s)return;const {data,error}=await s.from('school_cbt_exams').select('*').eq('school_id',schoolId).order('created_at',{ascending:false});if(error){setNotice(error.message);return;}setExams((data||[]) as Row[]);}
 async function loadQuestions(examId:string){const s=getSupabase();if(!s)return;const {data,error}=await s.from('school_cbt_exam_questions').select('*').eq('exam_id',examId).order('position');if(error){setNotice(error.message);return;}setQuestions((data||[]) as Row[]);}
 useEffect(()=>{void loadExams()},[schoolId]); useEffect(()=>{if(selectedExam)void loadQuestions(String(selectedExam.id))},[selectedExam?.id]);
 async function createExam(){const s=getSupabase();if(!s||!title.trim()||!subject.trim()||!classId.trim())return;setSaving(true);const uid=(await s.auth.getUser()).data.user?.id;const owner=teacherId.trim()||uid;if(!owner){setNotice('Please sign in before creating a CBT.');setSaving(false);return;}const {data,error}=await s.from('school_cbt_exams').insert({school_id:schoolId,title:title.trim(),subject:subject.trim(),topic:topic.trim()||null,class_id:classId.trim(),teacher_id:owner,created_by:owner,question_count:Number(count)||10,duration_minutes:Number(duration)||null,instructions:instructions.trim()||null,status:'draft'}).select('*').single();setSaving(false);if(error){setNotice(error.message);return;}setTitle('');setTopic('');setDuration('');setInstructions('');await loadExams();setSelectedExam(data as Row);setNotice('CBT created. You can now type the questions directly.');}
 function resetQuestion(){setQuestionText('');setQuestionType('mcq');setOptions(['','','','']);setCorrectAnswer('');setMarks('1');setMedia([]);}
 async function saveQuestion(){const s=getSupabase();if(!s||!selectedExam||!questionText.trim())return;setSaving(true);const nextPosition=questions.length?Math.max(...questions.map(q=>Number(q.position)||0))+1:1;const optionRows=questionType==='mcq'?options.map((label,i)=>({label:label.trim(),value:label.trim(),position:i+1})).filter(x=>x.label):[];const {data,error}=await s.from('school_cbt_exam_questions').insert({exam_id:String(selectedExam.id),position:nextPosition,question_text:questionText.trim(),options:optionRows.length?optionRows:null,correct_answer:correctAnswer.trim()||null,marks:Number(marks)||1,media:media.map(m=>({kind:m.media_type,path:m.storage_path}))}).select('*').single();setSaving(false);if(error){setNotice(error.message);return;}setQuestions(v=>[...v,data as Row]);await s.from('school_cbt_exams').update({question_count:questions.length+1}).eq('id',String(selectedExam.id));setSelectedExam(v=>v?({...v,question_count:questions.length+1}):v);resetQuestion();setNotice('Question saved to this school CBT. It remains part of the school CBT record.');}
 async function linkQuestionMedia(item:CurriculumLibraryItem){const s=getSupabase();if(!s||!selectedExam)return;if(!item.assetId||!item.storagePath){setNotice('Only existing stored Phenom Library media can be attached to a CBT.');return;}const uid=(await s.auth.getUser()).data.user?.id;if(!uid)return;const mediaType=item.itemType==='video'?'video':item.itemType==='audio'?'audio':'image';const {data,error}=await s.from('school_cbt_exam_media').insert({school_id:schoolId,exam_id:String(selectedExam.id),uploaded_by:uid,storage_bucket:item.storageBucket||'','storage_path':item.storagePath,media_type:mediaType,mime_type:item.mimeType||null,file_size:item.fileSize||null,library_item_id:item.id}).select('*').single();if(error){setNotice(error.message);return;}setMedia(v=>[...v,data as Row]);setNotice('Existing Phenom Library media linked to this CBT. No duplicate upload was created.');}
 async function loadLibrary(){try{setLibrary(await listCurriculumLibrary({query:libraryQuery.trim()||undefined,limit:60}));}catch(e){setNotice(e instanceof Error?e.message:'Could not load Phenom Library resources.');}}
 async function attachLibraryResource(item:CurriculumLibraryItem){const s=getSupabase();if(!s||!selectedExam)return;const qid=questions[questions.length-1]?.id;if(!qid){setNotice('Create at least one question first, then link a Library resource.');return;}const {error}=await s.from('school_cbt_question_resources').insert({school_id:schoolId,exam_id:String(selectedExam.id),question_id:String(qid),library_item_id:item.id});setNotice(error?'Could not link resource: '+error.message:'The canonical Library resource was linked without copying it into the school database.');}
 async function assign(){const s=getSupabase();if(!s||!selectedExam)return;const uid=(await s.auth.getUser()).data.user?.id;if(!uid)return;const ids=assignStudents.split(/[,\n]/).map(x=>x.trim()).filter(Boolean);if(!ids.length)return;const rows=ids.map(student_id=>({exam_id:String(selectedExam.id),school_id:schoolId,student_id,assigned_by:uid}));const {error}=await s.from('school_cbt_exam_assignments').upsert(rows,{onConflict:'exam_id,student_id'});setNotice(error?error.message:'CBT assigned to '+ids.length+' student(s). The assignment records are restricted to this school.');if(!error)setAssignStudents('');}
 return <Panel title="CBT — direct teacher question setting"><p className="mt-2 text-sm text-muted">Teachers can open a CBT and type questions directly. No PDF is created. The typed questions, answer keys, marks, assignments and attempts remain as structured school data. Phenom Library resources can be used as supporting material without being copied.</p>
 {notice&&<p className="mt-3 rounded-xl bg-paper p-3 text-sm">{notice}</p>}
 {editable&&<div className="mt-4 rounded-2xl border border-line bg-white p-4"><h3 className="font-semibold">Create CBT</h3><div className="mt-3 grid gap-2 md:grid-cols-3"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="CBT title" className="rounded-xl border border-line p-3"/><input value={subject} onChange={e=>setSubject(e.target.value)} placeholder="Subject" className="rounded-xl border border-line p-3"/><input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Topic (optional)" className="rounded-xl border border-line p-3"/><input value={classId} onChange={e=>setClassId(e.target.value)} placeholder="Class ID" className="rounded-xl border border-line p-3"/><input value={teacherId} onChange={e=>setTeacherId(e.target.value)} placeholder="Teacher ID (blank = my account)" className="rounded-xl border border-line p-3"/><input value={count} onChange={e=>setCount(Number(e.target.value)||1)} type="number" min={1} placeholder="Question count" className="rounded-xl border border-line p-3"/><input value={duration} onChange={e=>setDuration(e.target.value)} type="number" min={1} placeholder="Duration (minutes)" className="rounded-xl border border-line p-3"/><textarea value={instructions} onChange={e=>setInstructions(e.target.value)} placeholder="Instructions for pupils" className="rounded-xl border border-line p-3 md:col-span-2"/></div><Button className="mt-3" disabled={saving} onClick={()=>void createExam()}><Plus className="mr-2 size-4"/>Open CBT workspace</Button></div>}
 <div className="mt-5 grid gap-4 lg:grid-cols-[280px_1fr]"><div className="rounded-2xl border border-line bg-white p-4"><h3 className="font-semibold">School CBTs</h3><div className="mt-3 space-y-2">{exams.length===0?<p className="text-sm text-muted">No CBTs yet.</p>:exams.map(ex=><button key={String(ex.id)} onClick={()=>setSelectedExam(ex)} className={'w-full rounded-xl border p-3 text-left '+(selectedExam?.id===ex.id?'border-purple bg-purple/5':'border-line')}><p className="font-semibold">{String(ex.title)}</p><p className="text-xs text-muted">{String(ex.subject)} · {String(ex.status)}</p><p className="text-xs text-muted">{String(ex.question_count||0)} questions</p></button>)}</div></div>
 <div className="space-y-4">{selectedExam?<><div className="rounded-2xl border border-line bg-white p-4"><h3 className="font-display text-2xl font-semibold">{String(selectedExam.title)}</h3><p className="text-sm text-muted">{String(selectedExam.subject)}{selectedExam.topic?' · '+String(selectedExam.topic):''} · School-only CBT</p><p className="mt-2 text-sm text-muted">{String(selectedExam.instructions||'Teacher-created computer-based test.')} Duration: {selectedExam.duration_minutes?String(selectedExam.duration_minutes)+' minutes':'not set'}.</p></div>
 <div className="rounded-2xl border border-line bg-white p-4"><h3 className="font-semibold">Type a question</h3><textarea value={questionText} onChange={e=>setQuestionText(e.target.value)} placeholder="Type the question directly here…" className="mt-3 min-h-28 w-full rounded-xl border border-line p-3"/><div className="mt-3 grid gap-2 md:grid-cols-3"><select value={questionType} onChange={e=>setQuestionType(e.target.value as 'mcq'|'short')} className="rounded-xl border border-line p-3"><option value="mcq">Multiple choice</option><option value="short">Short answer</option></select><input value={correctAnswer} onChange={e=>setCorrectAnswer(e.target.value)} placeholder="Correct answer" className="rounded-xl border border-line p-3"/><input value={marks} onChange={e=>setMarks(e.target.value)} type="number" min={0.5} step={0.5} placeholder="Marks" className="rounded-xl border border-line p-3"/></div>{questionType==='mcq'&&<div className="mt-3 grid gap-2 md:grid-cols-2">{options.map((v,i)=><input key={i} value={v} onChange={e=>setOptions(prev=>prev.map((x,j)=>j===i?e.target.value:x))} placeholder={'Option '+String.fromCharCode(65+i)} className="rounded-xl border border-line p-3"/>)}</div>}<div className="mt-3 flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={()=>void loadLibrary()}>Choose Library media</Button>{media.map(m=><span key={String(m.id)} className="rounded-full bg-green/10 px-3 py-1 text-xs">{String(m.media_type)}</span>)}<Button disabled={saving||!questionText.trim()} onClick={()=>void saveQuestion()}><Save className="mr-2 size-4"/>Save question</Button></div></div>
 <div className="rounded-2xl border border-line bg-white p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="font-semibold">Phenom Library support</h3><p className="text-xs text-muted">Use existing canonical resources; they are linked, not copied.</p></div><Button variant="outline" size="sm" onClick={()=>void loadLibrary()}>Load resources</Button></div><div className="mt-3 flex gap-2"><input value={libraryQuery} onChange={e=>setLibraryQuery(e.target.value)} placeholder="Search Library resources" className="min-w-0 flex-1 rounded-xl border border-line p-3"/><Button variant="outline" onClick={()=>void loadLibrary()}>Search</Button></div>{library.length>0&&<div className="mt-3 max-h-52 space-y-2 overflow-auto">{library.map(item=><div key={item.id} className="flex items-center justify-between gap-3 rounded-xl border border-line p-3"><div><p className="text-sm font-semibold">{item.title}</p><p className="text-xs text-muted">{item.topicTitle||'Library resource'}</p></div><Button size="sm" variant="outline" onClick={()=>void attachLibraryResource(item)}>Link to latest question</Button></div>)}</div>}</div>
 <div className="rounded-2xl border border-line bg-white p-4"><h3 className="font-semibold">Assign to pupils</h3><p className="mt-1 text-xs text-muted">Enter student account IDs separated by commas or new lines. Assignment access is restricted to this school.</p><textarea value={assignStudents} onChange={e=>setAssignStudents(e.target.value)} placeholder="Student IDs" className="mt-3 min-h-20 w-full rounded-xl border border-line p-3"/><Button className="mt-2" onClick={()=>void assign()}>Assign CBT</Button></div>
 <div className="rounded-2xl border border-line bg-white p-4"><h3 className="font-semibold">Questions in this CBT</h3><div className="mt-3 space-y-2">{questions.length===0?<p className="text-sm text-muted">No questions yet.</p>:questions.map((q,ix)=><div key={String(q.id)} className="rounded-xl border border-line p-3"><p className="text-xs text-muted">Question {ix+1} · {String(q.marks||1)} mark(s)</p><p className="mt-1 font-medium">{String(q.question_text)}</p>{Array.isArray(q.options)&&q.options.length>0&&<p className="mt-1 text-xs text-muted">{q.options.map((o:any)=>String(o.label||o.value)).join(' · ')}</p>}</div>)}</div></div>
 </>:<div className="rounded-2xl border border-dashed border-line bg-paper p-6 text-sm text-muted">Select a CBT or create one above. The teacher works directly in this typed CBT environment; no exam PDF is created.</div>}</div></div></Panel>
}
function Results({schoolId,editable,canEnterScores,superAdmin}:{schoolId:string;editable:boolean;canEnterScores:boolean;superAdmin:boolean}){const t=useTable('student_result_entries',schoolId);const [student,setStudent]=useState('');const [classId,setClassId]=useState('');const [subjectId,setSubjectId]=useState('');const [sessionId,setSessionId]=useState('');const [componentId,setComponentId]=useState('');const [score,setScore]=useState('');const [publicationId,setPublicationId]=useState('');const [publicationState,setPublicationState]=useState(false);const [termNo,setTermNo]=useState(1);const [importNotice,setImportNotice]=useState('');async function save(){const s=getSupabase();if(!s||!student||!classId||!subjectId||!sessionId||!componentId)return;const {error}=await s.from('student_result_entries').insert({school_id:schoolId,student_id:student,class_id:classId,subject_id:subjectId,session_id:sessionId,component_id:componentId,term_no:termNo,score:Number(score||0),entered_by:(await s.auth.getUser()).data.user?.id});if(error)throw error;await t.refresh();}async function deleteResult(id:string){const s=getSupabase();if(!s||!superAdmin)return;const reason=window.prompt('Reason for permanently deleting this result (required):')?.trim();if(!reason||reason.length<10){setImportNotice('Deletion requires a documented reason of at least 10 characters.');return;}const {error}=await s.rpc('super_admin_delete_result_entry',{p_result_entry_id:id,p_reason:reason});setImportNotice(error?error.message:'Result permanently deleted and deletion audit recorded.');if(!error)await t.refresh();}async function publish(){const s=getSupabase();if(!s||!publicationId)return;const {error}=await s.from('school_result_publications').update({published:publicationState,published_by:(await s.auth.getUser()).data.user?.id}).eq('id',publicationId);if(error){setImportNotice(error.message);return;}setImportNotice(publicationState?'Result released. Email notifications were queued.':'Result hidden from students and parents.');if(publicationState)await s.functions.invoke('send-result-release',{body:{publicationId}});}
function exportResults(){const blob=new Blob([JSON.stringify(t.rows,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`phenom-result-${schoolId}.json`;a.click();URL.revokeObjectURL(a.href);}function printResults(){window.print();}
async function importCsv(file:File){const text=await file.text();const lines=text.split(/\r?\n/).filter(Boolean);if(lines.length<2){setImportNotice('CSV needs a header row and at least one result row.');return;}const headers=lines[0].split(',').map(x=>x.trim());const required=['student_id','class_id','subject_id','session_id','component_id','term_no','score'];if(!required.every(x=>headers.includes(x))){setImportNotice(`CSV must include: ${required.join(', ')}`);return;}const s=getSupabase();if(!s){setImportNotice('Connect Supabase first.');return;}const rows=lines.slice(1).map(line=>{const vals=line.split(',');return Object.fromEntries(headers.map((h,i)=>[h,vals[i]?.trim()||'']))}).map(r=>({...r,school_id:schoolId,term_no:Number(r.term_no||1),score:Number(r.score||0),entered_by:undefined}));const {error}=await s.from('student_result_entries').insert(rows);setImportNotice(error?error.message:`Imported ${rows.length} result row(s). Existing rows remain protected from editing.`);if(!error)await t.refresh();}
return <Panel title="Results & report cards"><p className="mt-2 text-sm text-muted">Subject teachers enter their own subject scores. Scores are automatically totalled and percentage-calculated, then locked. Class teachers see final assessment performance for their class; school administrators oversee the school. Students/parents see results only after publication.</p>{canEnterScores&&<div className="mt-4 grid gap-2 md:grid-cols-7"><input value={student} onChange={e=>setStudent(e.target.value)} placeholder="Student ID" className="rounded-xl border border-line p-3"/><input value={classId} onChange={e=>setClassId(e.target.value)} placeholder="Class ID" className="rounded-xl border border-line p-3"/><input value={subjectId} onChange={e=>setSubjectId(e.target.value)} placeholder="Subject ID" className="rounded-xl border border-line p-3"/><input value={sessionId} onChange={e=>setSessionId(e.target.value)} placeholder="Session ID" className="rounded-xl border border-line p-3"/><input value={componentId} onChange={e=>setComponentId(e.target.value)} placeholder="Component ID" className="rounded-xl border border-line p-3"/><select value={termNo} onChange={e=>setTermNo(Number(e.target.value))} className="rounded-xl border border-line p-3"><option value={1}>Term 1</option><option value={2}>Term 2</option><option value={3}>Term 3</option></select><input value={score} onChange={e=>setScore(e.target.value)} placeholder="Score" type="number" className="rounded-xl border border-line p-3"/><Button onClick={()=>void save()}><Save className="mr-2 size-4"/>Enter score</Button></div>}<div className="mt-5 rounded-xl border border-line bg-white p-4"><h3 className="font-semibold">Release / visibility switch</h3><p className="mt-1 text-xs text-muted">Keep this off while teachers are entering results. Turn it on only when the school is ready to release the result to students and active parents.</p><div className="mt-3 flex flex-wrap gap-2"><input value={publicationId} onChange={e=>setPublicationId(e.target.value)} placeholder="Result publication ID" className="min-w-[18rem] rounded-xl border border-line p-3"/><label className="flex items-center gap-2 rounded-xl border border-line px-3"><input type="checkbox" checked={publicationState} onChange={e=>setPublicationState(e.target.checked)}/> Release result</label><Button onClick={()=>void publish()}>Apply visibility</Button></div></div><div className="mt-5 flex flex-wrap gap-2"><label className="inline-flex cursor-pointer items-center rounded-xl border border-line bg-white px-4 py-2 text-sm font-semibold">Upload result CSV<input className="sr-only" type="file" accept=".csv,text/csv" onChange={e=>{const f=e.target.files?.[0];if(f)void importCsv(f)}}/></label><Button variant="outline" onClick={exportResults}>Download result data</Button><Button variant="outline" onClick={printResults}>Print results</Button></div>{importNotice&&<p className="mt-3 rounded-xl bg-paper p-3 text-sm">{importNotice}</p>}<List rows={t.rows} fields={['student_id','term_no','score','teacher_comment','locked']} onDelete={superAdmin?deleteResult:undefined}/></Panel>}
function Fees({schoolId,editable}:{schoolId:string;editable:boolean}){const t=useTable('school_fee_payments',schoolId);const [studentId,setStudentId]=useState('');const [amount,setAmount]=useState('');const [provider,setProvider]=useState('manual');const [reference,setReference]=useState('');async function save(){const s=getSupabase();if(!s||!studentId||!amount)return;const {error}=await s.from('school_fee_payments').insert({school_id:schoolId,student_id:studentId,amount:Number(amount),currency:'NGN',provider,status:'confirmed',reference:reference||null,paid_at:new Date().toISOString()});if(error)throw error;setStudentId('');setAmount('');setReference('');await t.refresh();}return <Panel title="Fees, payments & receipts"><p className="mt-2 text-sm text-muted">Fee schedules, adjustments, payments, allocations and receipts are supported. Merchant/platform payments remain separate from school ledger records.</p>{editable&&<div className="mt-4 grid gap-2 md:grid-cols-5"><input value={studentId} onChange={e=>setStudentId(e.target.value)} placeholder="Student user ID" className="rounded-xl border border-line p-3"/><input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Amount" type="number" className="rounded-xl border border-line p-3"/><input value={provider} onChange={e=>setProvider(e.target.value)} placeholder="Provider" className="rounded-xl border border-line p-3"/><input value={reference} onChange={e=>setReference(e.target.value)} placeholder="Payment reference" className="rounded-xl border border-line p-3"/><Button onClick={()=>void save()}>Record payment</Button></div>}<List rows={t.rows} fields={['student_id','amount','currency','provider','status','reference']} onDelete={editable?async id=>{await getSupabase()?.from('school_fee_payments').delete().eq('id',id);await t.refresh()}:undefined}/></Panel>}
function HR({schoolId,editable}:{schoolId:string;editable:boolean}){const staff=useTable('staff_records',schoolId);const payroll=useTable('payroll_runs',schoolId);const [staffUser,setStaffUser]=useState('');const [position,setPosition]=useState('');const [department,setDepartment]=useState('teaching');async function saveStaff(){const s=getSupabase();if(!s||!staffUser)return;const {error}=await s.from('staff_records').insert({school_id:schoolId,staff_user_id:staffUser,job_title:position||null,department:department||null});if(error)throw error;setStaffUser('');setPosition('');await staff.refresh();}return <div className="grid gap-6 lg:grid-cols-2"><Panel title="HR & Staff"><p className="mt-2 text-sm text-muted">Staff records, employment status, departments, emergency records and pay structures.</p>{editable&&<div className="mt-4 grid gap-2"><input value={staffUser} onChange={e=>setStaffUser(e.target.value)} placeholder="Staff user ID" className="rounded-xl border border-line p-3"/><input value={position} onChange={e=>setPosition(e.target.value)} placeholder="Job title" className="rounded-xl border border-line p-3"/><input value={department} onChange={e=>setDepartment(e.target.value)} placeholder="Department" className="rounded-xl border border-line p-3"/><Button onClick={()=>void saveStaff()}>Add staff</Button></div>}<List rows={staff.rows} fields={['staff_user_id','job_title','department','employment_status']} onDelete={editable?async id=>{await getSupabase()?.from('staff_records').delete().eq('id',id);await staff.refresh()}:undefined}/></Panel><Panel title="Payroll"><p className="mt-2 text-sm text-muted">Payroll runs support draft → review → approved → processed → closed workflow with payroll items, allowances, deductions and net pay.</p><List rows={payroll.rows} fields={['period_start','period_end','status','payment_method']} onDelete={editable?async id=>{await getSupabase()?.from('payroll_runs').delete().eq('id',id);await payroll.refresh()}:undefined}/></Panel></div>}
function Elections({schoolId,editable}:{schoolId:string;editable:boolean}){const t=useTable('school_elections',schoolId);const [title,setTitle]=useState('');async function save(){const s=getSupabase();if(!s||!title)return;const {error}=await s.from('school_elections').insert({school_id:schoolId,title,results_visible:false});if(error)throw error;setTitle('');await t.refresh();}return <Panel title="School Elections"><p className="mt-2 text-sm text-muted">Create elections, positions, candidates, voter scopes and one-vote-per-position voting with controlled result publication.</p>{editable&&<div className="mt-4 grid gap-2 md:grid-cols-2"><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Election title" className="rounded-xl border border-line p-3"/><Button onClick={()=>void save()}>Create election</Button></div>}<List rows={t.rows} fields={['title','starts_at','ends_at','results_visible']} onDelete={editable?async id=>{await getSupabase()?.from('school_elections').delete().eq('id',id);await t.refresh()}:undefined}/></Panel>}
function List({rows,fields,onDelete}:{rows:Row[];fields:string[];onDelete?:((id:string)=>Promise<void>)|undefined}){return <div className="mt-6 space-y-2">{rows.length===0?<p className="rounded-xl bg-paper p-4 text-sm text-muted">No records yet.</p>:rows.map(r=><div key={String(r.id)} className="rounded-xl border border-line bg-white p-4"><div className="grid gap-2 md:grid-cols-[1fr_auto]"><div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-4">{fields.map(f=><div key={f}><span className="text-[11px] uppercase tracking-wide text-muted">{f.replaceAll('_',' ')}</span><p className="break-words text-sm font-medium">{r[f]===null||r[f]===undefined?'—':String(r[f])}</p></div>)}</div>{onDelete&&<Button variant="outline" size="sm" onClick={()=>void onDelete(String(r.id))}><Trash2 className="size-4"/></Button>}</div></div>)}</div>}
