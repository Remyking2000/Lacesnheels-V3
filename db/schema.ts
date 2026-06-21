import { boolean, integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  intro: text("intro").notNull(),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  categorySlug: text("category_slug").notNull(),
  priceLabel: text("price_label").notNull(),
  badgeLabel: text("badge_label").notNull(),
  imageUrl: text("image_url").notNull(),
  colors: text("colors").notNull(),
  details: text("details").notNull(),
  condition: text("condition").notNull(),
  availability: text("availability").notNull(),
  description: text("description").notNull(),
  featured: boolean("featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
