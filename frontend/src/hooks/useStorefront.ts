/**
 * Storefront-facing hooks — fetch from the Express API and map to
 * the StorefrontProduct shape the storefront components expect.
 * Falls back to static catalog data if the API is unreachable.
 */
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { DbProduct, DbCategory } from "../lib/neon";
import {
  categories as staticCategories,
  products as staticProducts,
} from "../data/catalog";

// ── Storefront shape ──────────────────────────────────────────────────────────

export interface StorefrontProduct {
  slug: string;
  name: string;
  categoryName: string;
  categoryKey: string;
  price: string;
  priceNum: number;
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

// ── Mappers ───────────────────────────────────────────────────────────────────

function mapDbProduct(row: DbProduct & { category_name?: string }): StorefrontProduct {
  let images: string[] = [];
  try { images = JSON.parse(row.images); } catch { /* ignore */ }
  const image = images[0] || row.image_url;
  const priceNum = parseFloat(row.price) || 0;

  return {
    slug: row.slug,
    name: row.name,
    categoryName: (row as { category_name?: string }).category_name ?? row.category_slug,
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
  return { id: row.id, slug: row.slug, name: row.name, intro: row.intro, image: row.image_url };
}

// Static fallbacks
const staticCatMap = Object.fromEntries(staticCategories.map((c) => [c.slug, c.name]));

function staticToStorefront(p: (typeof staticProducts)[0]): StorefrontProduct {
  const priceNum = parseFloat(p.price.replace(/[^0-9.]/g, "")) || 0;
  return {
    slug: p.slug, name: p.name,
    categoryName: staticCatMap[p.category] ?? p.category,
    categoryKey: p.category,
    price: p.price, priceNum,
    label: p.label, image: p.image,
    colors: p.colors, details: p.details,
    condition: p.condition, availability: p.availability,
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
    queryFn: async () => {
      const rows = await api.get<DbCategory[]>("/api/categories");
      return rows.map(mapDbCategory);
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: staticCategories.map((c) => ({
      id: c.slug, slug: c.slug, name: c.name, intro: c.intro, image: c.image,
    })),
  });
}

export function useStorefrontProducts() {
  return useQuery({
    queryKey: ["storefront-products"],
    queryFn: async () => {
      const rows = await api.get<(DbProduct & { category_name?: string })[]>("/api/products");
      return rows.map(mapDbProduct);
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: staticProducts.map(staticToStorefront),
  });
}

export function useStorefrontProduct(slug: string | undefined) {
  return useQuery({
    queryKey: ["storefront-product", slug],
    enabled: !!slug,
    queryFn: async () => {
      const row = await api.get<DbProduct & { category_name?: string }>(
        `/api/products/slug/${slug}`,
      );
      return mapDbProduct(row);
    },
    staleTime: 1000 * 60 * 5,
    placeholderData: () => {
      const p = staticProducts.find((s) => s.slug === slug);
      return p ? staticToStorefront(p) : undefined;
    },
  });
}
