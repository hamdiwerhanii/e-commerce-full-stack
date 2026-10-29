import { getAddress } from "../addresses/addresses.service.js";
import { clearCart, getCart } from "../cart/cart.service.js";
import {
  AppError,
  badRequestError,
  conflictError,
  notFoundError,
} from "../common/errors/app-error.js";
import { env, isPaypalConfigured } from "../config/env.js";
import { capturePaypalOrder, createPaypalOrder } from "../payments/paypal.service.js";
import { ProductModel } from "../products/schema/product.schema.js";
import type { CaptureOrderDto, CreateOrderDto } from "./dto/order.dto.js";
import { OrderStatus, PaymentMethod, PaymentStatus } from "./enums/order.enums.js";
import { OrderModel } from "./schema/order.schema.js";
import type { OrderDocument, OrderItem } from "./types/order.types.js";

const toCents = (amount: number) => Math.round(amount * 100);

export const availablePaymentMethods = () => ({
  paypal: isPaypalConfigured(),
  demo: env.ENABLE_DEMO_PAYMENTS,
});

function assertMethodAvailable(method: PaymentMethod) {
  const available = availablePaymentMethods();
  if (method === PaymentMethod.Paypal && !available.paypal) {
    throw badRequestError("PayPal payments are not configured on this server");
  }
  if (method === PaymentMethod.Demo && !available.demo) {
    throw badRequestError("Demo payments are turned off on this server");
  }
}

async function restoreStock(items: OrderItem[]) {
  await Promise.all(
    items.map((item) =>
      ProductModel.updateOne({ _id: item.productId }, { $inc: { totalStock: item.quantity } }),
    ),
  );
}

async function reserveStock(items: OrderItem[]) {
  const reserved: OrderItem[] = [];
  for (const item of items) {
    const result = await ProductModel.updateOne(
      { _id: item.productId, totalStock: { $gte: item.quantity } },
      { $inc: { totalStock: -item.quantity } },
    );
    if (result.modifiedCount === 0) {
      await restoreStock(reserved);
      throw conflictError(`Sorry, ${item.title} no longer has enough stock`);
    }
    reserved.push(item);
  }
}

async function markPaid(order: OrderDocument, paymentId: string) {
  order.set({
    paymentStatus: PaymentStatus.Paid,
    orderStatus: OrderStatus.Confirmed,
    paymentId,
    paidAt: new Date(),
  });
  await order.save();
  await clearCart(String(order.userId));
  return order;
}

export async function createOrder(userId: string, { addressId, paymentMethod }: CreateOrderDto) {
  assertMethodAvailable(paymentMethod);

  const cart = await getCart(userId);
  if (cart.items.length === 0) throw badRequestError("Your cart is empty");

  const outOfStock = cart.items.find((line) => line.totalStock < line.quantity);
  if (outOfStock) throw conflictError(`Sorry, ${outOfStock.title} no longer has enough stock`);

  const address = await getAddress(userId, addressId);
  const items = cart.items.map((line) => ({
    productId: line.productId,
    title: line.title,
    image: line.image,
    price: line.finalPrice,
    quantity: line.quantity,
  }));
  const totalCents = items.reduce((sum, item) => sum + toCents(item.price) * item.quantity, 0);

  const order = await OrderModel.create({
    userId,
    items,
    address: {
      address: address.address,
      city: address.city,
      pincode: address.pincode,
      phone: address.phone,
      notes: address.notes,
    },
    paymentMethod,
    totalAmount: totalCents / 100,
  });

  if (paymentMethod === PaymentMethod.Demo) {
    try {
      await reserveStock(order.items);
    } catch (error) {
      order.paymentStatus = PaymentStatus.Failed;
      await order.save();
      throw error;
    }
    return { order: await markPaid(order, `DEMO-${order.id}`), approvalUrl: null };
  }

  try {
    const paypalOrder = await createPaypalOrder({
      referenceId: order.id,
      items: order.items.map((item) => ({
        name: item.title,
        sku: String(item.productId),
        unitAmountCents: toCents(item.price),
        quantity: item.quantity,
      })),
      returnUrl: `${env.CLIENT_URL}/shop/paypal-return?orderId=${order.id}`,
      cancelUrl: `${env.CLIENT_URL}/shop/checkout?cancelled=1`,
    });
    order.paypalOrderId = paypalOrder.id;
    await order.save();
    return { order, approvalUrl: paypalOrder.approvalUrl };
  } catch (error) {
    order.paymentStatus = PaymentStatus.Failed;
    await order.save();
    throw error;
  }
}

export async function capturePayment(
  userId: string,
  orderId: string,
  { paypalOrderId }: CaptureOrderDto,
) {
  const order = await OrderModel.findOneAndUpdate(
    {
      _id: orderId,
      userId,
      paymentMethod: PaymentMethod.Paypal,
      paypalOrderId,
      paymentStatus: PaymentStatus.Pending,
    },
    { $set: { paymentStatus: PaymentStatus.Processing } },
    { returnDocument: "after" },
  );

  if (!order) {
    const existing = await OrderModel.findOne({ _id: orderId, userId });
    if (!existing) throw notFoundError("Order");
    if (existing.paymentStatus === PaymentStatus.Paid) return existing;
    if (existing.paymentStatus === PaymentStatus.Processing) {
      throw conflictError("This payment is already being processed");
    }
    throw badRequestError("This order cannot be paid with PayPal");
  }

  const failPayment = async () => {
    order.paymentStatus = PaymentStatus.Pending;
    await order.save();
  };

  try {
    await reserveStock(order.items);
  } catch (error) {
    order.paymentStatus = PaymentStatus.Failed;
    await order.save();
    throw error;
  }

  let capture;
  try {
    capture = await capturePaypalOrder(paypalOrderId);
  } catch (error) {
    await restoreStock(order.items);
    await failPayment();
    throw error;
  }

  const paidInFull =
    capture.status === "COMPLETED" &&
    capture.captureId !== null &&
    capture.amountCents === toCents(order.totalAmount) &&
    capture.currency === "USD";

  if (!paidInFull) {
    await restoreStock(order.items);
    order.paymentStatus = PaymentStatus.Failed;
    await order.save();
    throw new AppError(402, "PayPal did not complete the payment");
  }

  return markPaid(order, capture.captureId!);
}

export const listMyOrders = (userId: string) =>
  OrderModel.find({ userId, paymentStatus: { $ne: PaymentStatus.Failed } }).sort({ createdAt: -1 });

export async function getMyOrder(userId: string, orderId: string) {
  const order = await OrderModel.findOne({ _id: orderId, userId });
  if (!order) throw notFoundError("Order");
  return order;
}

export const listAllOrders = () =>
  OrderModel.find({ paymentStatus: { $ne: PaymentStatus.Failed } })
    .sort({ createdAt: -1 })
    .populate("userId", "userName email");

export async function getOrder(orderId: string) {
  const order = await OrderModel.findById(orderId).populate("userId", "userName email");
  if (!order) throw notFoundError("Order");
  return order;
}

export async function updateOrderStatus(orderId: string, orderStatus: OrderStatus) {
  const order = await OrderModel.findById(orderId);
  if (!order) throw notFoundError("Order");
  if (order.paymentStatus !== PaymentStatus.Paid) {
    throw badRequestError("Only paid orders can change status");
  }
  order.orderStatus = orderStatus;
  return order.save();
}
