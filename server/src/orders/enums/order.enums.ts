export const OrderStatus = {
  Pending: "pending",
  Confirmed: "confirmed",
  InProcess: "inProcess",
  InShipping: "inShipping",
  Delivered: "delivered",
  Rejected: "rejected",
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export const PaymentStatus = {
  Pending: "pending",
  Processing: "processing",
  Paid: "paid",
  Failed: "failed",
} as const;

export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const PaymentMethod = {
  Paypal: "paypal",
  Demo: "demo",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
