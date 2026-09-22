import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Item = { key: string; text: string };
type Candidate = { text: string; provider: string };

const localeCode = (locale: string) => locale.split('-')[0];
const SUPPORTED = new Set([
  'en-NG','en-GB','en-US','en-AU','en-CA','pcm-NG','fr-FR','es-ES','zh-CN','pt-PT','ar','de-DE','it-IT','ru-RU','yo-NG','ig-NG','ha-NG',
  'sw-KE','sw-TZ','nl-NL','pl-PL','tr-TR','ko-KR','ja-JP','hi-IN','bn-BD','ur-PK','fa-IR','he-IL','id-ID','ms-MY','th-TH','vi-VN','fil-PH','uk-UA','ro-RO','cs-CZ','el-GR','da-DK','sv-SE','no-NO','fi-FI','hu-HU','am-ET','so-SO','zu-ZA','xh-ZA',
  'ab','ace','ach','af','sq','alz','as','awa','ay','az','ban','bm','ba','eu','be','bem','bn','bho','bik','bs','br','bg','bua','yue','ca','ceb','ny','cv','co','crh','hr','din','dv','doi','dov','dz','eo','et','ee','fj','ff','gaa','gl','lg','ka','gn','gu','ht','haw','hil','hmn','ilo','ga','jv','kn','pam','kk','cgg','rw','ktu','gom','kri','ku','ckb','ky','lo','ltg','la','lij','li','ln','lt','lmo','luo','lb','mk','mai','mak','mg','ml','mt','mi','chm','mni-Mtei','min','lus','mn','my','nr','new','nso','nus','oc','or','om','pag','pap','ps','pa','pa-Arab','qu','rom','rn','gd','sr','sk','sl','st','crs','shn','sn','scn','szl','sd','si','ss','tg','ta','tt','te','tet','ti','ts','tn','tk','ak','uz','cy','yi','yua',
  'zh-TW','zh-HK','zh-Hans','zh-Hant','en-NZ','en-PH','en-ZA','fr-CA','fr-CH','nl-BE','pt-BR','es-MX','es-AR','es-419','nb','nb-NO','he','iw'
]);

async function openaiTranslate(items: Item[], target: string): Promise<Candidate[]> {
  const key = Deno.env.get('OPENAI_API_KEY');
  if (!key) throw new Error('provider unavailable');
  const model = Deno.env.get('OPENAI_TRANSLATION_MODEL') || Deno.env.get('OPENAI_MODEL') || 'gpt-5.6-luna';
  const prompt = [
    'Translate the following Phenom Best Academy interface resources.',
    'Preserve resource keys, placeholders such as {{name}}, HTML tags, punctuation, product names and meaning.',
    'Return JSON only: an array of objects with key and translation.',
    `Target locale: ${target}`,
    JSON.stringify(items)
  ].join('\n');
  const r = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, input: prompt })
  });
  const p = await r.json();
  if (!r.ok) throw new Error('provider failed');
  const raw = String(p.output_text || p.output?.flatMap((x: any) => x.content || []).find((c: any) => c.type === 'output_text')?.text || '');
  const parsed = JSON.parse(raw.replace(/^\`\`\`json\s*/,'').replace(/\s*\`\`\`$/,''));
  const map = new Map((parsed as any[]).map(x => [String(x.key), String(x.translation)]));
  return items.map(i => ({ text: map.get(i.key) || i.text, provider: 'A' }));
}

async function geminiTranslate(items: Item[], target: string): Promise<Candidate[]> {
  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) throw new Error('provider unavailable');
  const model = Deno.env.get('GEMINI_TRANSLATION_MODEL') || Deno.env.get('GEMINI_MODEL') || 'gemini-3.8-flash';
  const prompt = [
    'Translate these Phenom Best Academy interface resources.',
    'Preserve keys, placeholders, HTML tags, punctuation and meaning. Return JSON only as [{key,translation}].',
    `Target locale: ${target}`,
    JSON.stringify(items)
  ].join('\n');
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });
  const p = await r.json();
  if (!r.ok) throw new Error('provider failed');
  const raw = String(p.candidates?.[0]?.content?.parts?.map((x: any) => x.text || '').join('') || '');
  const parsed = JSON.parse(raw.replace(/^\`\`\`json\s*/,'').replace(/\s*\`\`\`$/,''));
  const map = new Map((parsed as any[]).map(x => [String(x.key), String(x.translation)]));
  return items.map(i => ({ text: map.get(i.key) || i.text, provider: 'B' }));
}

async function googleTranslate(items: Item[], target: string): Promise<Candidate[]> {
  const key = Deno.env.get('GOOGLE_TRANSLATE_API_KEY');
  if (!key) throw new Error('provider unavailable');
  const q = items.map(i => i.text);
  const url = 'https://translation.googleapis.com/language/translate/v2';
  const r = await fetch(`${url}?key=${encodeURIComponent(key)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ q, source: 'en', target: localeCode(target), format: 'text' })
  });
  const p = await r.json();
  if (!r.ok) throw new Error('provider failed');
  const translations = p.data?.translations || [];
  return items.map((_, i) => ({ text: String(translations[i]?.translatedText || items[i].text), provider: 'C' }));
}

