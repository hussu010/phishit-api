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
const Package: Model<IPackage> = model<IPackage>("Package", PackageSchema);

export { Adventure, Package, PackageSchema };
