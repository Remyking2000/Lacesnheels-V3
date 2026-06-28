import type { Request, Response } from "express";
import { UserCartModel } from "../models/user-cart.model.js";
import { UserWishlistModel } from "../models/user-wishlist.model.js";

export const UserDataController = {
  // ── Cart ──────────────────────────────────────────────────────────────────

  // GET /api/user/cart
  async getCart(req: Request, res: Response) {
    try {
      const userId = req.currentUser!.userId;
      const items = await UserCartModel.getByUserId(userId);
      // Map DB row → CartItem shape expected by frontend
      const mapped = items.map((item) => ({
        slug:     item.product_slug,
        name:     item.name,
        price:    item.price,
        priceNum: parseFloat(item.price_num as unknown as string) || 0,
        image:    item.image,
        quantity: item.quantity,
      }));
      res.json({ success: true, data: mapped });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // POST /api/user/cart  { slug, name, price, priceNum, image, quantity }
  async addToCart(req: Request, res: Response) {
    try {
      const userId = req.currentUser!.userId;
      const { slug, name, price, priceNum, image, quantity = 1 } = req.body;
      if (!slug) return res.status(400).json({ success: false, message: "slug is required" });

      await UserCartModel.upsert(userId, {
        productSlug: slug,
        name:        name ?? "",
        price:       price ?? "",
        priceNum:    parseFloat(priceNum) || 0,
        image:       image ?? "",
        quantity:    parseInt(quantity) || 1,
      });
      res.json({ success: true, data: null });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // PATCH /api/user/cart/:slug  { quantity }
  async updateCartQuantity(req: Request, res: Response) {
    try {
      const userId   = req.currentUser!.userId;
      const slug     = req.params.slug as string;
      const quantity = parseInt(req.body.quantity);
      if (isNaN(quantity)) return res.status(400).json({ success: false, message: "quantity required" });

      await UserCartModel.updateQuantity(userId, slug, quantity);
      res.json({ success: true, data: null });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // DELETE /api/user/cart/:slug
  async removeFromCart(req: Request, res: Response) {
    try {
      const userId = req.currentUser!.userId;
      await UserCartModel.remove(userId, req.params.slug as string);
      res.json({ success: true, data: null });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // DELETE /api/user/cart
  async clearCart(req: Request, res: Response) {
    try {
      await UserCartModel.clear(req.currentUser!.userId);
      res.json({ success: true, data: null });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // PUT /api/user/cart  { items: CartItem[] } — full replace (sync on login)
  async syncCart(req: Request, res: Response) {
    try {
      const userId = req.currentUser!.userId;
      const { items } = req.body as {
        items: Array<{
          slug: string; name: string; price: string; priceNum: number;
          image: string; quantity: number;
        }>;
      };
      await UserCartModel.replaceAll(userId, items.map((i) => ({
        productSlug: i.slug,
        name:        i.name,
        price:       i.price,
        priceNum:    i.priceNum,
        image:       i.image,
        quantity:    i.quantity,
      })));
      res.json({ success: true, data: null });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // ── Wishlist ──────────────────────────────────────────────────────────────

  // GET /api/user/wishlist
  async getWishlist(req: Request, res: Response) {
    try {
      const slugs = await UserWishlistModel.getByUserId(req.currentUser!.userId);
      res.json({ success: true, data: slugs });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // POST /api/user/wishlist  { slug }
  async addToWishlist(req: Request, res: Response) {
    try {
      const { slug } = req.body;
      if (!slug) return res.status(400).json({ success: false, message: "slug is required" });
      await UserWishlistModel.add(req.currentUser!.userId, slug);
      res.json({ success: true, data: null });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // POST /api/user/wishlist/toggle  { slug }  → returns { inWishlist: boolean }
  async toggleWishlist(req: Request, res: Response) {
    try {
      const { slug } = req.body;
      if (!slug) return res.status(400).json({ success: false, message: "slug is required" });
      const inWishlist = await UserWishlistModel.toggle(req.currentUser!.userId, slug);
      res.json({ success: true, data: { inWishlist } });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // DELETE /api/user/wishlist/:slug
  async removeFromWishlist(req: Request, res: Response) {
    try {
      await UserWishlistModel.remove(req.currentUser!.userId, req.params.slug as string);
      res.json({ success: true, data: null });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // PUT /api/user/wishlist  { slugs: string[] } — full replace (sync on login)
  async syncWishlist(req: Request, res: Response) {
    try {
      const { slugs } = req.body as { slugs: string[] };
      await UserWishlistModel.replaceAll(req.currentUser!.userId, slugs ?? []);
      res.json({ success: true, data: null });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },
};
