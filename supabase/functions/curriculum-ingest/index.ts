import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });

function htmlCandidates(html: string) {
  const stripped = html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/gi, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim();
  const headings = [...html.matchAll(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gis)]
    .map(m => m[1].replace(/<[^>]*>/g, ' ').replace(/&amp;/gi, '&').replace(/\s+/g, ' ').trim())
    .filter(Boolean);
  return { textLength: stripped.length, headings: [...new Set(headings)].slice(0, 500) };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  try {
    const auth = req.headers.get('Authorization');
    if (!auth) return json({ error: 'Authentication required.' }, 401);
    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { global: { headers: { Authorization: auth } } });
    const { data: { user } } = await admin.auth.getUser(auth.replace(/^Bearer\s+/i, ''));
    if (!user) return json({ error: 'Authenticated user required.' }, 401);
    const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profile?.role !== 'super_admin') return json({ error: 'Super administrator access required.' }, 403);

    const body = await req.json();
    const sourceId = String(body.source_id || '');
    if (!sourceId) return json({ error: 'source_id is required.' }, 400);
    const { data: source, error: sourceError } = await admin.from('lms_curriculum_sources').select('*').eq('id', sourceId).single();
    if (sourceError || !source) return json({ error: 'Curriculum source not found.' }, 404);

    const mode = String(body.mode || 'preview');
    if (mode === 'preview') {
      const response = await fetch(source.official_url, { redirect: 'follow' });
      const contentType = response.headers.get('content-type') || '';
      const bytes = await response.arrayBuffer();
      await admin.from('lms_curriculum_sources').update({
        verification_status: response.ok ? 'retrieved' : 'failed',
        retrieved_at: new Date().toISOString(),
        extraction_method: contentType.includes('html') ? 'official_html_preview' : 'document_binary_registered',
      }).eq('id', sourceId);
      if (contentType.includes('html')) {
        const parsed = htmlCandidates(new TextDecoder().decode(bytes));
        return json({ source_id: sourceId, official_url: source.official_url, content_type: contentType, http_status: response.status, candidate_headings: parsed.headings, text_length: parsed.textLength });
      }
      return json({ source_id: sourceId, official_url: source.official_url, content_type: contentType, http_status: response.status, bytes: bytes.byteLength });
    }

    if (mode === 'commit') {
      if (body.confirmed !== true) return json({ error: 'confirmed=true is required.' }, 400);
      if (!Array.isArray(body.records) || !body.records.length) return json({ error: 'records[] is required.' }, 400);
      const verified = body.records.map((r: any) => ({
        curriculum_id: source.curriculum_id, level_id: r.level_id, subject_id: r.subject_id,
        parent_topic_id: r.parent_topic_id || null, topic_title: String(r.topic_title || '').trim(),
        topic_code: r.topic_code ? String(r.topic_code) : null, learning_outcomes: r.learning_outcomes ?? {},
        assessment_expectations: r.assessment_expectations ?? {}, official_source: source.official_url,
        source_reference: String(r.source_reference || source.official_url), source_version: r.source_version ? String(r.source_version) : null,
        source_status: 'verified', ai_generation_policy: 'curriculum_bound', active: true,
        metadata: { ingestion_source_id: source.id, extraction_method: r.extraction_method || 'admin_verified_structured_extraction' },
      })).filter((r: any) => r.topic_title && r.level_id && r.subject_id);
      if (!verified.length) return json({ error: 'No valid records supplied.' }, 400);
      const { data, error } = await admin.from('lms_curriculum_topics').insert(verified).select('id');
      if (error) return json({ error: error.message }, 400);
      await admin.from('lms_curriculum_sources').update({ verification_status: 'verified', updated_at: new Date().toISOString() }).eq('id', sourceId);
      const { data: run } = await admin.from('lms_curriculum_ingestion_runs').insert({
        source_id: sourceId, completed_at: new Date().toISOString(), status: 'completed',
        extracted_topics: verified.length, verified_topics: verified.length,
        metadata: { mode: 'commit', inserted_ids: data?.map((x: any) => x.id) || [] },
      }).select('id').single();
      return json({ source_id: sourceId, inserted_topics: verified.length, ingestion_run_id: run?.id || null });
    }
    return json({ error: 'mode must be preview or commit.' }, 400);
  } catch (error) {
    return json({ error: error instanceof Error ? error.message : 'Curriculum ingestion failed.' }, 500);
  }
});