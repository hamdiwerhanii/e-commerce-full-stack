import type { HydratedDocument } from "mongoose";
import type { Brand, Category } from "../consts/catalog.consts.js";

export type Product = {
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
  createdAt: Date;
  updatedAt: Date;
};

export type ProductDocument = HydratedDocument<Product>;
