import { create } from "zustand";

type WishlistState = {
  items: string[];
  toggle: (slug: string) => void;
};

export const useWishlistStore = create<WishlistState>((set) => ({
  items: [],
  toggle: (slug) =>
    set((state) => ({
      items: state.items.includes(slug) ? state.items.filter((item) => item !== slug) : [...state.items, slug],
    })),
}));
