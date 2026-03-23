import { Request, Response } from "express";
import mongoose from "mongoose";
import Order from "../models/order.model";
import Client from "../models/client.model";
import Rider from "../models/rider.model";
import Wallet from "../models/wallet.model";
import WalletTransaction from "../models/wallet-transaction.model";
import FinanceTransaction from "../models/finance-transaction.model";
import { sendSuccess, sendError, HTTP } from "../utils/response.utils";
import {
  calculateDeliveryFee,
  calculateFees,
  generateTrackingId,
  generateOtp,
} from "../utils/fee.utils";

const buildOrderResponse = (order: Record<string, unknown>) => {
  const o = order;
  const rider = o["riderId"] as Record<string, unknown> | null | undefined;
  const client = o["businessClientId"] as Record<string, unknown> | null | undefined;

  return {
    ...o,
    driver: rider
      ? `${rider["firstName"]} ${rider["lastName"]}`
      : undefined,
    driverId: rider ? String(rider["id"] || rider["_id"]) : undefined,
    businessClient: client ? String(client["company"]) : undefined,
    businessClientId: client
      ? String(client["id"] || client["_id"])
      : String(o["businessClientId"]),
  };
};

// GET /api/v1/orders
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      status,
      clientId,
      riderId,
      startDate,
      endDate,
      page = "1",
      limit = "50",
    } = req.query;

    const filter: Record<string, unknown> = {};
    if (status) filter["status"] = status;
    if (clientId && mongoose.isValidObjectId(clientId)) filter["businessClientId"] = clientId;
    if (riderId && mongoose.isValidObjectId(riderId)) filter["riderId"] = riderId;
    if (startDate || endDate) {
      filter["createdAt"] = {};
      if (startDate) (filter["createdAt"] as Record<string, unknown>)["$gte"] = new Date(String(startDate));
      if (endDate) (filter["createdAt"] as Record<string, unknown>)["$lte"] = new Date(String(endDate));
    }

    const pageNum = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("riderId", "firstName lastName")
        .populate("businessClientId", "company")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);

    sendSuccess(res, {
      orders: orders.map((o) => buildOrderResponse(o.toJSON())),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    sendError(res, "Error fetching orders", HTTP.SERVER_ERROR);
  }
};

// GET /api/v1/orders/:id
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid order ID", HTTP.BAD_REQUEST);
      return;
    }

    const order = await Order.findById(id)
      .populate("riderId", "firstName lastName")
      .populate("businessClientId", "company");

    if (!order) {
      sendError(res, "Order not found", HTTP.NOT_FOUND);
      return;
    }

    sendSuccess(res, { order: buildOrderResponse(order.toJSON()) });
  } catch (error) {
    console.error("Get order error:", error);
    sendError(res, "Error fetching order", HTTP.SERVER_ERROR);
  }
};

// POST /api/v1/orders
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      pickupLocation,
      pickupContact,
      pickupPhone,
      customerName,
      customerPhone,
      customerAddress,
      landmark,
      description,
      weight,
      value,
      deliveryType,
      deliveryModel,
      specialInstructions,
      scheduledFor,
      businessClientId,
    } = req.body;

    if (!mongoose.isValidObjectId(businessClientId)) {
      sendError(res, "Invalid business client ID", HTTP.BAD_REQUEST);
      return;
    }

    const client = await Client.findById(businessClientId);
    if (!client) {
      sendError(res, "Business client not found", HTTP.NOT_FOUND);
      return;
    }

    if (client.status !== "active") {
      sendError(res, "Business client account is not active", HTTP.FORBIDDEN);
      return;
    }

    const deliveryFee = calculateDeliveryFee(weight, deliveryType, deliveryModel);
    const { adminFee, totalFee, riderPayout, platformCommission } = calculateFees(deliveryFee, deliveryModel);

    // Atomically deduct from wallet for pay_as_you_go clients.
    // Using findOneAndUpdate with a $gte balance guard prevents the race condition
    // where two concurrent orders both pass the balance check but over-spend.
    if (client.accountType === "pay_as_you_go") {
      const wallet = await Wallet.findOneAndUpdate(
        { clientId: businessClientId, balance: { $gte: totalFee } },
        { $inc: { balance: -totalFee } },
        { new: false }, // Return the document BEFORE the update to capture balanceBefore
      );

      if (!wallet) {
        // Either no wallet exists or balance was insufficient — both map to 402
        sendError(
          res,
          "Insufficient wallet balance. Please top up your wallet to place this order.",
          HTTP.PAYMENT_REQUIRED,
        );
        return;
      }

      await WalletTransaction.create({
        walletId: wallet._id,
        type: "debit",
        amount: totalFee,
        balanceBefore: wallet.balance,
        balanceAfter: wallet.balance - totalFee,
        description: "Delivery order payment",
      });
    }

    const trackingId = generateTrackingId();
    const otp = generateOtp();

    const order = await Order.create({
      trackingId,
      customerName,
      customerPhone,
      customerLocation: customerAddress,
      businessClientId,
      pickupLocation,
      pickupContact,
      pickupPhone,
      deliveryLocation: customerAddress,
      landmark,
      description,
      specialInstructions,
      weight,
      value,
      deliveryType,
      deliveryModel,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      otp,
      deliveryFee,
      adminFee,
      totalFee,
    });

    // Create finance transaction record
    await FinanceTransaction.create({
      orderId: order._id,
      clientId: businessClientId,
      deliveryModel,
      totalFee,
      platformCommission,
      riderPayout,
      status: "Pending",
      date: new Date(),
    });

    // Update client order counts
    await Client.findByIdAndUpdate(businessClientId, {
      $inc: { totalOrders: 1, activeOrders: 1 },
    });

    sendSuccess(
      res,
      { order: order.toJSON() },
      "Order created successfully",
      HTTP.CREATED,
    );
  } catch (error) {
    console.error("Create order error:", error);
    sendError(res, "Error creating order", HTTP.SERVER_ERROR);
  }
};

