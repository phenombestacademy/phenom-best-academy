import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import * as tus from "tus-js-client";

export type MediaKind =
  | "picture"
  | "video"
  | "song"
  | "sound"
  | "resource"
  | "learning"
  | "news"
  | "link";

export type MediaItem = {
  id: string;
  title: string;
  description: string;
  kind: MediaKind;
  source: "upload" | "external";
  url: string;
  thumbnailUrl?: string;
  downloadUrl?: string;
  published: boolean;
  featured: boolean;
  createdAt: string;
};

export type BackgroundMode = "solid" | "gradient" | "image" | "pattern";

export type SiteSettings = {
  background: string;
  surface: string;
  accent: string;
  accent2: string;
  text: string;
  muted: string;
  animation: "refined" | "minimal" | "off";
  logoUrl: string;
  backgroundMode: BackgroundMode;
  backgroundImageUrl: string;
  gradientStart: string;
  gradientEnd: string;
  gradientAngle: number;
  pattern: string;
  fontScale: number;
};

export const defaultSettings: SiteSettings = {
  background: "#f4efe6",
  surface: "#fbf8f2",
  accent: "#c94b16",
  accent2: "#1a4a8c",
  text: "#152238",
  muted: "#4c5d73",
  animation: "refined",
  logoUrl: "/brand/academy-logo-primary.png",
  backgroundMode: "solid",
  backgroundImageUrl: "",
  gradientStart: "#f4efe6",
  gradientEnd: "#fbf8f2",
  gradientAngle: 135,
  pattern: "none",
  fontScale: 1,
};

const MEDIA_KEY = "phenom-cms-media-v1";
const SETTINGS_KEY = "phenom-cms-settings-v2";

let supabaseClient: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (supabaseClient !== undefined) return supabaseClient;

  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = (
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY
  ) as string | undefined;

  if (!url || !key) {
    supabaseClient = null;
    return supabaseClient;
  }

  supabaseClient = createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  return supabaseClient;
}

export function getLocalMedia(): MediaItem[] {
  if (typeof window === "undefined") return [];

  try {
    return JSON.parse(
      localStorage.getItem(MEDIA_KEY) || "[]",
    ) as MediaItem[];
  } catch {
    return [];
  }
}

export function saveLocalMedia(items: MediaItem[]) {
  localStorage.setItem(MEDIA_KEY, JSON.stringify(items));
}

export function getLocalSettings(): SiteSettings {
  if (typeof window === "undefined") return defaultSettings;

  try {
    return {
      ...defaultSettings,
      ...(JSON.parse(
        localStorage.getItem(SETTINGS_KEY) || "{}",
      ) as Partial<SiteSettings>),
    };
  } catch {
    return defaultSettings;
  }
}

export function saveLocalSettings(settings: SiteSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  applySettings(settings);
}

