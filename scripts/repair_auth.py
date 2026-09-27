from pathlib import Path

p = Path('src/lib/platform.ts')
s = p.read_text(encoding='utf-8')

old = """  const { data, error } = await supabase.auth.verifyOtp({ email: cleanEmail, token: cleanToken, type: 'email' });
  if (error) throw error;
  if (!data.session) throw new Error('Your code was accepted, but the secure session was not created. Please try again.');
  return data.session;
}"""
new = """  const { data, error } = await supabase.auth.verifyOtp({ email: cleanEmail, token: cleanToken, type: 'email' });
  if (error) throw error;
  if (!data.session) throw new Error('Your code was accepted, but the secure session was not created. Please try again.');
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
  if (sessionError) throw sessionError;
  return data.session;
}"""
if old in s:
    s = s.replace(old, new, 1)

old = """export async function setAccountPassword(password: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before enabling accounts.');
  if (password.length < 8) throw new Error('Use at least 8 characters for your password.');
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  if (typeof window !== 'undefined') {
    const phenomUserId = await getPhenomUserId();
    window.alert(`Phenom account created successfully.\\n\\nYour Phenom User ID is: ${phenomUserId || 'Being prepared'}\\n\\nPlease keep this ID safe. You can use it or your email address to sign in next time.`);
    window.location.assign('/');
  }
}"""
new = """export async function setAccountPassword(password: string) {
  const supabase = getSupabase();
  if (!supabase) throw new Error('Connect Supabase before enabling accounts.');
  if (password.length < 8) throw new Error('Use at least 8 characters for your password.');
  const current = await getSession();
  if (!current) throw new Error('Your verification session is no longer active. Please verify the code again.');
  const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) throw refreshError;
  if (!refreshed.session) throw new Error('Your secure session could not be refreshed. Please verify the code again.');
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  await supabase.auth.refreshSession();
  if (typeof window !== 'undefined') {
    const phenomUserId = await getPhenomUserId();
    window.alert(`Phenom account created successfully.\\n\\nYour Phenom User ID is: ${phenomUserId || 'Being prepared'}\\n\\nPlease keep this ID safe. You can use it or your email address to sign in next time.`);
    window.location.assign('/');
  }
}"""
if old in s:
    s = s.replace(old, new, 1)

old = """  const { data, error } = await supabase.auth.verifyOtp({ email: session.user.email, token: cleanToken, type: 'email' });
  if (error) throw error;
  if (!data.session) throw new Error('The verification code was accepted, but a secure session was not created.');
  return true;
}"""
new = """  const { data, error } = await supabase.auth.verifyOtp({ email: session.user.email, token: cleanToken, type: 'email' });
  if (error) throw error;
  if (!data.session) throw new Error('The verification code was accepted, but a secure session was not created.');
  const { error: sessionError } = await supabase.auth.setSession({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  });
  if (sessionError) throw sessionError;
  return true;
}"""
if old in s:
    s = s.replace(old, new, 1)

old = """  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}"""
new = """  const session = await getSession();
  if (!session) throw new Error('Please sign in first.');
  const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
  if (refreshError) throw refreshError;
  if (!refreshed.session) throw new Error('Your secure session could not be refreshed. Please try again.');
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}"""
if old in s:
    s = s.replace(old, new, 1)

p.write_text(s, encoding='utf-8')

# Recovery flow fix: verifyOtp must persist the returned session before updateUser.
a = Path('src/routes/account.tsx')
a_s = a.read_text(encoding='utf-8')

old = """      if (error) throw error;
      if (!data.session) throw new Error('The recovery code was accepted, but a secure session was not created. Please try again.');
      setPassword(''); setPasswordConfirm(''); setShowPassword(false); setAuthStep('forgotPassword'); setMessage('Your email has been verified. Create a new password now.');"""
new = """      if (error) throw error;
      if (!data.session) throw new Error('The recovery code was accepted, but a secure session was not created. Please try again.');
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      });
      if (sessionError) throw sessionError;
      setPassword(''); setPasswordConfirm(''); setShowPassword(false); setAuthStep('forgotPassword'); setMessage('Your email has been verified. Create a new password now.');"""
if old in a_s:
    a_s = a_s.replace(old, new, 1)

old = """      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      const p = await getMyProfile();"""
new = """      const session = await getSupabase()?.auth.getSession();
      if (!session?.data.session) throw new Error('Your recovery session is no longer active. Please verify the recovery code again.');
      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) throw refreshError;
      if (!refreshed.session) throw new Error('Your secure recovery session could not be refreshed. Please verify the recovery code again.');
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      await supabase.auth.refreshSession();
      const p = await getMyProfile();"""
if old in a_s:
    a_s = a_s.replace(old, new, 1)

a.write_text(a_s, encoding='utf-8')
