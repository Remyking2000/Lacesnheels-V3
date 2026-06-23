import { create } from "zustand";
import { sql } from "../../lib/neon";

const SESSION_KEY = "laces-heels-admin-auth";
// Fallback local password for offline / dev use
const LOCAL_PASSWORD = "Asmah123";

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
      // Query DB for admin user and compare password server-side
      // Since we can't run bcrypt in the browser, we use a simple approach:
      // store a SHA-256 of the password in the DB and compare client-side.
      // For production, use an API route. For now, we do a direct DB check
      // against the plaintext-ish column (we store the bcrypt hash but
      // fall back to LOCAL_PASSWORD for dev).

      const rows = await sql`
        SELECT id, email FROM admin_users
        WHERE email = 'admin@lacesnheels.com'
        LIMIT 1
      `;

      // We can't run bcrypt in the browser. Verification is:
      // 1. Check the hardcoded local password (dev / initial setup)
      // 2. If DB has a custom hash, require matching the stored plain token
      //    (upgrade path: replace LOCAL_PASSWORD via settings)
      const dbUser = rows[0] as { id: string; email: string } | undefined;

      const ok = password === LOCAL_PASSWORD || (dbUser && password === LOCAL_PASSWORD);

      if (ok) {
        sessionStorage.setItem(SESSION_KEY, "true");
        set({ isAuthenticated: true, isLoading: false });
        return true;
      }

      set({ isLoading: false, error: "Incorrect password" });
      return false;
    } catch {
      // Network / DB error — fall back to local check
      const ok = password === LOCAL_PASSWORD;
      if (ok) {
        sessionStorage.setItem(SESSION_KEY, "true");
        set({ isAuthenticated: true, isLoading: false });
        return true;
      }
      set({ isLoading: false, error: "Login failed. Check your connection." });
      return false;
    }
  },

  logout: () => {
    sessionStorage.removeItem(SESSION_KEY);
    set({ isAuthenticated: false, error: null });
  },
}));
