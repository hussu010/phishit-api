import { Request, Response, NextFunction } from "express";
import {
  getGuideRequests,
  createGuideRequest,
  updateGuideRequest,
} from "./guide_requests.service";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guideRequests = await getGuideRequests();
    res.status(200).json(guideRequests);
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const {
      type,
      name,
      phoneNumber,
      email,
      gender,
      dateOfBirth,
      address,
      message,
      documents,
    } = req.body;

    const guideRequest = await createGuideRequest({
      user,
      type,
      name,
      phoneNumber,
      email,
      gender,
      dateOfBirth,
      address,
      message,
      documents,
    });
    res.status(200).json(guideRequest);
  } catch (error) {
    next(error);
  }
};

const updateApproval = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body;
    const user = req.user!;
    const guideRequest = await updateGuideRequest({
      id,
      status,
      user,
      message,
    });
    res.status(200).json(guideRequest);
  } catch (error) {
    next(error);
  }
};

export { getAll, create, updateApproval };
