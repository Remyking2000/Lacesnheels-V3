import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "../db/schema.js";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required — check your .env file");
}

export const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export default db;
