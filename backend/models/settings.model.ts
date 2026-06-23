import { sql } from "../config/db.js";

export interface StoreSetting {
  key: string;
  value: string;
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeCurrency: string;
}

const DEFAULTS: StoreSettings = {
  storeName: "Laces & Heels",
  storeEmail: "hello@lacesnheels.com",
  storePhone: "+254 100 663761",
  storeAddress: "Nairobi, Kenya",
  storeCurrency: "KES",
};

export const SettingsModel = {
  async getAll(): Promise<StoreSettings> {
    const rows = await sql`SELECT key, value FROM store_settings`;
    const map: Record<string, string> = {};
    (rows as StoreSetting[]).forEach((r) => { map[r.key] = r.value; });
    return {
      storeName:     map.storeName     ?? DEFAULTS.storeName,
      storeEmail:    map.storeEmail    ?? DEFAULTS.storeEmail,
      storePhone:    map.storePhone    ?? DEFAULTS.storePhone,
      storeAddress:  map.storeAddress  ?? DEFAULTS.storeAddress,
      storeCurrency: map.storeCurrency ?? DEFAULTS.storeCurrency,
    };
  },

  async upsert(settings: StoreSettings): Promise<StoreSettings> {
    for (const [key, value] of Object.entries(settings)) {
      await sql`
        INSERT INTO store_settings (key, value)
        VALUES (${key}, ${value})
        ON CONFLICT (key) DO UPDATE
          SET value = excluded.value, updated_at = now()
      `;
    }
    return settings;
  },
};
