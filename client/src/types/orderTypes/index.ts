import type { AddressInput } from "../addressTypes";

export type OrderStatus =
  "pending" | "confirmed" | "inProcess" | "inShipping" | "delivered" | "rejected";

export type PaymentStatus = "pending" | "processing" | "paid" | "failed";

export type PaymentMethod = "paypal" | "demo";

export type OrderItem = {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

export type OrderCustomer = {
  id: string;
  userName: string;
  email: string;
};

export type Order = {
  id: string;
  userId: string | OrderCustomer;
  items: OrderItem[];
  address: AddressInput;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  totalAmount: number;
  paymentId?: string;
  paidAt?: string;
  createdAt: string;
};

export type CreateOrderInput = {
  addressId: string;
  paymentMethod: PaymentMethod;
};

export type CreateOrderResponse = {
  order: Order;
  approvalUrl: string | null;
};

export type CaptureOrderInput = {
  orderId: string;
  paypalOrderId: string;
};

export type OrdersResponse = { orders: Order[] };
export type OrderResponse = { order: Order };
