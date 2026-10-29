import type { HydratedDocument, Types } from "mongoose";
import type { AddressFields } from "../../addresses/types/address.types.js";
import type { OrderStatus, PaymentMethod, PaymentStatus } from "../enums/order.enums.js";

export type OrderItem = {
  productId: Types.ObjectId;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

export type Order = {
  userId: Types.ObjectId;
  items: OrderItem[];
  address: AddressFields;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  totalAmount: number;
  paypalOrderId?: string;
  paymentId?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type OrderDocument = HydratedDocument<Order>;
