import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sql } from "../lib/neon";
import type { DbCategory } from "../lib/neon";

export const CATEGORIES_KEY = ["categories"] as const;

// ── Fetch all ─────────────────────────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: CATEGORIES_KEY,
    queryFn: async () => {
      const rows = await sql`
        SELECT id, slug, name, intro, image_url, created_at
        FROM categories
        ORDER BY name ASC
      `;
      return rows as unknown as DbCategory[];
    },
    staleTime: 1000 * 60 * 5, // 5 min
  });
}

// ── Add ───────────────────────────────────────────────────────────────────────

export function useAddCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: { name: string; slug?: string; intro?: string; imageUrl?: string }) => {
      const slug = data.slug ?? data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const rows = await sql`
        INSERT INTO categories (slug, name, intro, image_url)
        VALUES (${slug}, ${data.name}, ${data.intro ?? ""}, ${data.imageUrl ?? ""})
        ON CONFLICT (slug) DO UPDATE SET name = excluded.name
        RETURNING *
      `;
      return rows[0] as unknown as DbCategory;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

// ── Update ────────────────────────────────────────────────────────────────────

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      await sql`UPDATE categories SET name = ${name} WHERE id = ${id}`;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

// ── Delete ────────────────────────────────────────────────────────────────────

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await sql`DELETE FROM categories WHERE id = ${id}`;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: CATEGORIES_KEY }),
  });
}

