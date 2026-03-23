import jwt from "jsonwebtoken";
import { JwtPayload } from "../types/auth.types";
import { ClientJwtPayload } from "../types/client.types";
import { RiderJwtPayload } from "../types/rider.types";

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "FATAL ERROR: JWT_SECRET is not defined in your .env file. " +
        "Generate one by running: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
    );
  }
  return secret;
};

export const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN ||
      "7d") as jwt.SignOptions["expiresIn"],
  });
};

export const generateClientToken = (payload: ClientJwtPayload): string => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN ||
      "7d") as jwt.SignOptions["expiresIn"],
  });
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
};

export const verifyClientToken = (token: string): ClientJwtPayload => {
  return jwt.verify(token, getJwtSecret()) as ClientJwtPayload;
};

export const generateRiderToken = (payload: RiderJwtPayload): string => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
  });
};

export const verifyRiderToken = (token: string): RiderJwtPayload => {
  return jwt.verify(token, getJwtSecret()) as RiderJwtPayload;
};

export const extractTokenFromHeader = (
  authHeader: string | undefined,
): string | null => {
  if (!authHeader) return null;

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  return parts[1];
};
