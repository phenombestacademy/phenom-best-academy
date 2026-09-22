import { getSupabase } from './cms';

export type PracticeQuestion = { id: string; position: number; questionText: string; options?: string[]; imageUrl?: string | null; explanation?: string };
export type PracticeQuiz = { id: string; subject: string; topic: string; level: number; language: string; questionCount: number; questions: PracticeQuestion[]; brandName: string; watermarkText: string };
export type PracticeResult = { attemptNo: number; score: number; correctCount: number; total: number; review: Array<{ questionId: string; position: number; correct: boolean; given: string; correctAnswer: string; explanation: string }>; improvement: Array<{ questionId: string; position: number; explanation: string }> };

export const SUBJECT_TOPICS: Record<string, string[]> = {
  Mathematics: ['Arithmetic', 'Fractions', 'Algebra', 'Linear Equations', 'Indices', 'Geometry', 'Mensuration', 'Statistics', 'Probability', 'Trigonometry'],
  'English Language': ['Grammar', 'Parts of Speech', 'Tenses', 'Vocabulary', 'Comprehension', 'Punctuation', 'Spelling', 'Sentence Structure'],
  Physics: ['Measurement', 'Motion', 'Force', 'Work Energy Power', 'Heat', 'Waves', 'Electricity', 'Light'],
  Chemistry: ['Matter', 'Atomic Structure', 'Periodic Table', 'Chemical Bonding', 'Acids Bases Salts', 'Stoichiometry', 'Organic Chemistry'],
  Biology: ['Cells', 'Nutrition', 'Transport', 'Respiration', 'Reproduction', 'Ecology', 'Genetics', 'Human Systems'],
  'Basic Science': ['Living Things', 'Matter', 'Energy', 'Environment', 'Health', 'Technology'],
  'Computer Studies': ['Hardware', 'Software', 'Internet', 'Cyber Safety', 'Algorithms', 'Data'],
  Economics: ['Demand and Supply', 'Production', 'Markets', 'National Income', 'Inflation', 'Trade'],
  Geography: ['Map Reading', 'Weather', 'Climate', 'Population', 'Resources', 'Environment'],
  'Civic Education': ['Rights and Responsibilities', 'Citizenship', 'Democracy', 'Community', 'Leadership'],
  'Financial Literacy': ['Saving', 'Budgeting', 'Banking', 'Interest', 'Entrepreneurship', 'Digital Payments'],
};

const n = (x: number) => Math.round(x * 100) / 100;
function makeQuestion(position: number, text: string, options: string[], answer: string, explanation: string) {
  return { id: `local-${Date.now()}-${position}-${Math.random().toString(36).slice(2, 7)}`, position, questionText: text, options: options.map((x, i) => `${String.fromCharCode(65+i)}. ${x}`), _answer: answer, explanation } as PracticeQuestion & { _answer: string };
}

function localQuestions(subject: string, topic: string, count: number, level: number): Array<PracticeQuestion & { _answer: string }> {
  const out: Array<PracticeQuestion & { _answer: string }> = [];
  for (let i = 0; i < count; i++) {
    const k = i % 6;
    if (subject === 'Mathematics' && /Arithmetic|Fractions|Algebra|Linear Equations/i.test(topic)) {
      const a = level + 2 + i; const b = 2 + (i % 5);
      if (/Fractions/i.test(topic)) {
        const answer = n(a / b); out.push(makeQuestion(i+1, `What is ${a}/${b} expressed as a decimal (approximately)?`, [answer.toFixed(2), (answer+0.5).toFixed(2), (answer-0.25).toFixed(2), (answer+1).toFixed(2)], 'A', 'Divide the numerator by the denominator.'));
      } else if (/Algebra|Linear/i.test(topic)) {
        const x = i + 3; const c = 2 + (i % 4); const rhs = x + c; out.push(makeQuestion(i+1, `If x + ${c} = ${rhs}, what is x?`, [String(x), String(x+1), String(x-1), String(rhs)], 'A', `Subtract ${c} from both sides: x = ${x}.`));
      } else {
        const answer = a * b; out.push(makeQuestion(i+1, `What is ${a} × ${b}?`, [String(answer), String(answer+2), String(answer-2), String(a+b)], 'A', `Multiplication gives ${a} × ${b} = ${answer}.`));
      }
    } else if (subject === 'Physics') {
      const examples = [
        ['Which quantity is measured in metres per second?', ['Speed','Mass','Force','Energy'], 'A', 'Speed is commonly measured in metres per second (m/s).'],
        ['Which instrument is commonly used to measure electric current?', ['Ammeter','Voltmeter','Thermometer','Barometer'], 'A', 'An ammeter measures electric current.'],
        ['What is the SI unit of force?', ['Newton','Joule','Watt','Pascal'], 'A', 'The SI unit of force is the newton (N).'],
        ['Which form of energy is associated with motion?', ['Kinetic energy','Chemical energy','Nuclear energy','Sound energy'], 'A', 'Kinetic energy is the energy of motion.'],
      ][k % 4]; out.push(makeQuestion(i+1, `${examples[0]} (${topic})`, examples[1] as string[], examples[2] as string, examples[3] as string));
    } else if (subject === 'Chemistry') {
      const examples = [
        ['What is the chemical symbol for oxygen?', ['O','Ox','Og','C'], 'A', 'O is the chemical symbol for oxygen.'],
        ['A substance with pH below 7 is generally described as what?', ['Acidic','Neutral','Alkaline','Metallic'], 'A', 'Values below 7 are acidic on the usual pH scale.'],
        ['What is the smallest unit of an element that retains its chemical identity?', ['Atom','Cell','Molecule only','Mixture'], 'A', 'An atom is the basic unit of an element.'],
      ][k % 3]; out.push(makeQuestion(i+1, `${examples[0]} (${topic})`, examples[1] as string[], examples[2] as string, examples[3] as string));
    } else if (subject === 'Biology') {
      const examples = [
        ['Which structure controls many activities of a cell?', ['Nucleus','Cell wall','Vacuole','Ribosome'], 'A', 'The nucleus contains genetic material and helps regulate cell activity.'],
        ['Which process allows green plants to make glucose using light energy?', ['Photosynthesis','Respiration','Digestion','Fermentation'], 'A', 'Photosynthesis uses light energy to produce glucose from carbon dioxide and water.'],
        ['Which organ pumps blood around the human body?', ['Heart','Lung','Kidney','Stomach'], 'A', 'The heart pumps blood through the circulatory system.'],
      ][k % 3]; out.push(makeQuestion(i+1, `${examples[0]} (${topic})`, examples[1] as string[], examples[2] as string, examples[3] as string));
    } else if (subject === 'English Language') {
      const examples = [
        ['Choose the correctly spelled word.', ['Necessary','Neccessary','Necesary','Necassary'], 'A', 'Necessary is the standard spelling.'],
        ['Which word is a noun?', ['Education','Quickly','Beautiful','Run'], 'A', 'Education is a noun naming a concept.'],
        ['Choose the sentence with correct punctuation.', ['The teacher said, “Study carefully.”','The teacher said “Study carefully”.','The teacher said, Study carefully.','The teacher, said “Study carefully.”'], 'A', 'The comma and full stop are placed correctly in the quoted sentence.'],
      ][k % 3]; out.push(makeQuestion(i+1, `${examples[0]} (${topic})`, examples[1] as string[], examples[2] as string, examples[3] as string));
    } else {
      const topicSafe = topic || 'the topic';
      const examples = [
        [`Which statement is most directly related to ${topicSafe}?`, ['It is a subject concept to be learned and applied','It has no connection to learning','It cannot be practised','It never requires evidence'], 'A', `The first option describes a normal learning relationship with ${topicSafe}.`],
        [`A good learner studying ${topicSafe} should usually do what?`, ['Learn, practise and review','Skip all practice','Avoid feedback','Memorise without understanding'], 'A', 'Active practice and review support understanding and retention.'],
        [`Which approach is useful when learning ${topicSafe}?`, ['Use examples and check corrections','Ignore errors','Avoid questions','Never review notes'], 'A', 'Examples and corrections help learners identify and fix misconceptions.'],
      ][k % 3]; out.push(makeQuestion(i+1, examples[0], examples[1] as string[], examples[2] as string, examples[3] as string));
    }
  }
  return out;
}

