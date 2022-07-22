import {Model, Schema, model, models} from "mongoose";
import type {AdapterSession} from "next-auth/adapters";

// @Schema
const SessionSchema = new Schema<AdapterSession>({
  expires: {
    type: Date,
    trim: true,
  },
  sessionToken: {
    type: String,
    trim: true,
  },
  userId: {
    type: String,
    ref: "User",
  },
});

// @Model
const registeredModel: Model<AdapterSession> = models.Session;
export default registeredModel ||
  model<AdapterSession>("Session", SessionSchema);
