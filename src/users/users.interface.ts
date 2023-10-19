import { Document } from "mongoose";

interface IUser extends Document {
  _id: string;
  phoneNumber: string;
  googleId: string;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export { IUser };
