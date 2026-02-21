import { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: Record<string, unknown> | null = null,
  message?: string,
  statusCode: number = 200,
): void => {
  const responseBody: Record<string, unknown> = {
    status: "success",
  };
  if (message) {
    responseBody.message = message;
  }
  if (data !== null) {
    responseBody.data = data;
  }

  res.status(statusCode).json(responseBody);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  errors?: Array<{ field: string; message: string }>,
): void => {
  const responseBody: Record<string, unknown> = {
    status: "error",
    message,
  };

  if (errors && errors.length > 0) {
    responseBody.errors = errors;
  }
  res.status(statusCode).json(responseBody);
};

export const HTTP = {
  OK: 200, // Request succeeded
  CREATED: 201, // New resource was successfully created
  BAD_REQUEST: 400, // Client sent invalid/missing data
  UNAUTHORIZED: 401, // Not logged in (no token, bad token, expired token)
  FORBIDDEN: 403, // Logged in but not allowed to do this action
  NOT_FOUND: 404, // The requested resource doesn't exist
  CONFLICT: 409, // Resource already exists (e.g., email already taken)
  UNPROCESSABLE: 422, // Data understood but failed business validation
  SERVER_ERROR: 500, // Something broke on our server (never our users' fault)
} as const;
