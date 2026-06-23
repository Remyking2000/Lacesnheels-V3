import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";

const router = Router();

// POST /api/auth/login
router.post("/login", AuthController.login);

// POST /api/auth/verify
router.post("/verify", AuthController.verify);

export default router;
