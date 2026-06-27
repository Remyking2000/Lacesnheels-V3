import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/api";

type WishlistState = {
  items: string[];

  /** Load items (called after sign-in to replace local state with DB data) */
  loadItems: (slugs: string[]) => void;

  toggle: (slug: string) => void;
};

function syncToggle(slug: string) {
  api.post("/api/user/wishlist/toggle", { slug }).catch(() => {});
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],

      loadItems: (slugs) => set({ items: slugs }),

      toggle: (slug) => {
        set((state) => ({
          items: state.items.includes(slug)
            ? state.items.filter((s) => s !== slug)
            : [...state.items, slug],
        }));
        syncToggle(slug);
      },
    }),
    { name: "lnh-wishlist" },
  ),
);
