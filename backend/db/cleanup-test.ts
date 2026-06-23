import "dotenv/config";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);
await sql`DELETE FROM products WHERE sku = 'TEST-001'`;
console.log("Cleaned up test product.");
