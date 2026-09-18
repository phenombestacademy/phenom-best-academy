import { getSupabase } from './cms';

export type AIRequest = { prompt: string; mode?: 'auto' | 'fast' | 'reasoning' | 'research' | 'creative'; context?: string; web?: boolean };
export type AIResponse = { text: string; citations?: { title?: string; url: string }[] };

export async function askAcademyAI(input: AIRequest): Promise<AIResponse> {
  const supabase = getSupabase();
  if (!supabase) throw new Error('The Academy Phenom Best Core is not connected yet.');
  const { data, error } = await supabase.functions.invoke('ai-router', { body: input });
  if (error) throw error;
  if (!data?.text) throw new Error(data?.error || 'The Phenom Best Core could not complete the request.');
  return data as AIResponse;
}
