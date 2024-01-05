import User from "../users/users.model";

import dotenv from "dotenv";
dotenv.config();

if (process.env.NODE_ENV !== "test") {
  import("../common/config/db");
}

const users = [
  {
    phoneNumber: "9848000000",
    username: "user1",
    roles: ["GENERAL", "GUIDE"],
    isActive: true,
  },
  {
    phoneNumber: "9863299610",
    username: "user2",
    roles: ["GENERAL", "ADMIN"],
    isActive: true,
  },
  {
    googleId: "105438825981277363287",
    username: "user3",
    roles: ["GENERAL", "GUIDE"],
    isActive: true,
  },
  {
    googleId: "106959373406842225543",
    username: "user4",
    roles: ["GENERAL", "ADMIN", "SUPER_ADMIN"],
    isActive: true,
  },
];

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
