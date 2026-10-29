import { Schema, model } from "mongoose";
import { MAX_QUANTITY_PER_ITEM } from "../consts/cart.consts.js";
import type { Cart } from "../types/cart.types.js";

const cartSchema = new Schema<Cart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
      {
        _id: false,
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1, max: MAX_QUANTITY_PER_ITEM },
      },
    ],
  },
  { timestamps: true },
);

export const CartModel = model<Cart>("Cart", cartSchema);
