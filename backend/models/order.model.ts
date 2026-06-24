import { sql } from "../config/db.js";

export type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

export interface Order {
  id: string;
  order_ref: string;
  customer: string;
  customer_phone: string;
  items: string; // JSON string
  total: string;
  status: OrderStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  name: string;
  price: string;
  quantity?: number;
}

export interface CreateOrderInput {
  customer?: string;
  customerPhone?: string;
  items: OrderItem[];
  total: number;
  notes?: string;
}

export const OrderModel = {
  async getAll(): Promise<Order[]> {
    const rows = await sql`
      SELECT * FROM orders
      ORDER BY created_at DESC
    `;
    return rows as Order[];
  },

  async getById(id: string): Promise<Order | null> {
    const rows = await sql`
      SELECT * FROM orders WHERE id = ${id} LIMIT 1
    `;
    return (rows[0] as Order) ?? null;
  },

  async getByRef(ref: string): Promise<Order | null> {
    const rows = await sql`
      SELECT * FROM orders WHERE order_ref = ${ref} LIMIT 1
    `;
    return (rows[0] as Order) ?? null;
  },

  async getByStatus(status: OrderStatus): Promise<Order[]> {
    const rows = await sql`
      SELECT * FROM orders
      WHERE status = ${status}
      ORDER BY created_at DESC
    `;
    return rows as Order[];
  },

  async create(input: CreateOrderInput): Promise<Order> {
    const ref = "ORD-" + Date.now().toString().slice(-6);
    const itemsJson = JSON.stringify(input.items);

    const rows = await sql`
      INSERT INTO orders (
        order_ref, customer, customer_phone,
        items, total, notes
      ) VALUES (
        ${ref},
        ${input.customer ?? ""},
        ${input.customerPhone ?? ""},
        ${itemsJson},
        ${input.total},
        ${input.notes ?? ""}
      )
      RETURNING *
    `;
    return rows[0] as Order;
  },

  async updateStatus(id: string, status: OrderStatus): Promise<Order | null> {
    const rows = await sql`
      UPDATE orders
      SET status = ${status}, updated_at = now()
      WHERE id = ${id}
      RETURNING *
    `;
    return (rows[0] as Order) ?? null;
  },

  async delete(id: string): Promise<boolean> {
    const rows = await sql`
      DELETE FROM orders WHERE id = ${id} RETURNING id
    `;
    return rows.length > 0;
  },

  async getStats(): Promise<Record<OrderStatus, number>> {
    const rows = await sql`
      SELECT status, COUNT(*)::int AS count
      FROM orders
      GROUP BY status
    `;
    const base: Record<OrderStatus, number> = {
      Pending: 0, Processing: 0, Shipped: 0, Delivered: 0, Cancelled: 0,
    };
    rows.forEach((r) => { base[r.status as OrderStatus] = r.count; });
    return base;
  },
};
