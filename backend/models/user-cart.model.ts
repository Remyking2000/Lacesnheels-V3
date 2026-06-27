import { sql } from "../config/db.js";

export interface UserCartItem {
  id: string;
  user_id: string;
  product_slug: string;
  name: string;
  price: string;
  price_num: string;
  image: string;
  quantity: number;
}

export const UserCartModel = {
  async getByUserId(userId: string): Promise<UserCartItem[]> {
    const rows = await sql`
      SELECT * FROM user_cart WHERE user_id = ${userId} ORDER BY created_at ASC
    `;
    return rows as UserCartItem[];
  },

  /** Add item or increment quantity if already exists */
  async upsert(userId: string, item: {
    productSlug: string;
    name: string;
    price: string;
    priceNum: number;
    image: string;
    quantity: number;
  }): Promise<UserCartItem> {
    const rows = await sql`
      INSERT INTO user_cart (user_id, product_slug, name, price, price_num, image, quantity)
      VALUES (${userId}, ${item.productSlug}, ${item.name}, ${item.price}, ${item.priceNum}, ${item.image}, ${item.quantity})
      ON CONFLICT (user_id, product_slug) DO UPDATE
        SET quantity   = user_cart.quantity + excluded.quantity,
            name       = excluded.name,
            price      = excluded.price,
            price_num  = excluded.price_num,
            image      = excluded.image,
            updated_at = now()
      RETURNING *
    `;
    return rows[0] as UserCartItem;
  },

  /** Set exact quantity (from UI controls) */
  async updateQuantity(userId: string, productSlug: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await sql`DELETE FROM user_cart WHERE user_id = ${userId} AND product_slug = ${productSlug}`;
    } else {
      await sql`
        UPDATE user_cart SET quantity = ${quantity}, updated_at = now()
        WHERE user_id = ${userId} AND product_slug = ${productSlug}
      `;
    }
  },

  async remove(userId: string, productSlug: string): Promise<void> {
    await sql`DELETE FROM user_cart WHERE user_id = ${userId} AND product_slug = ${productSlug}`;
  },

  async clear(userId: string): Promise<void> {
    await sql`DELETE FROM user_cart WHERE user_id = ${userId}`;
  },

  /** Replace the entire cart (used for sync on login) */
  async replaceAll(userId: string, items: Array<{
    productSlug: string;
    name: string;
    price: string;
    priceNum: number;
    image: string;
    quantity: number;
  }>): Promise<void> {
    await sql`DELETE FROM user_cart WHERE user_id = ${userId}`;
    for (const item of items) {
      await sql`
        INSERT INTO user_cart (user_id, product_slug, name, price, price_num, image, quantity)
        VALUES (${userId}, ${item.productSlug}, ${item.name}, ${item.price}, ${item.priceNum}, ${item.image}, ${item.quantity})
        ON CONFLICT DO NOTHING
      `;
    }
  },
};
