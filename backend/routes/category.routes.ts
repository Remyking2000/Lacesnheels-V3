import { Router } from "express";
import { CategoryController } from "../controllers/category.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public
router.get("/",    CategoryController.getAll);
router.get("/:id", CategoryController.getById);

// Admin-protected
router.post("/",    requireAuth, CategoryController.create);
router.put("/:id",  requireAuth, CategoryController.update);
router.delete("/:id", requireAuth, CategoryController.remove);

export default router;
