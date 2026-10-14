import { getSupabase } from './cms';

export type AccountCategory = 'individual' | 'school';
export type OnboardingRole = 'individual' | 'teacher' | 'non_teaching_staff' | 'student' | 'child' | 'teenager' | 'adult' | 'professional' | 'parent' | 'school_admin';

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
  phenomUserId?: string | null;
  preferredLocale?: string;
  learningLocale?: string | null;
  supportLocale?: string | null;
  firstName?: string | null;
  middleName?: string | null;
  surname?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  country?: string | null;
  stateRegion?: string | null;
  city?: string | null;
  address?: string | null;
};

const CATEGORY_KEY = 'phenom-pending-account-category-v1';
const ROLE_KEY = 'phenom-pending-account-role-v1';

let activeAuthFlow: 'google' | 'emailOtp' | null = null;

function beginAuthFlow(flow: 'google' | 'emailOtp') {
  if (activeAuthFlow) {
    throw new Error('Another sign-in method is already running. Please wait for it to finish or return to the sign-in options and try again.');
  }
  activeAuthFlow = flow;
}

function endAuthFlow(flow: 'google' | 'emailOtp') {
  if (activeAuthFlow === flow) activeAuthFlow = null;
}

export function getPendingAccountChoice(): { category: AccountCategory; role: OnboardingRole } {
  if (typeof window === 'undefined') return { category: 'individual' as AccountCategory, role: 'individual' as OnboardingRole };
  const category: AccountCategory = window.localStorage.getItem(CATEGORY_KEY) === 'school' ? 'school' : 'individual';
  const savedRole = window.localStorage.getItem(ROLE_KEY) as OnboardingRole | null;
  const validRoles: OnboardingRole[] = ['school_admin','teacher','non_teaching_staff','student','child','teenager','adult','professional','parent'];
  const role = validRoles.includes(savedRole as OnboardingRole) ? savedRole as OnboardingRole : category === 'school' ? 'school_admin' : 'individual';
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
  beginAuthFlow('google');
  try {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Connect Supabase before enabling accounts.');
    const redirectTo = `${window.location.origin}/account`;
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } });
    if (error) throw error;
    window.setTimeout(() => endAuthFlow('google'), 5000);
  } catch (error) {
    endAuthFlow('google');
    throw error;
  }
}

export async function sendEmailOtp(email: string) {
  beginAuthFlow('emailOtp');
  try {
    const supabase = getSupabase();
    if (!supabase) throw new Error('Connect Supabase before enabling accounts.');
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) throw new Error('Enter your email address.');
    const { data: lookup, error: lookupError } = await supabase.rpc('lookup_phenom_profile', { p_email: cleanEmail, p_user_id: null });
    if (lookupError) throw lookupError;
    if ((lookup as { exists?: boolean } | null)?.exists) throw new Error('You already have a Phenom account. Please sign in instead.');
    const otpRequest = supabase.auth.signInWithOtp({ email: cleanEmail, options: { shouldCreateUser: true } });
    const timeout = new Promise<never>((_, reject) => window.setTimeout(() => reject(new Error('The verification email service did not respond within 20 seconds. Please try again shortly. If this continues, the Academy email service needs attention.')), 20_000));
    const { error } = await Promise.race([otpRequest, timeout]);
    if (error) throw error;
  } finally {
    endAuthFlow('emailOtp');
  }
}

export async function verifyEmailOtp(email: string, token: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before enabling accounts.');
  const cleanEmail = email.trim().toLowerCase();
  const cleanToken = token.replace(/\D/g, '');
  if (cleanToken.length !== 6) throw new Error('Enter the 6-digit code from your email.');
  const { data, error } = await supabase.auth.verifyOtp({ email: cleanEmail, token: cleanToken, type: 'email' });
  if (error) throw error;
  if (!data.session) throw new Error('Your code was accepted, but the secure session was not created. Please try again.');
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
  if (sessionError) throw sessionError;
  return data.session;
}

export async function signInWithEmailPassword(identifier: string, password: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before enabling accounts.');
  const cleanIdentifier = identifier.trim();
  if (!cleanIdentifier) throw new Error('Enter your Phenom User ID or email address.');
  let email = cleanIdentifier.toLowerCase();
  if (!cleanIdentifier.includes('@')) {
    const { data: lookup, error: lookupError } = await supabase.rpc('lookup_phenom_profile', { p_email: null, p_user_id: cleanIdentifier });
    if (lookupError) throw lookupError;
    const result = lookup as { found?: boolean; email?: string } | null;
    if (!result?.found || !result.email) throw new Error('Sign-in failed. Check your Phenom User ID/email and password.');
    email = result.email.trim().toLowerCase();
  }
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error('Sign-in failed. Check your Phenom User ID/email and password.');
  try {
    return await getMyProfile();
  } catch {
    // Authentication succeeded; profile loading must not block the user's return to the homepage.
    return null;
  }
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
  const current = await getSession();
  if (!current) throw new Error('Your verification session is no longer active. Please verify the code again.');
  const { data: userCheck, error: userCheckError } = await supabase.auth.getUser();
  if (userCheckError || !userCheck.user) throw new Error('Your verification session is no longer active. Please verify the code again.');
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  if (typeof window !== 'undefined') {
    let phenomUserId: string | null = null;
    try {
      phenomUserId = await getPhenomUserId();
    } catch {
      // Password creation has already succeeded; profile lookup must not turn success into a false failure.
    }
    window.alert(`Phenom account created successfully.\n\nYour Phenom User ID is: ${phenomUserId || 'Being prepared'}\n\nPlease keep this ID safe. You can use it or your email address to sign in next time.`);
    window.location.assign('/');
  }
}

