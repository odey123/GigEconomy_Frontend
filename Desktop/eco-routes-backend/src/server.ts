import express, { Application, RequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

import { errorHandler } from "./middleware/errorHandler";
import apiRoutes from "./routes";

dotenv.config();

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error("Error: MONGODB_URI is not defined in environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1);
  }
};

const app: Application = express();
const PORT = process.env.PORT || 5000;

// ---------------------------------------------------------------------------
// Security middleware
// ---------------------------------------------------------------------------
app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);

// ---------------------------------------------------------------------------
// Rate limiting
// ---------------------------------------------------------------------------

// General API rate limit — 100 req/min per IP (matches API_DOCUMENTATION.md spec)
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many requests. Please wait a moment and try again.",
  },
});

// Stricter limit on auth endpoints to deter brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Too many authentication attempts. Please wait 15 minutes and try again.",
  },
});

app.use("/api/v1", apiLimiter as RequestHandler);
app.use("/api/v1/auth", authLimiter as RequestHandler);
app.use("/api/v1/client-auth", authLimiter as RequestHandler);

// ---------------------------------------------------------------------------
// Body parsers — explicit size limits to prevent oversized payload DoS
// ---------------------------------------------------------------------------
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "EcoRoutes API is running",
    timestamp: new Date().toISOString(),
  });
});

// ---------------------------------------------------------------------------
// API Routes
// ---------------------------------------------------------------------------
app.use("/api/v1", apiRoutes);

// ---------------------------------------------------------------------------
// 404 handler
// ---------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

// ---------------------------------------------------------------------------
// Global error handler (must be last)
// ---------------------------------------------------------------------------
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Graceful shutdown
// ---------------------------------------------------------------------------
const shutdown = async (signal: string): Promise<void> => {
  console.log(`\n${signal} received — shutting down gracefully…`);
  await mongoose.disconnect();
  console.log("MongoDB disconnected");
  process.exit(0);
};

process.on("SIGTERM", () => { void shutdown("SIGTERM"); });
process.on("SIGINT", () => { void shutdown("SIGINT"); });

// ---------------------------------------------------------------------------
// Start server
// ---------------------------------------------------------------------------
(async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📍 API base:     http://localhost:${PORT}/api/v1`);
  });
})();

export default app;
