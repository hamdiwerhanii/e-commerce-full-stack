import type { Brand, Category, Option, SortOption } from "@/types";

export const CATEGORY_OPTIONS: Option<Category>[] = [
  { id: "men", label: "Men" },
  { id: "women", label: "Women" },
  { id: "kids", label: "Kids" },
  { id: "accessories", label: "Accessories" },
  { id: "footwear", label: "Footwear" },
];

export const BRAND_OPTIONS: Option<Brand>[] = [
  { id: "nike", label: "Nike" },
  { id: "adidas", label: "Adidas" },
  { id: "puma", label: "Puma" },
  { id: "levi", label: "Levi's" },
  { id: "zara", label: "Zara" },
  { id: "h&m", label: "H&M" },
];

export const SORT_OPTIONS: Option<SortOption>[] = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const DEFAULT_SORT: SortOption = "price-lowtohigh";

export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORY_OPTIONS.map(({ id, label }) => [id, label]),
) as Record<Category, string>;

export const BRAND_LABELS = Object.fromEntries(
  BRAND_OPTIONS.map(({ id, label }) => [id, label]),
) as Record<Brand, string>;
