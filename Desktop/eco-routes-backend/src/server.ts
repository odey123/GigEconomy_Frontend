import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import mongoose from "mongoose";

import { errorHandler } from "./middleware/errorHandler";
import apiRoutes from "./routes";

// Load environment variables
dotenv.config();

const connectDB = async (): Promise<void> => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error(
      " Error: MONGODB_URI is not defined in environment variables",
    );
    console.error("Copy .env.example to .env and fill in your MongoDB URI. ");
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

// Middleware
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  }),
);
app.use(morgan("dev")); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "success",
    message: "EcoRoutes API is running",
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use("/api/v1", apiRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handling middleware
app.use(errorHandler);

(async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(
      `🚀 Server running on port ${PORT} in ${process.env.NODE_ENV || "development"} mode`,
    );
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📍 API endpoint: http://localhost:${PORT}/api/v1`);
    console.log(`\n🔑 Auth endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/v1/auth/register`);
    console.log(`   POST http://localhost:${PORT}/api/v1/auth/login`);
    console.log(`   GET  http://localhost:${PORT}/api/v1/auth/me`);
    console.log(`   POST http://localhost:${PORT}/api/v1/auth/logout`);
  });
})();

export default app;
