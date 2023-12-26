import { Document } from "mongoose";
import { IUser } from "../users/users.interface";

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

interface IPackage {
  _id: string;
  title: string;
  price: number;
  description: string;
  duration: number;
}

export { IAdventure, IPackage };
