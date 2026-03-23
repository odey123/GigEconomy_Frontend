import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware";
import * as financeController from "../controllers/finance.controller";

const router = Router();

router.use(protect, restrictTo("admin", "super_admin"));

router.get("/transactions", financeController.getTransactions);
router.get("/revenue-stats", financeController.getRevenueStats);
router.patch("/transactions/:id/process", financeController.processTransaction);
router.patch("/transactions/:id/dispute", financeController.disputeTransaction);

export default router;
