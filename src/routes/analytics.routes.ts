import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import * as analyticsController from "../controllers/analytics.controller";

const router = Router();

router.use(protect);

router.get("/dashboard", analyticsController.getDashboardAnalytics);
router.get("/orders", analyticsController.getOrderAnalytics);
router.get("/riders", analyticsController.getRiderAnalytics);

export default router;
