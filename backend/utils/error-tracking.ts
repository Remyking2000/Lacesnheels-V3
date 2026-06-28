/**
 * Error tracking and monitoring utilities
 * Integration point for services like Sentry
 */

export interface ErrorContext {
  userId?: string;
  requestId?: string;
  endpoint?: string;
  method?: string;
  userAgent?: string;
  ip?: string;
  timestamp?: string;
  [key: string]: any;
}

class ErrorTracker {
  private isDev = process.env.NODE_ENV === "development";
  private sentryDsn = process.env.SENTRY_DSN;

  /**
   * Initialize error tracking service (Sentry)
   */
  async initialize(): Promise<void> {
    if (!this.sentryDsn) {
      console.log("[ERROR_TRACKING] Sentry DSN not configured");
      return;
    }

    try {
      // Import Sentry dynamically to avoid dependency if not used
      const Sentry = await import("@sentry/node");
      Sentry.init({
        dsn: this.sentryDsn,
        environment: process.env.NODE_ENV || "production",
        tracesSampleRate: 1.0,
      });
      console.log("[ERROR_TRACKING] Sentry initialized");
    } catch (error) {
      console.warn("[ERROR_TRACKING] Sentry not installed, skipping initialization");
    }
  }

  /**
   * Capture an exception with context
   */
  captureException(error: Error, context: ErrorContext = {}): void {
    const errorData = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      ...context,
    };

    console.error("[ERROR_TRACKING]", JSON.stringify(errorData));

    // Send to Sentry in production
    if (!this.isDev && this.sentryDsn) {
      try {
        import("@sentry/node").then((Sentry) => {
          Sentry.captureException(error, {
            contexts: {
              request: context,
            },
          });
        });
      } catch (e) {
        // Sentry not available
      }
    }
  }

  /**
   * Capture a message for monitoring
   */
  captureMessage(message: string, level: "info" | "warning" | "error" = "info"): void {
    console.log(`[MONITORING] [${level.toUpperCase()}] ${message}`);

    if (!this.isDev && this.sentryDsn) {
      try {
        import("@sentry/node").then((Sentry) => {
          Sentry.captureMessage(message, level);
        });
      } catch (e) {
        // Sentry not available
      }
    }
  }

  /**
   * Track a performance metric
   */
  captureMetric(name: string, value: number, unit: string = "ms"): void {
    const metric = `${name}: ${value}${unit}`;
    
    if (value > 1000) {
      console.warn(`[METRIC_SLOW] ${metric}`);
    } else if (process.env.LOG_LEVEL === "debug") {
      console.log(`[METRIC] ${metric}`);
    }
  }

  /**
   * Create a breadcrumb for event tracking
   */
  addBreadcrumb(
    message: string,
    data: Record<string, any> = {},
    level: "debug" | "info" | "warning" | "error" = "info"
  ): void {
    if (this.isDev || process.env.LOG_LEVEL === "debug") {
      console.log(`[BREADCRUMB] [${level}] ${message}`, data);
    }

    if (!this.isDev && this.sentryDsn) {
      try {
        import("@sentry/node").then((Sentry) => {
          Sentry.addBreadcrumb({
            message,
            level,
            data,
            timestamp: Date.now() / 1000,
          });
        });
      } catch (e) {
        // Sentry not available
      }
    }
  }
}

export const errorTracker = new ErrorTracker();

/**
 * Custom error class with additional context
 */
export class ApplicationError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public context: ErrorContext = {}
  ) {
    super(message);
    this.name = "ApplicationError";
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Authentication error
 */
export class AuthenticationError extends ApplicationError {
  constructor(message: string = "Authentication failed", context: ErrorContext = {}) {
    super(message, 401, context);
    this.name = "AuthenticationError";
  }
}

/**
 * Authorization error
 */
export class AuthorizationError extends ApplicationError {
  constructor(message: string = "Access denied", context: ErrorContext = {}) {
    super(message, 403, context);
    this.name = "AuthorizationError";
  }
}

/**
 * Validation error
 */
export class ValidationError extends ApplicationError {
  constructor(message: string = "Validation failed", context: ErrorContext = {}) {
    super(message, 400, context);
    this.name = "ValidationError";
  }
}

/**
 * Resource not found error
 */
export class NotFoundError extends ApplicationError {
  constructor(message: string = "Resource not found", context: ErrorContext = {}) {
    super(message, 404, context);
    this.name = "NotFoundError";
  }
}

/**
 * Database error
 */
export class DatabaseError extends ApplicationError {
  constructor(message: string = "Database operation failed", context: ErrorContext = {}) {
    super(message, 500, context);
    this.name = "DatabaseError";
  }
}
