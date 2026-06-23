import { Router } from "express";
import { SettingsController } from "../controllers/settings.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Public read (storefront needs store name / currency)
router.get("/", SettingsController.getAll);

// Admin-protected write
router.put("/", requireAuth, SettingsController.update);

export default router;
