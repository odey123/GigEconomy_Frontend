import { Request, Response } from "express";
import User from "../models/user.model";
import { generateToken } from "../utils/jwt.utils";
import { sendSuccess, sendError, HTTP } from "../utils/response.utils";
import { RegisterRequest, LoginRequest, IUser } from "../types/auth.types";

const formatUserResponse = (user: {
  id?: string;
  _id?: { toString(): string };
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}): IUser => {
  return {
    id: (user.id || user._id?.toString()) as string,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role as IUser["role"],
    avatar: user.avatar ?? undefined,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role } = req.body as RegisterRequest;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      sendError(
        res,
        "An account with this email already exists. Please use a different email or log in instead.",
        HTTP.CONFLICT,
      );
      return;
    }

    const newUser = await User.create({
      name,
      email,
      phone,
      password,
      role,
      isActive: true,
    });

    const token = generateToken({
      id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role as IUser["role"],
    });

    const formattedUser = formatUserResponse(newUser.toJSON());

    sendSuccess(
      res,
      { user: formattedUser, token },
      "User registered successfully",
      HTTP.CREATED,
    );
  } catch (error) {
    console.error("Registration error", error);
    sendError(
      res,
      "An error occurred during registration. Please try again.",
      HTTP.SERVER_ERROR,
    );
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequest;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      sendError(
        res,
        "Invalid email or password. Please check your credentials and try again.",
        HTTP.UNAUTHORIZED,
      );
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      sendError(
        res,
        "Invalid email or password. Please check your credentials and try again.",
        HTTP.UNAUTHORIZED,
      );
      return;
    }

    if (!user.isActive) {
      sendError(
        res,
        "Your account has been deactivated. Please contact your system administrator for assistance.",
        HTTP.FORBIDDEN,
      );
      return;
    }

    const token = generateToken({
      id: user._id.toString(),
      email: user.email,
      role: user.role as IUser["role"],
    });

    const formattedUser = formatUserResponse(user.toJSON());

    sendSuccess(res, { user: formattedUser, token }, undefined, HTTP.OK);
  } catch (error) {
    console.error("❌ Login error:", error);
    sendError(
      res,
      "An error occurred during login. Please try again.",
      HTTP.SERVER_ERROR,
    );
  }
};

export const logout = async (_req: Request, res: Response): Promise<void> => {
  try {
    sendSuccess(res, null, "Logged out successfully", HTTP.OK);
  } catch (error) {
    console.error("❌ Logout error:", error);
    sendError(res, "An error occurred during logout.", HTTP.SERVER_ERROR);
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user!.id;
    const user = await User.findById(userId);

    if (!user) {
      sendError(
        res,
        "User account not found. The account may have been deleted.",
        HTTP.NOT_FOUND,
      );
      return;
    }

    if (!user.isActive) {
      sendError(res, "Your account has been deactivated.", HTTP.FORBIDDEN);
      return;
    }

    const formattedUser = formatUserResponse(user.toJSON());
    sendSuccess(res, { user: formattedUser });
  } catch (error) {
    console.error("❌ Get profile error:", error);
    sendError(
      res,
      "An error occurred while fetching your profile.",
      HTTP.SERVER_ERROR,
    );
  }
};
