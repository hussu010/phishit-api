import { IUser } from "../users/users.interface";
import { Types } from "mongoose";

type IResource =
  | "adventure"
  | "package"
  | "user"
  | "interactionLog"
  | "guideRequest";
type IAction = "create" | "update" | "delete" | "read" | "enroll" | "unenroll";

interface IInteractionLog {
  _id: string;
  user: IUser;
  action: IAction;
  resource: IResource;
  resourceId: string;
  data: any;
  createdAt: Date;
  updatedAt: Date;
}

export { IInteractionLog, IResource, IAction };
