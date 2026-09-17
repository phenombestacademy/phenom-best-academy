import { getSupabase } from './cms';

export type SchoolRole = 'school_admin' | 'teacher' | 'student' | 'parent';
export type AcademyRole = 'super_admin' | 'academy_admin' | 'staff';

export type SchoolCurriculum = { curriculumId:string; priority:number; stateOrRegion?:string|null };

export type School = {
  id: string;
  name: string;
  logoUrl?: string | null;
  primaryColor?: string | null;
  country?: string | null;
  currency?: string | null;
};

export type SchoolContext = {
  school: School;
  role: SchoolRole;
  membershipId: string;
};

export type SchoolDashboardSummary = {
  classes: number;
  students: number;
  subjects: number;
  attendance: number;
  results: number;
  staff: number;
  feePayments: number;
  elections: number;
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

export async function getMySchoolMembership(): Promise<SchoolContext | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('school_members')
    .select('id, school_id, role, schools(id,name,logo_url,primary_color,country,currency)')
    .maybeSingle();
  if (error || !data || !data.schools) return null;
  const school = Array.isArray(data.schools) ? data.schools[0] : data.schools;
  if (!school) return null;
  return {
    membershipId: String(data.id),
    role: data.role as SchoolRole,
    school: {
      id: String(school.id),
      name: String(school.name),
      logoUrl: school.logo_url ? String(school.logo_url) : null,
      primaryColor: school.primary_color ? String(school.primary_color) : null,
      country: school.country ? String(school.country) : null,
      currency: school.currency ? String(school.currency) : null,
    },
  };
}

async function countRows(table: string, column: string, value: string) {
  const supabase = getSupabase();
  if (!supabase) return 0;
  const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true }).eq(column, value);
  if (error) return 0;
  return count ?? 0;
}

export async function getSchoolDashboardSummary(schoolId: string): Promise<SchoolDashboardSummary> {
  const [classes, students, subjects, attendance, results, staff, feePayments, elections] = await Promise.all([
    countRows('school_classes', 'school_id', schoolId),
    countRows('student_school_records', 'school_id', schoolId),
    countRows('school_subjects', 'school_id', schoolId),
    countRows('student_attendance', 'school_id', schoolId),
    countRows('student_result_entries', 'school_id', schoolId),
    countRows('staff_records', 'school_id', schoolId),
    countRows('school_fee_payments', 'school_id', schoolId),
    countRows('school_elections', 'school_id', schoolId),
  ]);
  return { classes, students, subjects, attendance, results, staff, feePayments, elections };
}

export async function createSchool(input: { name: string; logoUrl?: string; primaryColor?: string; country?: string; currency?: string; curricula?: string[]; stateOrRegion?: string }) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before creating a school.');
  const { data, error } = await supabase.rpc('create_school_for_current_user_v2', {
    p_name: input.name.trim(),
    p_logo_url: input.logoUrl || null,
    p_primary_color: input.primaryColor || null,
    p_country: input.country || null,
    p_currency: input.currency || null,
    p_curricula: input.curricula || [],
    p_state_or_region: input.stateOrRegion || null,
  });
  if (error) throw error;
  return data;
}

export async function generateQuiz(config: QuizConfig) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect the Academy learning engine before generating quizzes.');
  const { data, error } = await supabase.functions.invoke('generate-quiz', { body: config });
  if (error) throw error;
  return data;
}

export async function submitQuizAttempt(quizId: string, answers: Record<string, string>) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before submitting an attempt.');
  const { data, error } = await supabase.functions.invoke('submit-quiz', { body: { quizId, answers, oneAttempt: true } });
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
