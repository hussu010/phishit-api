import { Schema, model, Model } from "mongoose";
import {
  StatusEnum,
  GuideTypeEnum,
  GuideRequestDocumentTypeEnum,
  GenderEnum,
} from "../common/config/enum";
import { IGuideRequest } from "./guide_requests.interface";

const GuideRequestSchema = new Schema<IGuideRequest>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: GuideTypeEnum,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: GenderEnum,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    email: {
      type: String,
    },
    address: {
      type: String,
    },
    message: {
      type: String,
    },
    documents: [
      {
        url: {
          type: String,
        },
        type: {
          type: String,
          enum: GuideRequestDocumentTypeEnum,
        },
      },
    ],
    status: {
      type: String,
      enum: StatusEnum,
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

const GuideRequest: Model<IGuideRequest> = model<IGuideRequest>(
  "GuideRequest",
  GuideRequestSchema
);
export default GuideRequest;
