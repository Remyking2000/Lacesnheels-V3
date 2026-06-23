import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { AdminOrder } from "../admin/types";

export const ORDERS_KEY = ["orders"] as const;

interface DbOrderRow {
  id: string;
  order_ref: string;
  customer: string;
  items: string;
  total: string;
  status: string;
  created_at: string;
}

function toAdminOrder(row: DbOrderRow): AdminOrder {
  return {
    id: row.id,
    customer: row.customer || "Anonymous",
    items: row.items,
    total: parseFloat(row.total) || 0,
    status: row.status as AdminOrder["status"],
    date: row.created_at.slice(0, 10),
  };
}

export function useOrders() {
  return useQuery({
    queryKey: ORDERS_KEY,
    queryFn: async () => {
      const rows = await api.get<DbOrderRow[]>("/api/orders");
      return rows.map(toAdminOrder);
    },
    staleTime: 1000 * 30,
  });
}

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
    mutationFn: (input: CreateOrderInput) =>
      api.post<DbOrderRow>("/api/orders", input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: AdminOrder["status"] }) =>
      api.patch<DbOrderRow>(`/api/orders/${id}/status`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ORDERS_KEY }),
  });
}
