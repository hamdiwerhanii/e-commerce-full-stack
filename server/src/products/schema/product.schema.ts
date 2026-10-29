import { Schema, model } from "mongoose";
import { toJSONOptions } from "../../common/utils/json.utils.js";
import { BRANDS, CATEGORIES } from "../consts/catalog.consts.js";
import type { Product } from "../types/product.types.js";

const productSchema = new Schema<Product>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, enum: CATEGORIES, required: true, index: true },
    brand: { type: String, enum: BRANDS, required: true, index: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, default: 0, min: 0 },
    finalPrice: { type: Number, required: true, min: 0, index: true },
    totalStock: { type: Number, required: true, min: 0 },
    averageReview: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, toJSON: toJSONOptions(["updatedAt"]) },
);

export const ProductModel = model<Product>("Product", productSchema);
