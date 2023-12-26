import { Document } from "mongoose";

interface IUser {
  _id: string;
  phoneNumber: string;
  googleId: string;
  username: string;
  roles: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export { IUser };
