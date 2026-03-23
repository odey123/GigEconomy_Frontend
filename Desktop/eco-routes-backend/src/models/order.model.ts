import mongoose, { Document, Schema, Types } from "mongoose";

export type OrderStatus =
  | "pending"
  | "assigned"
  | "picked_up"
  | "in_transit"
  | "delivered"
  | "cancelled";

export type DeliveryType = "standard" | "express" | "same_day";
export type DeliveryModel = "Standard" | "Premium";

export interface IOrderDocument extends Document {
  trackingId: string;
  // Recipient
  customerName: string;
  customerEmail?: string;
  customerPhone: string;
  customerLocation: string;
  // Client
  businessClientId: Types.ObjectId;
  // Pickup
  pickupLocation: string;
  pickupContact: string;
  pickupPhone: string;
  // Delivery
  deliveryLocation: string;
  landmark?: string;
  // Order details
  description: string;
  specialInstructions?: string;
  weight: number;
  value: number;
  deliveryType: DeliveryType;
  deliveryModel: DeliveryModel;
  // Status
  status: OrderStatus;
  // Rider
  riderId?: Types.ObjectId;
  assignedAt?: Date;
  // Timing
  scheduledFor?: Date;
  pickedUpAt?: Date;
  deliveredAt?: Date;
  // OTP for delivery verification
  otp?: string;
  // Fees
  deliveryFee: number;
  adminFee: number;
  totalFee: number;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderDocument>(
  {
    trackingId: {
      type: String,
      unique: true,
      required: true,
    },
    customerName: { type: String, required: true, trim: true },
    customerEmail: { type: String, trim: true, lowercase: true },
    customerPhone: { type: String, required: true, trim: true },
    customerLocation: { type: String, required: true, trim: true },
    businessClientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    pickupLocation: { type: String, required: true, trim: true },
    pickupContact: { type: String, required: true, trim: true },
    pickupPhone: { type: String, required: true, trim: true },
    deliveryLocation: { type: String, required: true, trim: true },
    landmark: { type: String, trim: true },
    description: { type: String, required: true, trim: true },
    specialInstructions: { type: String, trim: true },
    weight: { type: Number, required: true, min: 0 },
    value: { type: Number, required: true, min: 0 },
    deliveryType: {
      type: String,
      enum: ["standard", "express", "same_day"],
      required: true,
    },
    deliveryModel: {
      type: String,
      enum: ["Standard", "Premium"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "picked_up", "in_transit", "delivered", "cancelled"],
      default: "pending",
    },
    riderId: { type: Schema.Types.ObjectId, ref: "Rider" },
    assignedAt: { type: Date },
    scheduledFor: { type: Date },
    pickedUpAt: { type: Date },
    deliveredAt: { type: Date },
    otp: { type: String },
    deliveryFee: { type: Number, required: true, default: 0 },
    adminFee: { type: Number, required: true, default: 0 },
    totalFee: { type: Number, required: true, default: 0 },
  },
  { timestamps: true },
);

// Index for common queries
OrderSchema.index({ businessClientId: 1, status: 1 });
OrderSchema.index({ riderId: 1, status: 1 });
OrderSchema.index({ trackingId: 1 });
OrderSchema.index({ createdAt: -1 });

OrderSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const obj = ret as unknown as Record<string, unknown>;
    obj["id"] = (obj["_id"] as { toString(): string }).toString();
    delete obj["_id"];
    delete obj["__v"];
    return obj;
  },
});

const Order = mongoose.model<IOrderDocument>("Order", OrderSchema);
export default Order;
