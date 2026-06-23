import type { Request, Response } from "express";
import { ProductModel } from "../models/product.model.js";

export const ProductController = {
  // GET /api/products
  async getAll(req: Request, res: Response) {
    try {
      const adminMode = req.query.admin === "true";
      const products = await ProductModel.getAll(!adminMode);
      res.json({ success: true, data: products });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // GET /api/products/featured
  async getFeatured(req: Request, res: Response) {
    try {
      const limit = parseInt(req.query.limit as string) || 4;
      const products = await ProductModel.getFeatured(limit);
      res.json({ success: true, data: products });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // GET /api/products/search?q=...
  async search(req: Request, res: Response) {
    try {
      const query = (req.query.q as string)?.trim();
      if (!query) return res.json({ success: true, data: [] });
      const products = await ProductModel.search(query);
      res.json({ success: true, data: products });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // GET /api/products/:id
  async getById(req: Request, res: Response) {
    try {
      const product = await ProductModel.getById(req.params.id);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });
      res.json({ success: true, data: product });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // GET /api/products/slug/:slug
  async getBySlug(req: Request, res: Response) {
    try {
      const product = await ProductModel.getBySlug(req.params.slug);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });
      res.json({ success: true, data: product });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // GET /api/products/category/:categoryId
  async getByCategory(req: Request, res: Response) {
    try {
      const products = await ProductModel.getByCategory(req.params.categoryId);
      res.json({ success: true, data: products });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // POST /api/products
  async create(req: Request, res: Response) {
    try {
      const { name, slug, description, categoryId, price, comparePrice,
              images, stockQuantity, sku, isNewArrival, isFeatured, isActive } = req.body;

      if (!name?.trim()) return res.status(400).json({ success: false, message: "Product name is required" });
      if (!slug?.trim()) return res.status(400).json({ success: false, message: "Product slug is required" });
      if (!categoryId)   return res.status(400).json({ success: false, message: "Category ID is required" });
      if (!price)        return res.status(400).json({ success: false, message: "Price is required" });

      const product = await ProductModel.create({
        slug, name, description, categoryId,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
        images: images ?? [],
        stockQuantity: stockQuantity ?? 0,
        sku: sku ?? "",
        isNewArrival: !!isNewArrival,
        isFeatured: !!isFeatured,
        isActive: isActive !== false,
      });

      res.status(201).json({ success: true, data: product });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // PUT /api/products/:id
  async update(req: Request, res: Response) {
    try {
      const product = await ProductModel.update(req.params.id, req.body);
      if (!product) return res.status(404).json({ success: false, message: "Product not found" });
      res.json({ success: true, data: product });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // DELETE /api/products/:id
  async remove(req: Request, res: Response) {
    try {
      const deleted = await ProductModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: "Product not found" });
      res.json({ success: true, message: "Product deleted" });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },
};
