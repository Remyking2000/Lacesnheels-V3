import { Router } from "express";
import { OrderController } from "../controllers/order.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public — customers create orders on checkout
router.post("/", OrderController.create);

// Admin-protected
router.get("/",           requireAuth, OrderController.getAll);
router.get("/stats",      requireAuth, OrderController.getStats);
router.get("/:id",        requireAuth, OrderController.getById);
router.patch("/:id/status", requireAuth, OrderController.updateStatus);
router.delete("/:id",     requireAuth, OrderController.remove);

export default router;