export function applySettings(settings: SiteSettings) {
  if (typeof document === "undefined") return;

  const root = document.documentElement;

  root.style.setProperty("--cms-background", settings.background);
  root.style.setProperty("--cms-surface", settings.surface);
  root.style.setProperty("--cms-accent", settings.accent);
  root.style.setProperty("--cms-accent2", settings.accent2);
  root.style.setProperty("--cms-text", settings.text);
  root.style.setProperty("--cms-muted", settings.muted);
  root.style.setProperty("--cms-font-scale", String(settings.fontScale));
  root.dataset.cmsAnimation = settings.animation;

  const body = document.body;

  if (settings.backgroundMode === "gradient") {
    body.style.background = `linear-gradient(${settings.gradientAngle}deg, ${settings.gradientStart}, ${settings.gradientEnd})`;
  } else if (
    settings.backgroundMode === "image" &&
    settings.backgroundImageUrl
  ) {
    body.style.background =
      `linear-gradient(rgb(13 21 34 / .12),rgb(13 21 34 / .12)),url(${settings.backgroundImageUrl}) center/cover fixed`;
  } else if (settings.backgroundMode === "pattern") {
    body.style.backgroundColor = settings.background;

    const patterns: Record<string, string> = {
      none: "",
      dots:
        `radial-gradient(circle, color-mix(in srgb, ${settings.accent} 22%, transparent) 1.2px, transparent 1.2px)`,
      grid:
        `linear-gradient(color-mix(in srgb, ${settings.accent2} 12%, transparent) 1px, transparent 1px),linear-gradient(90deg,color-mix(in srgb, ${settings.accent2} 12%, transparent) 1px,transparent 1px)`,
      diagonal:
        `repeating-linear-gradient(135deg,color-mix(in srgb, ${settings.accent} 9%, transparent) 0 2px,transparent 2px 14px)`,
    };

    body.style.backgroundImage = patterns[settings.pattern] || "";
    body.style.backgroundSize =
      settings.pattern === "dots"
        ? "18px 18px"
        : settings.pattern === "grid"
          ? "24px 24px"
          : "auto";
  } else {
    body.style.backgroundImage = "";
    body.style.background = settings.background;
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const supabase = getSupabase();

  if (!supabase) return getLocalSettings();

  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return getLocalSettings();

  const settings: SiteSettings = {
    ...defaultSettings,
    background: String(data.background || defaultSettings.background),
    surface: String(data.surface || defaultSettings.surface),
    accent: String(data.accent || defaultSettings.accent),
    accent2: String(data.accent2 || defaultSettings.accent2),
    text: String(data.text || defaultSettings.text),
    muted: String(data.muted || defaultSettings.muted),
    animation:
      (data.animation as SiteSettings["animation"]) ||
      defaultSettings.animation,
    logoUrl: String(data.logo_url || defaultSettings.logoUrl),
    backgroundMode:
      (data.background_mode as BackgroundMode) ||
      defaultSettings.backgroundMode,
    backgroundImageUrl: String(data.background_image_url || ""),
    gradientStart: String(
      data.gradient_start || defaultSettings.gradientStart,
    ),
    gradientEnd: String(data.gradient_end || defaultSettings.gradientEnd),
    gradientAngle: Number(data.gradient_angle || 135),
    pattern: String(data.pattern || "none"),
    fontScale: Number(data.font_scale || 1),
  };

  saveLocalSettings(settings);
  return settings;
}

export async function saveSiteSettings(settings: SiteSettings) {
  saveLocalSettings(settings);

  const supabase = getSupabase();

  if (!supabase) return;

  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    background: settings.background,
    surface: settings.surface,
    accent: settings.accent,
    accent2: settings.accent2,
    text: settings.text,
    muted: settings.muted,
    animation: settings.animation,
    logo_url: settings.logoUrl,
    background_mode: settings.backgroundMode,
    background_image_url: settings.backgroundImageUrl || null,
    gradient_start: settings.gradientStart,
    gradient_end: settings.gradientEnd,
    gradient_angle: settings.gradientAngle,
    pattern: settings.pattern,
    font_scale: settings.fontScale,
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export type PaymentProviderPublic = {
  provider: string;
  enabled: boolean;
  publicLabel: string;
  publicNote?: string | null;
  directBankName?: string | null;
  directAccountName?: string | null;
  directAccountNumber?: string | null;
  directInstructions?: string | null;
};

function mapPaymentProvider(
  r: Record<string, unknown>,
): PaymentProviderPublic {
  return {
    provider: String(r.provider),
    enabled: Boolean(r.enabled),
    publicLabel: String(r.public_label || r.provider),
    publicNote: r.public_note ? String(r.public_note) : null,
    directBankName: r.direct_bank_name
      ? String(r.direct_bank_name)
      : null,
    directAccountName: r.direct_account_name
      ? String(r.direct_account_name)
      : null,
    directAccountNumber: r.direct_account_number
      ? String(r.direct_account_number)
      : null,
    directInstructions: r.direct_instructions
      ? String(r.direct_instructions)
      : null,
  };
}

export async function listAllPaymentProviders(): Promise<
  PaymentProviderPublic[]
> {
  const supabase = getSupabase();

  if (!supabase) return [];

  const { data, error } = await supabase
    .from("payment_provider_settings")
    .select("*")
    .order("provider");

  if (error) throw error;

  return (data ?? []).map((row) =>
    mapPaymentProvider(row as Record<string, unknown>),
  );
}

export async function savePaymentProvider(
  input: PaymentProviderPublic,
) {
  const supabase = getSupabase();

  if (!supabase) {
    throw new Error("Connect Supabase first.");
  }

  const { error } = await supabase
    .from("payment_provider_settings")
    .update({
      enabled: input.enabled,
      public_label: input.publicLabel,
      public_note: input.publicNote || null,
      direct_bank_name: input.directBankName || null,
      direct_account_name: input.directAccountName || null,
      direct_account_number: input.directAccountNumber || null,
      direct_instructions: input.directInstructions || null,
      updated_at: new Date().toISOString(),
    })
    .eq("provider", input.provider);

  if (error) throw error;
}

export async function listPaymentProviders(): Promise<
  PaymentProviderPublic[]
> {
  const supabase = getSupabase();

  if (!supabase) return [];

  const { data, error } = await supabase
    .from("payment_provider_settings")
    .select("*")
    .eq("enabled", true)
    .order("provider");

  if (error) throw error;

  return (data ?? []).map((row) =>
    mapPaymentProvider(row as Record<string, unknown>),
  );
}

/**
 * Generate a valid PostgreSQL UUID.
 *
 * media_items.id is a UUID column, so do not use IDs such as
 * "media-123456789".
 */
export function makeMediaId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  throw new Error(
    "Secure UUID generation is unavailable in this browser.",
  );
}

/**
 * Convert the application's MediaItem shape to the actual
 * Supabase media_items table shape.
 *
 * Actual database columns:
 * id
 * title
 * description
 * media_url
 * media_type
 * category
 * published
 * created_at
 * updated_at
 *
 * Do not send UI-only fields that do not exist in the table.
 */
function toRow(item: MediaItem) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    media_url: item.url,
    media_type: item.kind,
    category: item.kind,
    published: item.published,
    created_at: item.createdAt,
    updated_at: new Date().toISOString(),
  };
}

