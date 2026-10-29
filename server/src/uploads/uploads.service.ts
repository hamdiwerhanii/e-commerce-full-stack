import { v2 as cloudinary } from "cloudinary";
import { AppError } from "../common/errors/app-error.js";
import { env, isCloudinaryConfigured } from "../config/env.js";
import { CLOUDINARY_FOLDER } from "./consts/upload.consts.js";

export async function uploadImage(file: Express.Multer.File) {
  if (!isCloudinaryConfigured()) {
    throw new AppError(503, "Image uploads are not configured, paste an image URL instead");
  }

  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  const dataUri = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  try {
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: CLOUDINARY_FOLDER,
      resource_type: "image",
    });
    return { url: result.secure_url };
  } catch (error) {
    console.error(error);
    throw new AppError(502, "The image could not be uploaded, please try again");
  }
}
