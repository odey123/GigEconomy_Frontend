import mongoose, { Document, Schema, Types } from "mongoose";

export interface IWalletDocument extends Document {
  clientId: Types.ObjectId;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const WalletSchema = new Schema<IWalletDocument>(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "Client",
      required: true,
      unique: true,
    },
    balance: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "NGN" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

WalletSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const obj = ret as unknown as Record<string, unknown>;
    obj["id"] = (obj["_id"] as { toString(): string }).toString();
    delete obj["_id"];
    delete obj["__v"];
    return obj;
  },
});

const Wallet = mongoose.model<IWalletDocument>("Wallet", WalletSchema);
export default Wallet;
