import { useState } from "react";
import { format } from "date-fns";
import { useAdminStore } from "../store/admin-store";
import { StatusBadge } from "../components/StatusBadge";
import type { AdminOrder } from "../types";

const STATUS_OPTIONS: AdminOrder["status"][] = [
  "Pending", "Processing", "Shipped", "Delivered", "Cancelled",
];

export function OrdersPage() {
  const { orders } = useAdminStore();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    const matchSearch = !q || o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900 dark:text-white">Orders</h1>
        <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
          Track and manage customer orders.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input flex-1 min-w-[200px]"
          placeholder="Search order ID or customer..."
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input w-auto"
        >
          <option value="all">All Statuses</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {STATUS_OPTIONS.map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
              className={`rounded-xl border p-3 text-center transition-colors ${
                statusFilter === status
                  ? "border-gold bg-amber-50 dark:bg-amber-900/10"
                  : "border-gray-200 bg-white hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900"
              }`}
            >
              <p className="font-display text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
              <p className="mt-0.5 text-xs font-semibold text-gray-500 dark:text-gray-400">{status}</p>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wider text-gray-400 dark:border-gray-800 dark:text-gray-500">
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3 hidden md:table-cell">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 hidden sm:table-cell">Date</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                  >
                    <td className="px-5 py-3 font-mono text-xs font-semibold text-gray-600 dark:text-gray-400">
                      {order.id}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-800 dark:text-gray-200">
                      {order.customer}
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell text-gray-500 dark:text-gray-400 max-w-[200px] truncate">
                      {order.items}
                    </td>
                    <td className="px-5 py-3 font-semibold text-gray-800 dark:text-gray-200">
                      KES {order.total.toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3 hidden sm:table-cell text-xs text-gray-400">
                      {format(new Date(order.date), "MMM d, yyyy")}
                    </td>
                    <td className="px-5 py-3">
                      <button className="text-xs font-semibold text-gold hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
