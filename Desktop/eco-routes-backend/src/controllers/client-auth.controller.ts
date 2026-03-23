import { Request, Response } from "express";
import Client from "../models/client.model";
import Wallet from "../models/wallet.model";
import { generateClientToken } from "../utils/jwt.utils";
import { sendSuccess, sendError, HTTP } from "../utils/response.utils";
import { ClientJwtPayload } from "../types/client.types";

// POST /api/v1/client-auth/register/pay-as-you-go
export const registerPayAsYouGo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { company, contactName, email, phone, address, password } = req.body;

    const existing = await Client.findOne({ email: email.toLowerCase() });
    if (existing) {
      sendError(res, "An account with this email already exists.", HTTP.CONFLICT);
      return;
    }

    const client = await Client.create({
      company,
      contactName,
      email,
      phone,
      address,
      accountType: "pay_as_you_go",
      password,
      status: "pending",
    });

    // Create wallet immediately — balance starts at 0
    await Wallet.create({ clientId: client._id });

    sendSuccess(
      res,
      {
        client: {
          id: client.id,
          company: client.company,
          email: client.email,
          status: client.status,
          accountType: client.accountType,
        },
      },
      "Account created and pending admin approval",
      HTTP.CREATED,
    );
  } catch (error) {
    console.error("Pay-as-you-go registration error:", error);
    sendError(res, "Error creating account. Please try again.", HTTP.SERVER_ERROR);
  }
};

// POST /api/v1/client-auth/register/corporate
export const registerCorporate = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      company,
      contactName,
      email,
      phone,
      address,
      registrationNumber,
      estimatedMonthlyVolume,
    } = req.body;

    const existing = await Client.findOne({ email: email.toLowerCase() });
    if (existing) {
      sendError(res, "An account with this email already exists.", HTTP.CONFLICT);
      return;
    }

    // Corporate accounts: no password at registration — set via invite link later
    const client = await Client.create({
      company,
      contactName,
      email,
      phone,
      address,
      registrationNumber,
      estimatedMonthlyVolume,
      accountType: "corporate",
      status: "pending",
    });

    sendSuccess(
      res,
      {
        client: {
          id: client.id,
          company: client.company,
          email: client.email,
          status: client.status,
          accountType: client.accountType,
        },
      },
      "Corporate application received and pending review",
      HTTP.CREATED,
    );
  } catch (error) {
    console.error("Corporate registration error:", error);
    sendError(res, "Error submitting application. Please try again.", HTTP.SERVER_ERROR);
  }
};

// POST /api/v1/client-auth/login
export const clientLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const client = await Client.findOne({ email: email.toLowerCase() }).select("+password");
    if (!client) {
      sendError(res, "Invalid email or password.", HTTP.UNAUTHORIZED);
      return;
    }

    if (!client.password) {
      sendError(
        res,
        "This account requires an invitation link to set your password. Please contact your account manager.",
        HTTP.FORBIDDEN,
      );
      return;
    }

    const isValid = await client.comparePassword(password);
    if (!isValid) {
      sendError(res, "Invalid email or password.", HTTP.UNAUTHORIZED);
      return;
    }

    if (client.status === "pending") {
      sendError(
        res,
        "Your account is pending admin approval. You will be notified once activated.",
        HTTP.FORBIDDEN,
      );
      return;
    }

    if (client.status === "inactive") {
      sendError(
        res,
        "Your account has been deactivated. Please contact support.",
        HTTP.FORBIDDEN,
      );
      return;
    }

    const payload: ClientJwtPayload = {
      id: client.id as string,
      email: client.email,
      accountType: client.accountType,
      tokenType: "client",
    };

    const token = generateClientToken(payload);

    sendSuccess(res, {
      client: {
        id: client.id,
        company: client.company,
        email: client.email,
        accountType: client.accountType,
        status: client.status,
      },
      token,
    });
  } catch (error) {
    console.error("Client login error:", error);
    sendError(res, "An error occurred during login. Please try again.", HTTP.SERVER_ERROR);
  }
};
