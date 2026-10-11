#!/usr/bin/env node
/**
 * Read-only Supabase dependency scanner for the Phenom Best Academy exit migration.
 *
 * Usage:
 *   node scripts/migration/audit-supabase-dependencies.mjs
 *   node scripts/migration/audit-supabase-dependencies.mjs --json=/tmp/supabase-audit.json
 *
 * This tool only reads repository files. It never contacts Supabase or changes data.
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SKIP_DIRS = new Set([
  ".git", "node_modules", "dist", "build", ".output", ".vercel",
  ".tanstack", "coverage", "playwright-report", "test-results"
]);
const EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".json", ".jsonc",
  ".html", ".css", ".sql", ".md", ".yml", ".yaml", ".toml"
]);
const SELF = path.normalize("scripts/migration/audit-supabase-dependencies.mjs");

const RULES = [
  { category: "supabase-client-import", regex: /@supabase\/(?:supabase-js|ssr)/g },
  { category: "supabase-project-url", regex: /[A-Za-z0-9.-]+\.supabase\.co/g },
  { category: "supabase-environment-variable", regex: /\b(?:VITE_)?SUPABASE_[A-Z0-9_]+\b/g },
  { category: "table-access", regex: /\.from\(\s*["'`]([A-Za-z_][A-Za-z0-9_]*)["'`]\s*\)/g },
  { category: "rpc-call", regex: /\.rpc\(\s*["'`]([A-Za-z_][A-Za-z0-9_]*)["'`]/g },
  { category: "edge-function-call", regex: /\.functions\.invoke\(\s*["'`]([A-Za-z0-9_-]+)["'`]/g },
  { category: "storage-bucket", regex: /\.storage\.from\(\s*["'`]([A-Za-z0-9_-]+)["'`]\s*\)/g },
  { category: "realtime-channel", regex: /\.channel\(\s*["'`]([^"'`]{1,100})["'`]/g },
  { category: "auth-api", regex: /\.auth\.(signInWithOAuth|signInWithOtp|verifyOtp|signInWithPassword|signOut|getSession|getUser|refreshSession|updateUser|resetPasswordForEmail|onAuthStateChange)\b/g },
  { category: "supabase-rest-or-functions-url", regex: /https?:\/\/[^\s"'\x60]*\.supabase\.co\/(?:rest\/v1|auth\/v1|storage\/v1|functions\/v1)[^\s"'\x60]*/g }
];

function redact(value) {
  return value
    .replace(/(Bearer\s+)[A-Za-z0-9._-]+/gi, "$1[REDACTED]")
    .replace(/((?:api[_-]?key|service[_-]?role[_-]?key|password|secret)\s*[:=]\s*["']?)[^\s,"'\x60}]+/gi, "$1[REDACTED]")
    .slice(0, 180);
}

async function walk(directory, files = []) {
  let entries;
  try {
    entries = await readdir(directory, { withFileTypes: true });
  } catch {
    return files;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) await walk(path.join(directory, entry.name), files);
      continue;
    }
    if (!entry.isFile()) continue;
    const absolute = path.join(directory, entry.name);
    const relative = path.relative(ROOT, absolute).split(path.sep).join("/");
    if (relative === SELF) continue;
    if (EXTENSIONS.has(path.extname(entry.name).toLowerCase())) files.push({ absolute, relative });
  }
  return files;
}

const files = await walk(ROOT);
const findings = [];
for (const file of files) {
  let content;
  try {
    content = await readFile(file.absolute, "utf8");
  } catch {
    continue;
  }
  const lines = content.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    for (const rule of RULES) {
      rule.regex.lastIndex = 0;
      for (const match of line.matchAll(rule.regex)) {
        const reference = match[1] || match[0];
        findings.push({
          file: file.relative,
          line: index + 1,
          category: rule.category,
          reference: redact(String(reference)),
          preview: redact(line.trim())
        });
      }
    }
  }
}

const summary = Object.fromEntries(
  [...new Set(findings.map((item) => item.category))].sort().map((category) => [
    category,
    findings.filter((item) => item.category === category).length
  ])
);
const unique = {
  filesScanned: files.length,
  filesWithFindings: new Set(findings.map((item) => item.file)).size,
  totalFindings: findings.length,
  summary,
  findings
};

const jsonArg = process.argv.find((arg) => arg.startsWith("--json="));
if (jsonArg) {
  const destination = path.resolve(ROOT, jsonArg.slice("--json=".length));
  await writeFile(destination, JSON.stringify(unique, null, 2) + "\n", "utf8");
  process.stdout.write(`Wrote ${findings.length} findings to ${destination}\n`);
} else {
  process.stdout.write("# Supabase dependency scan\n\n");
  process.stdout.write(`Files scanned: ${unique.filesScanned}\nFiles with findings: ${unique.filesWithFindings}\nTotal findings: ${unique.totalFindings}\n\n`);
  process.stdout.write("| Category | Findings |\n|---|---:|\n");
  for (const [category, count] of Object.entries(summary)) {
    process.stdout.write(`| ${category} | ${count} |\n`);
  }
  process.stdout.write("\n## Findings\n");
  for (const item of findings) {
    process.stdout.write(`\n- ${item.file}:${item.line} — ${item.category} — ${item.reference}\n  ${item.preview}\n`);
  }
}
