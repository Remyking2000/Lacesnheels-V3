import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setUserToken, clearUserToken } from "../lib/api";
import { useCartStore } from "./cart-store";
import { useWishlistStore } from "./wishlist-store";
import type { CartItem } from "./cart-store";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  onSignIn: (data: {
    user: UserProfile;
    token: string;
    cart: CartItem[];
    wishlist: string[];
  }) => void;
  signOut: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      onSignIn: ({ user, token, cart, wishlist }) => {
        // Store JWT so api.ts attaches it on every future request
        setUserToken(token);
        // Restore cart and wishlist from DB
        useCartStore.getState().loadItems(cart);
        useWishlistStore.getState().loadItems(wishlist);
        set({ user, isLoading: false });
      },

      signOut: () => {
        clearUserToken();
        // Clear local state only — DB records stay intact
        useCartStore.setState({ items: [] });
        useWishlistStore.setState({ items: [] });
        set({ user: null });
      },
    }),
    {
      name: "lnh-user",
      partialize: (s) => ({ user: s.user }),
    },
  ),
);
