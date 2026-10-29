import { PackageIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAdminOrdersQuery, useUpdateOrderStatusMutation } from "@/api/orders.api";
import { OrderStatusBadge } from "@/modules/account/components/OrderStatusBadge";
import { OrderSummary } from "@/modules/account/components/OrderSummary";
import { Button } from "@/shared/components/Button";
import { Card, CardContent } from "@/shared/components/Card";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/components/Dialog";
import { EmptyState } from "@/shared/components/EmptyState";
import { Label, Select } from "@/shared/components/Input";
import { Skeleton } from "@/shared/components/Skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/Table";
import { ADMIN_STATUS_OPTIONS, ORDER_STATUS_LABELS } from "@/shared/constants/orders";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { getErrorMessage } from "@/shared/utils/error.utils";
import { formatDate, formatPrice, shortId } from "@/shared/utils/format.utils";
import type { OrderStatus } from "@/types";

export function AdminOrdersRoot() {
  useDocumentTitle("Manage orders");
  const { data: orders, isLoading } = useAdminOrdersQuery();
  const [updateStatus, { isLoading: isSaving }] = useUpdateOrderStatusMutation();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [status, setStatus] = useState<OrderStatus | "">("");
  const selected = orders?.find((order) => order.id === selectedId) ?? null;

  const open = (id: string) => {
    setSelectedId(id);
    setStatus("");
  };

  const save = async () => {
    if (!selected || !status) return;
    try {
      await updateStatus({ id: selected.id, orderStatus: status }).unwrap();
      toast.success(`Order marked as ${ORDER_STATUS_LABELS[status].toLowerCase()}`);
      setStatus("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Orders</h1>
      <Card>
        <CardContent className="p-6">
          {isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : !orders?.length ? (
            <EmptyState
              icon={PackageIcon}
              title="No orders yet"
              description="Paid orders from customers appear here."
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
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
                    <TableCell>
                      {typeof order.userId === "object" ? order.userId.userName : "-"}
                    </TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.orderStatus} />
                    </TableCell>
                    <TableCell>{formatPrice(order.totalAmount)}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="outline" onClick={() => open(order.id)}>
                        View details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <Dialog open={Boolean(selected)} onOpenChange={(next) => !next && setSelectedId(null)}>
        <DialogContent className="max-w-xl">
          <DialogTitle>Order details</DialogTitle>
          <DialogDescription className="sr-only">
            Review the order and update its status
          </DialogDescription>
          {selected && (
            <>
              <OrderSummary order={selected} />
              {selected.paymentStatus === "paid" ? (
                <div className="flex flex-wrap items-end gap-3 border-t pt-4">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="order-status">Update status</Label>
                    <Select
                      id="order-status"
                      value={status}
                      onChange={(event) => setStatus(event.target.value as OrderStatus)}
                    >
                      <option value="" disabled>
                        Choose a status
                      </option>
                      {ADMIN_STATUS_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {ORDER_STATUS_LABELS[option]}
                        </option>
                      ))}
                    </Select>
                  </div>
                  <Button onClick={save} disabled={!status || isSaving}>
                    {isSaving ? "Saving..." : "Update order status"}
                  </Button>
                </div>
              ) : (
                <p className="border-t pt-4 text-sm text-muted-foreground">
                  This order is not paid yet, so its status cannot change.
                </p>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
