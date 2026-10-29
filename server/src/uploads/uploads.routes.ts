import { Router, type Request, type Response } from "express";
import multer from "multer";
import { badRequestError } from "../common/errors/app-error.js";
import { requireAdmin } from "../common/middleware/require-auth.js";
import { ALLOWED_IMAGE_TYPES, MAX_IMAGE_BYTES, UPLOAD_FIELD } from "./consts/upload.consts.js";
import { uploadImage } from "./uploads.service.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
  fileFilter: (_req, file, callback) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) callback(null, true);
    else callback(badRequestError("Upload a JPG, PNG, WEBP or AVIF image"));
  },
});

async function create(req: Request, res: Response) {
  if (!req.file) throw badRequestError("Choose an image to upload");
  res.status(201).json(await uploadImage(req.file));
}

export const uploadsRouter = Router();

uploadsRouter.post("/images", requireAdmin, upload.single(UPLOAD_FIELD), create);
