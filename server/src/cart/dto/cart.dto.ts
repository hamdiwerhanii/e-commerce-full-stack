import { z } from "zod";
import { objectId } from "../../common/utils/validation.utils.js";
import { MAX_QUANTITY_PER_ITEM } from "../consts/cart.consts.js";

const quantity = z.coerce
  .number("Enter a quantity")
  .int("Use a whole number")
  .min(1, "Quantity must be at least 1")
  .max(MAX_QUANTITY_PER_ITEM, `You can buy at most ${MAX_QUANTITY_PER_ITEM} of each item`);

export const addCartItemDto = z.object({
  productId: objectId("product id"),
  quantity: quantity.default(1),
});

export const updateCartItemDto = z.object({ quantity });

export type AddCartItemDto = z.infer<typeof addCartItemDto>;
export type UpdateCartItemDto = z.infer<typeof updateCartItemDto>;
