import fs from 'node:fs';
import { execSync } from 'node:child_process';

function replace(path, from, to, label) {
  const text = fs.readFileSync(path, 'utf8');
  if (!text.includes(from)) throw new Error(`Expected source text not found for ${label} in ${path}`);
  fs.writeFileSync(path, text.replace(from, to));
}

replace('src/lib/platform.ts',
`  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  if (typeof window !== 'undefined') {
    const phenomUserId = await getPhenomUserId();
    window.alert(\`Phenom account created successfully.\\n\\nYour Phenom User ID is: \${phenomUserId || 'Being prepared'}\\n\\nPlease keep this ID safe. You can use it or your email address to sign in next time.\`);
    window.location.assign('/');
  }`,
`  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  if (typeof window !== 'undefined') {
    let phenomUserId: string | null = null;
    try {
      phenomUserId = await getPhenomUserId();
    } catch {
      // Password creation has already succeeded; profile lookup must not turn success into a false failure.
    }
    window.alert(\`Phenom account created successfully.\\n\\nYour Phenom User ID is: \${phenomUserId || 'Being prepared'}\\n\\nPlease keep this ID safe. You can use it or your email address to sign in next time.\`);
    window.location.assign('/');
  }`, 'account password success');

replace('src/lib/platform.ts',
`  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error('Sign-in failed. Check your Phenom User ID/email and password.');
  return getMyProfile();`,
`  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error('Sign-in failed. Check your Phenom User ID/email and password.');
  try {
    return await getMyProfile();
  } catch {
    // Authentication succeeded; profile loading must not block the user's return to the homepage.
    return null;
  }`, 'password sign-in profile loading');

replace('src/lib/platform.ts',
`  const { data, error } = await supabase.from('profiles').select('phenom_user_id').eq('id', session.user.id).maybeSingle();
  if (error) throw error;
  return data?.phenom_user_id ? String(data.phenom_user_id) : null;`,
`  const { data, error } = await supabase.from('profiles').select('phenom_user_id').eq('id', session.user.id).maybeSingle();
  if (error) return null;
  return data?.phenom_user_id ? String(data.phenom_user_id) : null;`, 'user id lookup resilience');

replace('src/routes/signin.tsx',
`      const profile = await signInWithEmailPassword(email, password);
      if (!profile) throw new Error('Sign-in succeeded, but your Phenom profile could not be loaded.');
      setMessage(profile.phenomUserId ? \`Signed in. Phenom User ID: \${profile.phenomUserId}\` : 'Signed in successfully.');
      setTimeout(() => navigate({ to: '/' }), 250);`,
`      const profile = await signInWithEmailPassword(email, password);
      setMessage(profile?.phenomUserId ? \`Signed in. Phenom User ID: \${profile.phenomUserId}\` : 'Signed in successfully.');
      setTimeout(() => navigate({ to: '/' }), 250);`, 'signin profile requirement');

replace('src/routes/signin.tsx',
`        <Link to="/account" className="mt-5 block text-center text-sm font-semibold text-green">Create a new Phenom account</Link>\n`,
``, 'remove signin create-account suggestion');

replace('src/routes/account.tsx',
`      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      const p = await getMyProfile();
      const userId = p?.phenomUserId || 'Being prepared';`,
`      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError || !refreshed.session) throw new Error('Your recovery session could not be refreshed. Please verify the recovery code again.');
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      let p = null;
      try {
        p = await getMyProfile();
      } catch {
        // Password reset has already succeeded; profile loading must not turn success into a false failure.
      }
      const userId = p?.phenomUserId || 'Being prepared';`, 'recovery password success');

fs.unlinkSync('.github/workflows/repair-auth-runtime.yml');
fs.unlinkSync('scripts/repair-auth-runtime.mjs');
execSync('git config user.name "phenombestacademy"');
execSync('git config user.email "phenombesta@gmail.com"');
execSync('git add src/lib/platform.ts src/routes/signin.tsx src/routes/account.tsx .github/workflows/repair-auth-runtime.yml scripts/repair-auth-runtime.mjs');
execSync('git commit -m "fix: make password auth and recovery resilient"');
execSync('git push origin main');
