import { Router } from "express";
import { protect, restrictTo } from "../middleware/auth.middleware";
import { validateCreateRider } from "../middleware/validate.middleware";
import * as riderController from "../controllers/rider.controller";

const router = Router();

router.use(protect);

router.get("/",    riderController.getAllRiders);
router.post("/",   validateCreateRider, riderController.createRider);
router.get("/:id", riderController.getRiderById);
router.put("/:id", riderController.updateRider);
router.delete("/:id", riderController.deleteRider);
router.get("/:id/orders", riderController.getRiderOrders);

// KYC approval / rejection — admin and super_admin only
router.patch("/:id/approve", restrictTo("admin", "super_admin"), riderController.approveRider);
router.patch("/:id/reject",  restrictTo("admin", "super_admin"), riderController.rejectRider);

export default router;
