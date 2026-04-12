import mongoose, { Document, Schema, Types } from "mongoose";
import { DeliveryModel } from "./order.model";

export type FinanceTxStatus = "Pending" | "Processed" | "Disputed";

export interface IFinanceTransactionDocument extends Document {
  orderId: Types.ObjectId;
  clientId: Types.ObjectId;
  riderId?: Types.ObjectId;
  deliveryModel: DeliveryModel;
  totalFee: number;
  platformCommission: number;
  riderPayout: number;
  status: FinanceTxStatus;
  date: Date;
  processedAt?: Date;
  disputeReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FinanceTransactionSchema = new Schema<IFinanceTransactionDocument>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    riderId: { type: Schema.Types.ObjectId, ref: "Rider" },
    deliveryModel: {
      type: String,
      enum: ["Standard", "Premium"],
      required: true,
    },
    totalFee: { type: Number, required: true, default: 0 },
    platformCommission: { type: Number, required: true, default: 0 },
    riderPayout: { type: Number, required: true, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Processed", "Disputed"],
      default: "Pending",
    },
    date: { type: Date, required: true },
    processedAt: { type: Date },
    disputeReason: { type: String, trim: true },
  },
  { timestamps: true },
);

FinanceTransactionSchema.index({ clientId: 1, status: 1 });
FinanceTransactionSchema.index({ date: -1 });

FinanceTransactionSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const obj = ret as unknown as Record<string, unknown>;
    obj["id"] = (obj["_id"] as { toString(): string }).toString();
    delete obj["_id"];
    delete obj["__v"];
    return obj;
  },
});

const FinanceTransaction = mongoose.model<IFinanceTransactionDocument>(
  "FinanceTransaction",
  FinanceTransactionSchema,
);
export default FinanceTransaction;
