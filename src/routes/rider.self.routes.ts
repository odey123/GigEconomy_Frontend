import { Router } from "express";
import { protectRider } from "../middleware/auth.middleware";
import {
  getRiderMe,
  updateRiderMe,
  updateRiderStatus,
  getAvailableJobs,
  acceptJob,
  markPickedUp,
  markDelivered,
  getRiderOrders,
  getRiderEarnings,
} from "../controllers/rider.self.controller";

const router = Router();

router.use(protectRider);

router.get("/me", getRiderMe);
router.patch("/me", updateRiderMe);
router.patch("/me/status", updateRiderStatus);
router.get("/me/orders", getRiderOrders);
router.get("/me/earnings", getRiderEarnings);
router.get("/available-jobs", getAvailableJobs);
router.post("/jobs/:orderId/accept", acceptJob);
router.patch("/jobs/:orderId/pickup", markPickedUp);
router.patch("/jobs/:orderId/deliver", markDelivered);

export default router;
