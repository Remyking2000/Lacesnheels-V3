import { sql } from "../config/db.js";

export interface UserWishlistItem {
  id: string;
  user_id: string;
  product_slug: string;
  created_at: string;
}

export const UserWishlistModel = {
  async getByUserId(userId: string): Promise<string[]> {
    const rows = await sql`
      SELECT product_slug FROM user_wishlist
      WHERE user_id = ${userId}
      ORDER BY created_at ASC
    `;
    return rows.map((r) => r.product_slug as string);
  },

  /** Add item — idempotent */
  async add(userId: string, productSlug: string): Promise<void> {
    await sql`
      INSERT INTO user_wishlist (user_id, product_slug)
      VALUES (${userId}, ${productSlug})
      ON CONFLICT (user_id, product_slug) DO NOTHING
    `;
  },

  /** Remove item */
  async remove(userId: string, productSlug: string): Promise<void> {
    await sql`
      DELETE FROM user_wishlist
      WHERE user_id = ${userId} AND product_slug = ${productSlug}
    `;
  },

  /** Toggle — returns true if now in wishlist, false if removed */
  async toggle(userId: string, productSlug: string): Promise<boolean> {
    const existing = await sql`
      SELECT id FROM user_wishlist
      WHERE user_id = ${userId} AND product_slug = ${productSlug}
      LIMIT 1
    `;
    if (existing.length > 0) {
      await sql`
        DELETE FROM user_wishlist
        WHERE user_id = ${userId} AND product_slug = ${productSlug}
      `;
      return false;
    } else {
      await sql`
        INSERT INTO user_wishlist (user_id, product_slug)
        VALUES (${userId}, ${productSlug})
        ON CONFLICT DO NOTHING
      `;
      return true;
    }
  },

  /** Replace all wishlist items (used for sync on login) */
  async replaceAll(userId: string, slugs: string[]): Promise<void> {
    await sql`DELETE FROM user_wishlist WHERE user_id = ${userId}`;
    for (const slug of slugs) {
      await sql`
        INSERT INTO user_wishlist (user_id, product_slug)
        VALUES (${userId}, ${slug})
        ON CONFLICT DO NOTHING
      `;
    }
  },
};
