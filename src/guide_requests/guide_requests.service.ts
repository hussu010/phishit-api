import GuideRequest from "./guide_requests.model";

const getGuideRequests = async () => {
  try {
    const guideRequests = await GuideRequest.find({ status: "PENDING" }).sort({
      createdAt: -1,
    });
    return guideRequests;
  } catch (error) {
    throw error;
  }
};

const createGuideRequest = async ({
  type,
  name,
  phoneNumber,
  email,
  address,
  message,
  documents,
}: {
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

export { getGuideRequests, createGuideRequest };
