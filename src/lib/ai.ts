import { getSupabase } from './cms';
import { PHENOM_CORE_MESSAGES } from './phenom-core';

export type AIRequest = { prompt: string; mode?: 'auto' | 'fast' | 'reasoning' | 'research' | 'creative'; context?: string; web?: boolean };
export type AIResponse = { text: string; citations?: { title?: string; url: string }[] };

export async function askAcademyAI(input: AIRequest): Promise<AIResponse> {
  const supabase = getSupabase();
  if (!supabase) throw new Error(PHENOM_CORE_MESSAGES.connection);
  const { data, error } = await supabase.functions.invoke('ai-router', { body: input });
  if (error) throw error;
  if (!data?.text) throw new Error(data?.error || PHENOM_CORE_MESSAGES.unavailable);
  return data as AIResponse;
}
