import { getSupabase } from './cms';

export type Profile = {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'parent' | 'staff' | 'admin' | 'super_admin';
  accountType: 'adult' | 'teen' | 'child';
  parentEmail?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
};

export type ModerationSeverity = 'low' | 'medium' | 'high' | 'critical';

export async function getSession() {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function signInWithGoogle() {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before enabling accounts.');
  const redirectTo = `${window.location.origin}/account`;
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  });
  if (error) throw error;
}

export async function signOut() {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
}

export async function ensureProfile(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const fullName = String(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Phenom User');
  const { data, error } = await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email ?? '',
    full_name: fullName,
  }, { onConflict: 'id' }).select().single();
  if (error) throw error;
  return fromProfileRow(data);
}

export async function getMyProfile(): Promise<Profile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const session = await getSession();
  if (!session) return null;
  const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
  return data ? fromProfileRow(data) : await ensureProfile(session.user);
}

export async function saveChildSafetySettings(input: { accountType: 'adult' | 'teen' | 'child'; parentEmail?: string }) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase first.');
  const session = await getSession();
  if (!session) throw new Error('Please sign in first.');
  const { error } = await supabase.from('profiles').update({
    account_type: input.accountType,
    parent_email: input.parentEmail?.trim().toLowerCase() || null,
  }).eq('id', session.user.id);
  if (error) throw error;
  if (input.parentEmail) {
    await supabase.from('parent_links').upsert({ child_id: session.user.id, parent_email: input.parentEmail.trim().toLowerCase(), status: 'pending' }, { onConflict: 'child_id,parent_email' });
  }
}

export async function logAnalytics(event: string, metadata: Record<string, unknown> = {}) {
  const supabase = getSupabase();
  if (!supabase) return;
  const session = await getSession();
  await supabase.from('analytics_events').insert({
    user_id: session?.user.id ?? null,
    event_name: event,
    metadata,
  });
}

export async function submitSuggestion(subject: string, message: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before submitting platform feedback.');
  const session = await getSession();
  const { error } = await supabase.from('suggestions').insert({
    user_id: session?.user.id ?? null,
    subject,
    message,
  });
  if (error) throw error;
}

export async function createEnquiry(service: string, message: string, preferredContact = '') {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before sending a platform enquiry.');
  const session = await getSession();
  const { error } = await supabase.from('service_enquiries').insert({
    user_id: session?.user.id ?? null,
    service,
    message,
    preferred_contact: preferredContact,
  });
  if (error) throw error;
}

export async function sendMessage(conversationId: string, body: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Messaging requires the connected platform database.');
  const session = await getSession();
  if (!session) throw new Error('Please sign in to chat.');
  const { error } = await supabase.from('messages').insert({ conversation_id: conversationId, sender_id: session.user.id, body });
  if (error) throw error;
}

function fromProfileRow(row: Record<string, unknown>): Profile {
  return {
    id: String(row.id),
    fullName: String(row.full_name ?? ''),
    email: String(row.email ?? ''),
    role: (row.role as Profile['role']) || 'user',
    accountType: (row.account_type as Profile['accountType']) || 'adult',
    parentEmail: row.parent_email ? String(row.parent_email) : null,
    avatarUrl: row.avatar_url ? String(row.avatar_url) : null,
    createdAt: row.created_at ? String(row.created_at) : undefined,
  };
}
