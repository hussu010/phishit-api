import { Request, Response, NextFunction } from "express";
import { getGuideRequests, createGuideRequest } from "./guide_requests.service";

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
    const { type, name, phoneNumber, email, address, message, documents } =
      req.body;

    const guideRequest = await createGuideRequest({
      type,
      name,
      phoneNumber,
      email,
      address,
      message,
      documents,
    });
    res.status(200).json(guideRequest);
  } catch (error) {
    next(error);
  }
};

export { getAll, create };
