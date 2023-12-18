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
      required: true,
      enum: GenderEnum,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    bio: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 254,
    },
    avatar: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Profile = mongoose.model<IProfile>("Profile", profileSchema);
export default Profile;
