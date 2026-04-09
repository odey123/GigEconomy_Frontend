import { Request, Response } from "express";
import mongoose from "mongoose";
import Rider from "../models/rider.model";
import Order from "../models/order.model";
import FinanceTransaction from "../models/finance-transaction.model";
import { sendSuccess, sendError, HTTP } from "../utils/response.utils";
import { generateOtp } from "../utils/fee.utils";

// GET /api/v1/rider/me
export const getRiderMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const riderId = req.rider!.id;
    const rider = await Rider.findById(riderId);
    if (!rider) {
      sendError(res, "Rider not found", HTTP.NOT_FOUND);
      return;
    }
    sendSuccess(res, {
      rider: {
        id: rider.id,
        name: `${rider.firstName} ${rider.lastName}`,
        firstName: rider.firstName,
        lastName: rider.lastName,
        email: rider.email,
        phone: rider.phone,
        status: rider.status,
        riderType: rider.riderType,
        vehicleType: rider.vehicleType,
        vehicleNumber: rider.vehicleNumber,
        rating: rider.rating,
        totalDeliveries: rider.totalDeliveries,
        completedOrders: rider.completedOrders,
        currentOrders: rider.currentOrders,
        passportPhotoUrl: rider.passportPhotoUrl,
      },
    });
  } catch (error) {
    console.error("Get rider me error:", error);
    sendError(res, "Error fetching profile", HTTP.SERVER_ERROR);
  }
};

// PATCH /api/v1/rider/me
export const updateRiderMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const riderId = req.rider!.id;
    const { name, phone, vehicleType } = req.body;

    const update: Record<string, unknown> = {};
    if (name) {
      const parts = String(name).trim().split(/\s+/);
      update["firstName"] = parts[0];
      update["lastName"] = parts.slice(1).join(" ") || parts[0];
    }
    if (phone) update["phone"] = phone;
    if (vehicleType) update["vehicleType"] = vehicleType;

    const rider = await Rider.findByIdAndUpdate(riderId, update, { new: true });
    if (!rider) {
      sendError(res, "Rider not found", HTTP.NOT_FOUND);
      return;
    }
    sendSuccess(res, {
      rider: {
        id: rider.id,
        name: `${rider.firstName} ${rider.lastName}`,
        phone: rider.phone,
        vehicleType: rider.vehicleType,
      },
    }, "Profile updated successfully");
  } catch (error) {
    console.error("Update rider me error:", error);
    sendError(res, "Error updating profile", HTTP.SERVER_ERROR);
  }
};

// PATCH /api/v1/rider/me/status
export const updateRiderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const riderId = req.rider!.id;
    const { status } = req.body;

    const validStatuses = ["active", "busy", "inactive"];
    if (!validStatuses.includes(status)) {
      sendError(res, "Invalid status. Must be active, busy, or inactive", HTTP.BAD_REQUEST);
      return;
    }

    await Rider.findByIdAndUpdate(riderId, { status });
    sendSuccess(res, { status }, "Status updated successfully");
  } catch (error) {
    console.error("Update rider status error:", error);
    sendError(res, "Error updating status", HTTP.SERVER_ERROR);
  }
};

// GET /api/v1/rider/available-jobs
export const getAvailableJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { deliveryType, page = "1", limit = "20" } = req.query;

    const filter: Record<string, unknown> = { status: "pending", riderId: { $exists: false } };
    if (deliveryType) filter["deliveryType"] = deliveryType;

    const pageNum = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(String(limit), 10)));
    const skip = (pageNum - 1) * limitNum;

    const [jobs, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(filter),
    ]);

    sendSuccess(res, {
      jobs: jobs.map((o) => ({
        id: o.id,
        trackingId: o.trackingId,
        pickupLocation: o.pickupLocation,
        deliveryLocation: o.deliveryLocation,
        description: o.description,
        weight: o.weight,
        deliveryType: o.deliveryType,
        totalFee: o.totalFee,
        estimatedRiderEarnings: Math.round(o.totalFee * 0.75),
        createdAt: o.createdAt,
      })),
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error("Get available jobs error:", error);
    sendError(res, "Error fetching available jobs", HTTP.SERVER_ERROR);
  }
};

// POST /api/v1/rider/jobs/:orderId/accept
export const acceptJob = async (req: Request, res: Response): Promise<void> => {
  try {
    const riderId = req.rider!.id;
    const { orderId } = req.params;

    if (!mongoose.isValidObjectId(orderId)) {
      sendError(res, "Invalid order ID", HTTP.BAD_REQUEST);
      return;
    }

    const otp = generateOtp();

    const order = await Order.findOneAndUpdate(
      { _id: orderId, status: "pending", riderId: { $exists: false } },
      { riderId, status: "assigned", assignedAt: new Date(), otp },
      { new: true },
    );

    if (!order) {
      sendError(res, "Order is no longer available or already assigned", HTTP.CONFLICT);
      return;
    }

    await Rider.findByIdAndUpdate(riderId, { $inc: { currentOrders: 1 }, status: "busy" });

    sendSuccess(res, {
      order: {
        id: order.id,
        trackingId: order.trackingId,
        status: order.status,
        otp: order.otp,
        pickupLocation: order.pickupLocation,
        deliveryLocation: order.deliveryLocation,
        customerName: order.customerName,
        customerPhone: order.customerPhone,
        assignedAt: order.assignedAt,
      },
    }, "Job accepted");
  } catch (error) {
    console.error("Accept job error:", error);
    sendError(res, "Error accepting job", HTTP.SERVER_ERROR);
  }
};

