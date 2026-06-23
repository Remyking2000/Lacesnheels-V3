import type { Request, Response } from "express";
import { SettingsModel } from "../models/settings.model.js";

export const SettingsController = {
  // GET /api/settings
  async getAll(_req: Request, res: Response) {
    try {
      const settings = await SettingsModel.getAll();
      res.json({ success: true, data: settings });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // PUT /api/settings
  async update(req: Request, res: Response) {
    try {
      const { storeName, storeEmail, storePhone, storeAddress, storeCurrency } = req.body;

      if (!storeName?.trim()) {
        return res.status(400).json({ success: false, message: "Store name is required" });
      }

      const updated = await SettingsModel.upsert({
        storeName:     storeName     ?? "",
        storeEmail:    storeEmail    ?? "",
        storePhone:    storePhone    ?? "",
        storeAddress:  storeAddress  ?? "",
        storeCurrency: storeCurrency ?? "KES",
      });

      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },
};
