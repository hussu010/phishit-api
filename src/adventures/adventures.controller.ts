import { NextFunction, Request, Response } from "express";

import {
  getAdventures,
  getAdventureById,
  createAdventure,
  deleteAdventure,
  updateAdventure,
} from "./adventures.service";

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
    const { id } = req.params;

    const adventure = await getAdventureById(id);
    res.status(200).json(adventure);
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, description, location, imageUrl, imageAlt, images } =
      req.body;

    const adventure = await createAdventure({
      title,
      description,
      location,
      images,
      imageUrl,
      imageAlt,
    });
    res.status(201).json(adventure);
  } catch (error) {
    next(error);
  }
};

const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { title, description, location, imageUrl, imageAlt, images } =
      req.body;

    const adventure = await updateAdventure({
      id,
      title,
      description,
      location,
      images,
      imageUrl,
      imageAlt,
    });
    res.status(200).json(adventure);
  } catch (error) {
    next(error);
  }
};

const remove = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await deleteAdventure(id);
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export { getAll, get, create, update, remove };
