import { CustomError } from "../common/interfaces/common";
import { errorMessages } from "../common/config/messages";

import Adventure from "./adventures.model";

const getAdventures = async () => {
  try {
    const adventures = await Adventure.find();
    return adventures;
  } catch (error) {
    throw error;
  }
};

const getAdventureById = async (id: string) => {
  try {
    const adventure = await Adventure.findById(id);

    if (!adventure) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    return adventure;
  } catch (error) {
    throw error;
  }
};

export { getAdventures, getAdventureById };
