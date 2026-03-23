export type UserRole = "super_admin" | "admin" | "logistics_staff" | "rider";

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface JwtPayload {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthResponse {
  user: IUser;
  token: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      client?: import("./client.types").ClientJwtPayload;
      rider?: import("./rider.types").RiderJwtPayload;
    }
  }
}
