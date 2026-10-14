type Env = {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  CURRICULUM_QUEUE: Queue;
  OPENAI_API_KEY?: string;
  OPENAI_MODEL?: string;
  GEMINI_API_KEY?: string;
  GEMINI_MODEL?: string;
  AZURE_OPENAI_API_KEY?: string;
  AZURE_OPENAI_ENDPOINT?: string;
  AZURE_OPENAI_DEPLOYMENT?: string;
  AZURE_OPENAI_API_VERSION?: string;
};

const RESOURCE_TYPES = [
  "lesson","study_note","worked_example","practice","assessment","answers",
  "marking_guide","revision","teacher_guide","activities","audio_script",
  "video_script","downloadable","workbook"
] as const;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" }
  });

function db(env: Env, path: string, init: RequestInit = {}) {
  return fetch(env.SUPABASE_URL + "/rest/v1/" + path, {
    ...init,
    headers: {
      apikey: env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: "Bearer " + env.SUPABASE_SERVICE_ROLE_KEY,
      "Content-Type": "application/json",
      ...(init.headers || {})
    }
  });
}

async function openai(env: Env, prompt: string, web = false) {
  if (!env.OPENAI_API_KEY) throw new Error("OpenAI not configured");
  const r = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + env.OPENAI_API_KEY,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: env.OPENAI_MODEL || "gpt-5.6-luna",
      input: prompt,
      ...(web ? { tools: [{ type: "web_search" }] } : {})
    })
  });
  const p: any = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(p.error?.message || "OpenAI request failed");
  return String(p.output_text || "");
}

