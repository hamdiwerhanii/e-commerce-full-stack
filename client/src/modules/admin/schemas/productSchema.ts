import { z } from "zod";
import { BRAND_OPTIONS, CATEGORY_OPTIONS } from "@/shared/constants/catalog";
import type { Brand, Category } from "@/types";

const categoryIds = CATEGORY_OPTIONS.map((option) => option.id) as [Category, ...Category[]];
const brandIds = BRAND_OPTIONS.map((option) => option.id) as [Brand, ...Brand[]];

const money = z
  .number("Enter a number")
  .min(0, "Must be 0 or more")
  .max(100000, "Must be 100,000 or less");

export const productSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(2, "Use at least 2 characters")
      .max(120, "Use at most 120 characters"),
    description: z
      .string()
      .trim()
      .min(10, "Use at least 10 characters")
      .max(2000, "Use at most 2000 characters"),
    category: z.enum(categoryIds, "Choose a category"),
    brand: z.enum(brandIds, "Choose a brand"),
    image: z.url({ protocol: /^https?$/, error: "Upload an image or paste an image URL" }),
    price: money.refine((value) => value > 0, "Price must be greater than 0"),
    salePrice: money,
    totalStock: z.number("Enter a number").int("Use a whole number").min(0, "Must be 0 or more"),
  })
  .refine((data) => !data.salePrice || data.salePrice < data.price, {
    message: "Sale price must be lower than the price",
    path: ["salePrice"],
  });
