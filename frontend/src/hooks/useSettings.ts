import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sql } from "../lib/neon";
import type { DbSetting } from "../lib/neon";
import type { StoreSettings } from "../admin/types";

export const SETTINGS_KEY = ["settings"] as const;

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Laces & Heels",
  storeEmail: "hello@lacesnheels.com",
  storePhone: "+254 100 663761",
  storeAddress: "Nairobi, Kenya",
  storeCurrency: "KES",
};

function rowsToSettings(rows: DbSetting[]): StoreSettings {
  const map: Record<string, string> = {};
  rows.forEach((r) => { map[r.key] = r.value; });
  return {
    storeName: map.storeName ?? DEFAULT_SETTINGS.storeName,
    storeEmail: map.storeEmail ?? DEFAULT_SETTINGS.storeEmail,
    storePhone: map.storePhone ?? DEFAULT_SETTINGS.storePhone,
    storeAddress: map.storeAddress ?? DEFAULT_SETTINGS.storeAddress,
    storeCurrency: map.storeCurrency ?? DEFAULT_SETTINGS.storeCurrency,
  };
}

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: async () => {
      const rows = await sql`SELECT key, value FROM store_settings`;
      return rowsToSettings(rows as unknown as DbSetting[]);
    },
    staleTime: 1000 * 60 * 10,
    placeholderData: DEFAULT_SETTINGS,
  });
}

export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (settings: StoreSettings) => {
      const entries = Object.entries(settings);
      for (const [key, value] of entries) {
        await sql`
          INSERT INTO store_settings (key, value)
          VALUES (${key}, ${value})
          ON CONFLICT (key) DO UPDATE SET value = excluded.value, updated_at = now()
        `;
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: SETTINGS_KEY }),
  });
}

