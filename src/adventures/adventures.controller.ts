import { NextFunction, Request, Response } from "express";

import {
  getAdventures,
  getAdventureById,
  createAdventure,
  deleteAdventure,
  updateAdventure,
  enrollGuideToAdventure,
  unenrollGuideFromAdventure,
  fetchAvailableGuides,
  updateAdventurePackage,
  createAdventurePackage,
  removeAdventurePackage,
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
    const user = req.user!;

    const adventure = await createAdventure({
      user,
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
    const user = req.user!;

    const adventure = await updateAdventure({
      user,
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
    const user = req.user!;

    await deleteAdventure({ id, user });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const enrollToAdventure = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    await enrollGuideToAdventure({ id, user });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const unenrollFromAdventure = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const user = req.user!;

    await unenrollGuideFromAdventure({ id, user });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const getAvailableGuides = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { startDate } = req.body;
    const guides = await fetchAvailableGuides({
      adventureId: id,
      startDate,
    });
    res.status(200).json(guides);
  } catch (error) {
    next(error);
  }
};

const createPackage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { title, price, description, duration } = req.body;
    const user = req.user!;

    const adventurePackage = await createAdventurePackage({
      user,
      adventureId: id,
      title,
      price,
      description,
      duration,
    });
    res.status(201).json(adventurePackage);
  } catch (error) {
    next(error);
  }
};

const updatePackage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { packageId, id } = req.params;
    const { title, price, description, duration } = req.body;
    const user = req.user!;

    const adventurePackage = await updateAdventurePackage({
      user,
      adventureId: id,
      packageId,
      title,
      price,
      description,
      duration,
    });
    res.status(200).json(adventurePackage);
  } catch (error) {
    next(error);
  }
};

const removePackage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { packageId, id } = req.params;
    const user = req.user!;

    await removeAdventurePackage({
      user,
      adventureId: id,
      packageId,
    });
    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

export {
  getAll,
  get,
  create,
  update,
  remove,
  enrollToAdventure,
  unenrollFromAdventure,
  getAvailableGuides,
  createPackage,
  updatePackage,
  removePackage,
};
