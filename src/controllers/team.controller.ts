import { Request, Response } from "express";
import mongoose from "mongoose";
import User from "../models/user.model";
import { sendSuccess, sendError, HTTP } from "../utils/response.utils";

// GET /api/v1/team/users
export const getAllTeamUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    sendSuccess(res, { users: users.map((u) => u.toJSON()) });
  } catch (error) {
    console.error("Get team users error:", error);
    sendError(res, "Error fetching team members", HTTP.SERVER_ERROR);
  }
};

// GET /api/v1/team/users/:id
export const getTeamUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid user ID", HTTP.BAD_REQUEST);
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      sendError(res, "Team member not found", HTTP.NOT_FOUND);
      return;
    }

    sendSuccess(res, { user: user.toJSON() });
  } catch (error) {
    console.error("Get team user error:", error);
    sendError(res, "Error fetching team member", HTTP.SERVER_ERROR);
  }
};

// POST /api/v1/team/users
export const createTeamUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Prevent creating super_admin via team endpoint
    if (role === "super_admin") {
      sendError(res, "Cannot create a super_admin via this endpoint.", HTTP.FORBIDDEN);
      return;
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      sendError(res, "A user with this email already exists.", HTTP.CONFLICT);
      return;
    }

    const user = await User.create({ name, email, phone, password, role, isActive: true });
    sendSuccess(res, { user: user.toJSON() }, "Team member created successfully", HTTP.CREATED);
  } catch (error) {
    console.error("Create team user error:", error);
    sendError(res, "Error creating team member", HTTP.SERVER_ERROR);
  }
};

// PUT /api/v1/team/users/:id
export const updateTeamUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid user ID", HTTP.BAD_REQUEST);
      return;
    }

    const allowed = ["name", "email", "phone", "role", "isActive"];
    const updateData: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }

    // Prevent promoting to super_admin
    if (updateData["role"] === "super_admin") {
      sendError(res, "Cannot assign super_admin role via this endpoint.", HTTP.FORBIDDEN);
      return;
    }

    const user = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!user) {
      sendError(res, "Team member not found", HTTP.NOT_FOUND);
      return;
    }

    sendSuccess(res, { user: user.toJSON() }, "Team member updated successfully");
  } catch (error) {
    console.error("Update team user error:", error);
    sendError(res, "Error updating team member", HTTP.SERVER_ERROR);
  }
};

// PATCH /api/v1/team/users/:id/toggle-status
export const toggleUserStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid user ID", HTTP.BAD_REQUEST);
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      sendError(res, "Team member not found", HTTP.NOT_FOUND);
      return;
    }

    user.isActive = !user.isActive;
    await user.save();

    sendSuccess(res, { user: { id: user.id, isActive: user.isActive } }, "User status updated successfully");
  } catch (error) {
    console.error("Toggle user status error:", error);
    sendError(res, "Error updating user status", HTTP.SERVER_ERROR);
  }
};

// DELETE /api/v1/team/users/:id
export const deleteTeamUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid user ID", HTTP.BAD_REQUEST);
      return;
    }

    // Prevent deleting self
    if (id === req.user!.id) {
      sendError(res, "You cannot delete your own account.", HTTP.BAD_REQUEST);
      return;
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      sendError(res, "Team member not found", HTTP.NOT_FOUND);
      return;
    }

    sendSuccess(res, null, "Team member deleted successfully");
  } catch (error) {
    console.error("Delete team user error:", error);
    sendError(res, "Error deleting team member", HTTP.SERVER_ERROR);
  }
};
