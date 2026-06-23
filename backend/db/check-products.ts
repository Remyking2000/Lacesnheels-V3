import "dotenv/config";
import { neon } from "@neondatabase/serverless";
const sql = neon(process.env.DATABASE_URL!);
const rows = await sql`
  SELECT slug, is_featured, featured, category_id, category_slug 
  FROM products LIMIT 6
`;
console.log(JSON.stringify(rows, null, 2));
