import { Request, Response } from "express";
import Order from "../models/order.model";
import Rider from "../models/rider.model";
import Client from "../models/client.model";
import FinanceTransaction from "../models/finance-transaction.model";
import { sendSuccess, sendError, HTTP } from "../utils/response.utils";

// GET /api/v1/analytics/dashboard
export const getDashboardAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { period = "daily" } = req.query;

    // Date range based on period
    const now = new Date();
    let startDate: Date;
    if (period === "weekly") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === "monthly") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else {
      // daily
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    }

    const [
      totalOrders,
      activeOrders,
      completedOrders,
      revenueResult,
      topRidersRaw,
      topClientsRaw,
      volumeByHour,
      deliveryPerformance,
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startDate } }),
      Order.countDocuments({
        status: { $in: ["pending", "assigned", "picked_up", "in_transit"] },
      }),
      Order.countDocuments({ status: "delivered", createdAt: { $gte: startDate } }),
      FinanceTransaction.aggregate([
        { $match: { status: "Processed", date: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: "$totalFee" } } },
      ]),
      // Top riders by completed orders
      Rider.find().sort({ completedOrders: -1 }).limit(5).select("firstName lastName completedOrders rating"),
      // Top clients by total orders
      Client.find().sort({ totalOrders: -1 }).limit(5).select("company totalOrders"),
      // Volume by hour of day
      Order.aggregate([
        { $match: { createdAt: { $gte: startDate } } },
        { $group: { _id: { $hour: "$createdAt" }, count: { $sum: 1 } } },
        { $sort: { "_id": 1 } },
      ]),
      // Delivery performance (on-time vs late) — last 7 days
      Order.aggregate([
        { $match: { status: "delivered", deliveredAt: { $exists: true } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            onTime: {
              $sum: {
                $cond: [
                  { $lte: [{ $subtract: ["$deliveredAt", "$createdAt"] }, 4 * 60 * 60 * 1000] },
                  1,
                  0,
                ],
              },
            },
            late: {
              $sum: {
                $cond: [
                  { $gt: [{ $subtract: ["$deliveredAt", "$createdAt"] }, 4 * 60 * 60 * 1000] },
                  1,
                  0,
                ],
              },
            },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 7 },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;
    const successRate = totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0;

    sendSuccess(res, {
      metrics: {
        totalOrders,
        activeOrders,
        completedOrders,
        totalRevenue,
        averageDeliveryTime: 0, // Placeholder: would need actual delivery time tracking
        successRate,
        onTimeRate: 0, // Calculated from deliveryPerformance if needed
      },
      charts: {
        volumeByTime: volumeByHour.map((v: { _id: number; count: number }) => ({
          hour: `${String(v._id).padStart(2, "0")}:00`,
          count: v.count,
        })),
        volumeByDay: [],
        deliveryPerformance: deliveryPerformance.map((d: { _id: string; onTime: number; late: number }) => ({
          date: d._id,
          onTime: d.onTime,
          late: d.late,
        })),
      },
      rankings: {
        topRiders: topRidersRaw.map((r) => ({
          id: r.id,
          name: `${r.firstName} ${r.lastName}`,
          orders: r.completedOrders,
          rating: r.rating,
        })),
        topClients: topClientsRaw.map((c) => ({
          id: c.id,
          name: c.company,
          orders: c.totalOrders,
        })),
      },
    });
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    sendError(res, "Error fetching dashboard analytics", HTTP.SERVER_ERROR);
  }
};

// GET /api/v1/analytics/orders
export const getOrderAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const { startDate, endDate, groupBy = "day" } = req.query;

    const matchFilter: Record<string, unknown> = {};
    if (startDate || endDate) {
      matchFilter["createdAt"] = {};
      if (startDate) (matchFilter["createdAt"] as Record<string, unknown>)["$gte"] = new Date(String(startDate));
      if (endDate) (matchFilter["createdAt"] as Record<string, unknown>)["$lte"] = new Date(String(endDate));
    }

    let dateFormat: string;
    switch (groupBy) {
      case "hour": dateFormat = "%Y-%m-%dT%H:00"; break;
      case "week": dateFormat = "%G-W%V"; break;
      case "month": dateFormat = "%Y-%m"; break;
      default: dateFormat = "%Y-%m-%d"; break;
    }

    const [statusDist, deliveryTypeDist, volumeTrend] = await Promise.all([
      Order.aggregate([
        { $match: matchFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: matchFilter },
        { $group: { _id: "$deliveryType", count: { $sum: 1 } } },
      ]),
      Order.aggregate([
        { $match: matchFilter },
        { $group: { _id: { $dateToString: { format: dateFormat, date: "$createdAt" } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const toMap = (arr: { _id: string; count: number }[]) =>
      arr.reduce((acc: Record<string, number>, cur) => {
        acc[cur._id] = cur.count;
        return acc;
      }, {});

    const statusMap = toMap(statusDist);
    const typeMap = toMap(deliveryTypeDist);

    sendSuccess(res, {
      statusDistribution: {
        pending: statusMap["pending"] || 0,
        assigned: statusMap["assigned"] || 0,
        picked_up: statusMap["picked_up"] || 0,
        in_transit: statusMap["in_transit"] || 0,
        delivered: statusMap["delivered"] || 0,
        cancelled: statusMap["cancelled"] || 0,
      },
      deliveryTypeDistribution: {
        standard: typeMap["standard"] || 0,
        express: typeMap["express"] || 0,
        same_day: typeMap["same_day"] || 0,
      },
      volumeTrend: volumeTrend.map((v: { _id: string; count: number }) => ({
        period: v._id,
        count: v.count,
      })),
    });
  } catch (error) {
    console.error("Order analytics error:", error);
    sendError(res, "Error fetching order analytics", HTTP.SERVER_ERROR);
  }
};

// GET /api/v1/analytics/riders
export const getRiderAnalytics = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [riders, ratingResult] = await Promise.all([
      Rider.find().select("firstName lastName totalDeliveries completedOrders rating status"),
      Rider.aggregate([
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]),
    ]);

    const totalRiders = riders.length;
    const activeRiders = riders.filter((r) => r.status === "active").length;
    const averageRating = ratingResult[0]?.avg ? Math.round(ratingResult[0].avg * 10) / 10 : 0;

    sendSuccess(res, {
      totalRiders,
      activeRiders,
      averageRating,
      performanceByRider: riders.map((r) => ({
        riderId: r.id,
        riderName: `${r.firstName} ${r.lastName}`,
        totalDeliveries: r.totalDeliveries,
        completedOrders: r.completedOrders,
        averageDeliveryTime: 0, // Would need time tracking
        rating: r.rating,
      })),
    });
  } catch (error) {
    console.error("Rider analytics error:", error);
    sendError(res, "Error fetching rider analytics", HTTP.SERVER_ERROR);
  }
};
