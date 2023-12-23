import multer from "multer";
import path from "path";
import { Upload } from "@aws-sdk/lib-storage";
import { S3Client } from "@aws-sdk/client-s3";
import sharp from "sharp";
import fs from "fs";
import mongoose from "mongoose";

import { MAX_IMAGE_SIZE } from "../config/general";

const s3 = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

const storage = multer.diskStorage({
  destination: "/tmp/uploads",
  filename: function (req, file, cb) {
    cb(
      null,
      `${Date.now().toString()}_${new mongoose.Types.ObjectId()}.${
        file.mimetype.split("/")[1]
      }`
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return callback(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
    callback(null, true);
  },
  limits: { fileSize: MAX_IMAGE_SIZE },
});

const resizeAndUploadToS3 = async (image: Express.MulterS3.File) => {
  try {
    const resizedImage = await sharp(image.path)
      .withMetadata()
      .rotate()
      .webp()
      .toBuffer()
      .catch((err) => {
        throw new Error(err.message);
      });

    fs.rmSync(image.path, { force: true });

    const response = await new Upload({
      client: s3,
      params: {
        Bucket: "merodera-dev",
        Key:
          "phishit/" +
          `${Date.now().toString()}_${new mongoose.Types.ObjectId()}.${"webp"}`,
        Body: resizedImage,
        ContentType: "image/webp",
        ACL: "public-read",
      },
    }).done();

    return response;
  } catch (error) {
    throw error;
  }
};

export { upload, resizeAndUploadToS3 };
