import { NextFunction, Response, Request } from "express";
import { updateUserProfile } from "./profiles.service";

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { fullName, email, gender, dateOfBirth, bio } = req.body;
    const user = req.user!; // TODO: Remove ! here

    const profile = await updateUserProfile({
      user,
      fullName,
      email,
      gender,
      dateOfBirth,
      bio,
    });

    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

export { updateProfile };
