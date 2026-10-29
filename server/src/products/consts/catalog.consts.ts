export const CATEGORIES = ["men", "women", "kids", "accessories", "footwear"] as const;

export const BRANDS = ["nike", "adidas", "puma", "levi", "zara", "h&m"] as const;

export const SORT_OPTIONS = [
  "price-lowtohigh",
  "price-hightolow",
  "title-atoz",
  "title-ztoa",
] as const;

export const MAX_SEARCH_LENGTH = 100;

export type Category = (typeof CATEGORIES)[number];
export type Brand = (typeof BRANDS)[number];
export type SortOption = (typeof SORT_OPTIONS)[number];
