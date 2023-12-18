import { NextFunction, Response, Request } from "express";
import { updateUserProfile, getUserProfile } from "./profiles.service";

const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!; // TODO: remove the ! here
    const profile = await getUserProfile(user);
    res.status(200).json(profile);
  } catch (error) {
    next(error);
  }
};

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

export { updateProfile, getProfile };
