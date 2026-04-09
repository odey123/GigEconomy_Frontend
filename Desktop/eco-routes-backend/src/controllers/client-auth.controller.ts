import { Request, Response } from "express";
import mongoose from "mongoose";
import Client from "../models/client.model";
import Order from "../models/order.model";
import Wallet from "../models/wallet.model";
import WalletTransaction from "../models/wallet-transaction.model";
import FinanceTransaction from "../models/finance-transaction.model";
import { generateClientToken } from "../utils/jwt.utils";
import { sendSuccess, sendError, HTTP } from "../utils/response.utils";
import { ClientJwtPayload } from "../types/client.types";
import { calculateDeliveryFee, calculateFees, generateTrackingId, generateOtp } from "../utils/fee.utils";

// POST /api/v1/client-auth/register/pay-as-you-go
export const registerPayAsYouGo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { company, contactName, email, phone, address, password } = req.body;

    const existing = await Client.findOne({ email: email.toLowerCase() });
    if (existing) {
      sendError(res, "An account with this email already exists.", HTTP.CONFLICT);
      return;
    }

    const client = await Client.create({
      company,
      contactName,
      email,
      phone,
      address,
      accountType: "pay_as_you_go",
      password,
      status: "pending",
    });

    // Create wallet immediately — balance starts at 0
    await Wallet.create({ clientId: client._id });

    sendSuccess(
      res,
      {
        client: {
          id: client.id,
          company: client.company,
          email: client.email,
          status: client.status,
          accountType: client.accountType,
        },
      },
      "Account created and pending admin approval",
      HTTP.CREATED,
    );
  } catch (error) {
    console.error("Pay-as-you-go registration error:", error);
    sendError(res, "Error creating account. Please try again.", HTTP.SERVER_ERROR);
  }
};

// POST /api/v1/client-auth/register/corporate
export const registerCorporate = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      company,
      contactName,
      email,
      phone,
      address,
      registrationNumber,
      estimatedMonthlyVolume,
    } = req.body;

    const existing = await Client.findOne({ email: email.toLowerCase() });
    if (existing) {
      sendError(res, "An account with this email already exists.", HTTP.CONFLICT);
      return;
    }

    // Corporate accounts: no password at registration — set via invite link later
    const client = await Client.create({
      company,
      contactName,
      email,
      phone,
      address,
      registrationNumber,
      estimatedMonthlyVolume,
      accountType: "corporate",
      status: "pending",
    });

    sendSuccess(
      res,
      {
        client: {
          id: client.id,
          company: client.company,
          email: client.email,
          status: client.status,
          accountType: client.accountType,
        },
      },
      "Corporate application received and pending review",
      HTTP.CREATED,
    );
  } catch (error) {
    console.error("Corporate registration error:", error);
    sendError(res, "Error submitting application. Please try again.", HTTP.SERVER_ERROR);
  }
};

// GET /api/v1/client-auth/me
export const getClientMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientId = req.client!.id;
    const [client, wallet] = await Promise.all([
      Client.findById(clientId),
      Wallet.findOne({ clientId }),
    ]);
    if (!client) {
      sendError(res, "Client not found", HTTP.NOT_FOUND);
      return;
    }
    sendSuccess(res, {
      client: {
        id: client.id,
        company: client.company,
        contactName: client.contactName,
        email: client.email,
        phone: client.phone,
        address: client.address,
        accountType: client.accountType,
        status: client.status,
        totalOrders: client.totalOrders,
        activeOrders: client.activeOrders,
      },
      walletBalance: wallet?.balance ?? 0,
    });
  } catch (error) {
    console.error("Get client me error:", error);
    sendError(res, "Error fetching profile", HTTP.SERVER_ERROR);
  }
};

// GET /api/v1/client-auth/orders
export const getClientOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientId = req.client!.id;
    const { status, page = "1", limit = "50" } = req.query;

    const filter: Record<string, unknown> = { businessClientId: clientId };
    if (status) filter["status"] = status;

    const pageNum = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10)));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("riderId", "firstName lastName")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);

    sendSuccess(res, {
      orders: orders.map((o) => {
        const obj = o.toJSON() as Record<string, unknown>;
        const rider = obj["riderId"] as Record<string, unknown> | null | undefined;
        
        // Status normalization for Client Portal display
        const statusMap: Record<string, string> = {
          pending: "Pending",
          assigned: "Accepted",
          picked_up: "Picked Up",
          in_transit: "In Transit",
          delivered: "Delivered",
          cancelled: "Cancelled",
        };

        return {
          id: obj["id"],
          trackingId: obj["trackingId"],
          customerName: obj["customerName"],
          status: statusMap[String(obj["status"])] || obj["status"],
          deliveryType: obj["deliveryType"],
          totalFee: obj["totalFee"],
          createdAt: obj["createdAt"],
          driver: rider ? `${rider["firstName"]} ${rider["lastName"]}` : undefined,
        };
      }),
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error("Get client orders error:", error);
    sendError(res, "Error fetching orders", HTTP.SERVER_ERROR);
  }
};