async function gemini(env: Env, prompt: string, web = false) {
  if (!env.GEMINI_API_KEY) throw new Error("Gemini not configured");
  const model = env.GEMINI_MODEL || "gemini-3.5-flash";
  const url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent";
  const body: any = { contents: [{ role: "user", parts: [{ text: prompt }] }] };
  if (web) body.tools = [{ google_search: {} }];
  const r = await fetch(url, {
    method: "POST",
    headers: { "x-goog-api-key": env.GEMINI_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const p: any = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(p.error?.message || "Gemini request failed");
  return String(p.candidates?.[0]?.content?.parts?.map((x: any) => x.text || "").join("") || "");
}

async function azure(env: Env, prompt: string) {
  if (!env.AZURE_OPENAI_API_KEY || !env.AZURE_OPENAI_ENDPOINT || !env.AZURE_OPENAI_DEPLOYMENT) {
    throw new Error("Azure OpenAI not fully configured");
  }
  const api = env.AZURE_OPENAI_API_VERSION || "2025-04-01-preview";
  const endpoint = env.AZURE_OPENAI_ENDPOINT.replace(/\/$/, "");
  const r = await fetch(
    endpoint + "/openai/deployments/" + env.AZURE_OPENAI_DEPLOYMENT +
    "/chat/completions?api-version=" + api,
    {
      method: "POST",
      headers: { "api-key": env.AZURE_OPENAI_API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2
      })
    }
  );
  const p: any = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(p.error?.message || "Azure OpenAI request failed");
  return String(p.choices?.[0]?.message?.content || "");
}

async function ai(env: Env, prompt: string, web = false) {
  const jobs = [
    env.OPENAI_API_KEY ? openai(env, prompt, web) : Promise.reject(new Error("OpenAI unavailable")),
    env.GEMINI_API_KEY ? gemini(env, prompt, web) : Promise.reject(new Error("Gemini unavailable")),
    env.AZURE_OPENAI_API_KEY ? azure(env, prompt) : Promise.reject(new Error("Azure unavailable"))
  ];
  const results = await Promise.allSettled(jobs);
  for (const r of results) {
    if (r.status === "fulfilled" && r.value.trim()) return r.value;
  }
  throw new Error("No configured AI provider returned usable content");
}

function extractJson(raw: string): any {
  const cleaned = raw.replace(/^\s*```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("AI response did not contain JSON");
  return JSON.parse(match[0]);
}

async function processContentJob(env: Env, job: any) {
  const topicResponse = await db(
    env,
    "lms_curriculum_topics?id=eq." + encodeURIComponent(job.topic_id) + "&select=*"
  );
  const topics: any[] = await topicResponse.json();
  const topic = topics[0];
  if (!topic) throw new Error("Topic not found: " + job.topic_id);

  const curriculumResponse = await db(
    env,
    "curriculum_catalogue?id=eq." + encodeURIComponent(job.curriculum_id) +
    "&select=name,description,official_source"
  );
  const curricula: any[] = await curriculumResponse.json();
  const curriculum = curricula[0];

  const base = [
    "You are the Phenom Best Academy curriculum content worker.",
    "Create original human-ready educational content in British English.",
    "Do not copy official wording. Distinguish statutory/source facts from Phenom-authored teaching material.",
    "Curriculum:", JSON.stringify(curriculum),
    "Topic:", JSON.stringify(topic),
    "Instruction:", String(job.metadata?.instruction || "Create original curriculum-aligned educational content.")
  ].join("\n");

  const a = extractJson(await ai(env,
    base + "\nReturn ONLY JSON containing: lesson,study_note,worked_example,practice,assessment,answers,marking_guide."
  ));
  const b = extractJson(await ai(env,
    base + "\nReturn ONLY JSON containing: revision,teacher_guide,activities,audio_script,video_script,downloadable,workbook."
  ));

  const all = { ...a, ...b };
  for (let i = 0; i < RESOURCE_TYPES.length; i++) {
    const type = RESOURCE_TYPES[i];
    const value = String(all[type] ?? "");
    if (value.length < 120) throw new Error("Missing or too-short " + type);

    const row = {
      topic_id: topic.id,
      pack_code: (job.curriculum_id || topic.curriculum_id) + "-" + topic.id + "-" + type,
      resource_type: type,
      title: String(topic.topic_title) + " — " + type.replaceAll("_", " "),
      content: value,
      locale: "en-NG",
      support_locale: "en-NG",
      sequence_no: i + 1,
      status: "ready",
      curriculum_alignment: {
        curriculum_id: job.curriculum_id || topic.curriculum_id,
        topic_id: topic.id,
        official_source: topic.official_source || curriculum?.official_source,
        source_reference: topic.source_reference,
        source_version: topic.source_version
      },
      brand_metadata: {
        brand: "Phenom Best Academy",
        engine: "Phenom Best Core",
        generated_by: "cloudflare-curriculum-worker",
        iqa_required: true,
        job_type: job.job_type
      }
    };

    const r = await db(env, "lms_curriculum_resource_packs?on_conflict=topic_id%2Cresource_type%2Clocale", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify(row)
    });
    if (!r.ok) throw new Error("Resource pack write failed: " + await r.text());
  }

  const update = await db(env, "lms_curriculum_content_jobs?id=eq." + encodeURIComponent(job.id), {
    method: "PATCH",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      status: "completed",
      completed_at: new Date().toISOString(),
      error_message: null,
      metadata: { ...(job.metadata || {}), generated: true, pending_independent_iqa: true, architecture: "cloudflare-queues" }
    })
  });
  if (!update.ok) throw new Error("Job completion update failed: " + await update.text());
}

async function enqueueFromSupabase(env: Env, queue: Queue, limit = 20) {
  const r = await db(
    env,
    "lms_curriculum_content_jobs?status=eq.queued&job_type=in.(topic_reconciliation,full_resource_pack,resource_expansion)&order=priority.desc,requested_at.asc&limit=" + limit
  );
  if (!r.ok) throw new Error("Could not read curriculum queue: " + await r.text());
  const jobs: any[] = await r.json();
  let queued = 0;
  for (const job of jobs) {
    const claim = await db(env, "lms_curriculum_content_jobs?id=eq." + encodeURIComponent(job.id) + "&status=eq.queued", {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ status: "processing", error_message: null })
    });
    if (!claim.ok) continue;
    await queue.send({ job_id: job.id, job_type: job.job_type });
    queued++;
  }
  return queued;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);
    if (url.pathname === "/health") return json({ ok: true, service: "phenom-curriculum-worker" });

    if (url.pathname === "/enqueue" && request.method === "POST") {
      const body: any = await request.json().catch(() => ({}));
      const jobId = String(body.job_id || "");
      if (!jobId) return json({ error: "job_id is required" }, 400);
      await env.CURRICULUM_QUEUE.send({ job_id: jobId, job_type: body.job_type || "full_resource_pack" });
      return json({ ok: true, queued: jobId });
    }

    return json({ ok: true, service: "phenom-curriculum-worker", mode: "queue-consumer" });
  },

  async scheduled(_controller: ScheduledController, env: Env, ctx: ExecutionContext) {
    ctx.waitUntil(enqueueFromSupabase(env, env.CURRICULUM_QUEUE, 20));
  },

  async queue(batch: MessageBatch<any>, env: Env) {
    for (const message of batch.messages) {
      try {
        const jobId = String(message.body?.job_id || "");
        if (!jobId) throw new Error("Queue message missing job_id");

        const r = await db(
          env,
          "lms_curriculum_content_jobs?id=eq." + encodeURIComponent(jobId) + "&select=*"
        );
        const jobs: any[] = await r.json();
        const job = jobs[0];
        if (!job) {
          message.ack();
          continue;
        }

        if (job.status !== "processing") {
          message.ack();
          continue;
        }

        await processContentJob(env, job);
        message.ack();
      } catch (error) {
        console.error("curriculum queue failure", error);
        const jobId = String(message.body?.job_id || "");
        if (jobId) {
          await db(env, "lms_curriculum_content_jobs?id=eq." + encodeURIComponent(jobId), {
            method: "PATCH",
            headers: { Prefer: "return=minimal" },
            body: JSON.stringify({
              status: "queued",
              error_message: String(error instanceof Error ? error.message : error),
              metadata: { last_failure_at: new Date().toISOString(), architecture: "cloudflare-queues" }
            })
          }).catch(() => undefined);
        }
        message.retry();
      }
    }
  }
};
