import { Document } from "mongoose";

interface IUser extends Document {
  _id: string;
  phoneNumber: string;
  googleId: string;
  username: string;
  roles: string[];
  isActive: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export { IUser };
