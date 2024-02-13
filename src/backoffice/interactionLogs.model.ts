import mongoose from "mongoose";
import { IInteractionLog } from "./backoffice.interface";

const interactionLogSchema = new mongoose.Schema<IInteractionLog>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    action: {
      type: String,
      required: true,
      enum: ["create", "update", "delete", "read", "enroll", "unenroll"],
    },
    resource: {
      type: String,
      required: true,
      enum: ["adventure", "package", "user", "interactionLog", "guideRequest"],
    },
    resourceId: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

const InteractionLog = mongoose.model<IInteractionLog>(
  "InteractionLog",
  interactionLogSchema
);
export default InteractionLog;
