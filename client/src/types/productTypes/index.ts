export type Category = "men" | "women" | "kids" | "accessories" | "footwear";

export type Brand = "nike" | "adidas" | "puma" | "levi" | "zara" | "h&m";

export type SortOption = "price-lowtohigh" | "price-hightolow" | "title-atoz" | "title-ztoa";

export type Option<T extends string> = { id: T; label: string };

export type Product = {
  id: string;
  title: string;
  description: string;
  category: Category;
  brand: Brand;
  image: string;
  price: number;
  salePrice: number;
  finalPrice: number;
  totalStock: number;
  averageReview: number;
  reviewCount: number;
  createdAt: string;
};

export type ProductFilters = {
  category: Category[];
  brand: Brand[];
};

export type ProductListParams = Partial<ProductFilters> & {
  sortBy?: SortOption;
  search?: string;
};

export type ProductInput = {
  title: string;
  description: string;
  category: Category;
  brand: Brand;
  image: string;
  price: number;
  salePrice: number;
  totalStock: number;
};

export type ProductsResponse = { products: Product[] };
export type ProductResponse = { product: Product };