// PATCH /api/v1/rider/jobs/:orderId/pickup
export const markPickedUp = async (req: Request, res: Response): Promise<void> => {
  try {
    const riderId = req.rider!.id;
    const { orderId } = req.params;

    if (!mongoose.isValidObjectId(orderId)) {
      sendError(res, "Invalid order ID", HTTP.BAD_REQUEST);
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      sendError(res, "Order not found", HTTP.NOT_FOUND);
      return;
    }
    if (String(order.riderId) !== riderId) {
      sendError(res, "This order is not assigned to you", HTTP.FORBIDDEN);
      return;
    }
    if (order.status !== "assigned") {
      sendError(res, "Order must be in Accepted status to mark as picked up", HTTP.UNPROCESSABLE);
      return;
    }

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { status: "in_transit", pickedUpAt: new Date() },
      { new: true },
    );

    sendSuccess(res, { order: { id: updated!.id, status: updated!.status, pickedUpAt: updated!.pickedUpAt } }, "Order marked as picked up");
  } catch (error) {
    console.error("Mark picked up error:", error);
    sendError(res, "Error updating order", HTTP.SERVER_ERROR);
  }
};

// PATCH /api/v1/rider/jobs/:orderId/deliver
export const markDelivered = async (req: Request, res: Response): Promise<void> => {
  try {
    const riderId = req.rider!.id;
    const { orderId } = req.params;

    if (!mongoose.isValidObjectId(orderId)) {
      sendError(res, "Invalid order ID", HTTP.BAD_REQUEST);
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      sendError(res, "Order not found", HTTP.NOT_FOUND);
      return;
    }
    if (String(order.riderId) !== riderId) {
      sendError(res, "This order is not assigned to you", HTTP.FORBIDDEN);
      return;
    }
    if (order.status !== "in_transit") {
      sendError(res, "Order must be In Transit to mark as delivered", HTTP.UNPROCESSABLE);
      return;
    }

    const { note } = req.body;
    const riderEarnings = Math.round(order.totalFee * 0.75);
    const platformCommission = order.totalFee - riderEarnings;

    const updated = await Order.findByIdAndUpdate(
      orderId,
      { status: "delivered", deliveredAt: new Date(), deliveryProof: note || "" },
      { new: true },
    );

    await Rider.findByIdAndUpdate(riderId, {
      $inc: { completedOrders: 1, totalDeliveries: 1, currentOrders: -1 },
    });

    await FinanceTransaction.findOneAndUpdate(
      { orderId: order._id },
      { riderId, status: "Processed" },
    );

    sendSuccess(res, {
      order: { id: updated!.id, status: updated!.status, deliveredAt: updated!.deliveredAt },
      earnings: { orderId: order.id, riderEarnings, platformCommission, totalFee: order.totalFee },
    }, "Delivery confirmed");
  } catch (error) {
    console.error("Mark delivered error:", error);
    sendError(res, "Error confirming delivery", HTTP.SERVER_ERROR);
  }
};

// GET /api/v1/rider/me/orders
export const getRiderOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const riderId = req.rider!.id;
    const { status, page = "1", limit = "50" } = req.query;

    const filter: Record<string, unknown> = { riderId };
    if (status) filter["status"] = status;

    const pageNum = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Order.countDocuments(filter),
    ]);

    sendSuccess(res, {
      orders: orders.map((o) => o.toJSON()),
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error("Get rider orders error:", error);
    sendError(res, "Error fetching orders", HTTP.SERVER_ERROR);
  }
};

// GET /api/v1/rider/me/earnings
export const getRiderEarnings = async (req: Request, res: Response): Promise<void> => {
  try {
    const riderId = req.rider!.id;

    const deliveredOrders = await Order.find({ riderId, status: "delivered" }).sort({ deliveredAt: -1 });

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const earn = (o: typeof deliveredOrders[0]) => Math.round(o.totalFee * 0.75);

    const summary = {
      today: deliveredOrders.filter((o) => o.deliveredAt && o.deliveredAt >= startOfDay).reduce((s, o) => s + earn(o), 0),
      thisWeek: deliveredOrders.filter((o) => o.deliveredAt && o.deliveredAt >= startOfWeek).reduce((s, o) => s + earn(o), 0),
      thisMonth: deliveredOrders.filter((o) => o.deliveredAt && o.deliveredAt >= startOfMonth).reduce((s, o) => s + earn(o), 0),
      allTime: deliveredOrders.reduce((s, o) => s + earn(o), 0),
    };

    const payouts = deliveredOrders.map((o) => ({
      orderId: o.id,
      trackingId: o.trackingId,
      deliveredAt: o.deliveredAt,
      pickupLocation: o.pickupLocation,
      deliveryLocation: o.deliveryLocation,
      deliveryType: o.deliveryType,
      totalFee: o.totalFee,
      riderEarnings: earn(o),
      status: "Processed",
    }));

    sendSuccess(res, { summary, commissionRate: 0.75, payouts });
  } catch (error) {
    console.error("Get rider earnings error:", error);
    sendError(res, "Error fetching earnings", HTTP.SERVER_ERROR);
  }
};
