import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { DbProduct } from "../lib/neon";
import type { AdminProduct } from "../admin/types";

export const PRODUCTS_KEY = ["products"] as const;

// ── Map DB row → AdminProduct ─────────────────────────────────────────────────

export function dbProductToAdmin(row: DbProduct): AdminProduct {
  let images: string[] = [];
  try { images = JSON.parse(row.images); } catch { /* ignore */ }
  if (images.length === 0 && row.image_url) images = [row.image_url];

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    category: row.category_id || row.category_slug,
    price: parseFloat(row.price) || 0,
    comparePrice: row.compare_price ? parseFloat(row.compare_price) : undefined,
    images,
    stockQuantity: row.stock_quantity,
    sku: row.sku,
    isNewArrival: row.is_new_arrival,
    isFeatured: row.is_featured,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_KEY,
    queryFn: async () => {
      const rows = await api.get<DbProduct[]>("/api/products");
      return rows.map(dbProductToAdmin);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminProducts() {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, "admin"],
    queryFn: async () => {
      const rows = await api.get<DbProduct[]>("/api/products?admin=true");
      return rows.map(dbProductToAdmin);
    },
    staleTime: 1000 * 60,
  });
}

export function useProduct(slug: string | undefined) {
  return useQuery({
    queryKey: [...PRODUCTS_KEY, slug],
    enabled: !!slug,
    queryFn: async () => {
      const row = await api.get<DbProduct>(`/api/products/slug/${slug}`);
      return dbProductToAdmin(row);
    },
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: AdminProduct) =>
      api.post<DbProduct>("/api/products", {
        slug:          p.slug,
        name:          p.name,
        description:   p.description,
        categoryId:    p.category,
        price:         p.price,
        comparePrice:  p.comparePrice,
        images:        p.images,
        stockQuantity: p.stockQuantity,
        sku:           p.sku,
        isNewArrival:  p.isNewArrival,
        isFeatured:    p.isFeatured,
        isActive:      p.isActive,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<AdminProduct> }) =>
      api.put<DbProduct>(`/api/products/${id}`, {
        name:          updates.name,
        slug:          updates.slug,
        description:   updates.description,
        categoryId:    updates.category,
        price:         updates.price,
        comparePrice:  updates.comparePrice,
        images:        updates.images,
        stockQuantity: updates.stockQuantity,
        sku:           updates.sku,
        isNewArrival:  updates.isNewArrival,
        isFeatured:    updates.isFeatured,
        isActive:      updates.isActive,
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/api/products/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: PRODUCTS_KEY }),
  });
}
