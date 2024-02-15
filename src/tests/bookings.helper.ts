import { faker } from "@faker-js/faker";
import Booking from "../bookings/bookings.model";
import User from "../users/users.model";

const seedBookings = async ({
  status,
  noOfBookings,
}: {
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
  noOfBookings: number;
}) => {
  const bookingsArray: any = [];

  for (let i = 0; i < noOfBookings; i++) {
    const user = await User.create({
      phoneNumber: faker.string.numeric(10),
    });

    const booking = new Booking({
      customer: user._id,
      guide: user._id,
      adventure: faker.database.mongodbObjectId(),
      package: {
        title: faker.lorem.words(),
        price: faker.number.int({ min: 100, max: 1000 }),
        duration: faker.number.int({ min: 1, max: 10 }),
        description: faker.lorem.paragraph(),
      },
      startDate: faker.date.recent(),
      noOfPeople: faker.number.int({ min: 1, max: 10 }),
      status: status,
      payment: {
        method: "KHALTI",
        amount: faker.number.int({ min: 100, max: 1000 }),
        transactionId: faker.database.mongodbObjectId(),
      },
    });

    bookingsArray.push(booking);
  }

  await Booking.insertMany(bookingsArray);
};

export { seedBookings };
