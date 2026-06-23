import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  items: string[];
  toggle: (slug: string) => void;
  moveToCart: (slug: string, addToCart: (slug: string) => void) => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      toggle: (slug) =>
        set((state) => ({
          items: state.items.includes(slug)
            ? state.items.filter((item) => item !== slug)
            : [...state.items, slug],
        })),
      moveToCart: (slug, addToCart) => {
        addToCart(slug);
        set((state) => ({ items: state.items.filter((item) => item !== slug) }));
      },
    }),
    { name: "lnh-wishlist" },
  ),
);
