import { PackageIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { useMyOrdersQuery } from "@/api/orders.api";
import { Button } from "@/shared/components/Button";
import { Card, CardContent } from "@/shared/components/Card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/components/Dialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { Skeleton } from "@/shared/components/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/Table";
import { formatDate, formatPrice, shortId } from "@/shared/utils/format.utils";
import type { Order } from "@/types";
import { OrderStatusBadge } from "./OrderStatusBadge";
import { OrderSummary } from "./OrderSummary";

export function OrderHistory() {
  const { data: orders, isLoading } = useMyOrdersQuery();
  const [selected, setSelected] = useState<Order | null>(null);

  return (
    <Card>
      <CardContent className="p-6">
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : !orders?.length ? (
          <EmptyState
            icon={PackageIcon}
            title="No orders yet"
            description="When you place an order it will show up here."
            titleAs="h3"
            action={
              <Button asChild>
                <Link to="/shop/listing">Start shopping</Link>
              </Button>
            }
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono">#{shortId(order.id)}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.orderStatus} />
                  </TableCell>
                  <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="outline" onClick={() => setSelected(order)}>
                      View details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Dialog open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)}>
          <DialogContent className="max-w-xl">
            <DialogTitle>Order details</DialogTitle>
            <DialogDescription className="sr-only">
              Items, payment and shipping for this order
            </DialogDescription>
            {selected && <OrderSummary order={selected} />}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
