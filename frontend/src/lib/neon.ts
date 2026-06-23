import { neon } from "@neondatabase/serverless";

// Browser-side Neon HTTP client — uses VITE_ prefixed env var.
// Vite reads .env from the project root (envDir set in vite.config.ts).
const databaseUrl = import.meta.env.VITE_DATABASE_URL as string | undefined;

if (!databaseUrl) {
  console.warn(
    "[neon] VITE_DATABASE_URL is not set. " +
      "Storefront will use static fallback data. " +
      "Add VITE_DATABASE_URL to your root .env file.",
  );
}

// Only initialise the client when we have a real URL — prevents the
// "@neondatabase/serverless requires a connection string" crash.
const _sql = databaseUrl ? neon(databaseUrl) : null;

/**
 * Tagged-template SQL helper.
 * Returns an empty array when no DB URL is configured so the app
 * renders the static fallback data instead of crashing.
 */
export async function sql(
  strings: TemplateStringsArray,
  ...values: unknown[]
): Promise<Record<string, unknown>[]> {
  if (!_sql) return [];
  return _sql(strings, ...values) as Promise<Record<string, unknown>[]>;
}

// ── Typed row helpers ─────────────────────────────────────────────────────────

export interface DbCategory {
  id: string;
  slug: string;
  name: string;
  intro: string;
  image_url: string;
  created_at: string;
}

export interface DbProduct {
  id: string;
  slug: string;
  name: string;
  description: string;
  category_id: string;
  category_slug: string;
  price_label: string;
  badge_label: string;
  image_url: string;
  colors: string;
  details: string;
  condition: string;
  availability: string;
  price: string;
  compare_price: string | null;
  images: string;
  stock_quantity: number;
  sku: string;
  is_new_arrival: boolean;
  is_featured: boolean;
  is_active: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbOrder {
  id: string;
  order_ref: string;
  customer: string;
  customer_phone: string;
  items: string;
  total: string;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface DbSetting {
  key: string;
  value: string;
}
