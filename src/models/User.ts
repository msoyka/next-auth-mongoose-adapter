import mongoose, {Model} from "mongoose";
import type {AdapterUser} from "next-auth/adapters";

// @Schema
const UserSchema = new mongoose.Schema<AdapterUser>({
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
  },
  emailVerified: {
    type: Date,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
});

// @Model
const registeredModel: Model<AdapterUser> = mongoose.models.User;
export default registeredModel ||
  mongoose.model<AdapterUser>("User", UserSchema);
