import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type MediaKind = "picture" | "video" | "song" | "sound" | "resource" | "learning" | "news" | "link";
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

export type SiteSettings = {
  background: string;
  surface: string;
  accent: string;
  animation: "refined" | "minimal" | "off";
  logoUrl: string;
};

export const defaultSettings: SiteSettings = {
  background: "#f4efe6",
  surface: "#fbf8f2",
  accent: "#c94b16",
  animation: "refined",
  logoUrl: "/brand/logo-full-clear.png",
};

const MEDIA_KEY = "phenom-cms-media-v1";
const SETTINGS_KEY = "phenom-cms-settings-v1";

export function getSupabase(): SupabaseClient | null {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !key) return null;
  return createClient(url, key);
}

export function getLocalMedia(): MediaItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(MEDIA_KEY) || "[]") as MediaItem[];
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
    return { ...defaultSettings, ...(JSON.parse(localStorage.getItem(SETTINGS_KEY) || "{}") as Partial<SiteSettings>) };
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
  document.documentElement.style.setProperty("--cms-background", settings.background);
  document.documentElement.style.setProperty("--cms-surface", settings.surface);
  document.documentElement.style.setProperty("--cms-accent", settings.accent);
  document.documentElement.dataset.cmsAnimation = settings.animation;
}

export function makeMediaId() {
  return `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function listPublishedMedia(): Promise<MediaItem[]> {
  const supabase = getSupabase();
  if (!supabase) return getLocalMedia().filter((item) => item.published);
  const { data, error } = await supabase.from("media_items").select("*").eq("published", true).order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function listAllMedia(): Promise<MediaItem[]> {
  const supabase = getSupabase();
  if (!supabase) return getLocalMedia();
  const { data, error } = await supabase.from("media_items").select("*").order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromRow);
}

export async function saveMedia(item: MediaItem) {
  const supabase = getSupabase();
  if (!supabase) {
    const items = getLocalMedia().filter((existing) => existing.id !== item.id);
    saveLocalMedia([item, ...items]);
    return;
  }
  const { error } = await supabase.from("media_items").upsert(toRow(item));
  if (error) throw error;
}

export async function deleteMedia(id: string) {
  const supabase = getSupabase();
  if (!supabase) {
    saveLocalMedia(getLocalMedia().filter((item) => item.id !== id));
    return;
  }
  const { error } = await supabase.from("media_items").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadMediaFile(file: File): Promise<string> {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Direct uploads require the connected CMS storage. Add the Supabase environment settings first.");
  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, "-");
  const path = `${Date.now()}-${safeName}`;
  const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false, contentType: file.type || undefined });
  if (error) throw error;
  const { data } = supabase.storage.from("media").getPublicUrl(path);
  return data.publicUrl;
}

function toRow(item: MediaItem) {
  return {
    id: item.id,
    title: item.title,
    description: item.description,
    kind: item.kind,
    source: item.source,
    url: item.url,
    thumbnail_url: item.thumbnailUrl ?? null,
    download_url: item.downloadUrl ?? null,
    published: item.published,
    featured: item.featured,
    created_at: item.createdAt,
  };
}

function fromRow(row: Record<string, unknown>): MediaItem {
  return {
    id: String(row.id),
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    kind: row.kind as MediaKind,
    source: row.source as "upload" | "external",
    url: String(row.url ?? ""),
    thumbnailUrl: row.thumbnail_url ? String(row.thumbnail_url) : undefined,
    downloadUrl: row.download_url ? String(row.download_url) : undefined,
    published: Boolean(row.published),
    featured: Boolean(row.featured),
    createdAt: String(row.created_at ?? new Date().toISOString()),
  };
}
