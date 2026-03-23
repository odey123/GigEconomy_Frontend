import { Router } from "express";
import express from "express";
import { protectClient } from "../middleware/auth.middleware";
import { validateFundAmount } from "../middleware/validate.middleware";
import * as walletController from "../controllers/wallet.controller";

const router = Router();

// Webhook: raw body needed for signature verification, strict size limit to prevent DoS
router.post(
  "/fund/webhook",
  express.json({ limit: "50kb" }),
  walletController.walletFundingWebhook,
);

// Client-authenticated routes
router.use(protectClient);
router.get("/me", walletController.getMyWallet);
router.post("/fund/initialize", validateFundAmount, walletController.initializeFunding);
router.get("/transactions", walletController.getWalletTransactions);

export default router;
