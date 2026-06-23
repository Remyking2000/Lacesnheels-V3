import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminProduct, AdminCategory, AdminOrder, StoreSettings, ActivityLog } from "../types";

// ── Seed data ─────────────────────────────────────────────────────────────────

const defaultCategories: AdminCategory[] = [
  { id: "cat-1", name: "Suitcases", createdAt: "2025-01-01T00:00:00Z" },
  { id: "cat-2", name: "Bags", createdAt: "2025-01-01T00:00:00Z" },
  { id: "cat-3", name: "Shoes", createdAt: "2025-01-01T00:00:00Z" },
  { id: "cat-4", name: "High Heels", createdAt: "2025-01-01T00:00:00Z" },
  { id: "cat-5", name: "Sandals", createdAt: "2025-01-01T00:00:00Z" },
  { id: "cat-6", name: "Perfumes", createdAt: "2025-01-01T00:00:00Z" },
  { id: "cat-7", name: "Ponchos", createdAt: "2025-01-01T00:00:00Z" },
  { id: "cat-8", name: "Belts", createdAt: "2025-01-01T00:00:00Z" },
];

const defaultProducts: AdminProduct[] = [
  {
    id: "prod-1",
    name: "Cabin Travel Suitcase",
    slug: "cabin-travel-suitcase",
    description: "A polished travel suitcase for quick trips, gifting, and everyday travel plans.",
    category: "cat-1",
    price: 12500,
    comparePrice: 15000,
    images: ["https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=900&q=82"],
    stockQuantity: 8,
    sku: "LH-SC-001",
    isNewArrival: false,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-01-10T08:00:00Z",
    updatedAt: "2025-01-10T08:00:00Z",
  },
  {
    id: "prod-2",
    name: "Premium Soft Poncho",
    slug: "premium-soft-poncho",
    description: "A cozy but elevated layer for work days, travel, weekend plans, and gifting.",
    category: "cat-7",
    price: 4800,
    images: ["https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=82"],
    stockQuantity: 3,
    sku: "LH-PO-001",
    isNewArrival: false,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-01-12T08:00:00Z",
    updatedAt: "2025-01-12T08:00:00Z",
  },
  {
    id: "prod-3",
    name: "Structured Leather Handbag",
    slug: "structured-leather-handbag",
    description: "A clean everyday handbag that works for office looks, lunch plans, and polished errands.",
    category: "cat-2",
    price: 7900,
    images: ["https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=82"],
    stockQuantity: 5,
    sku: "LH-BG-001",
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-01-15T08:00:00Z",
    updatedAt: "2025-01-15T08:00:00Z",
  },
  {
    id: "prod-4",
    name: "Classic Ladies Shoes",
    slug: "classic-ladies-shoes",
    description: "Elegant shoes for events, work outfits, and refined everyday styling.",
    category: "cat-3",
    price: 5500,
    images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=82"],
    stockQuantity: 0,
    sku: "LH-SH-001",
    isNewArrival: true,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-01-18T08:00:00Z",
    updatedAt: "2025-01-18T08:00:00Z",
  },
  {
    id: "prod-5",
    name: "Everyday Weekend Tote",
    slug: "everyday-weekend-tote",
    description: "A roomy tote for work, shopping, travel extras, and simple gifting.",
    category: "cat-2",
    price: 6200,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=82"],
    stockQuantity: 2,
    sku: "LH-BG-002",
    isNewArrival: false,
    isFeatured: false,
    isActive: true,
    createdAt: "2025-01-20T08:00:00Z",
    updatedAt: "2025-01-20T08:00:00Z",
  },
  {
    id: "prod-6",
    name: "Gift Accessory Set",
    slug: "gift-accessory-set",
    description: "A simple giftable set for birthdays, thank-you moments, weekend visits.",
    category: "cat-2",
    price: 3500,
    images: ["https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=82"],
    stockQuantity: 12,
    sku: "LH-AC-001",
    isNewArrival: true,
    isFeatured: true,
    isActive: true,
    createdAt: "2025-01-22T08:00:00Z",
    updatedAt: "2025-01-22T08:00:00Z",
  },
];

