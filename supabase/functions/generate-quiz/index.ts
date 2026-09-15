import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type' };

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const body = await req.json();
    const subject = String(body.subject || '').trim();
    const topic = String(body.topic || '').trim();
    const level = Number(body.level || 1);
    const questionCount = Math.min(100, Math.max(1, Number(body.questionCount || 10)));
    const language = String(body.language || 'English');
    if (!subject || !topic) throw new Error('Subject and topic are required.');

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: req.headers.get('Authorization') ?? '' } },
    });
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'Sign in required.' }), { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } });

    // AI generation stays server-side. Set QUIZ_AI_ENDPOINT to an approved provider/service.
    const endpoint = Deno.env.get('QUIZ_AI_ENDPOINT');
    if (!endpoint) {
      return new Response(JSON.stringify({ error: 'The Academy learning engine is not connected yet.', code: 'QUIZ_AI_NOT_CONFIGURED' }), { status: 503, headers: { ...cors, 'Content-Type': 'application/json' } });
    }
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${Deno.env.get('QUIZ_AI_SECRET') ?? ''}` },
      body: JSON.stringify({ subject, topic, level, questionCount, language, format: 'mcq_or_short_answer', includeImagesWhenNecessary: true }),
    });
    if (!response.ok) throw new Error(`Question provider returned ${response.status}.`);
    const generated = await response.json();
    const questions = Array.isArray(generated.questions) ? generated.questions.slice(0, questionCount) : [];
    if (!questions.length) throw new Error('No questions were returned.');

    const { data: quiz, error: quizError } = await supabase.from('learning_quizzes').insert({
      created_by: user.id, subject, topic, level, language, question_count: questions.length, generation_source: 'academy', status: 'ready',
    }).select().single();
    if (quizError) throw quizError;
    const rows = questions.map((q: any, i: number) => ({
      quiz_id: quiz.id, position: i + 1, question_text: String(q.question_text || q.question || ''), options: q.options ?? null,
      image_url: q.image_url ?? null, correct_answer: String(q.correct_answer ?? q.answer ?? ''), explanation: String(q.explanation ?? ''),
    }));
    const { error: qError } = await supabase.from('quiz_questions').insert(rows);
    if (qError) throw qError;

    // Do not return answer keys to the child-facing client.
    return new Response(JSON.stringify({ id: quiz.id, subject, topic, level, language, questionCount: questions.length }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Quiz generation failed.' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