// POST /api/v1/client-auth/orders
export const createClientOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientId = req.client!.id;
    const client = await Client.findById(clientId);
    if (!client) {
      sendError(res, "Client not found", HTTP.NOT_FOUND);
      return;
    }
    if (client.status !== "active") {
      sendError(res, "Your account is not active. Please contact support.", HTTP.FORBIDDEN);
      return;
    }

    const {
      pickupLocation, pickupContact, pickupPhone,
      customerName, customerPhone, customerAddress,
      landmark, description, weight, value,
      deliveryType = "standard", deliveryModel = "Standard",
      specialInstructions, scheduledFor,
    } = req.body;

    const deliveryFee = calculateDeliveryFee(weight, deliveryType, deliveryModel);
    const { adminFee, totalFee, riderPayout, platformCommission } = calculateFees(deliveryFee, deliveryModel);

    if (client.accountType === "pay_as_you_go") {
      const wallet = await Wallet.findOneAndUpdate(
        { clientId, balance: { $gte: totalFee } },
        { $inc: { balance: -totalFee } },
        { new: false },
      );
      if (!wallet) {
        sendError(res, "Insufficient wallet balance. Please top up your wallet.", HTTP.PAYMENT_REQUIRED);
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
      trackingId, customerName, customerPhone,
      customerLocation: customerAddress,
      businessClientId: clientId,
      pickupLocation, pickupContact, pickupPhone,
      deliveryLocation: customerAddress,
      landmark, description, specialInstructions,
      weight, value, deliveryType, deliveryModel,
      scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
      otp, deliveryFee, adminFee, totalFee,
    });

    await FinanceTransaction.create({
      orderId: order._id, clientId,
      deliveryModel, totalFee, platformCommission,
      riderPayout, status: "Pending", date: new Date(),
    });

    await Client.findByIdAndUpdate(clientId, { $inc: { totalOrders: 1, activeOrders: 1 } });

    sendSuccess(
      res,
      {
        order: {
          id: order.id,
          trackingId: order.trackingId,
          otp: order.otp,
          status: "Pending", // Newly created orders are always Pending
          totalFee: order.totalFee,
        },
      },
      "Order created successfully",
      HTTP.CREATED,
    );
  } catch (error) {
    console.error("Create client order error:", error);
    sendError(res, "Error creating order", HTTP.SERVER_ERROR);
  }
};

// POST /api/v1/client-auth/login
export const clientLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email: email.toLowerCase() }).select("+password");
    if (!client) {
      sendError(res, "Invalid email or password.", HTTP.UNAUTHORIZED);
      return;
    }

    if (!client.password) {
      sendError(
        res,
        "This account requires an invitation link to set your password. Please contact your account manager.",
        HTTP.FORBIDDEN,
      );
      return;
    }

    const isValid = await client.comparePassword(password);
    if (!isValid) {
      sendError(res, "Invalid email or password.", HTTP.UNAUTHORIZED);
      return;
    }

    if (client.status === "pending") {
      sendError(
        res,
        "Your account is pending admin approval. You will be notified once activated.",
        HTTP.FORBIDDEN,
      );
      return;
    }

    if (client.status === "inactive") {
      sendError(
        res,
        "Your account has been deactivated. Please contact support.",
        HTTP.FORBIDDEN,
      );
      return;
    }

    const payload: ClientJwtPayload = {
      id: client.id as string,
      email: client.email,
      accountType: client.accountType,
      tokenType: "client",
    };

    const token = generateClientToken(payload);

    sendSuccess(res, {
      client: {
        id: client.id,
        company: client.company,
        email: client.email,
        accountType: client.accountType,
        status: client.status,
      },
      token,
    });
  } catch (error) {
    console.error("Client login error:", error);
    sendError(res, "An error occurred during login. Please try again.", HTTP.SERVER_ERROR);
  }
};
