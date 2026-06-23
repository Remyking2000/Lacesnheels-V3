import { create } from "zustand";

const SESSION_KEY = "laces-heels-admin-auth";
const ADMIN_PASSWORD = "Asmah123";

interface AuthState {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  checkSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: sessionStorage.getItem(SESSION_KEY) === "true",

  login: (password: string) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      set({ isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => {
    sessionStorage.removeItem(SESSION_KEY);
    set({ isAuthenticated: false });
  },

  checkSession: () => {
    set({ isAuthenticated: sessionStorage.getItem(SESSION_KEY) === "true" });
  },
}));
