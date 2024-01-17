import GuideRequest from "./guide_requests.model";
import { CustomError } from "../common/interfaces/common";
import { errorMessages } from "../common/config/messages";
import User from "../users/users.model";
import { IUser } from "../users/users.interface";

const getGuideRequests = async () => {
  try {
    const guideRequests = await GuideRequest.find({
      $or: [
        {
          status: "PENDING",
        },
        {
          status: "APPROVED",
        },
      ],
    }).sort({
      createdAt: -1,
    });
    return guideRequests;
  } catch (error) {
    throw error;
  }
};

const createGuideRequest = async ({
  user,
  type,
  name,
  phoneNumber,
  email,
  address,
  message,
  documents,
}: {
  user: IUser;
  type: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  message: string;
  documents: string[];
}) => {
  try {
    const guideRequest = await GuideRequest.create({
      user,
      type,
      name,
      phoneNumber,
      email,
      address,
      message,
      documents,
    });
    return guideRequest;
  } catch (error) {
    throw error;
  }
};

const updateGuideRequestApproval = async ({
  id,
  status,
}: {
  id: string;
  status: string;
}) => {
  try {
    const guideRequest = await GuideRequest.findOneAndUpdate(
      {
        _id: id,
        status: "PENDING",
      },
      { status },
      { new: true }
    );

    if (!guideRequest) {
      throw new CustomError(errorMessages.OBJECT_WITH_ID_NOT_FOUND, 404);
    }

    if (status === "APPROVED") {
      await User.findOneAndUpdate(
        { _id: guideRequest.user },
        { $push: { roles: "GUIDE" } }
      );
    }

    return guideRequest;
  } catch (error) {
    throw error;
  }
};

export { getGuideRequests, createGuideRequest, updateGuideRequestApproval };
