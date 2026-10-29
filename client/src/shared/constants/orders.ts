import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/types";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  inProcess: "In process",
  inShipping: "Shipped",
  delivered: "Delivered",
  rejected: "Rejected",
};

export const ADMIN_STATUS_OPTIONS: OrderStatus[] = [
  "confirmed",
  "inProcess",
  "inShipping",
  "delivered",
  "rejected",
];

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Awaiting payment",
  processing: "Processing",
  paid: "Paid",
  failed: "Failed",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  paypal: "PayPal",
  demo: "Demo payment",
};
