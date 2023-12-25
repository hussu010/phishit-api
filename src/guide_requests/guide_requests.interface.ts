import { Document } from "mongoose";
import { StatusType, GuideType } from "../common/config/enum";

interface IGuideRequest extends Document {
  _id: string;
  type: GuideType;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  message: string;
  documents: {
    url: string;
    type: string;
  }[];
  status: StatusType;
  createdAt: Date;
  updatedAt: Date;
}

export { IGuideRequest };
