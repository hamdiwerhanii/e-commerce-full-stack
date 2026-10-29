import { isValidObjectId } from "mongoose";
import { z } from "zod";
import { badRequestError } from "../errors/app-error.js";

export function parseInput<T extends z.ZodType>(schema: T, data: unknown): z.output<T> {
  const result = schema.safeParse(data ?? {});
  if (!result.success) {
    const { fieldErrors } = z.flattenError(result.error);
    throw badRequestError("Please check the highlighted fields", fieldErrors);
  }
  return result.data;
}

export const objectId = (label = "id") =>
  z.string().refine((value) => isValidObjectId(value), `Invalid ${label}`);

export function parseObjectId(value: unknown, label = "id"): string {
  if (typeof value !== "string" || !isValidObjectId(value)) {
    throw badRequestError(`Invalid ${label}`);
  }
  return value;
}
