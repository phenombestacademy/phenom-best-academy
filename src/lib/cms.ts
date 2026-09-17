import { createClient, type SupabaseClient } from "@supabase/supabase-js";

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

export function getSupabase(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = (
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY
  ) as string | undefined;

  if (!url || !key) return null;

  return createClient(url, key);
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
    body.style.background = `linear-gradient(rgb(13 21 34 / .12),rgb(13 21 34 / .12)),url(${settings.backgroundImageUrl}) center/cover fixed`;
  } else if (settings.backgroundMode === "pattern") {
    body.style.backgroundColor = settings.background;

    const patterns: Record<string, string> = {
      none: "",
      dots:
        "radial-gradient(circle, color-mix(in srgb, " +
        settings.accent +
        " 22%, transparent) 1.2px, transparent 1.2px)",
      grid:
        "linear-gradient(color-mix(in srgb, " +
        settings.accent2 +
        " 12%, transparent) 1px, transparent 1px),linear-gradient(90deg,color-mix(in srgb," +
        settings.accent2 +
        " 12%, transparent) 1px,transparent 1px)",
      diagonal:
        "repeating-linear-gradient(135deg,color-mix(in srgb, " +
        settings.accent +
        " 9%, transparent) 0 2px,transparent 2px 14px)",
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
    background: String(
      data.background || defaultSettings.background,
    ),
    surface: String(data.surface || defaultSettings.surface),
    accent: String(data.accent || defaultSettings.accent),
    accent2: String(data.accent2 || defaultSettings.accent2),
    text: String(data.text || defaultSettings.text),
    muted: String(data.muted || defaultSettings.muted),
    animation:
      (data.animation as SiteSettings["animation"]) ||
      defaultSettings.animation,
    logoUrl: String(
      data.logo_url || defaultSettings.logoUrl,
    ),
    backgroundMode:
      (data.background_mode as BackgroundMode) ||
      defaultSettings.backgroundMode,
    backgroundImageUrl: String(
      data.background_image_url || "",
    ),
    gradientStart: String(
      data.gradient_start || defaultSettings.gradientStart,
    ),
    gradientEnd: String(
      data.gradient_end || defaultSettings.gradientEnd,
    ),
    gradientAngle: Number(data.gradient_angle || 135),
    pattern: String(data.pattern || "none"),
    fontScale: Number(data.font_scale || 1),
  };

  saveLocalSettings(settings);

  return settings;
}

export async function saveSiteSettings(
  settings: SiteSettings,
) {
  saveLocalSettings(settings);

  const supabase = getSupabase();

  if (!supabase) return;

  const { error } = await supabase
    .from("site_settings")
    .upsert({
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
      background_image_url:
        settings.backgroundImageUrl || null,
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
    publicLabel: String(
      r.public_label || r.provider,
    ),
    publicNote: r.public_note
      ? String(r.public_note)
      : null,
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

  return (data ?? []).map(
    (r: Record<string, unknown>) =>
      mapPaymentProvider(r),
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
      direct_bank_name:
        input.directBankName || null,
      direct_account_name:
        input.directAccountName || null,
      direct_account_number:
        input.directAccountNumber || null,
      direct_instructions:
        input.directInstructions || null,
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

  return (data ?? []).map(
    (r: Record<string, unknown>) =>
      mapPaymentProvider(r),
  );
}

export function makeMediaId() {
  return `media-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export async function listPublishedMedia(): Promise<
  MediaItem[]
> {
  const supabase = getSupabase();

  if (!supabase) {
    return getLocalMedia().filter(
      (item) => item.published,
    );
  }

  const { data, error } = await supabase
    .from("media_items")
    .select("*")
    .eq("published", true)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return (data ?? []).map(fromRow);
}

export async function listAllMedia(): Promise<
  MediaItem[]
> {
  const supabase = getSupabase();

  if (!supabase) return getLocalMedia();

  const { data, error } = await supabase
    .from("media_items")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return (data ?? []).map(fromRow);
}

export async function saveMedia(
  item: MediaItem,
) {
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

  const { error } = await supabase
    .from("media_items")
    .upsert(toRow(item));

  if (error) throw error;
}

export async function deleteMedia(
  id: string,
) {
  const supabase = getSupabase();

  if (!supabase) {
    saveLocalMedia(
      getLocalMedia().filter(
        (item) => item.id !== id,
      ),
    );
    return;
  }

  const { error } = await supabase
    .from("media_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/**
 * Upload a permanent Academy media file.
 *
 * IMPORTANT:
 * - There is intentionally NO artificial 500 MB frontend limit here.
 * - The Supabase Storage policies remain the real authorization layer.
 * - Only the Super Admin should be able to write to the permanent
 *   Academy media bucket/library.
 * - The function returns the public URL after a successful upload.
 *
 * Actual maximum file size can still be affected by Supabase plan/storage
 * configuration, browser/network limits, and the upload method.
 */
export async function uploadMediaFile(
  file: File,
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
    throw new Error(
      "This file type is not supported.",
    );
  }

  const safe = file.name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-");

  const randomId =
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random()
          .toString(36)
          .slice(2);

  const path = `academy/${Date.now()}-${randomId}-${safe}`;

  const { error } = await supabase.storage
    .from("media")
    .upload(path, file, {
      upsert: false,
      contentType:
        file.type || undefined,
      cacheControl: "3600",
    });

  if (error) throw error;

  return supabase.storage
    .from("media")
    .getPublicUrl(path)
    .data.publicUrl;
}

function toRow(i: MediaItem) {
  return {
    id: i.id,
    title: i.title,
    description: i.description,
    kind: i.kind,
    source: i.source,
    url: i.url,
    thumbnail_url:
      i.thumbnailUrl ?? null,
    download_url:
      i.downloadUrl ?? null,
    published: i.published,
    featured: i.featured,
    created_at: i.createdAt,
  };
}

function fromRow(
  r: Record<string, unknown>,
): MediaItem {
  return {
    id: String(r.id),
    title: String(r.title ?? ""),
    description: String(
      r.description ?? "",
    ),
    kind: r.kind as MediaKind,
    source:
      r.source as "upload" | "external",
    url: String(r.url ?? ""),
    thumbnailUrl: r.thumbnail_url
      ? String(r.thumbnail_url)
      : undefined,
    downloadUrl: r.download_url
      ? String(r.download_url)
      : undefined,
    published: Boolean(r.published),
    featured: Boolean(r.featured),
    createdAt: String(
      r.created_at ??
        new Date().toISOString(),
    ),
  };
}
