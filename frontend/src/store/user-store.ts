import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

interface UserState {
  user: UserProfile | null;
  isLoading: boolean;
  signOut: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      signOut: () => set({ user: null }),
    }),
    {
      name: "lnh-user",
      partialize: (s) => ({ user: s.user }),
    },
  ),
);
