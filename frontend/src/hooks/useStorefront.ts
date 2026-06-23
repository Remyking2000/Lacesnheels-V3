/**
 * Storefront-facing hooks — map DB rows to the shape the storefront components expect.
 * Falls back to static catalog data if the DB is unavailable.
 */
import { useQuery } from "@tanstack/react-query";
import { sql } from "../lib/neon";
import type { DbProduct, DbCategory } from "../lib/neon";
import {
  categories as staticCategories,
  products as staticProducts,
} from "../data/catalog";

// ── Storefront product shape (superset of old Product type) ───────────────────

export interface StorefrontProduct {
  slug: string;
  name: string;
  /** Category name (resolved) */
  categoryName: string;
  /** Category id or slug — for filtering */
  categoryKey: string;
  price: string;           // "From KES 12,500"
  priceNum: number;        // 12500 — for cart totals
  label: string;
  image: string;
  colors: string;
  details: string;
  condition: string;
  availability: string;
  description: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  stockQuantity: number;
}

export interface StorefrontCategory {
  id: string;
  slug: string;
  name: string;
  intro: string;
  image: string;
}

// ── Map DB rows → storefront shapes ──────────────────────────────────────────

function mapDbProduct(
  row: DbProduct,
  categoryMap: Record<string, DbCategory>,
): StorefrontProduct {
  const cat = categoryMap[row.category_id] ?? categoryMap[row.category_slug];
  const priceNum = parseFloat(row.price) || 0;
  let images: string[] = [];
  try { images = JSON.parse(row.images); } catch { /* ignore */ }
  const image = images[0] || row.image_url;

  return {
    slug: row.slug,
    name: row.name,
    categoryName: cat?.name ?? row.category_slug,
    categoryKey: row.category_slug || row.category_id,
    price: row.price_label || (priceNum > 0 ? `From KES ${priceNum.toLocaleString()}` : ""),
    priceNum,
    label: row.badge_label || (row.is_new_arrival ? "New Arrival" : row.is_featured ? "Featured" : ""),
    image,
    colors: row.colors,
    details: row.details,
    condition: row.condition,
    availability: row.availability,
    description: row.description,
    isFeatured: row.is_featured || row.featured,
    isNewArrival: row.is_new_arrival,
    stockQuantity: row.stock_quantity,
  };
}

function mapDbCategory(row: DbCategory): StorefrontCategory {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    intro: row.intro,
    image: row.image_url,
  };
}

function staticToStorefrontProduct(
  p: (typeof staticProducts)[0],
  catMap: Record<string, string>,
): StorefrontProduct {
  const priceNum = parseFloat(p.price.replace(/[^0-9.]/g, "")) || 0;
  return {
    slug: p.slug,
    name: p.name,
    categoryName: catMap[p.category] ?? p.category,
    categoryKey: p.category,
    price: p.price,
    priceNum,
    label: p.label,
    image: p.image,
    colors: p.colors,
    details: p.details,
    condition: p.condition,
    availability: p.availability,
    description: p.description,
    isFeatured: false,
    isNewArrival: p.category === "new-arrivals",
    stockQuantity: 99,
  };
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useStorefrontCategories() {
  return useQuery({
    queryKey: ["storefront-categories"],
    queryFn: async (): Promise<StorefrontCategory[]> => {
      const rows = await sql`SELECT * FROM categories ORDER BY name ASC`;
      return (rows as DbCategory[]).map(mapDbCategory);
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: staticCategories.map((c) => ({
      id: c.slug,
      slug: c.slug,
      name: c.name,
      intro: c.intro,
      image: c.image,
    })),
  });
}

export function useStorefrontProducts() {
  const { data: cats = [] } = useStorefrontCategories();

  return useQuery({
    queryKey: ["storefront-products"],
    queryFn: async (): Promise<StorefrontProduct[]> => {
      const rows = await sql`
        SELECT * FROM products
        WHERE is_active = true
        ORDER BY sort_order ASC, created_at DESC
      `;
      const catMap: Record<string, DbCategory> = {};
      const catRows = await sql`SELECT * FROM categories`;
      (catRows as DbCategory[]).forEach((c) => {
        catMap[c.id] = c;
        catMap[c.slug] = c;
      });
      return (rows as DbProduct[]).map((r) => mapDbProduct(r, catMap));
    },
    staleTime: 1000 * 60 * 5,
    // Fallback to static while loading
    placeholderData: () => {
      const catMap = Object.fromEntries(
        staticCategories.map((c) => [c.slug, c.name]),
      );
      return staticProducts.map((p) => staticToStorefrontProduct(p, catMap));
    },
    enabled: cats.length >= 0, // always enabled
  });
}

export function useStorefrontProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["storefront-product", slug],
    enabled: !!slug,
    queryFn: async (): Promise<StorefrontProduct | null> => {
      const rows = await sql`
        SELECT p.*, c.name as cat_name, c.slug as cat_slug
        FROM products p
        LEFT JOIN categories c ON c.id = p.category_id OR c.slug = p.category_slug
        WHERE p.slug = ${slug} AND p.is_active = true
        LIMIT 1
      `;
      if (!rows[0]) return null;
      const row = rows[0] as DbProduct & { cat_name: string; cat_slug: string };
      const catMap: Record<string, DbCategory> = {};
      return mapDbProduct(row, catMap);
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: () => {
      const p = staticProducts.find((s) => s.slug === slug);
      if (!p) return null;
      const catMap = Object.fromEntries(staticCategories.map((c) => [c.slug, c.name]));
      return staticToStorefrontProduct(p, catMap);
    },
  });
}
