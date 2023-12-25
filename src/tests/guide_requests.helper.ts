import { faker } from "@faker-js/faker";

import GuideRequest from "../guide_requests/guide_requests.model";
import User from "../users/users.model";
import {
  GuideTypeEnum,
  GuideRequestDocumentTypeEnum,
} from "../common/config/enum";

const seedGuideRequests = async ({
  numberOfGuideRequests,
}: {
  numberOfGuideRequests: number;
}) => {
  try {
    const guideRequestsToCreate: any = [];
    const user = await User.create({
      phoneNumber: "9800000000",
      roles: ["GENERAL"],
    });

    for (let i = 0; i < numberOfGuideRequests; i++) {
      const guideRequest = {
        user,
        type: faker.helpers.arrayElement(GuideTypeEnum),
        name: faker.person.fullName(),
        phoneNumber: faker.phone.number(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(),
        message: faker.lorem.sentences(3),
        documents: [
          {
            url: faker.image.avatar(),
            type: faker.helpers.arrayElement(GuideRequestDocumentTypeEnum),
          },
        ],
      };
      guideRequestsToCreate.push(guideRequest);
    }
    const guideRequests = await GuideRequest.create(guideRequestsToCreate);
    return guideRequests;
  } catch (error) {
    throw error;
  }
};

export { seedGuideRequests };
