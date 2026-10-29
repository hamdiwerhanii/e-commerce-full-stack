import { Types } from "mongoose";
import { conflictError, notFoundError } from "../common/errors/app-error.js";
import { roundMoney } from "../common/utils/text.utils.js";
import { ProductModel } from "../products/schema/product.schema.js";
import type { ProductDocument } from "../products/types/product.types.js";
import { MAX_QUANTITY_PER_ITEM } from "./consts/cart.consts.js";
import type { AddCartItemDto } from "./dto/cart.dto.js";
import { CartModel } from "./schema/cart.schema.js";
import type { CartLine, CartView } from "./types/cart.types.js";

const EMPTY_CART: CartView = { items: [], totalQuantity: 0, subtotal: 0 };

function assertAvailable(product: ProductDocument, quantity: number) {
  if (product.totalStock < quantity) {
    const left = product.totalStock;
    throw conflictError(
      left === 0
        ? `${product.title} is out of stock`
        : `Only ${left} of ${product.title} left in stock`,
    );
  }
}

export async function getCart(userId: string): Promise<CartView> {
  const cart = await CartModel.findOne({ userId });
  if (!cart || cart.items.length === 0) return EMPTY_CART;

  const products = await ProductModel.find({
    _id: { $in: cart.items.map((item) => item.productId) },
  });
  const byId = new Map(products.map((product) => [product.id as string, product]));

  const items: CartLine[] = [];
  for (const item of cart.items) {
    const product = byId.get(String(item.productId));
    if (!product) continue;
    items.push({
      productId: product.id,
      title: product.title,
      image: product.image,
      price: product.price,
      salePrice: product.salePrice,
      finalPrice: product.finalPrice,
      totalStock: product.totalStock,
      quantity: item.quantity,
      lineTotal: roundMoney(product.finalPrice * item.quantity),
    });
  }

  if (items.length !== cart.items.length) {
    const kept = new Set(items.map((item) => item.productId));
    cart.items = cart.items.filter((item) => kept.has(String(item.productId)));
    await cart.save();
  }

  return {
    items,
    totalQuantity: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: roundMoney(items.reduce((sum, item) => sum + item.lineTotal, 0)),
  };
}

async function findProduct(productId: string) {
  const product = await ProductModel.findById(productId);
  if (!product) throw notFoundError("Product");
  return product;
}

export async function addItem(userId: string, { productId, quantity }: AddCartItemDto) {
  const product = await findProduct(productId);
  const cart = (await CartModel.findOne({ userId })) ?? new CartModel({ userId, items: [] });

  const existing = cart.items.find((item) => String(item.productId) === productId);
  const nextQuantity = (existing?.quantity ?? 0) + quantity;

  if (nextQuantity > MAX_QUANTITY_PER_ITEM) {
    throw conflictError(`You can buy at most ${MAX_QUANTITY_PER_ITEM} of each item`);
  }
  assertAvailable(product, nextQuantity);

  if (existing) existing.quantity = nextQuantity;
  else cart.items.push({ productId: new Types.ObjectId(productId), quantity });

  await cart.save();
  return getCart(userId);
}

export async function setQuantity(userId: string, productId: string, quantity: number) {
  const cart = await CartModel.findOne({ userId });
  const item = cart?.items.find((entry) => String(entry.productId) === productId);
  if (!cart || !item) throw notFoundError("Cart item");

  assertAvailable(await findProduct(productId), quantity);
  item.quantity = quantity;
  await cart.save();
  return getCart(userId);
}

export async function removeItem(userId: string, productId: string) {
  await CartModel.updateOne(
    { userId },
    { $pull: { items: { productId: new Types.ObjectId(productId) } } },
  );
  return getCart(userId);
}

export async function clearCart(userId: string) {
  await CartModel.updateOne({ userId }, { $set: { items: [] } });
}
