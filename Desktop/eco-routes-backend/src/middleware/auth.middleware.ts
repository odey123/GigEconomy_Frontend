import { Request, Response, NextFunction } from "express";
import { verifyToken, extractTokenFromHeader } from "../utils/jwt.utils";
import { sendError, HTTP } from "../utils/response.utils";
import { UserRole } from "../types/auth.types";

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader as string | undefined);

    if (!token) {
      sendError(
        res,
        "Access denied. No authentication token provided. Please log in to continue.",
        HTTP.UNAUTHORIZED, // 401
      );
      return;
    }
    const decodedPayload = verifyToken(token);
    req.user = decodedPayload;

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        sendError(
          res,
          "Your session has expired. Please log in again to continue.",
          HTTP.UNAUTHORIZED,
        );
        return;
      }

      if (error.name === "JsonWebTokenError") {
        sendError(
          res,
          "Invalid authentication token. Please log in again to continue.",
          HTTP.UNAUTHORIZED,
        );
        return;
      }
    }

    sendError(
      res,
      "Authentication failed. Please log in again.",
      HTTP.UNAUTHORIZED,
    );
    return;
  }
};

export const restrictTo = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      sendError(
        res,
        "Authentication required. Please log in.",
        HTTP.UNAUTHORIZED,
      );
      return;
    }

    const userRole = req.user.role;
    if (!allowedRoles.includes(userRole)) {
      sendError(
        res,
        `Access forbidden. This action requires the following role(s): ${allowedRoles.join(" or ")}. Your current role is: ${userRole}.`,
        HTTP.FORBIDDEN,
      );
      return;
    }

    next();
  };
};