/**
 * Convert the actual Supabase media_items row back into
 * the application's MediaItem shape.
 */
function fromRow(row: Record<string, unknown>): MediaItem {
  const mediaType = String(row.media_type ?? "resource");

  const validKinds: MediaKind[] = [
    "picture",
    "video",
    "song",
    "sound",
    "resource",
    "learning",
    "news",
    "link",
  ];

  const kind: MediaKind = validKinds.includes(
    mediaType as MediaKind,
  )
    ? (mediaType as MediaKind)
    : "resource";

  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    kind,
    source: "external",
    url: String(row.media_url ?? ""),
    published: Boolean(row.published),
    featured: false,
    createdAt: String(
      row.created_at ?? new Date().toISOString(),
    ),
  };
}

export async function listPublishedMedia(): Promise<MediaItem[]> {
  const supabase = getSupabase();

  if (!supabase) {
    return getLocalMedia().filter((item) => item.published);
  }

  const { data, error } = await supabase
    .from("media_items")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) =>
    fromRow(row as Record<string, unknown>),
  );
}

export async function listAllMedia(): Promise<MediaItem[]> {
  const supabase = getSupabase();

  if (!supabase) return getLocalMedia();

  const { data, error } = await supabase
    .from("media_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row) =>
    fromRow(row as Record<string, unknown>),
  );
}

export async function saveMedia(item: MediaItem) {
  const supabase = getSupabase();

  if (!supabase) {
    saveLocalMedia([
      item,
      ...getLocalMedia().filter(
        (existing) => existing.id !== item.id,
      ),
    ]);
    return;
  }

  const row = toRow(item);

  const { error } = await supabase
    .from("media_items")
    .upsert(row, { onConflict: "id" });

  if (error) throw error;
}

