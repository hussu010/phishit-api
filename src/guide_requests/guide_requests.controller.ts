import { Request, Response, NextFunction } from "express";
import { getGuideRequests } from "./guide_requests.service";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const guideRequests = await getGuideRequests();
    res.status(200).json(guideRequests);
  } catch (error) {
    next(error);
  }
};

export { getAll };
