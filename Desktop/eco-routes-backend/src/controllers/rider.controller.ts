import { Request, Response } from "express";
import mongoose from "mongoose";
import Rider from "../models/rider.model";
import Order from "../models/order.model";
import { sendSuccess, sendError, HTTP } from "../utils/response.utils";

// GET /api/v1/riders
export const getAllRiders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, available, riderType } = req.query;

    const filter: Record<string, unknown> = {};
    if (status)     filter["status"]    = status;
    if (riderType)  filter["riderType"] = riderType;
    if (available === "true") filter["status"] = "active";

    const riders = await Rider.find(filter).sort({ createdAt: -1 });
    sendSuccess(res, { riders: riders.map((r) => r.toJSON()) });
  } catch (error) {
    console.error("Get riders error:", error);
    sendError(res, "Error fetching riders", HTTP.SERVER_ERROR);
  }
};

// GET /api/v1/riders/:id
export const getRiderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid rider ID", HTTP.BAD_REQUEST);
      return;
    }

    const rider = await Rider.findById(id);
    if (!rider) {
      sendError(res, "Rider not found", HTTP.NOT_FOUND);
      return;
    }

    sendSuccess(res, { rider: rider.toJSON() });
  } catch (error) {
    console.error("Get rider error:", error);
    sendError(res, "Error fetching rider", HTTP.SERVER_ERROR);
  }
};

// POST /api/v1/riders  (admin creates a standard rider directly)
export const createRider = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, phone, email, vehicleType, vehicleNumber, licenseNumber } = req.body;

    const existing = await Rider.findOne({ email: email.toLowerCase() });
    if (existing) {
      sendError(res, "A rider with this email already exists", HTTP.CONFLICT);
      return;
    }

    const rider = await Rider.create({
      firstName,
      lastName,
      phone,
      email,
      vehicleType,
      vehicleNumber,
      licenseNumber,
      riderType: "standard",
      status:    "active",
    });

    sendSuccess(res, { rider: rider.toJSON() }, "Rider created successfully", HTTP.CREATED);
  } catch (error) {
    console.error("Create rider error:", error);
    sendError(res, "Error creating rider", HTTP.SERVER_ERROR);
  }
};

// PUT /api/v1/riders/:id
export const updateRider = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid rider ID", HTTP.BAD_REQUEST);
      return;
    }

    const allowed = ["firstName", "lastName", "phone", "email", "status", "vehicleType", "vehicleNumber"];
    const updateData: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }

    const rider = await Rider.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!rider) {
      sendError(res, "Rider not found", HTTP.NOT_FOUND);
      return;
    }

    sendSuccess(res, { rider: rider.toJSON() }, "Rider updated successfully");
  } catch (error) {
    console.error("Update rider error:", error);
    sendError(res, "Error updating rider", HTTP.SERVER_ERROR);
  }
};

// DELETE /api/v1/riders/:id
export const deleteRider = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid rider ID", HTTP.BAD_REQUEST);
      return;
    }

    const rider = await Rider.findByIdAndDelete(id);
    if (!rider) {
      sendError(res, "Rider not found", HTTP.NOT_FOUND);
      return;
    }

    sendSuccess(res, null, "Rider deleted successfully");
  } catch (error) {
    console.error("Delete rider error:", error);
    sendError(res, "Error deleting rider", HTTP.SERVER_ERROR);
  }
};

// GET /api/v1/riders/:id/orders
export const getRiderOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid rider ID", HTTP.BAD_REQUEST);
      return;
    }

    const rider = await Rider.findById(id);
    if (!rider) {
      sendError(res, "Rider not found", HTTP.NOT_FOUND);
      return;
    }

    const filter: Record<string, unknown> = { riderId: id };
    if (status) filter["status"] = status;

    const orders = await Order.find(filter).sort({ createdAt: -1 });

    sendSuccess(res, {
      riderId:    id,
      riderName:  `${rider.firstName} ${rider.lastName}`,
      orders:     orders.map((o) => o.toJSON()),
    });
  } catch (error) {
    console.error("Get rider orders error:", error);
    sendError(res, "Error fetching rider orders", HTTP.SERVER_ERROR);
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/v1/riders/:id/approve
// Only valid when current status is pending
// ---------------------------------------------------------------------------
export const approveRider = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid rider ID", HTTP.BAD_REQUEST);
      return;
    }

    const rider = await Rider.findById(id);
    if (!rider) {
      sendError(res, "Rider not found", HTTP.NOT_FOUND);
      return;
    }

    if (rider.status !== "pending") {
      sendError(
        res,
        `Cannot approve a rider whose status is '${rider.status}'. Only pending applications can be approved.`,
        HTTP.BAD_REQUEST,
      );
      return;
    }

    rider.status = "active";
    await rider.save();

    sendSuccess(
      res,
      { rider: { id: rider.id, status: rider.status } },
      "Rider application approved successfully.",
    );
  } catch (error) {
    console.error("Approve rider error:", error);
    sendError(res, "Error approving rider", HTTP.SERVER_ERROR);
  }
};

// ---------------------------------------------------------------------------
// PATCH /api/v1/riders/:id/reject
// Body: { reason: string }  (required)
// Only valid when current status is pending
// ---------------------------------------------------------------------------
export const rejectRider = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid rider ID", HTTP.BAD_REQUEST);
      return;
    }

    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      sendError(res, "A rejection reason is required.", HTTP.BAD_REQUEST);
      return;
    }

    const rider = await Rider.findById(id);
    if (!rider) {
      sendError(res, "Rider not found", HTTP.NOT_FOUND);
      return;
    }

    if (rider.status !== "pending") {
      sendError(
        res,
        `Cannot reject a rider whose status is '${rider.status}'. Only pending applications can be rejected.`,
        HTTP.BAD_REQUEST,
      );
      return;
    }

    rider.status          = "rejected";
    rider.rejectionReason = reason.trim();
    await rider.save();

    sendSuccess(
      res,
      { rider: { id: rider.id, status: rider.status, rejectionReason: rider.rejectionReason } },
      "Rider application rejected.",
    );
  } catch (error) {
    console.error("Reject rider error:", error);
    sendError(res, "Error rejecting rider", HTTP.SERVER_ERROR);
  }
};
