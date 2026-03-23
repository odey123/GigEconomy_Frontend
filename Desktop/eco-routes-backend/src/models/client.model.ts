import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type ClientAccountType = "pay_as_you_go" | "corporate";
export type ClientStatus = "active" | "inactive" | "pending";

export interface IClientDocument extends Document {
  company: string;
  contactName: string;
  email: string;
  phone: string;
  address?: string;
  accountType: ClientAccountType;
  registrationNumber?: string;
  estimatedMonthlyVolume?: string;
  totalOrders: number;
  activeOrders: number;
  status: ClientStatus;
  password?: string;
  inviteToken?: string;
  inviteTokenExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const ClientSchema = new Schema<IClientDocument>(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    contactName: {
      type: String,
      required: [true, "Contact name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    address: { type: String, trim: true },
    accountType: {
      type: String,
      enum: ["pay_as_you_go", "corporate"],
      required: [true, "Account type is required"],
    },
    registrationNumber: { type: String, trim: true },
    estimatedMonthlyVolume: { type: String, trim: true },
    totalOrders: { type: Number, default: 0 },
    activeOrders: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "pending",
    },
    password: { type: String, select: false },
    inviteToken: { type: String, select: false },
    inviteTokenExpiresAt: { type: Date, select: false },
  },
  { timestamps: true },
);

ClientSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
  this.password = await bcrypt.hash(this.password, saltRounds);
});

ClientSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

ClientSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const obj = ret as unknown as Record<string, unknown>;
    obj["id"] = (obj["_id"] as { toString(): string }).toString();
    delete obj["_id"];
    delete obj["__v"];
    delete obj["password"];
    delete obj["inviteToken"];
    delete obj["inviteTokenExpiresAt"];
    return obj;
  },
});

const Client = mongoose.model<IClientDocument>("Client", ClientSchema);
export default Client;
