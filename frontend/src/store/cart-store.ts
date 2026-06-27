import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/api";

export interface CartItem {
  slug: string;
  name: string;
  price: string;
  priceNum: number;
  image: string;
  quantity: number;
}

type CartState = {
  items: CartItem[];

  /** Load items (called after sign-in to replace local state with DB data) */
  loadItems: (items: CartItem[]) => void;

  addItem: (product: Omit<CartItem, "quantity">) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
};

/** Fire-and-forget DB sync — never blocks the UI */
function syncAdd(item: CartItem) {
  api.post("/api/user/cart", item).catch(() => {/* offline — local state is source of truth */});
}
function syncRemove(slug: string) {
  api.delete(`/api/user/cart/${slug}`).catch(() => {});
}
function syncQuantity(slug: string, quantity: number) {
  api.patch(`/api/user/cart/${slug}`, { quantity }).catch(() => {});
}
function syncClear() {
  api.delete("/api/user/cart").catch(() => {});
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      loadItems: (items) => set({ items }),

      addItem: (product) => {
        set((state) => {
          const existing = state.items.find((i) => i.slug === product.slug);
          if (existing) {
            const updated = state.items.map((i) =>
              i.slug === product.slug ? { ...i, quantity: i.quantity + 1 } : i,
            );
            syncQuantity(product.slug, existing.quantity + 1);
            return { items: updated };
          }
          const newItem: CartItem = { ...product, quantity: 1 };
          syncAdd(newItem);
          return { items: [...state.items, newItem] };
        });
      },

      removeItem: (slug) => {
        set((state) => ({ items: state.items.filter((i) => i.slug !== slug) }));
        syncRemove(slug);
      },

      updateQuantity: (slug, quantity) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.slug === slug ? { ...i, quantity: Math.max(1, quantity) } : i,
          ),
        }));
        syncQuantity(slug, Math.max(1, quantity));
      },

      clear: () => {
        set({ items: [] });
        syncClear();
      },
    }),
    { name: "lnh-cart" },
  ),
);
