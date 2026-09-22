import { useEffect, useMemo, useState } from 'react';
import { CURRICULA, type CurriculumId } from '@/data/curricula';
import { getSupabase } from '@/lib/cms';

type Level = { id:string; stage:string; display_name:string };
type Subject = { id:string; name:string };
type Topic = { id:string; topic_title:string; parent_topic_id:string|null };

type Props = {
  onTopicSelected?: (subject:string, topic:string, level:string, curriculumId:string) => void;
};

export function CurriculumBrowser({ onTopicSelected }: Props) {
  const [curriculumId,setCurriculumId]=useState<CurriculumId>('nigeria-nerdc');
  const [levels,setLevels]=useState<Level[]>([]);
  const [levelId,setLevelId]=useState('');
  const [subjects,setSubjects]=useState<Subject[]>([]);
  const [subjectId,setSubjectId]=useState('');
  const [topics,setTopics]=useState<Topic[]>([]);
  const [topicId,setTopicId]=useState('');
  const [loading,setLoading]=useState(false);
  const curriculum=useMemo(()=>CURRICULA.find(x=>x.id===curriculumId)!,[curriculumId]);

  useEffect(()=>{
    const supabase=getSupabase(); if(!supabase) return;
    setLoading(true);
    supabase.from('lms_curriculum_levels').select('id,stage,display_name').eq('curriculum_id',curriculumId).eq('active',true).order('sequence_no')
      .then(({data})=>{const rows=(data||[]) as Level[];setLevels(rows);setLevelId(rows[0]?.id||'');})
      .finally(()=>setLoading(false));
  },[curriculumId]);

  useEffect(()=>{
    const supabase=getSupabase(); if(!supabase||!levelId) { setSubjects([]); return; }
    supabase.from('curriculum_subject_catalogue').select('subject_id,global_subject_catalogue(id,name)').eq('curriculum_id',curriculumId).eq('stage',levels.find(x=>x.id===levelId)?.stage||'').eq('active',true)
      .then(({data})=>{
        const rows=(data||[]).map((x:any)=>x.global_subject_catalogue).filter(Boolean) as Subject[];
        const unique=[...new Map(rows.map(x=>[x.id,x])).values()].sort((a,b)=>a.name.localeCompare(b.name));
        setSubjects(unique);setSubjectId(unique[0]?.id||'');
      });
  },[curriculumId,levelId,levels]);

  useEffect(()=>{
    const supabase=getSupabase(); if(!supabase||!levelId||!subjectId) { setTopics([]); return; }
    supabase.from('lms_curriculum_topics').select('id,topic_title,parent_topic_id').eq('curriculum_id',curriculumId).eq('level_id',levelId).eq('subject_id',subjectId).eq('active',true).is('parent_topic_id',null).order('topic_title')
      .then(({data})=>{const rows=(data||[]) as Topic[];setTopics(rows);setTopicId(rows[0]?.id||'');});
  },[curriculumId,levelId,subjectId]);

  const selectedSubject=subjects.find(x=>x.id===subjectId)?.name||'';
  const selectedLevel=levels.find(x=>x.id===levelId)?.display_name||'';
  const selectedTopic=topics.find(x=>x.id===topicId)?.topic_title||'';

  useEffect(()=>{
    if(selectedSubject&&selectedTopic) onTopicSelected?.(selectedSubject,selectedTopic,selectedLevel,curriculumId);
  },[selectedSubject,selectedTopic,selectedLevel,curriculumId,onTopicSelected]);

  return <div className="rounded-2xl border border-line bg-cream p-5">
    <div className="mb-4">
      <h3 className="font-display text-xl font-semibold">Curriculum pathway</h3>
      <p className="mt-1 text-sm text-muted">Choose the curriculum, level/stage, subject and official curriculum topic. Location does not restrict the curriculum you may study.</p>
    </div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <label className="text-sm font-semibold">Curriculum
        <select value={curriculumId} onChange={e=>setCurriculumId(e.target.value as CurriculumId)} className="mt-1 w-full rounded-xl border border-line bg-white p-3">
          {[...CURRICULA].sort((a,b)=>a.name.localeCompare(b.name)).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </label>
      <label className="text-sm font-semibold">Level / stage
        <select value={levelId} onChange={e=>setLevelId(e.target.value)} disabled={loading||!levels.length} className="mt-1 w-full rounded-xl border border-line bg-white p-3">
          {levels.map(x=><option key={x.id} value={x.id}>{x.display_name}</option>)}
        </select>
      </label>
      <label className="text-sm font-semibold">Subject
        <select value={subjectId} onChange={e=>setSubjectId(e.target.value)} disabled={!subjects.length} className="mt-1 w-full rounded-xl border border-line bg-white p-3">
          {subjects.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}
        </select>
      </label>
      <label className="text-sm font-semibold">Curriculum topic
        <select value={topicId} onChange={e=>setTopicId(e.target.value)} disabled={!topics.length} className="mt-1 w-full rounded-xl border border-line bg-white p-3">
          {topics.length ? topics.map(x=><option key={x.id} value={x.id}>{x.topic_title}</option>) : <option>No verified topics imported yet</option>}
        </select>
      </label>
    </div>
    {!topics.length && <p className="mt-3 text-xs text-muted">This pathway is connected to the official curriculum catalogue. Topic content is only published after its authoritative curriculum source has been imported and verified; Phenom does not invent curriculum topics.</p>}
    <p className="mt-3 text-xs text-muted">Pathway: {curriculum.name} → {selectedLevel || 'level'} → {selectedSubject || 'subject'} → {selectedTopic || 'topic'}</p>
  </div>;
}
