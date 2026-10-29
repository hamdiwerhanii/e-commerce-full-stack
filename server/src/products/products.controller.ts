import type { Request, Response } from "express";
import { parseInput, parseObjectId } from "../common/utils/validation.utils.js";
import { createProductDto, listProductsQueryDto, updateProductDto } from "./dto/product.dto.js";
import * as productsService from "./products.service.js";

export async function list(req: Request, res: Response) {
  const products = await productsService.listProducts(parseInput(listProductsQueryDto, req.query));
  res.json({ products });
}

export async function getById(req: Request, res: Response) {
  const product = await productsService.getProduct(parseObjectId(req.params.id, "product id"));
  res.json({ product });
}

export async function create(req: Request, res: Response) {
  const product = await productsService.createProduct(parseInput(createProductDto, req.body));
  res.status(201).json({ product });
}

export async function update(req: Request, res: Response) {
  const product = await productsService.updateProduct(
    parseObjectId(req.params.id, "product id"),
    parseInput(updateProductDto, req.body),
  );
  res.json({ product });
}

export async function remove(req: Request, res: Response) {
  await productsService.deleteProduct(parseObjectId(req.params.id, "product id"));
  res.status(204).end();
}
