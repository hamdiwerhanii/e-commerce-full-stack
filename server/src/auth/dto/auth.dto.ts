import { z } from "zod";

const email = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address"));

export const registerDto = z.object({
  userName: z
    .string()
    .trim()
    .regex(/^[a-zA-Z0-9_]{3,30}$/, "Use 3-30 letters, numbers or underscores"),
  email,
  password: z
    .string()
    .min(8, "Use at least 8 characters")
    .max(72, "Use at most 72 characters")
    .regex(/[a-zA-Z]/, "Include at least one letter")
    .regex(/\d/, "Include at least one number"),
});

export const loginDto = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
});

export type RegisterDto = z.infer<typeof registerDto>;
export type LoginDto = z.infer<typeof loginDto>;
