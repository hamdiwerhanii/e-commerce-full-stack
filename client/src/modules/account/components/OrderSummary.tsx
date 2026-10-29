import { PAYMENT_METHOD_LABELS, PAYMENT_STATUS_LABELS } from "@/shared/constants/orders";
import { formatDate, formatPrice, shortId } from "@/shared/utils/format.utils";
import type { Order } from "@/types";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrderSummary({ order }: { order: Order }) {
  const customer = typeof order.userId === "object" ? order.userId : null;

  return (
    <div className="grid gap-6 text-sm">
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
        <dt className="font-medium">Order</dt>
        <dd className="text-right font-mono">#{shortId(order.id)}</dd>
        <dt className="font-medium">Date</dt>
        <dd className="text-right">{formatDate(order.createdAt)}</dd>
        <dt className="font-medium">Payment</dt>
        <dd className="text-right">
          {PAYMENT_METHOD_LABELS[order.paymentMethod]} ·{" "}
          {PAYMENT_STATUS_LABELS[order.paymentStatus]}
        </dd>
        <dt className="font-medium">Status</dt>
        <dd className="text-right">
          <OrderStatusBadge status={order.orderStatus} />
        </dd>
        {customer && (
          <>
            <dt className="font-medium">Customer</dt>
            <dd className="text-right">
              {customer.userName} ({customer.email})
            </dd>
          </>
        )}
      </dl>
      <div className="space-y-2 border-t pt-4">
        <h3 className="font-semibold">Items</h3>
        <ul className="space-y-2">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-3">
              <img src={item.image} alt="" className="size-10 rounded object-cover" />
              <span className="flex-1">
                {item.title} <span className="text-muted-foreground">× {item.quantity}</span>
              </span>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <p className="flex justify-between border-t pt-2 text-base font-bold">
          <span>Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </p>
      </div>
      <div className="space-y-1 border-t pt-4">
        <h3 className="font-semibold">Shipping to</h3>
        <address className="not-italic text-muted-foreground">
          {order.address.address}, {order.address.city} {order.address.pincode}
          <br />
          {order.address.phone}
          {order.address.notes && (
            <>
              <br />
              {order.address.notes}
            </>
          )}
        </address>
      </div>
    </div>
  );
}
