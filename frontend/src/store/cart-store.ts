import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  addItem: (product: { slug: string; name: string; price: string; priceNum: number; image: string }) => void;
  removeItem: (slug: string) => void;
  updateQuantity: (slug: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          const existing = state.items.find((item) => item.slug === product.slug);
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.slug === product.slug
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }
          return {
            items: [...state.items, { ...product, quantity: 1 }],
          };
        }),
      removeItem: (slug) =>
        set((state) => ({ items: state.items.filter((item) => item.slug !== slug) })),
      updateQuantity: (slug, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.slug === slug ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "lnh-cart" },
  ),
);
