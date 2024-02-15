import mongoose from "mongoose";
import { GenderEnum } from "../common/config/enum";
import { IProfile } from "./profiles.interface";

const profileSchema = new mongoose.Schema<IProfile>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 64,
    },
    email: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 254,
    },
    gender: {
      type: String,
      enum: GenderEnum,
    },
    dateOfBirth: {
      type: Date,
    },
    bio: {
      type: String,
      minLength: 3,
      maxLength: 254,
    },
    avatar: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model<IProfile>("Profile", profileSchema);
export default Profile;
