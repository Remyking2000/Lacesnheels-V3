import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { StoreSettings } from "../admin/types";

export const SETTINGS_KEY = ["settings"] as const;

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Laces & Heels",
  storeEmail: "hello@lacesnheels.com",
  storePhone: "+254 100 663761",
  storeAddress: "Nairobi, Kenya",
  storeCurrency: "KES",
};

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => api.get<StoreSettings>("/api/settings"),
    staleTime: 1000 * 60 * 10,
    placeholderData: DEFAULT_SETTINGS,
  });
}

export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings: StoreSettings) =>
      api.put<StoreSettings>("/api/settings", settings),
    onSuccess: () => qc.invalidateQueries({ queryKey: SETTINGS_KEY }),
  });
}
