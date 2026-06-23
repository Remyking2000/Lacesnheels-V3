import type { Request, Response, NextFunction } from "express";

/**
 * Protects admin-only routes.
 * Expects: Authorization: Bearer <base64-token>
 * Token format: base64("admin:<timestamp>")
 * Replace with JWT verification in production.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.warn(`[Auth] Blocked request to ${req.method} ${req.originalUrl}: No Authorization header provided.`);
    return res.status(401).json({ success: false, message: "Authentication required" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    console.warn(`[Auth] Blocked request to ${req.method} ${req.originalUrl}: Invalid Authorization header format (${authHeader}).`);
    return res.status(401).json({ success: false, message: "Invalid token format" });
  }

  const token = parts[1];

  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    if (!decoded.startsWith("admin:")) {
      console.warn(`[Auth] Blocked request to ${req.method} ${req.originalUrl}: Token does not start with 'admin:'.`);
      return res.status(401).json({ success: false, message: "Invalid token content" });
    }
    next();
  } catch (err) {
    console.warn(`[Auth] Blocked request to ${req.method} ${req.originalUrl}: Error decoding token (${(err as Error).message}).`);
    res.status(401).json({ success: false, message: "Invalid token decoding" });
  }
}
