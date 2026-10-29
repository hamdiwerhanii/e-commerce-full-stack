import { z } from "zod";
import { objectId } from "../../common/utils/validation.utils.js";
import { OrderStatus, PaymentMethod } from "../enums/order.enums.js";

export const createOrderDto = z.object({
  addressId: objectId("address"),
  paymentMethod: z.enum(Object.values(PaymentMethod), "Choose a payment method"),
});

export const captureOrderDto = z.object({
  paypalOrderId: z
    .string()
    .trim()
    .regex(/^[A-Z0-9-]{5,40}$/, "Invalid PayPal order"),
});

export const updateOrderStatusDto = z.object({
  orderStatus: z.enum(
    Object.values(OrderStatus).filter((status) => status !== OrderStatus.Pending),
    "Choose a valid status",
  ),
});

export type CreateOrderDto = z.infer<typeof createOrderDto>;
export type CaptureOrderDto = z.infer<typeof captureOrderDto>;
export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusDto>;
