import InteractionLog from "./interactionLogs.model";
import { IResource, IAction } from "./backoffice.interface";
import { IUser } from "../users/users.interface";
import { PAGE_SIZE, PAGE_SIZE_LIMIT } from "../common/config/general";

const getAllInteractions = async ({
  limitQuery,
  offsetQuery,
}: {
  limitQuery: string;
  offsetQuery: string;
}) => {
  try {
    const _limit =
      parseInt(limitQuery) > PAGE_SIZE_LIMIT
        ? PAGE_SIZE_LIMIT
        : parseInt(limitQuery) || PAGE_SIZE;
    const _offset = parseInt(offsetQuery) || 0;

    const interactions = await InteractionLog.find()
      .populate({
        path: "user",
        select: "-phoneNumber -googleId -isActive -__v -createdAt -updatedAt",
      })
      .limit(_limit)
      .skip(_offset)
      .sort({
        createdAt: -1,
      });

    const total = await InteractionLog.countDocuments();

    return {
      interactions,
      total,
      count: interactions.length,
      limit: _limit,
      offset: _offset,
    };
  } catch (error) {
    throw error;
  }
};

const logInteraction = async ({
  user,
  action,
  resource,
  resourceId,
  data,
}: {
  user: IUser;
  action: IAction;
  resource: IResource;
  resourceId: string;
  data?: any;
}) => {
  try {
    const interactionLog = new InteractionLog({
      user,
      action,
      resource,
      resourceId,
      data,
    });
    await interactionLog.save();
  } catch (error) {
    throw error;
  }
};

export { logInteraction, getAllInteractions };
