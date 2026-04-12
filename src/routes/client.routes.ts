import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { validateCreateClient } from "../middleware/validate.middleware";
import * as clientController from "../controllers/client.controller";

const router = Router();

router.use(protect);

router.get("/", clientController.getAllClients);
router.post("/", validateCreateClient, clientController.createClient);
router.get("/:id", clientController.getClientById);
router.put("/:id", clientController.updateClient);
router.delete("/:id", clientController.deleteClient);
router.get("/:id/orders", clientController.getClientOrders);

export default router;
