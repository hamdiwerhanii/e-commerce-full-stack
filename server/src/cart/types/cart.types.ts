import type { Types } from "mongoose";

export type CartItem = {
  productId: Types.ObjectId;
  quantity: number;
};

export type Cart = {
  userId: Types.ObjectId;
  items: CartItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type CartLine = {
  productId: string;
  title: string;
  image: string;
  price: number;
  salePrice: number;
  finalPrice: number;
  totalStock: number;
  quantity: number;
  lineTotal: number;
};

export type CartView = {
  items: CartLine[];
  totalQuantity: number;
  subtotal: number;
};
