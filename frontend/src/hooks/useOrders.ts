import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sql } from "../lib/neon";
import type { DbOrder } from "../lib/neon";
import type { AdminOrder } from "../admin/types";

export const ORDERS_KEY = ["orders"] as const;

function dbOrderToAdmin(row: DbOrder): AdminOrder {
  return {
    id: row.id,
    customer: row.customer || "Anonymous",
    items: row.items,
    total: parseFloat(row.total) || 0,
    status: row.status as AdminOrder["status"],
    date: row.created_at.slice(0, 10),
  };
}

// ── Fetch all ─────────────────────────────────────────────────────────────────

export function useOrders() {
  return useQuery({
    queryKey: ORDERS_KEY,
    queryFn: async () => {
      const rows = await sql`
        SELECT * FROM orders ORDER BY created_at DESC
      `;
      return (rows as DbOrder[]).map(dbOrderToAdmin);
    },
    staleTime: 1000 * 30,
  });
}

// ── Create order (called when customer checks out via WhatsApp) ───────────────

export interface CreateOrderInput {
  customer?: string;
  customerPhone?: string;
  items: Array<{ name: string; price: string }>;
  total: number;
  notes?: string;
}

export function useCreateOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateOrderInput) => {
      // Generate a human-readable order ref
      const ref = "ORD-" + Date.now().toString().slice(-6);
      await sql`
        INSERT INTO orders (order_ref, customer, customer_phone, items, total, notes)
        VALUES (
          ${ref},
          ${input.customer ?? ""},
          ${input.customerPhone ?? ""},
          ${JSON.stringify(input.items)},
          ${input.total},
          ${input.notes ?? ""}
        )
      `;
      return ref;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
}

// ── Update order status ───────────────────────────────────────────────────────

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: AdminOrder["status"] }) => {
      await sql`
        UPDATE orders SET status = ${status}, updated_at = now() WHERE id = ${id}
      `;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
}
