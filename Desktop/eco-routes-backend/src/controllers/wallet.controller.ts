import { Request, Response } from "express";
import crypto from "crypto";
import Wallet from "../models/wallet.model";
import WalletTransaction from "../models/wallet-transaction.model";
import Client from "../models/client.model";
import { sendSuccess, sendError, HTTP } from "../utils/response.utils";

// GET /api/v1/wallets/me
export const getMyWallet = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientId = req.client!.id;

    const wallet = await Wallet.findOne({ clientId });
    if (!wallet) {
      sendError(res, "Wallet not found", HTTP.NOT_FOUND);
      return;
    }

    sendSuccess(res, { wallet: wallet.toJSON() });
  } catch (error) {
    console.error("Get wallet error:", error);
    sendError(res, "Error fetching wallet", HTTP.SERVER_ERROR);
  }
};

// POST /api/v1/wallets/fund/initialize
export const initializeFunding = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientId = req.client!.id;
    const { amount } = req.body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      sendError(res, "A valid positive amount is required", HTTP.BAD_REQUEST);
      return;
    }

    const client = await Client.findById(clientId);
    if (!client) {
      sendError(res, "Client not found", HTTP.NOT_FOUND);
      return;
    }

    // Generate a unique reference for this payment
    const reference = `ECO-WALLET-${Date.now()}-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

    // In production, call Paystack/Flutterwave to get the authorization URL.
    // For now, return the reference. Integrate with payment gateway using env vars:
    //   PAYSTACK_SECRET_KEY or FLUTTERWAVE_SECRET_KEY
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    if (paystackSecretKey) {
      // Real Paystack integration
      const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: client.email,
          amount: amount * 100, // Paystack expects amount in kobo
          reference,
          callback_url: process.env.PAYMENT_CALLBACK_URL,
          metadata: { clientId, walletFunding: true },
        }),
      });

      const data = (await paystackResponse.json()) as {
        status: boolean;
        data: { authorization_url: string; reference: string };
      };

      if (!data.status) {
        sendError(res, "Payment initialization failed", HTTP.SERVER_ERROR);
        return;
      }

      sendSuccess(res, {
        reference: data.data.reference,
        authorizationUrl: data.data.authorization_url,
      }, "Payment initialized successfully");
    } else {
      // Development/test mode: return mock authorization URL
      sendSuccess(res, {
        reference,
        authorizationUrl: `${process.env.FRONTEND_URL || "http://localhost:3000"}/wallet/verify?reference=${reference}&amount=${amount}`,
      }, "Payment initialized successfully");
    }
  } catch (error) {
    console.error("Initialize funding error:", error);
    sendError(res, "Error initializing payment", HTTP.SERVER_ERROR);
  }
};

// POST /api/v1/wallets/fund/webhook
// Secured via HMAC signature verification — no JWT required
export const walletFundingWebhook = async (req: Request, res: Response): Promise<void> => {
  try {
    const paystackSecret = process.env.PAYSTACK_SECRET_KEY;
    if (paystackSecret) {
      const signature = req.headers["x-paystack-signature"] as string;
      const expectedSig = crypto
        .createHmac("sha512", paystackSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");

      if (signature !== expectedSig) {
        res.status(401).json({ status: "error", message: "Invalid signature" });
        return;
      }
    }

    const { event, data } = req.body as {
      event: string;
      data: {
        reference: string;
        amount: number;
        metadata?: { clientId?: string };
        customer?: { email?: string };
      };
    };

    if (event !== "charge.success") {
      res.status(200).json({ received: true });
      return;
    }

    const { reference, amount, metadata } = data;
    const clientId = metadata?.clientId;

    if (!clientId) {
      res.status(200).json({ received: true });
      return;
    }

    const creditAmount = amount / 100; // Paystack sends amount in kobo → convert to NGN

    const wallet = await Wallet.findOne({ clientId });
    if (!wallet) {
      res.status(200).json({ received: true });
      return;
    }

    // IDEMPOTENCY: insert the ledger record FIRST using the payment reference as the
    // natural idempotency key (unique sparse index on WalletTransaction.reference).
    //
    // If two webhooks for the same reference arrive simultaneously:
    //   - Both race to insert the WalletTransaction.
    //   - Exactly one wins; the other throws a duplicate-key (11000) error.
    //   - The $inc only runs for the winner — the balance is never double-credited.
    //
    // Doing $inc BEFORE this insert (the previous order) was wrong: both webhooks
    // would increment the balance before either duplicate-key check could stop them.
    let ledgerRecord;
    try {
      ledgerRecord = await WalletTransaction.create({
        walletId: wallet._id,
        type: "credit",
        amount: creditAmount,
        balanceBefore: wallet.balance, // snapshot; may be slightly stale but acceptable for a ledger audit trail
        balanceAfter: wallet.balance + creditAmount,
        reference,
        description: "Wallet top-up via payment gateway",
      });
    } catch (insertError) {
      if (
        insertError instanceof Error &&
        "code" in insertError &&
        (insertError as NodeJS.ErrnoException).code === "11000"
      ) {
        // Duplicate reference → already processed, acknowledge and stop
        res.status(200).json({ received: true });
        return;
      }
      throw insertError; // unexpected error — re-throw to outer catch
    }

    // Ledger record created successfully → now atomically credit the wallet.
    // $inc is safe here because only one webhook can reach this line per reference.
    await Wallet.updateOne({ _id: wallet._id }, { $inc: { balance: creditAmount } });

    console.log(`Wallet credited: clientId=${clientId} amount=${creditAmount} ref=${ledgerRecord.reference}`);
    res.status(200).json({ received: true });
  } catch (error) {
    console.error("Wallet webhook error:", error);
    res.status(500).json({ status: "error", message: "Webhook processing failed" });
  }
};

// GET /api/v1/wallets/transactions
export const getWalletTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const clientId = req.client!.id;
    const { type, page = "1", limit = "50" } = req.query;

    const wallet = await Wallet.findOne({ clientId });
    if (!wallet) {
      sendError(res, "Wallet not found", HTTP.NOT_FOUND);
      return;
    }

    const filter: Record<string, unknown> = { walletId: wallet._id };
    if (type) filter["type"] = type;

    const pageNum = Math.max(1, parseInt(String(page), 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(String(limit), 10)));
    const skip = (pageNum - 1) * limitNum;

    const [transactions, total] = await Promise.all([
      WalletTransaction.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      WalletTransaction.countDocuments(filter),
    ]);

    sendSuccess(res, {
      transactions: transactions.map((t) => t.toJSON()),
      pagination: { page: pageNum, limit: limitNum, total },
    });
  } catch (error) {
    console.error("Get wallet transactions error:", error);
    sendError(res, "Error fetching wallet transactions", HTTP.SERVER_ERROR);
  }
};
