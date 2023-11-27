import { NextFunction, Request, Response } from "express";

import { getAdventures } from "./adventures.service";

const getAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const adventures = await getAdventures();
    res.status(200).json(adventures);
  } catch (error) {
    next(error);
  }
};

const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    next(error);
  }
};

export { getAll, get, create, update, remove };
