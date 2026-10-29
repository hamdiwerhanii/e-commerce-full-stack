import type { QueryFilter, SortOrder } from "mongoose";
import { badRequestError, notFoundError } from "../common/errors/app-error.js";
import { escapeRegex } from "../common/utils/text.utils.js";
import type { SortOption } from "./consts/catalog.consts.js";
import {
  salePriceBelowPrice,
  salePriceIssue,
  type CreateProductDto,
  type ListProductsQueryDto,
  type UpdateProductDto,
} from "./dto/product.dto.js";
import { ProductModel } from "./schema/product.schema.js";
import type { Product } from "./types/product.types.js";

const SORTS: Record<SortOption, Record<string, SortOrder>> = {
  "price-lowtohigh": { finalPrice: 1, _id: 1 },
  "price-hightolow": { finalPrice: -1, _id: 1 },
  "title-atoz": { title: 1, _id: 1 },
  "title-ztoa": { title: -1, _id: 1 },
};

const finalPriceOf = (price: number, salePrice: number) =>
  salePrice > 0 && salePrice < price ? salePrice : price;

export function listProducts({ category, brand, sortBy, search }: ListProductsQueryDto) {
  const filter: QueryFilter<Product> = {};
  if (category.length) filter.category = { $in: category };
  if (brand.length) filter.brand = { $in: brand };
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    filter.$or = [
      { title: pattern },
      { description: pattern },
      { category: pattern },
      { brand: pattern },
    ];
  }
  return ProductModel.find(filter).sort(SORTS[sortBy]);
}

export async function getProduct(id: string) {
  const product = await ProductModel.findById(id);
  if (!product) throw notFoundError("Product");
  return product;
}

export function createProduct(data: CreateProductDto) {
  return ProductModel.create({ ...data, finalPrice: finalPriceOf(data.price, data.salePrice) });
}

export async function updateProduct(id: string, changes: UpdateProductDto) {
  const product = await getProduct(id);
  const next = { price: product.price, salePrice: product.salePrice, ...changes };
  if (!salePriceBelowPrice(next)) {
    throw badRequestError(salePriceIssue.message, { salePrice: [salePriceIssue.message] });
  }

  product.set({ ...changes, finalPrice: finalPriceOf(next.price, next.salePrice) });
  return product.save();
}

export async function deleteProduct(id: string) {
  const product = await ProductModel.findByIdAndDelete(id);
  if (!product) throw notFoundError("Product");
}
