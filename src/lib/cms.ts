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

let browserSupabase: SupabaseClient | null | undefined;

export function getSupabase(): SupabaseClient | null {
  if (browserSupabase !== undefined) return browserSupabase;

  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = (
    import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    import.meta.env.VITE_SUPABASE_ANON_KEY
  ) as string | undefined;

  if (!url || !key) {
    browserSupabase = null;
    return browserSupabase;
  }

  browserSupabase = createClient(url, key, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  });

  return browserSupabase;
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
