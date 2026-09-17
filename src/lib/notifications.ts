import { getSupabase } from './cms';

export type Announcement = {
  id: string;
  title: string;
  body: string;
  linkUrl?: string | null;
  published: boolean;
  floating: boolean;
  startsAt?: string | null;
  endsAt?: string | null;
  createdAt: string;
};

export type UserNotification = {
  id: string;
  title: string;
  body: string;
  linkUrl?: string | null;
  readAt?: string | null;
  createdAt: string;
};

const LOCAL_ANNOUNCEMENTS = 'phenom-announcements-v1';

function fromAnnouncement(row: Record<string, unknown>): Announcement {
  return { id: String(row.id), title: String(row.title ?? ''), body: String(row.body ?? ''), linkUrl: row.link_url ? String(row.link_url) : null, published: Boolean(row.published), floating: Boolean(row.floating), startsAt: row.starts_at ? String(row.starts_at) : null, endsAt: row.ends_at ? String(row.ends_at) : null, createdAt: String(row.created_at ?? new Date().toISOString()) };
}

export async function listActiveAnnouncements(): Promise<Announcement[]> {
  const supabase = getSupabase();
  if (!supabase) {
    if (typeof window === 'undefined') return [];
    try { return (JSON.parse(localStorage.getItem(LOCAL_ANNOUNCEMENTS) || '[]') as Announcement[]).filter(isActive); } catch { return []; }
  }
  const now = new Date().toISOString();
  const { data, error } = await supabase.from('site_announcements').select('*').eq('published', true).or(`starts_at.is.null,starts_at.lte.${now}`).or(`ends_at.is.null,ends_at.gte.${now}`).order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromAnnouncement);
}

export async function listAllAnnouncements(): Promise<Announcement[]> {
  const supabase = getSupabase();
  if (!supabase) return typeof window === 'undefined' ? [] : (JSON.parse(localStorage.getItem(LOCAL_ANNOUNCEMENTS) || '[]') as Announcement[]);
  const { data, error } = await supabase.from('site_announcements').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(fromAnnouncement);
}

export async function saveAnnouncement(input: Omit<Announcement, 'createdAt'> & { createdAt?: string }) {
  const row = { id: input.id || crypto.randomUUID(), title: input.title, body: input.body, link_url: input.linkUrl || null, published: input.published, floating: input.floating, starts_at: input.startsAt || null, ends_at: input.endsAt || null, created_at: input.createdAt || new Date().toISOString() };
  const supabase = getSupabase();
  if (!supabase) {
    const current = typeof window === 'undefined' ? [] : (JSON.parse(localStorage.getItem(LOCAL_ANNOUNCEMENTS) || '[]') as Announcement[]);
    const next = [fromAnnouncement(row), ...current.filter(a => a.id !== row.id)];
    if (typeof window !== 'undefined') localStorage.setItem(LOCAL_ANNOUNCEMENTS, JSON.stringify(next));
    return;
  }
  const { error } = await supabase.from('site_announcements').upsert(row);
  if (error) throw error;
}

export async function deleteAnnouncement(id: string) {
  const supabase = getSupabase();
  if (!supabase) {
    if (typeof window !== 'undefined') localStorage.setItem(LOCAL_ANNOUNCEMENTS, JSON.stringify((JSON.parse(localStorage.getItem(LOCAL_ANNOUNCEMENTS) || '[]') as Announcement[]).filter(a => a.id !== id)));
    return;
  }
  const { error } = await supabase.from('site_announcements').delete().eq('id', id);
  if (error) throw error;
}

export async function subscribeEmail(email: string) {
  const normalized = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error('Please enter a valid email address.');
  const supabase = getSupabase();
  if (!supabase) throw new Error('Email subscriptions will activate after Supabase is connected.');
  const { error } = await supabase.from('email_subscribers').upsert({ email: normalized, active: true, marketing_opt_in: true }, { onConflict: 'email' });
  if (error) throw error;
}

export async function listMyNotifications(): Promise<UserNotification[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase.from('user_notifications').select('*').order('created_at', { ascending: false }).limit(50);
  if (error) throw error;
  return (data ?? []).map((row: Record<string, unknown>) => ({ id: String(row.id), title: String(row.title ?? ''), body: String(row.body ?? ''), linkUrl: row.link_url ? String(row.link_url) : null, readAt: row.read_at ? String(row.read_at) : null, createdAt: String(row.created_at ?? '') }));
}

export async function markNotificationRead(id: string) {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.from('user_notifications').update({ read_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

function isActive(a: Announcement) {
  const now = Date.now();
  return a.published && (!a.startsAt || new Date(a.startsAt).getTime() <= now) && (!a.endsAt || new Date(a.endsAt).getTime() >= now);
}
