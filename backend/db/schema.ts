import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  numeric,
} from "drizzle-orm/pg-core";

// ── Categories ────────────────────────────────────────────────────────────────

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  intro: text("intro").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Products ──────────────────────────────────────────────────────────────────

export const products = pgTable("products", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull().default(""),
  categoryId: text("category_id").notNull().default(""),
  // Storefront legacy fields (kept for backward compat)
  categorySlug: text("category_slug").notNull().default(""),
  priceLabel: text("price_label").notNull().default(""),
  badgeLabel: text("badge_label").notNull().default(""),
  imageUrl: text("image_url").notNull().default(""),
  colors: text("colors").notNull().default(""),
  details: text("details").notNull().default(""),
  condition: text("condition").notNull().default("New"),
  availability: text("availability").notNull().default(""),
  // Admin / inventory fields
  price: numeric("price", { precision: 12, scale: 2 }).notNull().default("0"),
  comparePrice: numeric("compare_price", { precision: 12, scale: 2 }),
  images: text("images").notNull().default("[]"), // JSON array stored as text
  stockQuantity: integer("stock_quantity").notNull().default(0),
  sku: text("sku").notNull().default(""),
  isNewArrival: boolean("is_new_arrival").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  // Legacy
  featured: boolean("featured").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Orders ────────────────────────────────────────────────────────────────────

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderRef: text("order_ref").notNull().unique(), // human-readable e.g. ORD-001
  customer: text("customer").notNull().default(""),
  customerPhone: text("customer_phone").notNull().default(""),
  items: text("items").notNull().default("[]"), // JSON array
  total: numeric("total", { precision: 12, scale: 2 }).notNull().default("0"),
  status: text("status").notNull().default("Pending"),
  notes: text("notes").notNull().default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Admin users ───────────────────────────────────────────────────────────────

export const adminUsers = pgTable("admin_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ── Store settings ────────────────────────────────────────────────────────────

export const storeSettings = pgTable("store_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
