import { faker } from "@faker-js/faker";

import GuideRequest from "../guide_requests/guide_requests.model";
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

    for (let i = 0; i < numberOfGuideRequests; i++) {
      const guideRequest = {
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
    await GuideRequest.create(guideRequestsToCreate);
  } catch (error) {
    throw error;
  }
};

export { seedGuideRequests };
