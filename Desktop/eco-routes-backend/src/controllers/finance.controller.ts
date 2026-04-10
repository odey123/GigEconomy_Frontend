import { Request, Response } from "express";
import mongoose from "mongoose";
import FinanceTransaction from "../models/finance-transaction.model";
import { sendSuccess, sendError, HTTP } from "../utils/response.utils";

// GET /api/v1/finance/transactions
export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      status,
      deliveryModel,
      startDate,
      endDate,
      page = "1",
      limit = "50",
    } = req.query;

    const filter: Record<string, unknown> = {};
    if (status) filter["status"] = status;
    if (deliveryModel) filter["deliveryModel"] = deliveryModel;
    if (startDate || endDate) {
      filter["date"] = {};
      if (startDate) (filter["date"] as Record<string, unknown>)["$gte"] = new Date(String(startDate));
      if (endDate) (filter["date"] as Record<string, unknown>)["$lte"] = new Date(String(endDate));
    }

    const pageNum = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10)));
    const skip = (pageNum - 1) * limitNum;

    const [txns, total] = await Promise.all([
      FinanceTransaction.find(filter)
        .populate("clientId", "company contactName")
        .populate("riderId", "firstName lastName")
        .sort({ date: -1 })
        .skip(skip)
        .limit(limitNum),
      FinanceTransaction.countDocuments(filter),
    ]);

    const transactions = txns.map((t) => {
      const obj = t.toJSON() as unknown as Record<string, unknown>;
      const client = obj["clientId"] as Record<string, unknown> | null;
      const rider = obj["riderId"] as Record<string, unknown> | null;
      return {
        ...obj,
        clientId: client ? String(client["id"] || client["_id"]) : String(obj["clientId"]),
        clientName: client ? String(client["company"]) : "",
        riderId: rider ? String(rider["id"] || rider["_id"]) : obj["riderId"] ? String(obj["riderId"]) : undefined,
        riderName: rider ? `${rider["firstName"]} ${rider["lastName"]}` : undefined,
      };
    });

    sendSuccess(res, {
      transactions,
      pagination: { page: pageNum, limit: limitNum, total },
    });
  } catch (error) {
    console.error("Get transactions error:", error);
    sendError(res, "Error fetching transactions", HTTP.SERVER_ERROR);
  }
};

// GET /api/v1/finance/revenue-stats
export const getRevenueStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = "monthly" } = req.query;

    const now = new Date();
    let startDate: Date;
    let trendFormat: string;

    switch (period) {
      case "daily":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
        trendFormat = "%Y-%m-%d";
        break;
      case "weekly":
        startDate = new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);
        trendFormat = "%G-W%V";
        break;
      case "yearly":
        startDate = new Date(now.getFullYear() - 2, 0, 1);
        trendFormat = "%Y";
        break;
      default: // monthly
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        trendFormat = "%Y-%m";
        break;
    }

    const [statsResult, standardResult, premiumResult, trendResult] = await Promise.all([
      FinanceTransaction.aggregate([
        { $match: { date: { $gte: startDate } } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalFee" },
            platformEarnings: { $sum: "$platformCommission" },
            riderPayouts: { $sum: "$riderPayout" },
          },
        },
      ]),
      FinanceTransaction.aggregate([
        { $match: { date: { $gte: startDate }, deliveryModel: "Standard" } },
        { $group: { _id: null, total: { $sum: "$totalFee" } } },
      ]),
      FinanceTransaction.aggregate([
        { $match: { date: { $gte: startDate }, deliveryModel: "Premium" } },
        { $group: { _id: null, total: { $sum: "$totalFee" } } },
      ]),
      FinanceTransaction.aggregate([
        { $match: { date: { $gte: startDate } } },
        {
          $group: {
            _id: { $dateToString: { format: trendFormat, date: "$date" } },
            revenue: { $sum: "$totalFee" },
            profit: { $sum: "$platformCommission" },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const stats = statsResult[0] || { totalRevenue: 0, platformEarnings: 0, riderPayouts: 0 };
    const operationalExpenses = 0; // Placeholder for future expense tracking
    const netProfit = stats.platformEarnings - operationalExpenses;

    sendSuccess(res, {
      stats: {
        totalRevenue: stats.totalRevenue,
        standardRevenue: standardResult[0]?.total || 0,
        premiumRevenue: premiumResult[0]?.total || 0,
        platformEarnings: stats.platformEarnings,
        riderPayouts: stats.riderPayouts,
        operationalExpenses,
        netProfit,
      },
      trend: trendResult.map((t: { _id: string; revenue: number; profit: number }) => ({
        period: t._id,
        revenue: t.revenue,
        profit: t.profit,
      })),
    });
  } catch (error) {
    console.error("Revenue stats error:", error);
    sendError(res, "Error fetching revenue statistics", HTTP.SERVER_ERROR);
  }
};

// PATCH /api/v1/finance/transactions/:id/process
export const processTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid transaction ID", HTTP.BAD_REQUEST);
      return;
    }

    const txn = await FinanceTransaction.findById(id);
    if (!txn) {
      sendError(res, "Transaction not found", HTTP.NOT_FOUND);
      return;
    }

    if (txn.status !== "Pending") {
      sendError(res, `Transaction is already ${txn.status.toLowerCase()}`, HTTP.BAD_REQUEST);
      return;
    }

    txn.status = "Processed";
    txn.processedAt = new Date();
    await txn.save();

    sendSuccess(res, {
      transaction: { id: txn.id, status: txn.status, processedAt: txn.processedAt },
    }, "Transaction processed successfully");
  } catch (error) {
    console.error("Process transaction error:", error);
    sendError(res, "Error processing transaction", HTTP.SERVER_ERROR);
  }
};

// PATCH /api/v1/finance/transactions/:id/dispute
export const disputeTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      sendError(res, "Invalid transaction ID", HTTP.BAD_REQUEST);
      return;
    }

    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      sendError(res, "Dispute reason is required", HTTP.BAD_REQUEST);
      return;
    }

    const txn = await FinanceTransaction.findById(id);
    if (!txn) {
      sendError(res, "Transaction not found", HTTP.NOT_FOUND);
      return;
    }

    if (txn.status === "Processed") {
      sendError(res, "Cannot dispute an already processed transaction", HTTP.BAD_REQUEST);
      return;
    }

    txn.status = "Disputed";
    txn.disputeReason = reason.trim();
    await txn.save();

    sendSuccess(res, {
      transaction: { id: txn.id, status: txn.status },
    }, "Transaction marked as disputed");
  } catch (error) {
    console.error("Dispute transaction error:", error);
    sendError(res, "Error disputing transaction", HTTP.SERVER_ERROR);
  }
};
