import { z } from "zod";

export const addressDto = z.object({
  address: z
    .string()
    .trim()
    .min(5, "Use at least 5 characters")
    .max(200, "Use at most 200 characters"),
  city: z.string().trim().min(2, "Use at least 2 characters").max(80, "Use at most 80 characters"),
  pincode: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9 -]{3,12}$/, "Enter a valid postal code"),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[0-9 ()-]{6,20}$/, "Enter a valid phone number"),
  notes: z.string().trim().max(300, "Use at most 300 characters").default(""),
});

export type AddressDto = z.infer<typeof addressDto>;
