import { sql } from "../config/db.js";

export interface Product {
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

export interface CreateProductInput {
  id?: string;
  slug: string;
  name: string;
  description?: string;
  categoryId: string;
  price: number;
  comparePrice?: number;
  images?: string[];
  stockQuantity?: number;
  sku?: string;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  price?: number;
  comparePrice?: number | null;
  images?: string[];
  stockQuantity?: number;
  sku?: string;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
}

export const ProductModel = {
  async getAll(activeOnly = true): Promise<Product[]> {
    const rows = activeOnly
      ? await sql`
          SELECT p.*, c.name AS category_name
          FROM products p
          LEFT JOIN categories c
            ON c.id::text = p.category_id OR c.slug = p.category_slug
          WHERE p.is_active = true
          ORDER BY p.sort_order ASC, p.created_at DESC
        `
      : await sql`
          SELECT p.*, c.name AS category_name
          FROM products p
          LEFT JOIN categories c
            ON c.id::text = p.category_id OR c.slug = p.category_slug
          ORDER BY p.created_at DESC
        `;
    return rows as Product[];
  },

  async getById(id: string): Promise<Product | null> {
    const rows = await sql`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c
        ON c.id::text = p.category_id OR c.slug = p.category_slug
      WHERE p.id = ${id}
      LIMIT 1
    `;
    return (rows[0] as Product) ?? null;
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const rows = await sql`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c
        ON c.id::text = p.category_id OR c.slug = p.category_slug
      WHERE p.slug = ${slug} AND p.is_active = true
      LIMIT 1
    `;
    return (rows[0] as Product) ?? null;
  },

  async getByCategory(categoryId: string): Promise<Product[]> {
    const rows = await sql`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c
        ON c.id::text = p.category_id OR c.slug = p.category_slug
      WHERE (p.category_id = ${categoryId} OR p.category_slug = ${categoryId})
        AND p.is_active = true
      ORDER BY p.sort_order ASC, p.created_at DESC
    `;
    return rows as Product[];
  },

  async getFeatured(limit = 4): Promise<Product[]> {
    const rows = await sql`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c
        ON c.id::text = p.category_id OR c.slug = p.category_slug
      WHERE p.is_featured = true AND p.is_active = true
      ORDER BY p.sort_order ASC
      LIMIT ${limit}
    `;
    return rows as Product[];
  },

  async create(input: CreateProductInput): Promise<Product> {
    const {
      id = crypto.randomUUID(),
      slug,
      name,
      description = "",
      categoryId,
      price,
      comparePrice,
      images = [],
      stockQuantity = 0,
      sku = "",
      isNewArrival = false,
      isFeatured = false,
      isActive = true,
    } = input;

    const imageJson = JSON.stringify(images);
    const firstImage = images[0] ?? "";
    const priceLabel = `From KES ${price.toLocaleString()}`;

    const rows = await sql`
      INSERT INTO products (
        id, slug, name, description,
        category_id, category_slug,
        price_label, badge_label, image_url,
        colors, details, condition, availability,
        price, compare_price, images,
        stock_quantity, sku,
        is_new_arrival, is_featured, is_active,
        featured, sort_order
      ) VALUES (
        ${id}, ${slug}, ${name}, ${description},
        ${categoryId}, ${categoryId},
        ${priceLabel}, ${""}, ${firstImage},
        ${""}, ${""}, ${"New"}, ${""},
        ${price}, ${comparePrice ?? null}, ${imageJson},
        ${stockQuantity}, ${sku},
        ${isNewArrival}, ${isFeatured}, ${isActive},
        ${isFeatured}, 0
      )
      ON CONFLICT (slug) DO NOTHING
      RETURNING *
    `;
    return rows[0] as Product;
  },

  async update(id: string, input: UpdateProductInput): Promise<Product | null> {
    const rows = await sql`
      UPDATE products SET
        name           = COALESCE(${input.name ?? null},          name),
        slug           = COALESCE(${input.slug ?? null},          slug),
        description    = COALESCE(${input.description ?? null},   description),
        category_id    = COALESCE(${input.categoryId ?? null},    category_id),
        category_slug  = COALESCE(${input.categoryId ?? null},    category_slug),
        price          = COALESCE(${input.price ?? null},         price),
        compare_price  = COALESCE(${input.comparePrice ?? null},  compare_price),
        images         = COALESCE(${input.images ? JSON.stringify(input.images) : null}, images),
        image_url      = COALESCE(${input.images?.[0] ?? null},   image_url),
        stock_quantity = COALESCE(${input.stockQuantity ?? null}, stock_quantity),
        sku            = COALESCE(${input.sku ?? null},           sku),
        is_new_arrival = COALESCE(${input.isNewArrival ?? null},  is_new_arrival),
        is_featured    = COALESCE(${input.isFeatured ?? null},    is_featured),
        is_active      = COALESCE(${input.isActive ?? null},      is_active),
        featured       = COALESCE(${input.isFeatured ?? null},    featured),
        updated_at     = now()
      WHERE id = ${id}
      RETURNING *
    `;
    return (rows[0] as Product) ?? null;
  },

  async delete(id: string): Promise<boolean> {
    const rows = await sql`
      DELETE FROM products WHERE id = ${id} RETURNING id
    `;
    return rows.length > 0;
  },

  async search(query: string): Promise<Product[]> {
    const like = `%${query.toLowerCase()}%`;
    const rows = await sql`
      SELECT p.*, c.name AS category_name
      FROM products p
      LEFT JOIN categories c
        ON c.id::text = p.category_id OR c.slug = p.category_slug
      WHERE p.is_active = true
        AND (
          LOWER(p.name) LIKE ${like}
          OR LOWER(p.sku)  LIKE ${like}
          OR LOWER(p.description) LIKE ${like}
        )
      ORDER BY p.sort_order ASC
    `;
    return rows as Product[];
  },
};