// PUT /api/v1/orders/:id
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid order ID", HTTP.BAD_REQUEST);
      return;
    }

    const allowed = ["customerName", "customerPhone", "deliveryLocation", "specialInstructions", "weight", "value"];
    const updateData: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }

    const order = await Order.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!order) {
      sendError(res, "Order not found", HTTP.NOT_FOUND);
      return;
    }

    sendSuccess(res, { order: order.toJSON() }, "Order updated successfully");
  } catch (error) {
    console.error("Update order error:", error);
    sendError(res, "Error updating order", HTTP.SERVER_ERROR);
  }
};

// DELETE /api/v1/orders/:id
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid order ID", HTTP.BAD_REQUEST);
      return;
    }

    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      sendError(res, "Order not found", HTTP.NOT_FOUND);
      return;
    }

    sendSuccess(res, null, "Order deleted successfully");
  } catch (error) {
    console.error("Delete order error:", error);
    sendError(res, "Error deleting order", HTTP.SERVER_ERROR);
  }
};

// PATCH /api/v1/orders/:id/status
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid order ID", HTTP.BAD_REQUEST);
      return;
    }

    const validStatuses = ["pending", "assigned", "picked_up", "in_transit", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      sendError(res, `Invalid status. Must be one of: ${validStatuses.join(", ")}`, HTTP.BAD_REQUEST);
      return;
    }

    const order = await Order.findById(id);
    if (!order) {
      sendError(res, "Order not found", HTTP.NOT_FOUND);
      return;
    }

    const update: Record<string, unknown> = { status };
    if (status === "picked_up") update["pickedUpAt"] = new Date();
    if (status === "delivered") {
      update["deliveredAt"] = new Date();
      // Update rider completed orders and client active orders
      if (order.riderId) {
        await Rider.findByIdAndUpdate(order.riderId, {
          $inc: { completedOrders: 1, totalDeliveries: 1, currentOrders: -1 },
        });
      }
      await Client.findByIdAndUpdate(order.businessClientId, {
        $inc: { activeOrders: -1 },
      });
      await FinanceTransaction.findOneAndUpdate(
        { orderId: order._id },
        { riderId: order.riderId },
      );
    }
    if (status === "cancelled") {
      if (order.riderId) {
        await Rider.findByIdAndUpdate(order.riderId, { $inc: { currentOrders: -1 } });
      }
      await Client.findByIdAndUpdate(order.businessClientId, {
        $inc: { activeOrders: -1 },
      });
    }

    const updated = await Order.findByIdAndUpdate(id, update, { new: true });
    sendSuccess(res, { order: updated!.toJSON() }, "Order status updated successfully");
  } catch (error) {
    console.error("Update order status error:", error);
    sendError(res, "Error updating order status", HTTP.SERVER_ERROR);
  }
};

// PATCH /api/v1/orders/:id/assign
export const assignRider = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { riderId } = req.body;

    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(riderId)) {
      sendError(res, "Invalid order ID or rider ID", HTTP.BAD_REQUEST);
      return;
    }

    const [order, rider] = await Promise.all([
      Order.findById(id),
      Rider.findById(riderId),
    ]);

    if (!order) {
      sendError(res, "Order not found", HTTP.NOT_FOUND);
      return;
    }
    if (!rider) {
      sendError(res, "Rider not found", HTTP.NOT_FOUND);
      return;
    }
    if (rider.status === "inactive") {
      sendError(res, "Cannot assign order to an inactive rider", HTTP.BAD_REQUEST);
      return;
    }

    // Unassign from previous rider if any
    if (order.riderId) {
      await Rider.findByIdAndUpdate(order.riderId, { $inc: { currentOrders: -1 } });
    }

    const updated = await Order.findByIdAndUpdate(
      id,
      { riderId, status: "assigned", assignedAt: new Date() },
      { new: true },
    ).populate("riderId", "firstName lastName");

    await Rider.findByIdAndUpdate(riderId, {
      $inc: { currentOrders: 1 },
      status: "busy",
    });

    const riderPop = updated?.riderId as unknown as { firstName: string; lastName: string; _id: { toString(): string } } | null;
    sendSuccess(res, {
      order: {
        id: updated!.id,
        driver: riderPop ? `${riderPop.firstName} ${riderPop.lastName}` : undefined,
        driverId: riderId,
        assignedAt: updated!.assignedAt,
      },
    }, "Rider assigned successfully");
  } catch (error) {
    console.error("Assign rider error:", error);
    sendError(res, "Error assigning rider", HTTP.SERVER_ERROR);
  }
};
