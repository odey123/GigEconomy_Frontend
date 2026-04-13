import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export type RiderStatus = "active" | "inactive" | "busy" | "pending" | "rejected";
export type RiderType = "standard" | "premium";
export type IdType =
  | "voters_card"
  | "drivers_license"
  | "international_passport"
  | "nin_card";

export interface IRiderDocument extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password?: string;
  status: RiderStatus;
  riderType: RiderType;

  // Operational counters
  currentOrders: number;
  completedOrders: number;
  totalDeliveries: number;
  rating: number;

  // Vehicle
  vehicleType: string;
  vehicleNumber: string;
  licenseNumber?: string;

  // KYC — premium riders only
  nin?: string;
  idType?: IdType;
  idDocumentUrl?: string;
  passportPhotoUrl?: string;
  rejectionReason?: string;

  createdAt: Date;
  updatedAt: Date;

  comparePassword(candidatePassword: string): Promise<boolean>;
}

const RiderSchema = new Schema<IRiderDocument>(
  {
    firstName: { type: String, required: [true, "First name is required"], trim: true },
    lastName:  { type: String, required: [true, "Last name is required"],  trim: true },
    phone:     { type: String, required: [true, "Phone number is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false },

    status: {
      type: String,
      enum: ["active", "inactive", "busy", "pending", "rejected"],
      default: "active",
    },
    riderType: {
      type: String,
      enum: ["standard", "premium"],
      default: "standard",
    },

    currentOrders:    { type: Number, default: 0 },
    completedOrders:  { type: Number, default: 0 },
    totalDeliveries:  { type: Number, default: 0 },
    rating:           { type: Number, default: 0, min: 0, max: 5 },

    vehicleType:    { type: String, required: [true, "Vehicle type is required"],   trim: true },
    vehicleNumber:  { type: String, required: [true, "Vehicle number is required"], trim: true },
    licenseNumber:  { type: String, trim: true }, // optional for self-registered premium riders

    // KYC fields
    nin:              { type: String, trim: true },
    idType:           { type: String, enum: ["voters_card", "drivers_license", "international_passport", "nin_card"] },
    idDocumentUrl:    { type: String, trim: true },
    passportPhotoUrl: { type: String, trim: true },
    rejectionReason:  { type: String, trim: true },
  },
  { timestamps: true },
);

RiderSchema.index({ status: 1, riderType: 1 });

RiderSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "12", 10);
  this.password = await bcrypt.hash(this.password, saltRounds);
});

RiderSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

RiderSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    const obj = ret as unknown as Record<string, unknown>;
    obj["id"] = (obj["_id"] as { toString(): string }).toString();
    obj["name"] = `${obj["firstName"]} ${obj["lastName"]}`.trim();
    delete obj["_id"];
    delete obj["__v"];
    delete obj["password"];
    return obj;
  },
});

const Rider = mongoose.model<IRiderDocument>("Rider", RiderSchema);
export default Rider;
