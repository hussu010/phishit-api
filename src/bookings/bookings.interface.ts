import { IAdventure, IPackage } from "../adventures/adventures.interface";
import { IUser } from "../users/users.interface";

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
  createdAt: Date;
  updatedAt: Date;
}

export { IBooking };