export async function savePreferredLocale(locale: string) {
  const supabase = getSupabase();
  if (!supabase) return;
  const session = await getSession();
  if (!session) return;
  const { error } = await supabase.from('profiles').update({ preferred_locale: locale }).eq('id', session.user.id);
  if (error) throw error;
}

export async function saveLearningLanguage(learningLocale: string | null, supportLocale?: string | null) {
  const supabase = getSupabase();
  if (!supabase) return;
  const session = await getSession();
  if (!session) return;
  const { error } = await supabase.from('profiles').update({ learning_locale: learningLocale, support_locale: supportLocale ?? null }).eq('id', session.user.id);
  if (error) throw error;
}

export async function getPhenomUserId(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const session = await getSession();
  if (!session) return null;
  const { data, error } = await supabase.from('profiles').select('phenom_user_id').eq('id', session.user.id).maybeSingle();
  if (error) return null;
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
  const { error } = await supabase.from('profiles').update({ account_category: category, onboarding_role: role }).eq('id', userId);
  if (error) throw error;
}

export async function ensureProfile(user: { id: string; email?: string; user_metadata?: Record<string, unknown> }) {
  const supabase = getSupabase();
  if (!supabase) return null;
  const choice = getPendingAccountChoice();
  const invitedCategory = user.user_metadata?.account_category === 'school' ? 'school' : user.user_metadata?.account_category === 'individual' ? 'individual' : null;
  const invitedRole = typeof user.user_metadata?.onboarding_role === 'string' ? user.user_metadata.onboarding_role as OnboardingRole : null;
  const effectiveCategory = invitedCategory ?? choice.category;
  const effectiveRole = invitedRole ?? choice.role;
  const fullName = String(user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'Phenom User');
  const { data, error } = await supabase .from('profiles').upsert({ id: user.id, email: user.email ?? '', full_name: fullName, account_category: effectiveCategory, onboarding_role: effectiveRole }, { onConflict: 'id' }).select('id,full_name,email,role,account_category,onboarding_role,account_type,parent_email,avatar_url,created_at,phenom_user_id,preferred_locale,learning_locale,support_locale,first_name,middle_name,surname,phone,date_of_birth,gender,country,state_region,city,address').single();
  if (error) throw error;
  await supabase.rpc('activate_school_membership_for_current_user');
  clearPendingAccountChoice();
  return fromProfileRow(data);
}

export async function getMyProfile(): Promise<Profile | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const session = await getSession();
  if (!session) return null;
  const { data } = await supabase .from('profiles').select('id,full_name,email,role,account_category,onboarding_role,account_type,parent_email,avatar_url,created_at,phenom_user_id,preferred_locale,learning_locale,support_locale,first_name,middle_name,surname,phone,date_of_birth,gender,country,state_region,city,address').eq('id', session.user.id).maybeSingle();
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
  const { error } = await supabase.from('profiles').update({ account_type: input.accountType, parent_email: input.parentEmail?.trim().toLowerCase() || null }).eq('id', session.user.id);
  if (error) throw error;
  if (input.parentEmail) {
    const parentEmail = input.parentEmail.trim().toLowerCase();
    const { data: parent } = await supabase.from('profiles').select('id').eq('email', parentEmail).maybeSingle();
    if (parent?.id && parent.id !== session.user.id) {
      const { error: linkError } = await supabase.from('parent_links').upsert({ child_id: session.user.id, parent_id: parent.id, status: 'pending' }, { onConflict: 'parent_id,child_id' });
      if (linkError) throw linkError;
    }
  }
}

export async function saveProfileDetails(input: {
  firstName?: string | null;
  middleName?: string | null;
  surname?: string | null;
  fullName?: string | null;
  phone?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  country?: string | null;
  stateRegion?: string | null;
  city?: string | null;
  address?: string | null;
}) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase first.');
  const session = await getSession();
  if (!session) throw new Error('Please sign in first.');
  const updates = {
    first_name: input.firstName?.trim() || null,
    middle_name: input.middleName?.trim() || null,
    surname: input.surname?.trim() || null,
    full_name: input.fullName?.trim() || [input.firstName, input.middleName, input.surname].filter(Boolean).join(' ').trim() || 'Phenom User',
    phone: input.phone?.trim() || null,
    date_of_birth: input.dateOfBirth || null,
    gender: input.gender?.trim() || null,
    country: input.country?.trim() || null,
    state_region: input.stateRegion?.trim() || null,
    city: input.city?.trim() || null,
    address: input.address?.trim() || null,
  };
  const { error } = await supabase.from('profiles').update(updates).eq('id', session.user.id);
  if (error) throw error;
  return getMyProfile();
}

