import { Schema, model, Model } from "mongoose";
import { UserEnum, UserRole } from "../common/config/enum";
import { IUser } from "./users.interface";
import { generateRandomUsername } from "./users.utils";

const UserSchema = new Schema<IUser>(
  {
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      minLength: 10,
      maxLength: 10,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      minLength: 21,
      maxLength: 21,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      minLength: 5,
      maxLength: 255,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      minLength: 3,
      maxLength: 15,
      default: generateRandomUsername(),
    },
    roles: [
      {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.GENERAL,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("validate", function (next) {
  if (!this.phoneNumber && !this.googleId) {
    next(new Error("At least `phoneNumber` or `googleId` is required."));
  } else {
    next();
  }
});

// generate username until a unique one is found
UserSchema.pre("save", async function (this: IUser, next) {
  const user = this;
  try {
    while (true) {
      const username = generateRandomUsername();
      const userWithUsername = await User.findOne({
        username,
      });

      if (!userWithUsername) {
        user.username = username;
        break;
      }
    }
    return next();
  } catch (err: any) {
    return next(err);
  }
});

const User: Model<IUser> = model<IUser>("User", UserSchema);
export default User;
