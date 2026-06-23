/**
 * admin-store.ts
 *
 * Thin Zustand store for admin-only state that doesn't live in the DB:
 * - Activity log (session-only, not persisted)
 * - UI-level settings cache (synced from DB via useSettings hook)
 *
 * All product / category / order mutations now go through the TanStack Query
 * hooks in src/hooks/. The admin pages import those hooks directly and this
 * store is used only for cross-page state like the activity log.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ActivityLog, StoreSettings } from "../types";

const defaultSettings: StoreSettings = {
  storeName: "Laces & Heels",
  storeEmail: "hello@lacesnheels.com",
  storePhone: "+254 100 663761",
  storeAddress: "Nairobi, Kenya",
  storeCurrency: "KES",
};

interface AdminUiState {
  // Local settings cache (overwritten when DB settings load)
  settings: StoreSettings;
  setSettings: (settings: StoreSettings) => void;

  // Activity log — session memory only
  activityLog: ActivityLog[];
  logActivity: (action: string, target: string) => void;
  clearLog: () => void;
}

export const useAdminStore = create<AdminUiState>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      setSettings: (settings) => set({ settings }),

      activityLog: [],

      logActivity: (action, target) => {
        const entry: ActivityLog = {
          id: crypto.randomUUID(),
          action,
          target,
          timestamp: new Date().toISOString(),
        };
        set((s) => ({ activityLog: [entry, ...s.activityLog].slice(0, 50) }));
      },

      clearLog: () => set({ activityLog: [] }),
    }),
    {
      name: "laces-heels-admin-store",
      // Only persist settings and activityLog — products/categories come from DB
      partialize: (s) => ({ settings: s.settings, activityLog: s.activityLog }),
    },
  ),
);