export async function uploadProfileAvatar(file: File) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase first.');
  const session = await getSession();
  if (!session) throw new Error('Please sign in first.');
  if (!file.type.startsWith('image/')) throw new Error('Please choose an image file.');
  if (file.size > 5 * 1024 * 1024) throw new Error('Profile pictures must be 5 MB or smaller.');
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `${session.user.id}/avatar-${Date.now()}.${extension}`;
  const { error: uploadError } = await supabase.storage.from('profile-avatars').upload(path, file, { upsert: true, contentType: file.type, cacheControl: '3600' });
  if (uploadError) throw uploadError;
  const { data } = supabase.storage.from('profile-avatars').getPublicUrl(path);
  const { error: profileError } = await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', session.user.id);
  if (profileError) throw profileError;
  return data.publicUrl;
}

export async function removeProfileAvatar() {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase first.');
  const session = await getSession();
  if (!session) throw new Error('Please sign in first.');
  const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', session.user.id).maybeSingle();
  if (profile?.avatar_url) {
    const marker = '/storage/v1/object/public/profile-avatars/';
    const index = profile.avatar_url.indexOf(marker);
    if (index >= 0) await supabase.storage.from('profile-avatars').remove([profile.avatar_url.slice(index + marker.length)]);
  }
  const { error } = await supabase.from('profiles').update({ avatar_url: null }).eq('id', session.user.id);
  if (error) throw error;
}

export async function sendPasswordChangeOtp() {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase first.');
  const session = await getSession();
  if (!session?.user.email) throw new Error('Please sign in first.');
  const { error } = await supabase.auth.signInWithOtp({ email: session.user.email, options: { shouldCreateUser: false } });
  if (error) throw error;
}

export async function verifyPasswordChangeOtp(token: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase first.');
  const session = await getSession();
  if (!session?.user.email) throw new Error('Please sign in first.');
  const cleanToken = token.replace(/\D/g, '');
  if (cleanToken.length !== 6) throw new Error('Enter the 6-digit code from your email.');
  const { data, error } = await supabase.auth.verifyOtp({ email: session.user.email, token: cleanToken, type: 'email' });
  if (error) throw error;
  if (!data.session) throw new Error('The verification code was accepted, but a secure session was not created.');
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
  if (sessionError) throw sessionError;
  return true;
}

export async function changePassword(password: string, confirmation: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase first.');
  if (password.length < 8) throw new Error('Use at least 8 characters for your new password.');
  if (password !== confirmation) throw new Error('The passwords do not match.');
  const session = await getSession();
  if (!session) throw new Error('Please sign in first.');
  const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) throw refreshError;
  if (!refreshed.session) throw new Error('Your secure session could not be refreshed. Please try again.');
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}

export async function logAnalytics(event: string, metadata: Record<string, unknown> = {}) {
  const supabase = getSupabase();
  if (!supabase) return;
  const session = await getSession();
  await supabase.from('analytics_events').insert({ user_id: session?.user.id ?? null, event_name: event, payload: metadata });
}

export async function submitSuggestion(subject: string, message: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before submitting platform feedback.');
  const session = await getSession();
  const { error } = await supabase.from('suggestions').insert({ user_id: session?.user.id ?? null, subject, body: message });
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
  const validRoles: OnboardingRole[] = ['individual', 'school_admin', 'teacher', 'non_teaching_staff', 'student', 'child', 'teenager', 'adult', 'professional', 'parent'];
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
    phenomUserId: row.phenom_user_id ? String(row.phenom_user_id) : null,
    preferredLocale: row.preferred_locale ? String(row.preferred_locale) : 'en-NG',
    learningLocale: row.learning_locale ? String(row.learning_locale) : null,
    supportLocale: row.support_locale ? String(row.support_locale) : null,
    firstName: row.first_name ? String(row.first_name) : null,
    middleName: row.middle_name ? String(row.middle_name) : null,
    surname: row.surname ? String(row.surname) : null,
    phone: row.phone ? String(row.phone) : null,
    dateOfBirth: row.date_of_birth ? String(row.date_of_birth) : null,
    gender: row.gender ? String(row.gender) : null,
    country: row.country ? String(row.country) : null,
    stateRegion: row.state_region ? String(row.state_region) : null,
    city: row.city ? String(row.city) : null,
    address: row.address ? String(row.address) : null,
    createdAt: row.created_at ? String(row.created_at) : undefined,
  };
}