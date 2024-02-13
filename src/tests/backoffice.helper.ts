import { faker } from "@faker-js/faker";
import InteractionLog from "../backoffice/interactionLogs.model";
import User from "../users/users.model";

const seedInteractions = async ({
  noOfInteractions,
}: {
  noOfInteractions: number;
}) => {
  const interactionLogs: any = [];

  for (let i = 0; i < noOfInteractions; i++) {
    const user = await User.create({
      phoneNumber: faker.string.numeric(10),
    });

    const interactionLog = new InteractionLog({
      user: user._id,
      action: faker.helpers.arrayElement([
        "create",
        "update",
        "delete",
        "read",
        "enroll",
        "unenroll",
      ]),
      resource: faker.helpers.arrayElement([
        "adventure",
        "user",
        "package",
        "guideRequest",
      ]),
      resourceId: faker.database.mongodbObjectId(),
      data: {
        before: {
          title: faker.lorem.words(3),
          description: faker.lorem.sentences(3),
        },
        after: {
          title: faker.lorem.words(3),
          description: faker.lorem.sentences(3),
        },
      },
    });

    interactionLogs.push(interactionLog);
  }

  await InteractionLog.insertMany(interactionLogs);
};

export { seedInteractions };
