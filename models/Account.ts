import mongoose, {Model} from "mongoose";
import type {Account} from "next-auth";

// @Schema
const AccountSchema = new mongoose.Schema<Account>({
  userId: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
  },
  provider: {
    type: String,
    trim: true,
  },
  providerAccountId: {
    type: String,
    trim: true,
  },
  refresh_token: {
    type: String,
    trim: true,
  },
  access_token: {
    type: String,
    trim: true,
  },
  expires_at: {
    type: Number,
    trim: true,
  },
  token_type: {
    type: String,
    trim: true,
  },
  scope: {
    type: String,
    trim: true,
  },
  id_token: {
    type: String,
    trim: true,
  },
  session_state: {
    type: String,
    trim: true,
  },
  oauth_token_secret: {
    type: String,
    trim: true,
  },
  oauth_token: {
    type: String,
    trim: true,
  },
});

// @Model
const registeredModel: Model<Account> = mongoose.models.Account;
export default registeredModel ||
  mongoose.model<Account>("Account", AccountSchema);
