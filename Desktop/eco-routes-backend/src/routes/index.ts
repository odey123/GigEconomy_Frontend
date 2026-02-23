import { Router } from "express";
import authRoutes from "./auth.routes";
// import orderRoutes from "./order.routes";
// import riderRoutes from "./rider.routes";
// import clientRoutes from "./client.routes";

const router = Router();

// Mount route modules
router.use("/auth", authRoutes);
// router.use("/orders", orderRoutes);
// router.use("/riders", riderRoutes);
// router.use("/clients", clientRoutes);

// API info endpoint
router.get("/", (_req, res) => {
  res.json({
    status: "success",
    message: "EcoRoutes API v1",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth",
      // orders: "/api/v1/orders",
      // riders: "/api/v1/riders",
      // clients: "/api/v1/clients",
    },
  });
});

export default router;
