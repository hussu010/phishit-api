import { IUser } from "../users/users.interface";

interface IProfile {
  _id: string;
  user: IUser;
  fullName: string;
  email: string;
  gender: string;
  dateOfBirth: Date;
  bio: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

export { IProfile };
