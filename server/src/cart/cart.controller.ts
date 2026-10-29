import type { Request, Response } from "express";
import { parseInput, parseObjectId } from "../common/utils/validation.utils.js";
import * as cartService from "./cart.service.js";
import { addCartItemDto, updateCartItemDto } from "./dto/cart.dto.js";

const userIdOf = (req: Request) => req.user!.id as string;

export async function get(req: Request, res: Response) {
  res.json({ cart: await cartService.getCart(userIdOf(req)) });
}

export async function addItem(req: Request, res: Response) {
  const cart = await cartService.addItem(userIdOf(req), parseInput(addCartItemDto, req.body));
  res.status(201).json({ cart });
}

export async function updateItem(req: Request, res: Response) {
  const { quantity } = parseInput(updateCartItemDto, req.body);
  const productId = parseObjectId(req.params.productId, "product id");
  res.json({ cart: await cartService.setQuantity(userIdOf(req), productId, quantity) });
}

export async function removeItem(req: Request, res: Response) {
  const productId = parseObjectId(req.params.productId, "product id");
  res.json({ cart: await cartService.removeItem(userIdOf(req), productId) });
}
