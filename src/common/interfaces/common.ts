import { IUser } from "../../users/users.interface";

class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export { CustomError };
