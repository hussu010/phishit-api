import mongoose from "mongoose";

const mongoUri =
  (process.env.MONGO_URI as string) || "mongodb://localhost:27017/phishit";

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log(error);
  });
