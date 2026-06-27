import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "fallback-secret";

export interface UserJwtPayload {
  userId: string;
  email: string;
}

// Extend Express Request to carry the verified user
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserJwtPayload;
    }
  }
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const token = req.headers["x-user-token"] as string | undefined;
  if (!token) {
    return res.status(401).json({ success: false, message: "User authentication required" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as UserJwtPayload;
    req.currentUser = payload;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid or expired user token" });
  }
}
