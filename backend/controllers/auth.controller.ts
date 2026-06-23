import type { Request, Response } from "express";
import { AuthModel } from "../models/auth.model.js";

export const AuthController = {
  // POST /api/auth/login
  async login(req: Request, res: Response) {
    try {
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ success: false, message: "Password is required" });
      }

      const valid = AuthModel.verifyPassword(password);
      if (!valid) {
        return res.status(401).json({ success: false, message: "Incorrect password" });
      }

      // Simple session token — replace with JWT in production
      const token = Buffer.from(`admin:${Date.now()}`).toString("base64");
      res.json({ success: true, token, message: "Login successful" });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // POST /api/auth/verify  (lightweight token check)
  async verify(req: Request, res: Response) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }
    try {
      const decoded = Buffer.from(token, "base64").toString("utf-8");
      const valid = decoded.startsWith("admin:");
      if (!valid) {
        return res.status(401).json({ success: false, message: "Invalid token" });
      }
      res.json({ success: true, message: "Token is valid" });
    } catch {
      res.status(401).json({ success: false, message: "Invalid token" });
    }
  },
};
