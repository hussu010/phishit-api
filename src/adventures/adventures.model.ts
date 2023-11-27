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
      minLength: 8,
      maxLength: 64,
    },
    summary: {
      type: String,
      unique: true,
      sparse: true,
      minLength: 16,
      maxLength: 128,
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
