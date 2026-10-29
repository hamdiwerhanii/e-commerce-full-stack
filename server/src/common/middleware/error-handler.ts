import type { ErrorRequestHandler, RequestHandler } from "express";
import multer from "multer";
import { isProduction } from "../../config/env.js";
import { AppError } from "../errors/app-error.js";

const DUPLICATE_KEY_CODE = 11000;

type KnownError = {
  code?: number;
  keyValue?: Record<string, unknown>;
  type?: string;
  name?: string;
  message?: string;
};

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(404, `Route ${req.method} ${req.originalUrl} not found`));
};

export const errorHandler: ErrorRequestHandler = (err: unknown, _req, res, _next) => {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { message: err.message, details: err.details } });
    return;
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === "LIMIT_FILE_SIZE" ? "The image must be 2 MB or smaller" : err.message;
    res.status(400).json({ error: { message } });
    return;
  }

  const known = (err ?? {}) as KnownError;

  if (known.code === DUPLICATE_KEY_CODE) {
    const field = Object.keys(known.keyValue ?? {})[0] ?? "value";
    const message = `That ${field} is already taken`;
    res.status(409).json({ error: { message, details: { [field]: [message] } } });
    return;
  }

  if (known.name === "CastError") {
    res.status(400).json({ error: { message: "Invalid identifier" } });
    return;
  }

  if (known.type === "entity.parse.failed") {
    res.status(400).json({ error: { message: "Request body must be valid JSON" } });
    return;
  }

  if (known.type === "entity.too.large") {
    res.status(413).json({ error: { message: "Request body is too large" } });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: { message: isProduction ? "Something went wrong" : String(known.message ?? err) },
  });
};
