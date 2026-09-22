import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Generated = {
  question: string;
  options?: string[];
  answer: string;
  explanation?: string;
  imageUrl?: string | null;
};

function cleanJson(raw: string) {
  return raw.replace(/^\s*\`\`\`(?:json)?\s*/i, '').replace(/\s*\`\`\`\s*$/i, '').trim();
}

async function generateBatch(prompt: string, count: number): Promise<Generated[]> {
  const url = Deno.env.get('SUPABASE_URL')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const r = await fetch(`${url}/functions/v1/ai-router`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      apikey: serviceKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mode: 'reasoning',
      prompt: `${prompt}\nGenerate exactly ${count} distinct questions. Return JSON only as {"questions":[{"question":"...","options":["..."],"answer":"A","explanation":"..."}]}.`
    })
  });
  const data = await r.json();
  if (!r.ok || !data?.text) throw new Error('Question generation engine did not return a usable result.');
  const parsed = JSON.parse(cleanJson(String(data.text)));
  const questions = Array.isArray(parsed.questions) ? parsed.questions : [];
  return questions.map((q: any) => ({
    question: String(q.question || '').trim(),
    options: Array.isArray(q.options) ? q.options.map((x: any) => String(x)) : undefined,
    answer: String(q.answer || '').trim(),
    explanation: q.explanation == null ? '' : String(q.explanation),
    imageUrl: q.imageUrl == null ? null : String(q.imageUrl),
  })).filter((q: Generated) => q.question && q.answer);
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const auth = req.headers.get('Authorization') || '';
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, serviceKey);
    const token = auth.replace(/^Bearer\s+/i, '');
    const { data: userData } = await admin.auth.getUser(token);
    if (!userData.user) return new Response(JSON.stringify({ error: 'Authentication required.' }), { status: 401, headers: { ...cors, 'Content-Type': 'application/json' } });

    const body = await req.json();
    const subject = String(body.subject || '').trim();
    const topic = String(body.topic || '').trim();
    const level = Math.max(1, Number(body.level || 1));
    const questionCount = Math.floor(Number(body.questionCount || 0));
    const language = String(body.language || 'English').trim();
    const mode = body.mode === 'self_directed' ? 'self_directed' : 'teacher_assigned';
    if (!subject || !topic || !Number.isFinite(questionCount) || questionCount < 1) throw new Error('A subject, topic and positive question count are required.');

    const batchSize = 25;
    const all: Generated[] = [];
    const prompt = [
      'You are the Phenom Best Academy assessment engine.',
      'Create accurate, age-appropriate educational assessment questions.',
      `Subject: ${subject}`,
      `Topic: ${topic}`,
      `Level: ${level}`,
      `Language of the assessment: ${language}`,
      'Keep the target learning language as the question language when one is supplied.',
      'Avoid duplicate questions, ambiguous answers, unsupported claims and answer-pattern bias.',
      'For multiple choice questions use four options and answer as A, B, C or D.',
      'Explanations must teach the concept briefly.',
      'Do not mention providers, models, internal systems or implementation details.'
    ].join('\n');

    for (let remaining = questionCount; remaining > 0; remaining -= batchSize) {
      const count = Math.min(batchSize, remaining);
      const batch = await generateBatch(prompt, count);
      if (!batch.length) throw new Error('No questions were generated.');
      all.push(...batch);
    }

    const questions = all.slice(0, questionCount);
    if (questions.length < questionCount) throw new Error(`Only ${questions.length} of ${questionCount} questions were generated.`);

    const { data: quiz, error: quizError } = await admin.from('learning_quizzes').insert({
      school_id: body.schoolId || null,
      created_by: userData.user.id,
      subject,
      topic,
      level,
      language,
      question_count: questions.length,
      generation_source: 'academy',
      status: 'ready',
      learning_mode: mode,
      brand_name: 'Phenom Best Academy',
      watermark_text: 'Phenom Best Academy',
    }).select('id,subject,topic,level,language,question_count,brand_name,watermark_text').single();
    if (quizError) throw quizError;

    const rows = questions.map((q, i) => ({
      quiz_id: quiz.id,
      position: i + 1,
      question_text: q.question,
      options: q.options ? q.options : null,
      image_url: q.imageUrl || null,
      correct_answer: q.answer,
      explanation: q.explanation || null,
    }));
    const { error: questionError } = await admin.from('quiz_questions').insert(rows);
    if (questionError) {
      await admin.from('learning_quizzes').delete().eq('id', quiz.id);
      throw questionError;
    }

    return new Response(JSON.stringify({
      id: quiz.id,
      subject: quiz.subject,
      topic: quiz.topic,
      level: quiz.level,
      language: quiz.language,
      questionCount: quiz.question_count,
      brandName: quiz.brand_name,
      watermarkText: quiz.watermark_text
    }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Question generation failed.' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
