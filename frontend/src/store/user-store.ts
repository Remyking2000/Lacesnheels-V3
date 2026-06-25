import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "../lib/api";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  signInWithGoogle: (credential: string) => Promise<void>;
  signOut: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      signInWithGoogle: async (credential: string) => {
        set({ isLoading: true });
        try {
          const user = await api.post<UserProfile>("/api/auth/google", { credential });
          set({ user, isLoading: false });
        } catch (err) {
          console.error("[user-store] Google sign-in failed:", (err as Error).message);
          set({ isLoading: false });
          throw err;
        }
      },

      signOut: () => {
        set({ user: null });
      },
    }),
    {
      name: "lnh-user",
      // Only persist the user object — not loading state
      partialize: (s) => ({ user: s.user }),
    },
  ),
);
