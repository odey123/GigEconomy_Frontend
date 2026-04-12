import { Request, Response, NextFunction } from "express";

interface MongoError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
}

interface MongooseValidationError extends Error {
  name: "ValidationError";
  errors: Record<string, { message: string; path: string }>;
}

interface MongooseCastError extends Error {
  name: "CastError";
  path: string;
  value: unknown;
}

export const errorHandler = (
  err: MongoError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const isDev = process.env.NODE_ENV === "development";

  // Log all errors for server-side visibility
  console.error(`[ERROR] ${err.name || "UnknownError"}:`, err.message);
  if (isDev) console.error(err.stack);

  // --- Mongoose: Duplicate key (e.g. unique email already exists) ---
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || "field";
    res.status(409).json({
      status: "error",
      message: `An account with this ${field} already exists.`,
      errors: [{ field, message: `This ${field} is already taken` }],
    });
    return;
  }

  // --- Mongoose: Document validation failed ---
  if (err.name === "ValidationError") {
    const mongooseErr = err as unknown as MongooseValidationError;
    const errors = Object.values(mongooseErr.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    res.status(400).json({
      status: "error",
      message: "Validation failed. Please correct the highlighted fields.",
      errors,
    });
    return;
  }

  // --- Mongoose: Invalid ObjectId cast (e.g. malformed :id param) ---
  if (err.name === "CastError") {
    const castErr = err as unknown as MongooseCastError;
    res.status(400).json({
      status: "error",
      message: `Invalid value for '${castErr.path}': ${String(castErr.value)}`,
    });
    return;
  }

  // --- JWT errors (should normally be caught in middleware, but just in case) ---
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    res.status(401).json({
      status: "error",
      message: "Invalid or expired authentication token. Please log in again.",
    });
    return;
  }

  // --- Default: unexpected server error ---
  res.status(500).json({
    status: "error",
    message: isDev ? err.message : "An unexpected error occurred. Please try again.",
    ...(isDev && { stack: err.stack }),
  });
};
