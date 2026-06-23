import "dotenv/config";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);
await sql`DELETE FROM _migrations WHERE filename = '0003_full_schema.sql'`;
console.log("Reset 0003 — ready to re-run.");
