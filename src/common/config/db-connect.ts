import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI as string).catch((error) => {
  console.log(error);
});
