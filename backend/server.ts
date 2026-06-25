import "dotenv/config";
import express from "express";
import cors from "cors";

import authRoutes       from "./routes/auth.routes.js";
import googleAuthRoutes from "./routes/google-auth.routes.js";
import categoryRoutes   from "./routes/category.routes.js";
import productRoutes    from "./routes/product.routes.js";
import orderRoutes      from "./routes/order.routes.js";
import settingsRoutes   from "./routes/settings.routes.js";

import { notFound, errorHandler } from "./middleware/error.middleware.js";

// ── App setup ─────────────────────────────────────────────────────────────────

const app = express();
const PORT = parseInt(process.env.PORT ?? "4000", 10);

// ── Global middleware ─────────────────────────────────────────────────────────

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or postman)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:4173",
        process.env.FRONTEND_URL,
      ].filter(Boolean) as string[];

      // Clean trailing slashes for comparison
      const cleanOrigin = origin.replace(/\/$/, "");
      const isAllowed = allowedOrigins.some(allowed => allowed.replace(/\/$/, "") === cleanOrigin) || 
                        origin.endsWith(".vercel.app");

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// ── Health check ──────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "Laces & Heels API",
    timestamp: new Date().toISOString(),
  });
});

// ── API routes ────────────────────────────────────────────────────────────────

app.use("/api/auth",       authRoutes);
app.use("/api/auth",       googleAuthRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products",   productRoutes);
app.use("/api/orders",     orderRoutes);
app.use("/api/settings",   settingsRoutes);

// ── Error handling ────────────────────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀  Laces & Heels API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   Routes: /api/auth | /api/products | /api/categories | /api/orders | /api/settings\n`);
});

export default app;
