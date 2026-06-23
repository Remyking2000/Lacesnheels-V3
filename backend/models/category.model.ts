import { sql } from "../config/db.js";

export interface Category {
  id: string;
  slug: string;
  name: string;
  intro: string;
  image_url: string;
  created_at: string;
}

export const CategoryModel = {
  async getAll(): Promise<Category[]> {
    const rows = await sql`
      SELECT id, slug, name, intro, image_url, created_at
      FROM categories
      ORDER BY name ASC
    `;
    return rows as Category[];
  },

  async getById(id: string): Promise<Category | null> {
    const rows = await sql`
      SELECT * FROM categories WHERE id = ${id} LIMIT 1
    `;
    return (rows[0] as Category) ?? null;
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const rows = await sql`
      SELECT * FROM categories WHERE slug = ${slug} LIMIT 1
    `;
    return (rows[0] as Category) ?? null;
  },

  async create(name: string, intro = "", imageUrl = ""): Promise<Category> {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

    const rows = await sql`
      INSERT INTO categories (slug, name, intro, image_url)
      VALUES (${slug}, ${name}, ${intro}, ${imageUrl})
      ON CONFLICT (slug) DO UPDATE SET
        name      = excluded.name,
        intro     = excluded.intro,
        image_url = excluded.image_url
      RETURNING *
    `;
    return rows[0] as Category;
  },

  async update(id: string, name: string): Promise<Category | null> {
    const rows = await sql`
      UPDATE categories SET name = ${name}
      WHERE id = ${id}
      RETURNING *
    `;
    return (rows[0] as Category) ?? null;
  },

  async delete(id: string): Promise<boolean> {
    const rows = await sql`
      DELETE FROM categories WHERE id = ${id} RETURNING id
    `;
    return rows.length > 0;
  },
};
