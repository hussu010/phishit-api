import { faker } from "@faker-js/faker";
import Adventure from "../adventures/adventures.model";
import { IPackage } from "../adventures/adventures.interface";

import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV !== "test") {
  import("../common/config/db");
}

const seedAdventures = async ({
  numberOfAdventures,
  numberOfPackages,
}: {
  numberOfAdventures: number;
  numberOfPackages: number;
}) => {
  const adventuresArray = [];

  for (let i = 0; i < numberOfAdventures; i++) {
    const adventure = new Adventure({
      title: faker.location.city(),
      description: faker.lorem.sentences(3),
      location: {
        type: "Point",
        coordinates: [faker.location.longitude(), faker.location.latitude()],
      },
      imageUrl: faker.image.urlLoremFlickr({ category: "nature" }),
      imageAlt: faker.lorem.words(3),
      images: [
        {
          url: faker.image.urlLoremFlickr({ category: "nature" }),
          position: 1,
        },
        {
          url: faker.image.urlLoremFlickr({ category: "nature" }),
          position: 2,
        },
        {
          url: faker.image.urlLoremFlickr({ category: "nature" }),
          position: 3,
        },
      ],
      packages: [],
    });

    for (let j = 0; j < numberOfPackages; j++) {
      const adventurePackage: IPackage = {
        title: faker.commerce.productName(),
        price: faker.number.int({
          min: 10000,
          max: 100000,
        }),
        description: faker.lorem.sentences(3),
        duration: faker.number.int({ min: 1, max: 30 }),
      };

      adventure.packages.push(adventurePackage);
    }

    adventuresArray.push(adventure);
  }

  const adventures = await Adventure.insertMany(adventuresArray);
  return adventures;
};

if (require.main === module) {
  seedAdventures({
    numberOfAdventures: 6,
    numberOfPackages: 6,
  })
    .catch((err) => {
      console.log(err);
      process.exit(1);
    })
    .then(() => {
      console.log("Adventures seeded successfully...");
      process.exit(0);
    });
}

export { seedAdventures };
