import { create } from "zustand";
import { persist } from "zustand/middleware";

type CartState = {
  items: string[];
  addItem: (slug: string) => void;
  removeItem: (slug: string) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (slug) =>
        set((state) => ({
          items: state.items.includes(slug) ? state.items : [...state.items, slug],
        })),
      removeItem: (slug) =>
        set((state) => ({ items: state.items.filter((item) => item !== slug) })),
      clear: () => set({ items: [] }),
    }),
    { name: "lnh-cart" },
  ),
);
