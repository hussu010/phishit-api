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
    roles: ["GENERAL"],
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
    roles: ["GENERAL"],
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
    const user = new User(users[i]);
    usersArray.push(user);
  }

  const newUsers = await User.insertMany(usersArray);
  return newUsers;
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
