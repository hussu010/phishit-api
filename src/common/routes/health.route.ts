import express from "express";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = {
      uptime: process.uptime(),
      message: "OK",
      date: new Date(),
    };

    await res.status(200).send(data);
  } catch (error) {
    next(error);
  }
});

export default router;
