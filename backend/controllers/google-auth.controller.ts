import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { UserModel } from "../models/user.model.js";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
const client = new OAuth2Client(CLIENT_ID);

export const GoogleAuthController = {
  // POST /api/auth/google  — verify Google ID token (one-tap flow)
  async verify(req: Request, res: Response) {
    const { credential } = req.body as { credential?: string };

    if (!credential) {
      return res.status(400).json({ success: false, message: "Google credential is required" });
    }

    try {
      const ticket = await client.verifyIdToken({
        idToken: credential,
        audience: CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.sub || !payload.email) {
        return res.status(401).json({ success: false, message: "Invalid Google token" });
      }

      const user = await UserModel.upsertGoogleUser({
        googleId: payload.sub,
        email:    payload.email,
        name:     payload.name ?? payload.email,
        avatar:   payload.picture ?? "",
      });

      res.json({
        success: true,
        data: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
      });
    } catch (err) {
      console.error("[google-auth]", (err as Error).message);
      res.status(401).json({ success: false, message: "Google authentication failed" });
    }
  },

  // POST /api/auth/google/callback  — receive user info from implicit/access-token flow
  async callback(req: Request, res: Response) {
    const { googleId, email, name, avatar } = req.body as {
      googleId?: string;
      email?: string;
      name?: string;
      avatar?: string;
    };

    if (!googleId || !email) {
      return res.status(400).json({ success: false, message: "googleId and email are required" });
    }

    try {
      const user = await UserModel.upsertGoogleUser({
        googleId,
        email,
        name:   name   ?? email,
        avatar: avatar ?? "",
      });

      res.json({
        success: true,
        data: { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
      });
    } catch (err) {
      console.error("[google-auth/callback]", (err as Error).message);
      res.status(500).json({ success: false, message: "Failed to save user" });
    }
  },
};
