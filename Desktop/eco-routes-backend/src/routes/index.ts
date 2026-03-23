import { Router } from "express";
import authRoutes from "./auth.routes";
import clientAuthRoutes from "./client-auth.routes";
import riderAuthRoutes from "./rider-auth.routes";
import orderRoutes from "./order.routes";
import riderRoutes from "./rider.routes";
import clientRoutes from "./client.routes";
import teamRoutes from "./team.routes";
import analyticsRoutes from "./analytics.routes";
import financeRoutes from "./finance.routes";
import walletRoutes from "./wallet.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/client-auth", clientAuthRoutes);
router.use("/rider-auth", riderAuthRoutes);
router.use("/orders", orderRoutes);
router.use("/riders", riderRoutes);
router.use("/clients", clientRoutes);
router.use("/team", teamRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/finance", financeRoutes);
router.use("/wallets", walletRoutes);

router.get("/", (_req, res) => {
  res.json({
    status: "success",
    message: "EcoRoutes API v1",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      clientAuth: "/api/v1/client-auth",
      riderAuth: "/api/v1/rider-auth",
      orders: "/api/v1/orders",
      riders: "/api/v1/riders",
      clients: "/api/v1/clients",
      team: "/api/v1/team",
      analytics: "/api/v1/analytics",
      finance: "/api/v1/finance",
      wallets: "/api/v1/wallets",
    },
  });
});

export default router;
