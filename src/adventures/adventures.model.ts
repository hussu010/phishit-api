import { Schema, model, Model } from "mongoose";
import { IAdventure } from "./adventures.interface";

const AdventureSchema = new Schema<IAdventure>(
  {
    title: {
      type: String,
      unique: true,
      sparse: true,
      minLength: 3,
      maxLength: 64,
    },
    description: {
      type: String,
      sparse: true,
      minLength: 16,
      maxLength: 1024,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    imageUrl: {
      type: String,
      required: true,
    },
    imageAlt: {
      type: String,
      required: true,
    },
    images: [
      {
        url: {
          type: String,
        },
        position: {
          type: Number,
        },
      },
    ],
    packages: [
      {
        type: Schema.Types.ObjectId,
        ref: "Package",
      },
    ],
    guides: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Adventure: Model<IAdventure> = model<IAdventure>(
  "Adventure",
  AdventureSchema
);
export default Adventure;
