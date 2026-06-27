import type { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/user.model.js";
import { UserCartModel } from "../models/user-cart.model.js";
import { UserWishlistModel } from "../models/user-wishlist.model.js";

const CLIENT_ID  = process.env.GOOGLE_CLIENT_ID ?? "";
const JWT_SECRET = process.env.JWT_SECRET ?? "fallback-secret";
const client     = new OAuth2Client(CLIENT_ID);

/** Build the full login response — user profile + JWT + saved data */
async function buildLoginResponse(userId: string, user: {
  id: string; email: string; name: string; avatar: string;
}) {
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: "30d" },
  );

  const [cartItems, wishlistSlugs] = await Promise.all([
    UserCartModel.getByUserId(userId),
    UserWishlistModel.getByUserId(userId),
  ]);

  const cart = cartItems.map((item) => ({
    slug:     item.product_slug,
    name:     item.name,
    price:    item.price,
    priceNum: parseFloat(item.price_num as unknown as string) || 0,
    image:    item.image,
    quantity: item.quantity,
  }));

  return {
    user:     { id: user.id, email: user.email, name: user.name, avatar: user.avatar },
    token,
    cart,
    wishlist: wishlistSlugs,
  };
}

export const GoogleAuthController = {
  // POST /api/auth/google  — verify Google ID token (one-tap flow)
  async verify(req: Request, res: Response) {
    const { credential } = req.body as { credential?: string };
    if (!credential) {
      return res.status(400).json({ success: false, message: "Google credential is required" });
    }
    try {
      const ticket = await client.verifyIdToken({ idToken: credential, audience: CLIENT_ID });
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email) {
        return res.status(401).json({ success: false, message: "Invalid Google token" });
      }
      const user = await UserModel.upsertGoogleUser({
        googleId: payload.sub,
        email:    payload.email,
        name:     payload.name ?? payload.email,
        avatar:   payload.picture ?? "",
      });
      const data = await buildLoginResponse(user.id, user);
      res.json({ success: true, data });
    } catch (err) {
      console.error("[google-auth]", (err as Error).message);
      res.status(401).json({ success: false, message: "Google authentication failed" });
    }
  },

  // POST /api/auth/google/callback  — access-token flow (receives user info directly)
  async callback(req: Request, res: Response) {
    const { googleId, email, name, avatar } = req.body as {
      googleId?: string; email?: string; name?: string; avatar?: string;
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
      const data = await buildLoginResponse(user.id, user);
      res.json({ success: true, data });
    } catch (err) {
      console.error("[google-auth/callback]", (err as Error).message);
      res.status(500).json({ success: false, message: "Failed to sign in" });
    }
  },
};
