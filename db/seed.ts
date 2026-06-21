import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { categories, products } from "./schema";
import { categories as seedCategories, products as seedProducts } from "../src/data/catalog";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to seed the database.");
}

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

await db.delete(products);
await db.delete(categories);

await db.insert(categories).values(
  seedCategories.map((category) => ({
    slug: category.slug,
    name: category.name,
    intro: category.intro,
    imageUrl: category.image,
  })),
);

await db.insert(products).values(
  seedProducts.map((product, index) => ({
    slug: product.slug,
    name: product.name,
    categorySlug: product.category,
    priceLabel: product.price,
    badgeLabel: product.label,
    imageUrl: product.image,
    colors: product.colors,
    details: product.details,
    condition: product.condition,
    availability: product.availability,
    description: product.description,
    featured: index < 4,
    sortOrder: index + 1,
  })),
);

console.log(`Seeded ${seedCategories.length} categories and ${seedProducts.length} products.`);
