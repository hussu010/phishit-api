import { Schema, model, Model } from "mongoose";
import { IAdventure, IPackage } from "./adventures.interface";

const PackageSchema = new Schema<IPackage>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

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
      unique: true,
      sparse: true,
      minLength: 16,
      maxLength: 512,
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
    packages: [PackageSchema],
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
