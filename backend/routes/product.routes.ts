import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public — order matters: specific paths before :id
router.get("/",                    ProductController.getAll);
router.get("/featured",            ProductController.getFeatured);
router.get("/search",              ProductController.search);
router.get("/slug/:slug",          ProductController.getBySlug);
router.get("/category/:categoryId", ProductController.getByCategory);
router.get("/:id",                 ProductController.getById);

// Admin-protected
router.post("/",     requireAuth, ProductController.create);
router.put("/:id",   requireAuth, ProductController.update);
router.delete("/:id", requireAuth, ProductController.remove);

export default router;
