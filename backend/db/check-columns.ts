import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const cols = await sql`
  SELECT column_name 
  FROM information_schema.columns 
  WHERE table_name = 'products' 
  ORDER BY ordinal_position
`;
console.log("products columns:", cols.map((r) => r.column_name).join(", "));

const catCols = await sql`
  SELECT column_name 
  FROM information_schema.columns 
  WHERE table_name = 'categories' 
  ORDER BY ordinal_position
`;
console.log("categories columns:", catCols.map((r) => r.column_name).join(", "));

const tables = await sql`
  SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public' ORDER BY table_name
`;
console.log("tables:", tables.map((r) => r.table_name).join(", "));
