import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  validateCreateOrder,
  validateUpdateOrderStatus,
  validateAssignRider,
} from "../middleware/validate.middleware";
import * as orderController from "../controllers/order.controller";

const router = Router();

router.use(protect);

router.get("/", orderController.getAllOrders);
router.post("/", validateCreateOrder, orderController.createOrder);
router.get("/:id", orderController.getOrderById);
router.put("/:id", orderController.updateOrder);
router.delete("/:id", orderController.deleteOrder);
router.patch("/:id/status", validateUpdateOrderStatus, orderController.updateOrderStatus);
router.patch("/:id/assign", validateAssignRider, orderController.assignRider);

export default router;
