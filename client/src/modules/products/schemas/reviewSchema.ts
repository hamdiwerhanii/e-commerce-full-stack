import { z } from "zod";

export const reviewSchema = z.object({
  reviewValue: z.number().int().min(1, "Choose a rating from 1 to 5").max(5),
  reviewMessage: z
    .string()
    .trim()
    .min(3, "Write at least 3 characters")
    .max(500, "Use at most 500 characters"),
});
