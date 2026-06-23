import type { Request, Response, NextFunction } from "express";

/**
 * Protects admin-only routes.
 * Expects: Authorization: Bearer <base64-token>
 * Token format: base64("admin:<timestamp>")
 * Replace with JWT verification in production.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    if (!decoded.startsWith("admin:")) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
}