export async function deleteMedia(id: string) {
  const supabase = getSupabase();

  if (!supabase) {
    saveLocalMedia(
      getLocalMedia().filter((item) => item.id !== id),
    );
    return;
  }

  const { error } = await supabase
    .from("media_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export type UploadProgress = {
  percentage: number;
  bytesUploaded: number;
  bytesTotal: number;
  phase:
    | "starting"
    | "uploading"
    | "finalizing"
    | "complete";
};

export type UploadProgressCallback = (
  progress: UploadProgress,
) => void;

/**
 * Permanent Academy media upload.
 *
 * Authorization is deliberately not handled by a client-side role flag.
 * Supabase Storage RLS remains the authorization boundary.
 *
 * Supabase recommends TUS resumable uploads for large files and for
 * progress events. We use TUS for every upload here so the Admin Studio
 * can display real progress consistently, including on mobile networks.
 */
export async function uploadMediaFile(
  file: File,
  onProgress?: UploadProgressCallback,
): Promise<string> {
  const supabase = getSupabase();

  if (!supabase) {
    throw new Error(
      "Media upload requires Supabase storage and an authorised account.",
    );
  }

  const allowed =
    /^(image\/|video\/|audio\/|application\/(pdf|msword|rtf|zip|epub\+zip|json|csv)|text\/(plain|csv|markdown)|application\/vnd\.(openxmlformats-officedocument\.|ms-excel|ms-powerpoint))/i;

  if (file.type && !allowed.test(file.type)) {
    throw new Error("This file type is not supported.");
  }

  const safe = file.name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-");

  const randomId =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  const path = `academy/${Date.now()}-${randomId}-${safe}`;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error(
      "Please sign in with the authorised Super Admin account before uploading Academy media.",
    );
  }

  const projectUrl = import.meta.env.VITE_SUPABASE_URL as
    | string
    | undefined;

  if (!projectUrl) {
    throw new Error("Supabase project configuration is missing.");
  }

  let projectId = "";

  try {
    projectId = new URL(projectUrl).hostname.split(".")[0];
  } catch {
    throw new Error("Supabase project URL is invalid.");
  }

  if (!projectId) {
    throw new Error(
      "Supabase project reference could not be determined.",
    );
  }

  onProgress?.({
    percentage: 0,
    bytesUploaded: 0,
    bytesTotal: file.size,
    phase: "starting",
  });

  const publicUrl = supabase.storage
    .from("media")
    .getPublicUrl(path).data.publicUrl;

  await new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${session.access_token}`,
        "x-upsert": "false",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      chunkSize: 6 * 1024 * 1024,
      metadata: {
        bucketName: "media",
        objectName: path,
        contentType:
          file.type || "application/octet-stream",
        cacheControl: "3600",
      },
      onError: (error) => reject(error),
      onProgress: (bytesUploaded, bytesTotal) => {
        onProgress?.({
          percentage:
            bytesTotal > 0
              ? Math.min(
                  99,
                  (bytesUploaded / bytesTotal) * 100,
                )
              : 0,
          bytesUploaded,
          bytesTotal,
          phase: "uploading",
        });
      },
      onSuccess: () => {
        onProgress?.({
          percentage: 100,
          bytesUploaded: file.size,
          bytesTotal: file.size,
          phase: "finalizing",
        });

        resolve();
      },
    });

    void upload
      .findPreviousUploads()
      .then((previousUploads) => {
        if (previousUploads.length > 0) {
          upload.resumeFromPreviousUpload(
            previousUploads[0],
          );
        }

        upload.start();
      })
      .catch(reject);
  });

  onProgress?.({
    percentage: 100,
    bytesUploaded: file.size,
    bytesTotal: file.size,
    phase: "complete",
  });

  return publicUrl;
}


export type CurriculumLibraryItem = {
  id: string; title: string; itemType: string; curriculumId: string | null; topicId: string | null; topicTitle: string | null; topicCode: string | null; assetId: string | null; externalResourceId: string | null; externalUrl: string | null; storageBucket: string | null; storagePath: string | null; mimeType: string | null; fileSize: number | null; viewable: boolean; downloadable: boolean; canView: boolean; canDownload: boolean; status: string | null;
};

export async function listCurriculumLibrary(options: { query?: string; topicId?: string; curriculumId?: string; limit?: number } = {}): Promise<CurriculumLibraryItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data: links, error: linkError } = await supabase.from("lms_curriculum_library_topic_links").select("library_item_id,topic_id,alignment_status").in("alignment_status", ["origin", "verified", "candidate"]);
  if (linkError) throw linkError;
  const linkRows = (links ?? []) as Record<string, unknown>[];
  const linkMap = new Map<string, string>();
  for (const row of linkRows) { const itemId = String(row.library_item_id); if (!linkMap.has(itemId)) linkMap.set(itemId, String(row.topic_id)); }
  if (options.topicId) for (const row of linkRows) if (String(row.topic_id) === options.topicId) linkMap.set(String(row.library_item_id), options.topicId);

  let itemQuery = supabase.from("lms_curriculum_library_items").select("id,title,item_type,curriculum_id,topic_id,asset_id,external_resource_id").order("created_at", { ascending: false }).limit(options.limit ?? 200);
  if (options.curriculumId) itemQuery = itemQuery.eq("curriculum_id", options.curriculumId);
  if (options.query?.trim()) itemQuery = itemQuery.ilike("title", "%" + options.query.trim() + "%");
  const { data: items, error: itemError } = await itemQuery;
  if (itemError) throw itemError;
  const itemRows = (items ?? []) as Record<string, unknown>[];
  const selectedItems = options.topicId ? itemRows.filter((r) => linkMap.get(String(r.id)) === options.topicId) : itemRows;
  const assetIds = Array.from(new Set(selectedItems.map((r) => r.asset_id).filter(Boolean).map(String)));
  const externalIds = Array.from(new Set(selectedItems.map((r) => r.external_resource_id).filter(Boolean).map(String)));

  let assets: Record<string, unknown>[] = [];
  if (assetIds.length) {
    const { data, error } = await supabase.from("lms_curriculum_assets").select("id,storage_bucket,storage_path,mime_type,file_size,viewable,downloadable,status,visibility").in("id", assetIds);
    if (error) throw error;
    assets = (data ?? []) as Record<string, unknown>[];
  }
  const assetMap = new Map(assets.map((a) => [String(a.id), a]));
  let externalResources: Record<string, unknown>[] = [];
  if (externalIds.length) {
    const { data, error } = await supabase.from("lms_curriculum_external_resources").select("id,official_url,title").in("id", externalIds);
    if (error) throw error;
    externalResources = (data ?? []) as Record<string, unknown>[];
  }
  const externalMap = new Map(externalResources.map((r) => [String(r.id), r]));
  const topicIds = Array.from(new Set(selectedItems.map((r) => linkMap.get(String(r.id)) ?? r.topic_id).filter(Boolean).map(String)));
  let topics: Record<string, unknown>[] = [];
  if (topicIds.length) {
    const { data, error } = await supabase.from("lms_curriculum_topics").select("id,curriculum_id,topic_title,topic_code,active").in("id", topicIds);
    if (error) throw error;
    topics = (data ?? []) as Record<string, unknown>[];
  }
  const topicMap = new Map(topics.map((t) => [String(t.id), t]));
  const currentUser = (await supabase.auth.getUser()).data.user;
  const permissionMap = new Map<string, { view: boolean; download: boolean }>();
  if (currentUser && assetIds.length) {
    const { data, error } = await supabase.from("lms_curriculum_asset_permissions").select("asset_id,user_id,can_view,can_download,expires_at").eq("user_id", currentUser.id).in("asset_id", assetIds);
    if (error) throw error;
    for (const row of (data ?? []) as Record<string, unknown>[]) {
      const expired = row.expires_at && new Date(String(row.expires_at)).getTime() <= Date.now();
      if (!expired) permissionMap.set(String(row.asset_id), { view: Boolean(row.can_view), download: Boolean(row.can_download) });
    }
  }
  return selectedItems.map((row) => {
    const asset = row.asset_id ? assetMap.get(String(row.asset_id)) : undefined;
    const external = row.external_resource_id ? externalMap.get(String(row.external_resource_id)) : undefined;
    const topicId = linkMap.get(String(row.id)) ?? (row.topic_id ? String(row.topic_id) : null);
    const topic = topicId ? topicMap.get(topicId) : undefined;
    const permission = row.asset_id ? permissionMap.get(String(row.asset_id)) : undefined;
    const assetViewable = asset ? Boolean(asset.viewable) : false;
    const assetDownloadable = asset ? Boolean(asset.downloadable) : false;
    const visibility = asset ? String(asset.visibility ?? "") : "";
    const publicAsset = visibility === "public" || visibility === "authenticated";
    const canView = asset ? assetViewable && (publicAsset || Boolean(permission?.view)) : true;
    const canDownload = asset ? assetDownloadable && (publicAsset || Boolean(permission?.download)) : false;
    return { id: String(row.id), title: String(row.title ?? ""), itemType: String(row.item_type ?? "resource"), curriculumId: row.curriculum_id ? String(row.curriculum_id) : null, topicId, topicTitle: topic?.topic_title ? String(topic.topic_title) : null, topicCode: topic?.topic_code ? String(topic.topic_code) : null, assetId: row.asset_id ? String(row.asset_id) : null, externalResourceId: row.external_resource_id ? String(row.external_resource_id) : null, externalUrl: external?.official_url ? String(external.official_url) : null, storageBucket: asset?.storage_bucket ? String(asset.storage_bucket) : null, storagePath: asset?.storage_path ? String(asset.storage_path) : null, mimeType: asset?.mime_type ? String(asset.mime_type) : null, fileSize: asset?.file_size == null ? null : Number(asset.file_size), viewable: assetViewable, downloadable: assetDownloadable, canView, canDownload, status: asset?.status ? String(asset.status) : null };
  }).filter((item) => item.canView || Boolean(item.externalUrl));
}

export async function getCurriculumAssetUrl(item: CurriculumLibraryItem, mode: "view" | "download" = "view"): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase || !item.storageBucket || !item.storagePath) return null;
  if (mode === "download" && !item.canDownload) return null;
  if (mode === "view" && !item.canView) return null;
  const bucket = supabase.storage.from(item.storageBucket);
  const { data, error } = await bucket.createSignedUrl(item.storagePath, 3600, mode === "download" ? { download: true } : undefined);
  if (error) throw error;
  return data?.signedUrl ?? null;
}

export async function uploadCurriculumLibraryFile(
  file: File,
  options: { title?: string; curriculumId?: string; itemType?: string } = {},
  onProgress?: UploadProgressCallback,
): Promise<{ assetId: string; libraryItemId: string; url: string }> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Connect Supabase first.");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Please sign in before uploading a Library resource.");

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();
  if (profileError) throw profileError;
  if (profile?.role !== "super_admin") {
    throw new Error("Only Super Admin can add or replace authoritative Library resources.");
  }

  const safe = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const assetId = makeMediaId();
  const path = `nigeria-nerdc/supplied/${assetId}/${safe}`;
  const bucketName = "phenom-curriculum-assets";
  const projectUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  if (!projectUrl) throw new Error("Supabase project configuration is missing.");
  const projectId = new URL(projectUrl).hostname.split(".")[0];
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.access_token) throw new Error("Please sign in again before uploading.");

  onProgress?.({ percentage: 0, bytesUploaded: 0, bytesTotal: file.size, phase: "starting" });

  await new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: { authorization: `Bearer ${session.access_token}`, "x-upsert": "false" },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      chunkSize: 6 * 1024 * 1024,
      metadata: {
        bucketName,
        objectName: path,
        contentType: file.type || "application/octet-stream",
        cacheControl: "31536000",
      },
      onError: reject,
      onProgress: (bytesUploaded, bytesTotal) => onProgress?.({
        percentage: bytesTotal ? Math.min(99, bytesUploaded / bytesTotal * 100) : 0,
        bytesUploaded, bytesTotal, phase: "uploading",
      }),
      onSuccess: () => {
        onProgress?.({ percentage: 100, bytesUploaded: file.size, bytesTotal: file.size, phase: "finalizing" });
        resolve();
      },
    });
    void upload.findPreviousUploads().then(previous => {
      if (previous.length) upload.resumeFromPreviousUpload(previous[0]);
      upload.start();
    }).catch(reject);
  });

  const now = new Date().toISOString();
  const { data: asset, error: assetError } = await supabase
    .from("lms_curriculum_assets")
    .insert({
      id: assetId,
      curriculum_id: options.curriculumId || "nigeria-nerdc",
      asset_type: "source_document",
      format: file.name.split(".").pop()?.toLowerCase() || "bin",
      title: options.title || file.name,
      status: "published",
      storage_bucket: bucketName,
      storage_path: path,
      mime_type: file.type || "application/octet-stream",
      file_size: file.size,
      version: 1,
      visibility: "public",
      downloadable: true,
      viewable: true,
      editable: false,
      generation_source: "verified_user_supplied",
      generator_metadata: { original_name: file.name, uploaded_by: user.id },
      generated_at: now,
      stored_at: now,
      published_at: now,
      updated_at: now,
    })
    .select("id")
    .single();
  if (assetError) {
    await supabase.storage.from(bucketName).remove([path]);
    throw assetError;
  }

  const { data: libraryItem, error: libraryError } = await supabase
    .from("lms_curriculum_library_items")
    .insert({
      id: makeMediaId(),
      curriculum_id: options.curriculumId || "nigeria-nerdc",
      asset_id: asset.id,
      title: options.title || file.name,
      item_type: options.itemType || "source_document",
      source_class: "verified_user_supplied",
      access_class: "public",
      licence_status: "verified_user_supplied",
      storage_status: "stored",
      public_status: "published",
      qc_status: "passed",
      metadata: { canonical_asset_id: asset.id, original_name: file.name },
      updated_at: now,
    })
    .select("id")
    .single();
  if (libraryError) throw libraryError;

  const url = supabase.storage.from(bucketName).getPublicUrl(path).data.publicUrl;
  onProgress?.({ percentage: 100, bytesUploaded: file.size, bytesTotal: file.size, phase: "complete" });
  return { assetId: asset.id, libraryItemId: libraryItem.id, url };
}
