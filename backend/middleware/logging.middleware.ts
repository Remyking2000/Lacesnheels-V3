import { Request, Response, NextFunction } from "express";

interface RequestLog {
  timestamp: string;
  method: string;
  path: string;
  status?: number;
  duration?: number;
  ip: string;
  userAgent?: string;
  error?: string;
}

/**
 * Structured logging middleware for production monitoring
 */
export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startTime = Date.now();
  const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Attach request ID to request object for tracking
  (req as any).requestId = requestId;

  // Capture response finish
  res.on("finish", () => {
    const duration = Date.now() - startTime;
    const log: RequestLog = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration,
      ip: req.ip || req.socket.remoteAddress || "unknown",
      userAgent: req.get("user-agent"),
    };

    // Log based on status code
    if (res.statusCode >= 500) {
      console.error(`[ERROR] Request ${requestId}:`, JSON.stringify(log));
    } else if (res.statusCode >= 400) {
      console.warn(`[WARN] Request ${requestId}:`, JSON.stringify(log));
    } else if (process.env.LOG_LEVEL === "debug") {
      console.log(`[INFO] Request ${requestId}:`, JSON.stringify(log));
    }
  });

  next();
};

/**
 * Log uncaught errors with context
 */
export const errorLoggingMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    requestId: (req as any).requestId,
    method: req.method,
    path: req.path,
    error: error.message,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  };

  console.error("[ERROR]", JSON.stringify(errorLog));
  next(error);
};

/**
 * Log database queries in development
 */
export const queryLogger = (query: string, params?: any[]) => {
  if (process.env.LOG_LEVEL === "debug") {
    console.log("[DB]", { query, params });
  }
};

/**
 * Performance monitoring utility
 */
export const measurePerformance = (label: string) => {
  const start = Date.now();
  return {
    end: () => {
      const duration = Date.now() - start;
      if (process.env.LOG_LEVEL === "debug" || duration > 1000) {
        console.log(`[PERF] ${label}: ${duration}ms`);
      }
    },
  };
};
