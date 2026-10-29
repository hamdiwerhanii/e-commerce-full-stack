import { z } from "zod";
import { BRANDS, CATEGORIES, MAX_SEARCH_LENGTH, SORT_OPTIONS } from "../consts/catalog.consts.js";

const money = z.coerce
  .number("Enter a number")
  .min(0, "Must be 0 or more")
  .max(100000, "Must be 100,000 or less")
  .transform((value) => Math.round(value * 100) / 100);

const productFields = {
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
  category: z.enum(CATEGORIES, "Choose a category"),
  brand: z.enum(BRANDS, "Choose a brand"),
  image: z.url({ protocol: /^https?$/, error: "Upload an image or paste an image URL" }),
  price: money.refine((value) => value > 0, "Price must be greater than 0"),
  salePrice: money.default(0),
  totalStock: z.coerce
    .number("Enter a number")
    .int("Use a whole number")
    .min(0, "Must be 0 or more")
    .max(100000, "Must be 100,000 or less"),
};

const salePriceBelowPrice = (data: { price?: number; salePrice?: number }) =>
  !data.salePrice || data.price === undefined || data.salePrice < data.price;

const salePriceIssue = {
  message: "Sale price must be lower than the price",
  path: ["salePrice"],
};

export const createProductDto = z.object(productFields).refine(salePriceBelowPrice, salePriceIssue);

export const updateProductDto = z
  .object(productFields)
  .partial()
  .refine((data) => Object.keys(data).length > 0, "Send at least one field to update");

const csvList = <T extends readonly [string, ...string[]]>(values: T) =>
  z
    .string()
    .optional()
    .transform((raw) =>
      (raw ?? "")
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter((item): item is T[number] => (values as readonly string[]).includes(item)),
    );

export const listProductsQueryDto = z.object({
  category: csvList(CATEGORIES),
  brand: csvList(BRANDS),
  sortBy: z.enum(SORT_OPTIONS).catch("price-lowtohigh"),
  search: z.string().trim().max(MAX_SEARCH_LENGTH).optional().catch(undefined),
});

export { salePriceBelowPrice, salePriceIssue };

export type CreateProductDto = z.infer<typeof createProductDto>;
export type UpdateProductDto = z.infer<typeof updateProductDto>;
export type ListProductsQueryDto = z.infer<typeof listProductsQueryDto>;
