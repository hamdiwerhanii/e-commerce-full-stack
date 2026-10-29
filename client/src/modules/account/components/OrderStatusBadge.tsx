import { Badge } from "@/shared/components/Badge";
import { ORDER_STATUS_LABELS } from "@/shared/constants/orders";
import type { OrderStatus } from "@/types";

const VARIANTS: Record<
  OrderStatus,
  "default" | "secondary" | "destructive" | "success" | "outline"
> = {
  pending: "outline",
  confirmed: "default",
  inProcess: "secondary",
  inShipping: "secondary",
  delivered: "success",
  rejected: "destructive",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={VARIANTS[status]}>{ORDER_STATUS_LABELS[status]}</Badge>;
}
