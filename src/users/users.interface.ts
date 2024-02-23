import { Document } from "mongoose";

import { IProfile } from "../profiles/profiles.interface";
import { IAdventure } from "../adventures/adventures.interface";

interface IUser extends Document {
  _id: string;
  phoneNumber: string;
  googleId: string;
  email: string;
  username: string;
  roles: string[];
  isActive: boolean;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface UserFetchResult {
  user: IUser;
  profile: IProfile | null;
  adventures: IAdventure[];
}

export { IUser, UserFetchResult };
