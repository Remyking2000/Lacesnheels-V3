/**
 * One-time data patch:
 * 1. Back-fill category_id from category_slug
 * 2. Back-fill is_featured from legacy featured column
 * 3. Back-fill is_new_arrival for new-arrivals category
 * 4. Back-fill is_active = true for all existing products
 */
import "dotenv/config";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

// 1. Back-fill category_id
await sql`
  UPDATE products p
  SET category_id = c.id::text
  FROM categories c
  WHERE c.slug = p.category_slug
    AND (p.category_id IS NULL OR p.category_id = '')
`;
console.log("✓ category_id back-filled");

// 2. Back-fill is_featured from legacy featured column
await sql`
  UPDATE products
  SET is_featured = featured
  WHERE is_featured IS DISTINCT FROM featured
`;
console.log("✓ is_featured back-filled from featured");

// 3. Back-fill is_new_arrival for products in new-arrivals category
await sql`
  UPDATE products
  SET is_new_arrival = true
  WHERE category_slug = 'new-arrivals'
    AND is_new_arrival = false
`;
console.log("✓ is_new_arrival back-filled");

// 4. Ensure all products are active
await sql`
  UPDATE products SET is_active = true WHERE is_active = false
`;
console.log("✓ is_active set to true for all products");

// 5. Back-fill images JSON from image_url where images is empty array
await sql`
  UPDATE products
  SET images = json_build_array(image_url)::text
  WHERE (images = '[]' OR images = '') AND image_url <> ''
`;
console.log("✓ images JSON back-filled from image_url");

console.log("\nData patch complete.");
