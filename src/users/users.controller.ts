import { NextFunction, Request, Response } from "express";
import { changeUsername } from "./users.service";
import { Adventure } from "../adventures/adventures.model";

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
    const adventures = await Adventure.find({ guides: user._id }).select(
      "-guides -packages -__v -createdAt -updatedAt"
    );

    res.status(200).json({
      ...user.toJSON(),
      adventures,
    });
  } catch (error) {
    next(error);
  }
};

export { updateUsername, getMe };
