export interface Env {
  SUPABASE_URL: string;
  SUPABASE_SERVICE_ROLE_KEY: string;
  LMS_QUEUE: Queue;
  LMS_ASSETS: R2Bucket;
}

export default {
  async fetch(): Promise<Response> {
    return Response.json({
      service: "phenom-lms-background",
      status: "ok",
      architecture: "Cloudflare Worker + Queues + R2 + Supabase"
    });
  }
};
