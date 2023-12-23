import express from "express";
const router = express.Router();

import { isAuthorized } from "../middlewares/permissions";
import { upload, resizeAndUploadToS3 } from "../utils/s3";
import { CustomError } from "../interfaces/common";
import { errorMessages } from "../config/messages";

router.post(
  "/",
  isAuthorized,
  upload.single("images"),
  async (req, res, next) => {
    try {
      const image = req.file as Express.MulterS3.File;

      const s3UploadResponse = await resizeAndUploadToS3(image);

      if ("Location" in s3UploadResponse) {
        return res.status(200).json({
          url: s3UploadResponse.Location,
        });
      } else {
        throw new Error(
          `Upload aborted with error ${s3UploadResponse.$metadata.httpStatusCode}`
        );
      }
    } catch (error: any) {
      if (error.code == "LIMIT_FILE_SIZE") {
        throw new CustomError(errorMessages.FILE_SIZE_TOO_LARGE, 413);
      }

      next(error);
    }
  }
);

export default router;
