/**
 * Runs all .sql migration files against Neon using the serverless HTTP driver.
 * Usage:  npm run db:migrate
 */
import "dotenv/config";
import { readdir, readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { neon } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required — check your .env file");
}

const sql = neon(process.env.DATABASE_URL);

// ── Ensure migrations tracking table exists ────────────────────────────────
await sql`
  CREATE TABLE IF NOT EXISTS _migrations (
    filename   TEXT        PRIMARY KEY,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )
`;

const migrationsDir = join(__dirname, "migrations");
const files = (await readdir(migrationsDir))
  .filter((f) => f.endsWith(".sql"))
  .sort();

const applied = await sql`SELECT filename FROM _migrations`;
const appliedSet = new Set(applied.map((r) => r.filename as string));

console.log(`\nFound ${files.length} migration file(s). ${appliedSet.size} already applied.\n`);

for (const file of files) {
  if (appliedSet.has(file)) {
    console.log(`⏭  ${file} (already applied)`);
    continue;
  }

  const content = await readFile(join(migrationsDir, file), "utf-8");
  console.log(`▶  ${file} ...`);

  // Strip SQL line comments, then split on semicolons at statement boundaries
  const stripped = content
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");

  const statements = stripped
    .split(/;[ \t]*\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  let failed = false;
  for (const stmt of statements) {
    try {
      await sql([stmt] as unknown as TemplateStringsArray);
    } catch (err) {
      const msg = (err as Error).message;
      if (msg.includes("already exists") || msg.includes("duplicate column")) {
        console.log(`   ⚠  skipped (idempotent): ${msg.split("\n")[0]}`);
      } else {
        console.error(`   ✗ FAILED on:\n${stmt.slice(0, 120)}...\n\nError: ${msg}\n`);
        failed = true;
        break;
      }
    }
  }

  if (!failed) {
    await sql`INSERT INTO _migrations (filename) VALUES (${file}) ON CONFLICT DO NOTHING`;
    console.log(`   ✓ applied\n`);
  } else {
    console.error(`   Migration ${file} failed — stopping.\n`);
    process.exit(1);
  }
}

console.log("All migrations complete.\n");
