import mongoose, { Document, Schema, Types } from "mongoose";

export type WalletTxType = "credit" | "debit";

export interface IWalletTransactionDocument extends Document {
  walletId: Types.ObjectId;
  type: WalletTxType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reference?: string;
  description: string;
  createdAt: Date;
}

const WalletTransactionSchema = new Schema<IWalletTransactionDocument>(
  {
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    reference: { type: String, trim: true, sparse: true }, // sparse allows multiple null values while enforcing uniqueness on non-null
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

WalletTransactionSchema.index({ walletId: 1, createdAt: -1 });
WalletTransactionSchema.index({ reference: 1 }, { unique: true, sparse: true }); // Idempotency: prevents double-credit on duplicate webhooks

WalletTransactionSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const obj = ret as unknown as Record<string, unknown>;
    obj["id"] = (obj["_id"] as { toString(): string }).toString();
    delete obj["_id"];
    delete obj["__v"];
    return obj;
  },
});

const WalletTransaction = mongoose.model<IWalletTransactionDocument>(
  "WalletTransaction",
  WalletTransactionSchema,
);
export default WalletTransaction;