const mockOrders: AdminOrder[] = [
  { id: "ORD-001", customer: "Aisha Mwangi", items: "Cabin Travel Suitcase x1", total: 12500, status: "Delivered", date: "2025-01-28" },
  { id: "ORD-002", customer: "Fatuma Hassan", items: "Structured Leather Handbag x1, Classic Ladies Shoes x1", total: 13400, status: "Processing", date: "2025-01-30" },
  { id: "ORD-003", customer: "Winnie Otieno", items: "Premium Soft Poncho x2", total: 9600, status: "Shipped", date: "2025-02-01" },
  { id: "ORD-004", customer: "Sandra Kamau", items: "Gift Accessory Set x3", total: 10500, status: "Pending", date: "2025-02-03" },
  { id: "ORD-005", customer: "Zara Njoroge", items: "Everyday Weekend Tote x1", total: 6200, status: "Cancelled", date: "2025-02-04" },
];

const defaultSettings: StoreSettings = {
  storeName: "Laces & Heels",
  storeEmail: "hello@lacesnheels.com",
  storePhone: "+254 100 663761",
  storeAddress: "Nairobi, Kenya",
  storeCurrency: "KES",
};

// ── Store ─────────────────────────────────────────────────────────────────────

interface AdminStoreState {
  products: AdminProduct[];
  categories: AdminCategory[];
  orders: AdminOrder[];
  settings: StoreSettings;
  activityLog: ActivityLog[];

  // Products
  addProduct: (product: AdminProduct) => void;
  updateProduct: (id: string, updates: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;

  // Categories
  addCategory: (category: AdminCategory) => void;
  updateCategory: (id: string, name: string) => void;
  deleteCategory: (id: string) => void;

  // Settings
  updateSettings: (settings: StoreSettings) => void;

  // Activity log
  logActivity: (action: string, target: string) => void;
}

export const useAdminStore = create<AdminStoreState>()(
  persist(
    (set, get) => ({
      products: defaultProducts,
      categories: defaultCategories,
      orders: mockOrders,
      settings: defaultSettings,
      activityLog: [],

      addProduct: (product) => {
        set((s) => ({ products: [product, ...s.products] }));
        get().logActivity("Created product", product.name);
      },

      updateProduct: (id, updates) => {
        set((s) => ({
          products: s.products.map((p) =>
            p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p,
          ),
        }));
        const name = get().products.find((p) => p.id === id)?.name ?? id;
        get().logActivity("Updated product", name);
      },

      deleteProduct: (id) => {
        const name = get().products.find((p) => p.id === id)?.name ?? id;
        set((s) => ({ products: s.products.filter((p) => p.id !== id) }));
        get().logActivity("Deleted product", name);
      },

      addCategory: (category) => {
        set((s) => ({ categories: [...s.categories, category] }));
        get().logActivity("Created category", category.name);
      },

      updateCategory: (id, name) => {
        set((s) => ({
          categories: s.categories.map((c) => (c.id === id ? { ...c, name } : c)),
        }));
        get().logActivity("Updated category", name);
      },

      deleteCategory: (id) => {
        const name = get().categories.find((c) => c.id === id)?.name ?? id;
        set((s) => ({ categories: s.categories.filter((c) => c.id !== id) }));
        get().logActivity("Deleted category", name);
      },

      updateSettings: (settings) => {
        set({ settings });
        get().logActivity("Updated settings", settings.storeName);
      },

      logActivity: (action, target) => {
        const entry: ActivityLog = {
          id: crypto.randomUUID(),
          action,
          target,
          timestamp: new Date().toISOString(),
        };
        set((s) => ({ activityLog: [entry, ...s.activityLog].slice(0, 50) }));
      },
    }),
    { name: "laces-heels-admin-store" },
  ),
);
