import {
  BRAND_OPTIONS,
  CATEGORY_OPTIONS,
  DEFAULT_SORT,
  SORT_OPTIONS,
} from "@/shared/constants/catalog";
import type { Brand, Category, Product, ProductFilters, SortOption } from "@/types";

const CATEGORY_IDS = new Set<string>(CATEGORY_OPTIONS.map((option) => option.id));
const BRAND_IDS = new Set<string>(BRAND_OPTIONS.map((option) => option.id));
const SORT_IDS = new Set<string>(SORT_OPTIONS.map((option) => option.id));

const readList = (params: URLSearchParams, key: string, allowed: Set<string>) =>
  (params.get(key) ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter((value, index, all) => allowed.has(value) && all.indexOf(value) === index);

export function parseFilters(params: URLSearchParams): ProductFilters {
  return {
    category: readList(params, "category", CATEGORY_IDS) as Category[],
    brand: readList(params, "brand", BRAND_IDS) as Brand[],
  };
}

export function parseSort(params: URLSearchParams): SortOption {
  const sort = params.get("sortBy");
  return sort && SORT_IDS.has(sort) ? (sort as SortOption) : DEFAULT_SORT;
}

export function toggleValue<T extends string>(values: T[], value: T): T[] {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

export function writeListParam(params: URLSearchParams, key: string, values: string[]) {
  const next = new URLSearchParams(params);
  if (values.length) next.set(key, values.join(","));
  else next.delete(key);
  return next;
}

export const isOnSale = (product: Pick<Product, "price" | "finalPrice">) =>
  product.finalPrice < product.price;

export const discountPercent = (product: Pick<Product, "price" | "finalPrice">) =>
  isOnSale(product) ? Math.round((1 - product.finalPrice / product.price) * 100) : 0;
