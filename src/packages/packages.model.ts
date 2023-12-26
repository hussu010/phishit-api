import { Schema, model, Model } from "mongoose";

import { IPackage } from "./packages.interface";

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

const Package: Model<IPackage> = model<IPackage>("Package", PackageSchema);
export default Package;
