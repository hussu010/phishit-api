import { NextFunction, Request, Response } from "express";
import { changeUsername } from "./users.service";

const updateUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.body;

    const user = req.user!;

    const updatedUser = await changeUsername({
      user,
      username,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export { updateUsername, getMe };
