const highRiskPatterns: Array<[RegExp,string]> = [
  [/\b(child sexual|child abuse|csam|minor sexual|underage sex)\b/i, 'child_safety'],
  [/\b(groom(?:ing)?|meet (?:a|the) minor|send nudes?)\b/i, 'grooming_or_sexual_solicitation'],
  [/\b(kill you|murder|bomb|terrorist attack)\b/i, 'credible_violence_signal'],
  [/\b(self[- ]harm|suicide|kill myself)\b/i, 'self_harm_signal'],
];

export function preModerateText(text: string) {
  const hits = highRiskPatterns.filter(([pattern]) => pattern.test(text)).map(([, category]) => category);
  if (hits.includes('child_safety') || hits.includes('grooming_or_sexual_solicitation')) return { action: 'block' as const, severity: 'critical' as const, categories: hits };
  if (hits.length) return { action: 'flag' as const, severity: 'high' as const, categories: hits };
  return { action: 'allow' as const, severity: 'low' as const, categories: [] as string[] };
}

export async function moderateText(text: string) {
  const local = preModerateText(text);
  const endpoint = import.meta.env.VITE_MODERATION_ENDPOINT as string | undefined;
  if (!endpoint) return local;
  try {
    const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text }) });
    if (!response.ok) return local;
    const result = await response.json();
    return { ...local, ...result };
  } catch { return local; }
}
