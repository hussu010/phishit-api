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

export { getGuideRequests };
