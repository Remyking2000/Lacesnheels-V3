import { create } from "zustand";
import { api, setToken, clearToken } from "../../lib/api";

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
      // API returns { token, message }
      const result = await api.post<{ token: string; message: string }>(
        "/api/auth/login",
        { password },
      );
      // Persist both the "logged in" flag and the bearer token
      sessionStorage.setItem(SESSION_KEY, "true");
      setToken(result.token);
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
    clearToken();
    set({ isAuthenticated: false, error: null });
  },
}));