async function libreTranslate(items: Item[], target: string): Promise<Candidate[]> {
  const base = Deno.env.get('LIBRETRANSLATE_URL');
  if (!base) throw new Error('provider unavailable');
  const body: Record<string, unknown> = { q: items.map(i => i.text).join('\n'), source: 'en', target: localeCode(target), format: 'text' };
  const apiKey = Deno.env.get('LIBRETRANSLATE_API_KEY');
  if (apiKey) body.api_key = apiKey;
  const r = await fetch(`${base.replace(/\/$/,'')}/translate`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
  });
  const p = await r.json();
  if (!r.ok) throw new Error('provider failed');
  const lines = String(p.translatedText || '').split('\n');
  return items.map((_, i) => ({ text: lines[i] || items[i].text, provider: 'D' }));
}

async function azureTranslate(items: Item[], target: string): Promise<Candidate[]> {
  const key = Deno.env.get('AZURE_TRANSLATOR_KEY');
  const endpoint = Deno.env.get('AZURE_TRANSLATOR_ENDPOINT');
  const region = Deno.env.get('AZURE_TRANSLATOR_REGION');
  if (!key || !endpoint) throw new Error('provider unavailable');
  const url = `${endpoint.replace(/\/$/,'')}/translate?api-version=3.0&from=en&to=${encodeURIComponent(localeCode(target))}`;
  const r = await fetch(url, { method:'POST', headers:{'Ocp-Apim-Subscription-Key':key, ...(region?{'Ocp-Apim-Subscription-Region':region}:{}),'Content-Type':'application/json'}, body:JSON.stringify(items.map(i=>({Text:i.text}))) });
  const p = await r.json(); if(!r.ok) throw new Error('provider failed');
  return items.map((_,i)=>({text:String(p[i]?.translations?.[0]?.text || items[i].text),provider:'F'}));
}

async function myMemoryTranslate(items: Item[], target: string): Promise<Candidate[]> {
  const results: Candidate[] = [];
  for (const item of items) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(item.text)}&langpair=en|${encodeURIComponent(localeCode(target))}`;
    const r = await fetch(url);
    const p = await r.json();
    if (!r.ok) throw new Error('provider failed');
    results.push({ text: String(p.responseData?.translatedText || item.text), provider: 'E' });
  }
  return results;
}

function quality(source: string, translated: string): number {
  if (!translated || translated === source) return 0;
  let score = 80;
  if (translated.length < Math.max(2, source.length * 0.2)) score -= 25;
  if ((source.match(/\{\{[^}]+\}\}/g) || []).join('|') !== (translated.match(/\{\{[^}]+\}\}/g) || []).join('|')) score -= 40;
  if ((source.match(/<[^>]+>/g) || []).join('|') !== (translated.match(/<[^>]+>/g) || []).join('|')) score -= 30;
  return Math.max(0, Math.min(100, score));
}

async function bestOf(items: Item[], target: string): Promise<{translations: string[]; trace: Record<string, unknown>}> {
  const jobs = [
    openaiTranslate(items, target),
    geminiTranslate(items, target),
    googleTranslate(items, target),
    libreTranslate(items, target),
    myMemoryTranslate(items, target),
    azureTranslate(items, target),
  ];
  const settled = await Promise.allSettled(jobs);
  const candidates = settled.filter((x): x is PromiseFulfilledResult<Candidate[]> => x.status === 'fulfilled').map(x => x.value);
  if (!candidates.length) throw new Error('No translation engine is configured.');
  const translations = items.map((item, i) => {
    let best = { text: item.text, score: 0, provider: 'fallback' };
    for (const candidateSet of candidates) {
      const c = candidateSet[i];
      const s = quality(item.text, c.text);
      if (s > best.score) best = { text: c.text, score: s, provider: c.provider };
    }
    return best;
  });
  return {
    translations: translations.map(x => x.text),
    trace: {
      engines_available: candidates.length,
      selected: translations.map(x => ({ score: x.score }))
    }
  };
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
    const { data: profile } = await admin.from('profiles').select('role').eq('id', userData.user.id).maybeSingle();
    if (profile?.role !== 'super_admin') return new Response(JSON.stringify({ error: 'Super Admin access required.' }), { status: 403, headers: { ...cors, 'Content-Type': 'application/json' } });

    const body = await req.json();
    const locale = String(body.locale || '');
    const items = Array.isArray(body.resources) ? body.resources.map((x: any) => ({ key: String(x.key), text: String(x.text) })) : [];
    if (!SUPPORTED.has(locale) || !items.length) throw new Error('A supported locale and resource list are required.');

    const { translations, trace } = await bestOf(items, locale);
    const rows = items.map((item, i) => ({
      locale,
      resource_key: item.key,
      source_text: item.text,
      translated_text: translations[i],
      source_version: String(body.sourceVersion || 'v1'),
      quality_score: quality(item.text, translations[i]),
      status: 'draft',
      provider_trace: trace,
    }));
    const { error } = await admin.from('ui_translation_resources').upsert(rows, { onConflict: 'locale,resource_key,source_version' });
    if (error) throw error;
    return new Response(JSON.stringify({ ok: true, locale, count: rows.length, translations: translations.map((text, i) => ({ key: items[i].key, text })) }), { headers: { ...cors, 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Translation preparation failed.' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
});
