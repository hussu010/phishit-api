import User from "../users/users.model";

import dotenv from "dotenv";
dotenv.config();

import { users } from "./data";

if (process.env.NODE_ENV !== "test") {
  import("../common/config/db");
}

const seedUsers = async () => {
  const usersArray = [];

  for (let i = 0; i < users.length; i++) {
    let query;

    if (users[i].phoneNumber) {
      query = { phoneNumber: users[i].phoneNumber };
    } else {
      query = { googleId: users[i].googleId };
    }

    const user = await User.findOneAndUpdate(
      query,
      { ...users[i] },
      { upsert: true, new: true }
    ).lean();
    usersArray.push(user);
  }

  return usersArray;
};

seedUsers()
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
  .then(() => {
    console.log("Users seeded successfully...");
    process.exit(0);
  });
