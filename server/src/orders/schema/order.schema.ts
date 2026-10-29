import { Schema, model } from "mongoose";
import { toJSONOptions } from "../../common/utils/json.utils.js";
import { OrderStatus, PaymentMethod, PaymentStatus } from "../enums/order.enums.js";
import type { Order } from "../types/order.types.js";

const orderSchema = new Schema<Order>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    items: [
      {
        _id: false,
        productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        title: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    address: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true },
      notes: { type: String, default: "" },
    },
    paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.Pending,
    },
    orderStatus: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.Pending },
    totalAmount: { type: Number, required: true, min: 0 },
    paypalOrderId: { type: String, index: true, sparse: true },
    paymentId: String,
    paidAt: Date,
  },
  { timestamps: true, toJSON: toJSONOptions(["paypalOrderId"]) },
);

export const OrderModel = model<Order>("Order", orderSchema);
