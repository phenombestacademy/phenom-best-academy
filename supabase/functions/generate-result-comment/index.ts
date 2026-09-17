import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const body = await req.json();
    const schoolId = String(body.schoolId || '');
    const classId = String(body.classId || '');
    const studentId = String(body.studentId || '');
    const subjectId = String(body.subjectId || '');
    const sessionId = String(body.sessionId || '');
    const termNo = Number(body.termNo || 1);
    if (!schoolId || !classId || !studentId || !subjectId || !sessionId || ![1, 2, 3].includes(termNo)) throw new Error('Complete result context is required.');

    const userClient = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } } });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'Sign in required.' }), { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } });

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
    const elevated = ['staff', 'admin', 'super_admin'].includes(profile?.role ?? '');
    const { data: schoolRole } = await admin.from('school_members').select('role').eq('school_id', schoolId).eq('user_id', user.id).maybeSingle();
    const { data: assigned } = await admin.from('class_subjects').select('id').eq('class_id', classId).eq('subject_id', subjectId).eq('teacher_id', user.id).maybeSingle();
    const { data: member } = await admin.from('class_members').select('id').eq('class_id', classId).eq('user_id', studentId).eq('role', 'student').maybeSingle();
    if (!(elevated || schoolRole?.role === 'school_admin' || (assigned && member))) return new Response(JSON.stringify({ error: 'Not authorised for this result.' }), { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } });

    const { data: current } = await admin.from('student_result_entries').select('score,component_id,school_result_components(name,max_score,weight,component_type)').eq('school_id', schoolId).eq('session_id', sessionId).eq('term_no', termNo).eq('class_id', classId).eq('student_id', studentId).eq('subject_id', subjectId);
    const previous = termNo > 1
      ? await admin.from('student_term_summaries').select('term_no,term_percentage,cumulative_percentage,performance_note').eq('school_id', schoolId).eq('class_id', classId).eq('student_id', studentId).eq('subject_id', subjectId).lt('term_no', termNo).order('term_no', { ascending: false }).limit(2)
      : { data: [] };

    const max = (current ?? []).reduce((a: number, r: any) => a + Number(r.school_result_components?.max_score ?? 0), 0);
    const score = (current ?? []).reduce((a: number, r: any) => a + Number(r.score ?? 0), 0);
    const percentage = max > 0 ? Math.round((score / max) * 10000) / 100 : null;
    const prior = previous.data ?? [];
    const trend = prior.length && percentage != null ? percentage - Number(prior[0].term_percentage ?? percentage) : null;

    const endpoint = Deno.env.get('RESULT_COMMENT_AI_ENDPOINT');
    let comment = '';
    if (endpoint) {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Deno.env.get('RESULT_COMMENT_AI_SECRET') ?? ''}` },
        body: JSON.stringify({ current, percentage, previous: prior, trend, instruction: 'Write a concise, constructive school report comment based on current performance and previous-term context. Do not invent facts. Focus on strengths and specific improvement areas.' }),
      });
      if (response.ok) {
        const generated = await response.json();
        comment = String(generated.comment || '').trim();
      }
    }

    if (!comment) {
      if (percentage == null) comment = 'Performance information is being reviewed. Continue to engage consistently with the subject.';
      else if (percentage >= 80) comment = trend != null && trend > 0 ? 'Excellent performance with encouraging progress. Continue to strengthen understanding and maintain this level of consistency.' : 'Very good performance. Continue to deepen understanding and maintain consistent effort.';
      else if (percentage >= 60) comment = trend != null && trend > 0 ? 'Good progress is evident. Continue practising the areas that need reinforcement to build stronger mastery.' : 'Good performance overall. More focused practice in the weaker areas should help improve mastery.';
      else if (percentage >= 50) comment = 'A developing performance. Regular practice, revision and focused support in the weaker areas are recommended.';
      else comment = 'The current performance shows areas requiring attention. Consistent revision and targeted support should be prioritised.';
    }

    const context = { percentage, trend, previousTerms: prior.map((p: any) => ({ term: p.term_no, percentage: p.term_percentage, cumulative: p.cumulative_percentage })) };
    const { error: upsertError } = await admin.from('student_result_comments').upsert({ school_id: schoolId, session_id: sessionId, term_no: termNo, class_id: classId, student_id: studentId, subject_id: subjectId, generated_comment: comment, final_comment: comment, generated_context: context, generated_at: new Date().toISOString(), updated_at: new Date().toISOString() }, { onConflict: 'session_id,term_no,class_id,student_id,subject_id' });
    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({ comment, percentage, trend }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Comment generation failed.' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
