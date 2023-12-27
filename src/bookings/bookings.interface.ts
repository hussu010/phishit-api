import { IAdventure, IPackage } from "../adventures/adventures.interface";
import { IUser } from "../users/users.interface";

interface IPayment {
  amount: number;
  method: string;
  pixd: string;
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
  status: string;
  payment: IPayment;
  createdAt: Date;
  updatedAt: Date;
}

export { IBooking, IPayment };
