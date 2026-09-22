import { getSupabase } from './cms';

export type AccountCategory = 'individual' | 'school';
export type OnboardingRole = 'individual' | 'school_admin' | 'teacher' | 'student' | 'parent';

export type Profile = {
  id: string;
  fullName: string;
  email: string;
  role: 'user' | 'parent' | 'staff' | 'admin' | 'super_admin';
  accountCategory: AccountCategory;
  onboardingRole: OnboardingRole;
  accountType: 'adult' | 'teen' | 'child';
  parentEmail?: string | null;
  avatarUrl?: string | null;
  createdAt?: string;
};

const CATEGORY_KEY = 'phenom-pending-account-category-v1';
const ROLE_KEY = 'phenom-pending-account-role-v1';

export function getPendingAccountChoice() {
  if (typeof window === 'undefined') return { category: 'individual' as AccountCategory, role: 'individual' as OnboardingRole };
  const category = window.localStorage.getItem(CATEGORY_KEY) === 'school' ? 'school' : 'individual';
  const savedRole = window.localStorage.getItem(ROLE_KEY) as OnboardingRole | null;
  const role = category === 'school' && ['school_admin', 'teacher', 'student', 'parent'].includes(savedRole || '')
    ? savedRole!
    : 'individual';
  return { category, role };
}

export function savePendingAccountChoice(category: AccountCategory, role: OnboardingRole) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(CATEGORY_KEY, category);
  window.localStorage.setItem(ROLE_KEY, role);
}

function clearPendingAccountChoice() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(CATEGORY_KEY);
  window.localStorage.removeItem(ROLE_KEY);
}

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

export async function sendEmailOtp(email: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before enabling accounts.');
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail) throw new Error('Enter your email address.');
  const { error } = await supabase.auth.signInWithOtp({
    email: cleanEmail,
    options: { shouldCreateUser: true },
  });
  if (error) throw error;
}

export async function verifyEmailOtp(email: string, token: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before enabling accounts.');
  const cleanEmail = email.trim().toLowerCase();
  const cleanToken = token.replace(/\D/g, '');
  if (cleanToken.length !== 6) throw new Error('Enter the 6-digit code from your email.');
  const { data, error } = await supabase.auth.verifyOtp({
    email: cleanEmail,
    token: cleanToken,
    type: 'email',
  });
  if (error) throw error;
  if (!data.session) throw new Error('Your code was accepted, but the secure session was not created. Please try again.');
  return data.session;
}

export async function signInWithEmailPassword(email: string, password: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before enabling accounts.');
  const { error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  return getMyProfile();
}

export async function sendWelcomeEmail() {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before enabling accounts.');
  const { error } = await supabase.functions.invoke('send-welcome-email');
  if (error) throw error;
}

export async function setAccountPassword(password: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before enabling accounts.');
  if (password.length < 8) throw new Error('Use at least 8 characters for your password.');
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

export async function getPhenomUserId(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const session = await getSession();
  if (!session) return null;
  const { data, error } = await supabase
    .from('profiles')
    .select('phenom_user_id')
    .eq('id', session.user.id)
    .maybeSingle();
  if (error) throw error;
  return data?.phenom_user_id ? String(data.phenom_user_id) : null;
}

export async function signOut() {
  const supabase = getSupabase();
  if (!supabase) return;
  await supabase.auth.signOut();
  clearPendingAccountChoice();
}

export async function saveAccountChoice(category: AccountCategory, role: OnboardingRole) {
  savePendingAccountChoice(category, role);
  const supabase = getSupabase();
  if (!supabase) return;
  const session = await getSession();
  if (!session) return;
  await updateAccountChoice(session.user.id, category, role);
}

async function updateAccountChoice(userId: string, category: AccountCategory, role: OnboardingRole) {
  const supabase = getSupabase();
  if (!supabase) return;
  const { error } = await supabase.from('profiles').update({
    account_category: category,
    onboarding_role: role,
  }).eq('id', userId);
  if (error) throw error;
}

export async function ensureProfile(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const choice = getPendingAccountChoice();
  const fullName = String(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Phenom User');
  const { data, error } = await supabase.from('profiles').upsert({
    id: user.id,
    email: user.email ?? '',
    full_name: fullName,
    account_category: choice.category,
    onboarding_role: choice.role,
  }, { onConflict: 'id' }).select().single();
  if (error) throw error;
  clearPendingAccountChoice();
  return fromProfileRow(data);
}

export async function getMyProfile(): Promise<Profile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const session = await getSession();
  if (!session) return null;
  const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
  if (!data) return ensureProfile(session.user);
  const choice = getPendingAccountChoice();
  if (!data.account_category || !data.onboarding_role) {
    await updateAccountChoice(session.user.id, choice.category, choice.role);
    return getMyProfile();
  }
  return fromProfileRow(data);
}


export type ActiveSubscription = { id: string; planCode: string; status: string; provider: string; amount: number | null; currency: string | null; startedAt: string | null; endsAt: string | null };

export async function getMyActiveSubscriptions(): Promise<ActiveSubscription[]> {
  const supabase = getSupabase();
  if (!supabase) return [];
  const session = await getSession();
  if (!session) return [];
  const { data, error } = await supabase.from('subscriptions').select('id,plan_code,status,provider,amount,currency,started_at,ends_at').eq('user_id', session.user.id).in('status', ['active','trialing','paid']).order('ends_at', { ascending: true, nullsFirst: false });
  if (error) throw error;
  return (data ?? []).map((row: Record<string, unknown>) => ({ id: String(row.id), planCode: String(row.plan_code), status: String(row.status), provider: String(row.provider), amount: row.amount == null ? null : Number(row.amount), currency: row.currency == null ? null : String(row.currency), startedAt: row.started_at == null ? null : String(row.started_at), endsAt: row.ends_at == null ? null : String(row.ends_at) }));
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
  const { error } = await supabase.from('suggestions').insert({ user_id: session?.user.id ?? null, subject, message });
  if (error) throw error;
}

export async function createEnquiry(service: string, message: string, preferredContact = '') {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before sending a platform enquiry.');
  const session = await getSession();
  const { error } = await supabase.from('service_enquiries').insert({ user_id: session?.user.id ?? null, service, message, preferred_contact: preferredContact });
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
  const category = row.account_category === 'school' ? 'school' : 'individual';
  const validRoles: OnboardingRole[] = ['individual', 'school_admin', 'teacher', 'student', 'parent'];
  const onboardingRole = validRoles.includes(row.onboarding_role as OnboardingRole) ? row.onboarding_role as OnboardingRole : category === 'school' ? 'school_admin' : 'individual';
  return {
    id: String(row.id),
    fullName: String(row.full_name ?? ''),
    email: String(row.email ?? ''),
    role: (row.role as Profile['role']) || 'user',
    accountCategory: category,
    onboardingRole,
    accountType: (row.account_type as Profile['accountType']) || 'adult',
    parentEmail: row.parent_email ? String(row.parent_email) : null,
    avatarUrl: row.avatar_url ? String(row.avatar_url) : null,
    createdAt: row.created_at ? String(row.created_at) : undefined,
  };
}