export async function generatePracticeQuiz(input: { subject: string; topic: string; level: number; questionCount: number; language?: string; schoolId?: string | null; mode?: 'self_directed' | 'teacher_assigned' }) {
  const s = getSupabase();
  if (!s) {
    const local = localQuestions(input.subject, input.topic, Math.max(1, Math.floor(input.questionCount)), input.level);
    return { id: `local-quiz-${Date.now()}`, subject: input.subject, topic: input.topic, level: input.level, language: input.language || 'English', questionCount: local.length, questions: local.map(({ _answer, ...q }) => q), brandName: 'Phenom Best Academy', watermarkText: 'Phenom Best Academy' } as PracticeQuiz;
  }
  const { data, error } = await s.functions.invoke('generate-quiz', { body: { ...input, questionCount: Math.max(1, Math.floor(input.questionCount)), mode: input.mode || 'self_directed' } });
  if (error) throw error;
  const quizId = data?.id;
  if (!quizId) throw new Error(data?.error || 'Questions could not be prepared.');
  const { data: questions, error: qError } = await s.from('quiz_questions').select('id,position,question_text,options,image_url,explanation').eq('quiz_id', quizId).order('position');
  if (qError) throw qError;
  return { id: quizId, subject: data.subject, topic: data.topic, level: data.level, language: data.language, questionCount: data.questionCount, questions: (questions || []).map((q: any) => ({ id: q.id, position: q.position, questionText: q.question_text, options: Array.isArray(q.options) ? q.options : undefined, imageUrl: q.image_url, explanation: q.explanation })), brandName: data.brandName || 'Phenom Best Academy', watermarkText: data.watermarkText || 'Phenom Best Academy' } as PracticeQuiz;
}

export async function submitPracticeQuiz(quiz: PracticeQuiz, answers: Record<string, string>): Promise<PracticeResult> {
  const s = getSupabase();
  if (!s || quiz.id.startsWith('local-quiz-')) {
    const local = localQuestions(quiz.subject, quiz.topic, quiz.questions.length, quiz.level);
    let correct = 0;
    const review = quiz.questions.map((q, i) => {
      const expected = local[i]?._answer || 'A'; const given = String(answers[q.id] || ''); const ok = given === expected; if (ok) correct += 1;
      return { questionId: q.id, position: q.position, correct: ok, given, correctAnswer: expected, explanation: q.explanation || local[i]?.explanation || '' };
    });
    const score = Math.round((correct / quiz.questions.length) * 10000) / 100;
    return { attemptNo: 1, score, correctCount: correct, total: quiz.questions.length, review, improvement: review.filter(x => !x.correct).map(x => ({ questionId: x.questionId, position: x.position, explanation: x.explanation })) };
  }
  const { data, error } = await s.functions.invoke('submit-quiz', { body: { quizId: quiz.id, answers } });
  if (error) throw error;
  if (data?.error) throw new Error(data.error);
  return data as PracticeResult;
}
