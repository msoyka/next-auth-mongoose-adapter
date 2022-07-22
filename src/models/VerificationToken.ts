import mongoose, {Model} from "mongoose";
import type {VerificationToken} from "next-auth/adapters";

// @Schema
const VerificationTokenSchema = new mongoose.Schema<VerificationToken>({
  expires: {
    type: Date,
    trim: true,
  },
  token: {
    type: String,
    trim: true,
  },
  identifier: {
    type: String,
    trim: true,
  },
});

// @Model
const registeredModel: Model<VerificationToken> =
  mongoose.models.VerificationToken;
export default registeredModel ||
  mongoose.model<VerificationToken>(
    "VerificationToken",
    VerificationTokenSchema
  );
