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
} from "../controllers/client-auth.controller";

const router = Router();

router.post("/register/pay-as-you-go", validateClientRegisterPayAsYouGo, registerPayAsYouGo);
router.post("/register/corporate", validateClientRegisterCorporate, registerCorporate);
router.post("/login", validateClientLogin, clientLogin);

export default router;
