import crypto from "crypto";
import { DeliveryModel, DeliveryType } from "../models/order.model";

// All monetary values are in NGN (Nigerian Naira)
const BASE_FEE = 500;       // Flat base fee per delivery
const WEIGHT_RATE = 50;     // Additional NGN per kg

const DELIVERY_TYPE_MULTIPLIER: Record<DeliveryType, number> = {
  standard: 1.0,
  express: 1.5,
  same_day: 2.0,
};

const PREMIUM_MULTIPLIER = 1.5; // Premium fleet is 50% more expensive than Standard

// Commission split for Premium (market model)
export const PLATFORM_COMMISSION_RATE = {
  Standard: 1.0,  // Company-owned fleet: platform keeps 100%
  Premium: 0.25,  // Independent riders: platform keeps 25%, rider gets 75%
};

export const calculateDeliveryFee = (
  weight: number,
  deliveryType: DeliveryType,
  deliveryModel: DeliveryModel,
): number => {
  const weightFee = weight * WEIGHT_RATE;
  const subtotal = BASE_FEE + weightFee;
  const typeMultiplier = DELIVERY_TYPE_MULTIPLIER[deliveryType];
  const modelMultiplier = deliveryModel === "Premium" ? PREMIUM_MULTIPLIER : 1;
  return Math.round(subtotal * typeMultiplier * modelMultiplier);
};

export const calculateFees = (
  deliveryFee: number,
  deliveryModel: DeliveryModel,
): {
  deliveryFee: number;
  adminFee: number;
  totalFee: number;
  riderPayout: number;
  platformCommission: number;
} => {
  const adminFee = 0;
  const totalFee = deliveryFee + adminFee;
  const platformCommission =
    deliveryModel === "Premium"
      ? Math.round(totalFee * PLATFORM_COMMISSION_RATE.Premium)
      : totalFee;
  const riderPayout = totalFee - platformCommission;
  return { deliveryFee, adminFee, totalFee, riderPayout, platformCommission };
};

/**
 * Generates a unique, human-readable tracking ID.
 * Uses cryptographically secure random bytes — not Math.random().
 * Format: ECO-YYYYMMDD-XXXXXXXX
 */
export const generateTrackingId = (): string => {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `ECO-${date}-${random}`;
};

/**
 * Generates a 6-digit delivery verification OTP.
 * Uses crypto.randomInt() — cryptographically secure, unlike Math.random().
 */
export const generateOtp = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};
