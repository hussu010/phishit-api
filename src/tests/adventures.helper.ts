import { faker } from "@faker-js/faker";
import { Adventure, Package } from "../adventures/adventures.model";
import User from "../users/users.model";

const seedAdventures = async ({
  numberOfAdventures,
  numberOfPackages,
  numberOfGuides = 0,
}: {
  numberOfAdventures: number;
  numberOfPackages: number;
  numberOfGuides?: number;
}) => {
  const adventuresArray: any = [];

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
      const adventurePackage = await Package.create({
        title: faker.commerce.productName(),
        price: faker.number.int({
          min: 10,
          max: 1000,
        }),
        description: faker.lorem.sentences(3),
        duration: faker.number.int({ min: 1, max: 30 }),
      });

      adventure.packages.push(adventurePackage);
    }

    for (let k = 0; k < numberOfGuides; k++) {
      const user = await User.create({
        phoneNumber: faker.string.numeric(10),
        roles: ["GUIDE"],
      });

      adventure.guides.push(user);
    }

    adventuresArray.push(adventure);
  }

  const adventures = await Adventure.insertMany(adventuresArray);
  return adventures;
};

export { seedAdventures };
