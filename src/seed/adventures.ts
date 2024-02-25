import { faker } from "@faker-js/faker";
import { Adventure, Package } from "../adventures/adventures.model";
import User from "../users/users.model";
import Profile from "../profiles/profiles.model";

import { adventures } from "./data";

import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV !== "test") {
  import("../common/config/db");
}

const seedAdventures = async ({
  numberOfGuides = 3,
}: {
  numberOfGuides?: number;
}) => {
  const adventuresArray = [];

  for await (const adventure of adventures) {
    const newAdventure = new Adventure({
      title: adventure.title,
      description: adventure.description,
      location: {
        type: "Point",
        coordinates: [
          adventure.location.longitude,
          adventure.location.latitude,
        ],
      },
      imageUrl: adventure.imageUrl,
      imageAlt: adventure.imageAlt,
      images: adventure.images,
      packages: [],
    });

    for await (const adventurePackage of adventure.packages) {
      const newPackage = await Package.create({
        title: adventurePackage.title,
        price: adventurePackage.price,
        description: adventurePackage.description,
        duration: adventurePackage.duration,
      });

      newAdventure.packages.push(newPackage);
    }

    for (let k = 0; k < numberOfGuides; k++) {
      const user = await User.create({
        phoneNumber: faker.string.numeric(10),
        roles: ["GUIDE"],
      });

      await Profile.create({
        user: user._id,
        fullName: faker.person.fullName(),
        email: faker.internet.email(),
        gender: faker.helpers.arrayElement(["MALE", "FEMALE", "OTHER"]),
        dateOfBirth: faker.date.past({ years: 22 }),
        bio: faker.lorem.paragraph(),
        avatar: faker.image.avatar(),
      });

      newAdventure.guides.push(user);
    }
    adventuresArray.push(newAdventure);
  }

  const newAdventures = await Adventure.insertMany(adventuresArray);
  return newAdventures;
};

if (require.main === module) {
  seedAdventures({ numberOfGuides: 3 })
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
