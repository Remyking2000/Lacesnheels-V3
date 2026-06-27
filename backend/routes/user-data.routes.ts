import { Router } from "express";
import { UserDataController } from "../controllers/user-data.controller.js";
import { requireUser } from "../middleware/user-auth.middleware.js";

const router = Router();

// All routes require a valid user JWT in X-User-Token header
router.use(requireUser);

// Cart
router.get("/cart",                UserDataController.getCart);
router.post("/cart",               UserDataController.addToCart);
router.put("/cart",                UserDataController.syncCart);
router.patch("/cart/:slug",        UserDataController.updateCartQuantity);
router.delete("/cart",             UserDataController.clearCart);
router.delete("/cart/:slug",       UserDataController.removeFromCart);

// Wishlist
router.get("/wishlist",            UserDataController.getWishlist);
router.post("/wishlist",           UserDataController.addToWishlist);
router.post("/wishlist/toggle",    UserDataController.toggleWishlist);
router.put("/wishlist",            UserDataController.syncWishlist);
router.delete("/wishlist/:slug",   UserDataController.removeFromWishlist);

export default router;
