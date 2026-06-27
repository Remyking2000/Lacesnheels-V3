import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setUserToken, clearUserToken } from "../lib/api";
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
  /** Called after a successful Google sign-in with the full server response */
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
        // 1. Persist the JWT so api.ts attaches it on every request
        setUserToken(token);

        // 2. Load cart + wishlist from DB into local stores
        // Import lazily to avoid circular deps
        import("./cart-store").then(({ useCartStore }) => {
          useCartStore.getState().loadItems(cart);
        });
        import("./wishlist-store").then(({ useWishlistStore }) => {
          useWishlistStore.getState().loadItems(wishlist);
        });

        set({ user, isLoading: false });
      },

      signOut: () => {
        // Remove JWT — future requests won't carry it
        clearUserToken();

        // Clear only local state — DB records stay intact
        import("./cart-store").then(({ useCartStore }) => {
          useCartStore.setState({ items: [] });
        });
        import("./wishlist-store").then(({ useWishlistStore }) => {
          useWishlistStore.setState({ items: [] });
        });

        set({ user: null });
      },
    }),
    {
      name: "lnh-user",
      partialize: (s) => ({ user: s.user }),
    },
  ),
);
