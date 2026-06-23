import { neon } from "@neondatabase/serverless";

// Browser-side Neon HTTP client — uses VITE_ prefixed env var
const databaseUrl = import.meta.env.VITE_DATABASE_URL as string;

if (!databaseUrl) {
  console.warn(
    "[neon] VITE_DATABASE_URL is not set. Database queries will fail. " +
      "Add it to your .env file.",
  );
}

export const sql = neon(databaseUrl ?? "");

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
  images: string; // JSON string
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
  items: string; // JSON string
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
