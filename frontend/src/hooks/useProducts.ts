import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sql } from "../lib/neon";
import type { DbProduct } from "../lib/neon";
import type { AdminProduct } from "../admin/types";

export const PRODUCTS_KEY = ["products"] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseImages(raw: string): string[] {
  try {
    return JSON.parse(raw);
  } catch {
    return raw ? [raw] : [];
  }
}

export function dbProductToAdmin(row: DbProduct): AdminProduct {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    category: row.category_id || row.category_slug,
    price: parseFloat(row.price) || 0,
    comparePrice: row.compare_price ? parseFloat(row.compare_price) : undefined,
    images: parseImages(row.images).length > 0 ? parseImages(row.images) : [row.image_url],
    stockQuantity: row.stock_quantity,
    sku: row.sku,
    isNewArrival: row.is_new_arrival,
    isFeatured: row.is_featured,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── Fetch all ─────────────────────────────────────────────────────────────────

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: async () => {
      const rows = await sql`
        SELECT * FROM products
        WHERE is_active = true
        ORDER BY sort_order ASC, created_at DESC
      `;
      return (rows as DbProduct[]).map(dbProductToAdmin);
    },
    staleTime: 1000 * 60 * 5,
  });
}

// ── Fetch all (admin — includes inactive) ────────────────────────────────────

export function useAdminProducts() {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, "admin"],
    queryFn: async () => {
      const rows = await sql`
        SELECT * FROM products
        ORDER BY created_at DESC
      `;
      return (rows as DbProduct[]).map(dbProductToAdmin);
    },
    staleTime: 1000 * 60,
  });
}

// ── Fetch single by slug ──────────────────────────────────────────────────────

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, slug],
    enabled: !!slug,
    queryFn: async () => {
      const rows = await sql`SELECT * FROM products WHERE slug = ${slug} AND is_active = true`;
      if (!rows[0]) return null;
      return dbProductToAdmin(rows[0] as DbProduct);
    },
    staleTime: 1000 * 60 * 5,
  });
}

// ── Add ───────────────────────────────────────────────────────────────────────

export function useAddProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (p: AdminProduct) => {
      await sql`
        INSERT INTO products (
          id, slug, name, description, category_id, category_slug,
          price_label, badge_label, image_url, colors, details,
          condition, availability, price, compare_price, images,
          stock_quantity, sku, is_new_arrival, is_featured, is_active,
          featured, sort_order
        ) VALUES (
          ${p.id}, ${p.slug}, ${p.name}, ${p.description},
          ${p.category}, ${p.category},
          ${"KES " + p.price.toLocaleString()}, ${""},
          ${p.images[0] ?? ""}, ${""}, ${""},
          ${"New"}, ${""},
          ${p.price}, ${p.comparePrice ?? null},
          ${JSON.stringify(p.images)},
          ${p.stockQuantity}, ${p.sku},
          ${p.isNewArrival}, ${p.isFeatured}, ${p.isActive},
          ${p.isFeatured}, 0
        )
        ON CONFLICT (slug) DO NOTHING
      `;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}

// ── Update ────────────────────────────────────────────────────────────────────

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<AdminProduct> }) => {
      await sql`
        UPDATE products SET
          name            = COALESCE(${updates.name ?? null}, name),
          slug            = COALESCE(${updates.slug ?? null}, slug),
          description     = COALESCE(${updates.description ?? null}, description),
          category_id     = COALESCE(${updates.category ?? null}, category_id),
          category_slug   = COALESCE(${updates.category ?? null}, category_slug),
          price           = COALESCE(${updates.price ?? null}, price),
          compare_price   = COALESCE(${updates.comparePrice ?? null}, compare_price),
          images          = COALESCE(${updates.images ? JSON.stringify(updates.images) : null}, images),
          image_url       = COALESCE(${updates.images?.[0] ?? null}, image_url),
          stock_quantity  = COALESCE(${updates.stockQuantity ?? null}, stock_quantity),
          sku             = COALESCE(${updates.sku ?? null}, sku),
          is_new_arrival  = COALESCE(${updates.isNewArrival ?? null}, is_new_arrival),
          is_featured     = COALESCE(${updates.isFeatured ?? null}, is_featured),
          is_active       = COALESCE(${updates.isActive ?? null}, is_active),
          featured        = COALESCE(${updates.isFeatured ?? null}, featured),
          updated_at      = now()
        WHERE id = ${id}
      `;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}

// ── Delete ────────────────────────────────────────────────────────────────────

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await sql`DELETE FROM products WHERE id = ${id}`;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PRODUCTS_KEY });
    },
  });
}
