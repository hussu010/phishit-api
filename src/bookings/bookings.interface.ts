import { IAdventure, IPackage } from "../adventures/adventures.interface";
import { IUser } from "../users/users.interface";
import { BookingStatus } from "../common/config/enum";

interface IPayment {
  amount: number;
  method: string;
  pidx: string;
  paymentUrl: string;
  expiresAt: Date;
  status: string;
}

interface IBooking {
  _id: string;
  adventure: IAdventure;
  package: IPackage;
  guide: IUser;
  customer: IUser;
  noOfPeople: number;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  payment: IPayment;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt: Date;
}

export { IBooking, IPayment };
