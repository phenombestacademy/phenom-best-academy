import { getSupabase } from './cms';

export type SchoolRole = 'school_admin' | 'teacher' | 'student' | 'parent';
export type AcademyRole = 'super_admin' | 'academy_admin' | 'staff';

export type School = {
  id: string;
  name: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  country?: string | null;
  currency?: string | null;
};

export type QuizConfig = {
  subject: string;
  topic: string;
  level: number;
  questionCount: 10 | 20 | number;
  language?: string;
  durationMinutes?: number | null;
  oneAttempt: true;
  allowRedo: true;
};

export async function getMySchoolMembership() {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase
    .from('school_members')
    .select('school_id, role, schools(id,name,logo_url,primary_color,country,currency)')
    .maybeSingle();
  return data ?? null;
}

export async function createSchool(input: { name: string; logoUrl?: string; primaryColor?: string; country?: string; currency?: string }) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before creating a school.');
  const { data, error } = await supabase.from('schools').insert({
    name: input.name.trim(),
    logo_url: input.logoUrl || null,
    primary_color: input.primaryColor || null,
    country: input.country || null,
    currency: input.currency || null,
  }).select().single();
  if (error) throw error;
  return data;
}

export async function generateQuiz(config: QuizConfig) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect the Academy learning engine before generating quizzes.');
  // Server-side generation is intentionally delegated to an Edge Function/AI provider.
  // The child only receives the finished quiz; the UI never exposes the generation prompt.
  const { data, error } = await supabase.functions.invoke('generate-quiz', { body: config });
  if (error) throw error;
  return data;
}

export async function submitQuizAttempt(quizId: string, answers: Record<string, string>) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before submitting an attempt.');
  const { data, error } = await supabase.functions.invoke('submit-quiz', {
    body: { quizId, answers, oneAttempt: true },
  });
  if (error) throw error;
  return data;
}

export async function generateResultComment(input: { schoolId: string; classId: string; studentId: string; subjectId: string; sessionId: string; termNo: 1 | 2 | 3 }) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before generating result comments.');
  const { data, error } = await supabase.functions.invoke('generate-result-comment', { body: input });
  if (error) throw error;
  return data;
}
