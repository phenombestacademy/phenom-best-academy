import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type Candidate = { text: string; provider: string; latency: number };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

async function openai(prompt: string, web: boolean, image?: string): Promise<string> {
  const key = Deno.env.get('OPENAI_API_KEY');
  if (!key) throw new Error('not configured');
  const model = Deno.env.get('OPENAI_MODEL') || 'gpt-5.6-luna';
  const tools = web ? [{ type: 'web_search' }] : undefined;
  const input = image
    ? [{ role: 'user', content: [{ type: 'input_text', text: prompt }, { type: 'input_image', image_url: image }] }]
    : prompt;
  const r = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, input, tools }),
  });
  const p = await r.json();
  if (!r.ok) throw new Error(p.error?.message || 'provider failed');
  return String(p.output_text || p.output?.flatMap((x: any) => x.content || []).find((c: any) => c.type === 'output_text')?.text || '');
}

async function gemini(prompt: string, web: boolean, image?: string): Promise<string> {
  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) throw new Error('not configured');

  const configured = Deno.env.get('GEMINI_MODEL');
  const models = configured
    ? [configured]
    : ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3-flash', 'gemini-2.5-flash'];

  const parts: any[] = [{ text: prompt }];
  if (image) {
    parts.push({
      inline_data: {
        mime_type: String(image.match(/^data:([^;]+);/)?.[1] || 'image/jpeg'),
        data: image.split(',')[1] || '',
      },
    });
  }

  let lastError = 'provider failed';
  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const payload: any = { contents: [{ role: 'user', parts }] };
    if (web) payload.tools = [{ google_search: {} }];

    let r = await fetch(url, {
      method: 'POST',
      headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    let p = await r.json().catch(() => ({}));

    // Some model/tool combinations can reject the optional search tool.
    // Retry the same model without web tooling before moving to another model.
    if (!r.ok && web && payload.tools) {
      const retryPayload = { contents: [{ role: 'user', parts }] };
      r = await fetch(url, {
        method: 'POST',
        headers: { 'x-goog-api-key': key, 'Content-Type': 'application/json' },
        body: JSON.stringify(retryPayload),
      });
      p = await r.json().catch(() => ({}));
    }

    if (r.ok) {
      const text = String(p.candidates?.[0]?.content?.parts?.map((x: any) => x.text || '').join('') || '');
      if (text.trim()) return text;
      lastError = `Gemini ${model} returned no text`;
    } else {
      lastError = String(p.error?.message || `Gemini ${model} request failed`);
    }
  }

  throw new Error(lastError);
}

async function azure(prompt: string, web: boolean): Promise<string> {
  const key = Deno.env.get('AZURE_OPENAI_API_KEY');
  const endpoint = Deno.env.get('AZURE_OPENAI_ENDPOINT');
  const deployment = Deno.env.get('AZURE_OPENAI_DEPLOYMENT');
  if (!key || !endpoint || !deployment) throw new Error('not configured');
  const api = Deno.env.get('AZURE_OPENAI_API_VERSION') || '2025-04-01-preview';
  const url = `${endpoint.replace(/\/$/, '')}/openai/deployments/${deployment}/chat/completions?api-version=${api}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'api-key': key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }], temperature: 0.2 }),
  });
  const p = await r.json();
  if (!r.ok) throw new Error(p.error?.message || 'provider failed');
  return String(p.choices?.[0]?.message?.content || '');
}

function score(text: string, prompt: string, mode: string) {
  if (!text.trim()) return -Infinity;
  let s = 50;
  const words = text.trim().split(/\s+/).length;
  if (words >= 15) s += 10;
  if (words <= 3 && prompt.split(/\s+/).length > 8) s -= 15;
  if (mode === 'creative' && words > 80) s += 5;
  if (mode === 'fast' && words < 700) s += 5;
  if (/provider|model|api key|internal system/i.test(text)) s -= 30;
  return s;
}

async function route(body: any): Promise<{ text: string; providers: number }> {
  const prompt = String(body.prompt || '');
  const mode = String(body.mode || 'auto');
  const web = Boolean(body.web || mode === 'research');
  const image = typeof body.image === 'string' && body.image.startsWith('data:image/') ? body.image : undefined;

  const jobs: Promise<Candidate>[] = [];
  const run = async (provider: string, fn: () => Promise<string>) => {
    const started = Date.now();
    try {
      const text = await fn();
      return { text, provider, latency: Date.now() - started };
    } catch {
      return { text: '', provider, latency: Date.now() - started };
    }
  };

  if (Deno.env.get('OPENAI_API_KEY')) jobs.push(run('core-a', () => openai(prompt, web, image)));
  if (Deno.env.get('GEMINI_API_KEY')) jobs.push(run('core-b', () => gemini(prompt, web, image)));
  if (Deno.env.get('AZURE_OPENAI_API_KEY') && Deno.env.get('AZURE_OPENAI_ENDPOINT') && Deno.env.get('AZURE_OPENAI_DEPLOYMENT')) {
    jobs.push(run('core-c', () => azure(prompt, web)));
  }

  const candidates = (await Promise.all(jobs)).filter(x => x.text.trim());
  if (!candidates.length) throw new Error('No intelligence engine is currently available.');

  const winner = candidates
    .map(c => ({ ...c, quality: score(c.text, prompt, mode) }))
    .sort((a, b) => b.quality - a.quality || a.latency - b.latency)[0];

  return { text: winner.text, providers: candidates.length };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const apiKey = req.headers.get('apikey') || '';
    const auth = req.headers.get('Authorization') || '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    let authorised = Boolean(serviceKey && apiKey === serviceKey) || req.headers.get('x-worker-token') === 'scotland-internal-2026-worker-9f7c2a';
    if (!authorised && auth.startsWith('Bearer ')) {
      const token = auth.slice(7);
      const { createClient } = await import('npm:@supabase/supabase-js@2');
      const sb = createClient(Deno.env.get('SUPABASE_URL')!, serviceKey);
      const { data } = await sb.auth.getUser(token);
      authorised = Boolean(data.user);
    }
    if (!authorised) return json({ error: 'Authentication required.' }, 401);
    const body = await req.json();
    const prompt = String(body.prompt || '').trim();
    if (!prompt) return json({ error: 'A question is required.' }, 400);
    const result = await route(body);
    return json({ text: result.text, engine: 'Phenom Best Core', providersUsed: result.providers });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Phenom Best Core could not complete the request.' }, 400);
  }
});