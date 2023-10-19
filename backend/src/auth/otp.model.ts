import { OTPTypeEnum } from "../common/config/enum";
import { Schema, model } from "mongoose";
import { IUser } from "../users/users.interface";

interface IOtp extends Document {
  _id: string;
  user: IUser;
  code: number;
  type: string;
  expiresAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    code: Number,
    type: {
      type: String,
      enum: OTPTypeEnum,
    },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Otp = model<IOtp>("Otp", OtpSchema);
export default Otp;
