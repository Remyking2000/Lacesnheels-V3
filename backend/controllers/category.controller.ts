import type { Request, Response } from "express";
import { CategoryModel } from "../models/category.model.js";

export const CategoryController = {
  // GET /api/categories
  async getAll(req: Request, res: Response) {
    try {
      const categories = await CategoryModel.getAll();
      res.json({ success: true, data: categories });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // GET /api/categories/:id
  async getById(req: Request, res: Response) {
    try {
      const category = await CategoryModel.getById(req.params.id);
      if (!category) return res.status(404).json({ success: false, message: "Category not found" });
      res.json({ success: true, data: category });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // POST /api/categories
  async create(req: Request, res: Response) {
    try {
      const { name, intro, imageUrl } = req.body;
      if (!name?.trim()) {
        return res.status(400).json({ success: false, message: "Category name is required" });
      }
      const category = await CategoryModel.create(name.trim(), intro, imageUrl);
      res.status(201).json({ success: true, data: category });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // PUT /api/categories/:id
  async update(req: Request, res: Response) {
    try {
      const { name } = req.body;
      if (!name?.trim()) {
        return res.status(400).json({ success: false, message: "Category name is required" });
      }
      const category = await CategoryModel.update(req.params.id, name.trim());
      if (!category) return res.status(404).json({ success: false, message: "Category not found" });
      res.json({ success: true, data: category });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },

  // DELETE /api/categories/:id
  async remove(req: Request, res: Response) {
    try {
      const deleted = await CategoryModel.delete(req.params.id);
      if (!deleted) return res.status(404).json({ success: false, message: "Category not found" });
      res.json({ success: true, message: "Category deleted" });
    } catch (err) {
      res.status(500).json({ success: false, message: (err as Error).message });
    }
  },
};
