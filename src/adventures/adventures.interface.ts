import { Document } from "mongoose";
import { IUser } from "../users/users.interface";
import { IPackage } from "../packages/packages.interface";

interface IAdventure extends Document {
  _id: string;
  title: string;
  description: string;
  location: {
    type: string;
    coordinates: number[];
  };
  imageUrl: string;
  imageAlt: string;
  images: {
    url: string;
    position: number;
  }[];
  packages: IPackage[];
  guides: IUser[];
  createdAt: Date;
  updatedAt: Date;
}

export { IAdventure };
