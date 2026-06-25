import { Router } from "express";
import { GoogleAuthController } from "../controllers/google-auth.controller.js";

const router = Router();

// POST /api/auth/google  — verify Google ID token, upsert user
router.post("/google", GoogleAuthController.verify);

// POST /api/auth/google/callback  — access-token flow (receives user info directly)
router.post("/google/callback", GoogleAuthController.callback);

export default router;
