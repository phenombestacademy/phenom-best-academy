Phenom Best Academy — V5.9.1 COMMIT PACKAGE
============================================

Unzip into your project root (merge/replace matching paths).
Then commit EVERYTHING in this package — it is cleaned for Git.

SAFE TO COMMIT
--------------
src/                 Full site + Phenom Calculator Tool Hub
public/              Brand logos, founder, athletics, icons
supabase/            SQL migrations + Edge function source
                     (uses Deno.env — no real secrets inside)
package.json
vite.config.ts
tsconfig.json
README.md
V5.9.1-CHANGELOG.md (and older changelog notes)
.gitignore
supabase/ENVIRONMENT-SECRETS-TEMPLATE.txt
  → empty placeholders only; fill values in Supabase Dashboard, never in Git

DO NOT COMMIT (not included here)
---------------------------------
.env / .env.local / real API keys
node_modules/
dist/ .output/ .vercel/
Supabase service role key, payment secrets, AI provider keys (server-side only)

SUGGESTED GIT COMMANDS
----------------------
git add src public supabase package.json vite.config.ts tsconfig.json \
  README.md .gitignore V5.9.1-CHANGELOG.md V5.9-CHANGELOG.md \
  V5.8-CHANGELOG.md V5.6-IMPLEMENTATION-NOTES.md \
  supabase/ENVIRONMENT-SECRETS-TEMPLATE.txt
git status
git commit -m "V5.9.1: legibility, community copy, Calculator curriculum, brand assets"
git push

WHAT THIS PACKAGE COVERS (not only Calculator)
----------------------------------------------
• Site-wide black body text + pure white on navy
• Login / Sign up + Enquire header
• Account centre + community wording
• Brand assets under public/brand and public/media
• Phenom Calculator: formulas, units, graph, modes, animated keys
• School, CPD, admin, community, platform routes unchanged in structure
