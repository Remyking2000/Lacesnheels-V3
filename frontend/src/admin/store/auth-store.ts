import { create } from "zustand";
import { api } from "../../lib/api";

const SESSION_KEY = "laces-heels-admin-auth";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: sessionStorage.getItem(SESSION_KEY) === "true",
  isLoading: false,
  error: null,

  login: async (password: string) => {
    set({ isLoading: true, error: null });
    try {
      await api.post("/api/auth/login", { password });
      sessionStorage.setItem(SESSION_KEY, "true");
      set({ isAuthenticated: true, isLoading: false });
      return true;
    } catch (err) {
      const msg = (err as Error).message ?? "Login failed";
      set({ isLoading: false, error: msg });
      return false;
    }
  },

  logout: () => {
    sessionStorage.removeItem(SESSION_KEY);
    set({ isAuthenticated: false, error: null });
  },
}));
