import { Document } from "mongoose";

interface IAdventure extends Document {
  _id: string;
  title: string;
  summary: string;
  location: {
    type: string;
    coordinates: number[];
  };
  packages: IPackage[];
  createdAt: Date;
  updatedAt: Date;
}

interface IPackage {
  title: string;
  price: number;
  description: string;
  duration: number;
}

export { IAdventure, IPackage };
