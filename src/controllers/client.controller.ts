import { Request, Response } from "express";
import mongoose from "mongoose";
import Client from "../models/client.model";
import Order from "../models/order.model";
import Wallet from "../models/wallet.model";
import { sendSuccess, sendError, HTTP } from "../utils/response.utils";

// GET /api/v1/clients
export const getAllClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const { status, page = "1", limit = "50" } = req.query;

    const filter: Record<string, unknown> = {};
    if (status) filter["status"] = status;

    const pageNum = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10)));
    const skip = (pageNum - 1) * limitNum;

    const [clients, total] = await Promise.all([
      Client.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      Client.countDocuments(filter),
    ]);

    sendSuccess(res, {
      clients: clients.map((c) => c.toJSON()),
      pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) },
    });
  } catch (error) {
    console.error("Get clients error:", error);
    sendError(res, "Error fetching clients", HTTP.SERVER_ERROR);
  }
};

// GET /api/v1/clients/:id
export const getClientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid client ID", HTTP.BAD_REQUEST);
      return;
    }

    const client = await Client.findById(id);
    if (!client) {
      sendError(res, "Client not found", HTTP.NOT_FOUND);
      return;
    }

    sendSuccess(res, { client: client.toJSON() });
  } catch (error) {
    console.error("Get client error:", error);
    sendError(res, "Error fetching client", HTTP.SERVER_ERROR);
  }
};

// POST /api/v1/clients
export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      contactName,
      email,
      phone,
      company,
      address,
      accountType,
      registrationNumber,
      estimatedMonthlyVolume,
    } = req.body;

    const existing = await Client.findOne({ email: email.toLowerCase() });
    if (existing) {
      sendError(res, "A client with this email already exists", HTTP.CONFLICT);
      return;
    }

    const client = await Client.create({
      contactName,
      email,
      phone,
      company,
      address,
      accountType,
      registrationNumber,
      estimatedMonthlyVolume,
      status: "active",
    });

    // Create wallet for pay_as_you_go clients
    if (client.accountType === "pay_as_you_go") {
      await Wallet.create({ clientId: client._id });
    }

    sendSuccess(res, { client: client.toJSON() }, "Client created successfully", HTTP.CREATED);
  } catch (error) {
    console.error("Create client error:", error);
    sendError(res, "Error creating client", HTTP.SERVER_ERROR);
  }
};

// PUT /api/v1/clients/:id
export const updateClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid client ID", HTTP.BAD_REQUEST);
      return;
    }

    const allowed = ["contactName", "email", "phone", "company", "address", "status", "accountType"];
    const updateData: Record<string, unknown> = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    }

    const client = await Client.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!client) {
      sendError(res, "Client not found", HTTP.NOT_FOUND);
      return;
    }

    sendSuccess(res, { client: client.toJSON() }, "Client updated successfully");
  } catch (error) {
    console.error("Update client error:", error);
    sendError(res, "Error updating client", HTTP.SERVER_ERROR);
  }
};

// DELETE /api/v1/clients/:id
export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid client ID", HTTP.BAD_REQUEST);
      return;
    }

    const client = await Client.findByIdAndDelete(id);
    if (!client) {
      sendError(res, "Client not found", HTTP.NOT_FOUND);
      return;
    }

    sendSuccess(res, null, "Client deleted successfully");
  } catch (error) {
    console.error("Delete client error:", error);
    sendError(res, "Error deleting client", HTTP.SERVER_ERROR);
  }
};

// GET /api/v1/clients/:id/orders
export const getClientOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid client ID", HTTP.BAD_REQUEST);
      return;
    }

    const client = await Client.findById(id);
    if (!client) {
      sendError(res, "Client not found", HTTP.NOT_FOUND);
      return;
    }

    const orders = await Order.find({ businessClientId: id })
      .populate("riderId", "firstName lastName")
      .sort({ createdAt: -1 });

    sendSuccess(res, {
      clientId: id,
      clientName: client.company,
      orders: orders.map((o) => o.toJSON()),
    });
  } catch (error) {
    console.error("Get client orders error:", error);
    sendError(res, "Error fetching client orders", HTTP.SERVER_ERROR);
  }
};
