import { Router } from "express";
import {
  validateClientRegisterPayAsYouGo,
  validateClientRegisterCorporate,
  validateClientLogin,
} from "../middleware/validate.middleware";
import {
  registerPayAsYouGo,
  registerCorporate,
  clientLogin,
  getClientMe,
  getClientOrders,
  createClientOrder,
} from "../controllers/client-auth.controller";
import { protectClient } from "../middleware/auth.middleware";

const router = Router();

router.post("/register/pay-as-you-go", validateClientRegisterPayAsYouGo, registerPayAsYouGo);
router.post("/register/corporate", validateClientRegisterCorporate, registerCorporate);
router.post("/login", validateClientLogin, clientLogin);

// Authenticated client self-service
router.get("/me", protectClient, getClientMe);
router.get("/orders", protectClient, getClientOrders);
router.post("/orders", protectClient, createClientOrder);

export default router;
