// ── Admin-specific types ─────────────────────────────────────────────────────

export interface AdminProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  comparePrice?: number;
  images: string[];
  stockQuantity: number;
  sku: string;
  isNewArrival: boolean;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminCategory {
  id: string;
  name: string;
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  customer: string;
  items: string;
  total: number;
  status: "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled";
  date: string;
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeCurrency: string;
}

export interface ActivityLog {
  id: string;
  action: string;
  target: string;
  timestamp: string;
}

export type StockStatus = "In Stock" | "Low Stock" | "Out of Stock";

export function getStockStatus(qty: number): StockStatus {
  if (qty === 0) return "Out of Stock";
  if (qty <= 3) return "Low Stock";
  return "In Stock";
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}
