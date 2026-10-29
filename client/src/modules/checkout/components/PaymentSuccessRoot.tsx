import { CircleCheckBigIcon } from "lucide-react";
import { Link, useSearchParams } from "react-router";
import { useMyOrderQuery } from "@/api/orders.api";
import { OrderSummary } from "@/modules/account/components/OrderSummary";
import { Button } from "@/shared/components/Button";
import { Card, CardContent } from "@/shared/components/Card";
import { PageLoader } from "@/shared/components/Skeleton";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export function PaymentSuccessRoot() {
  useDocumentTitle("Order confirmed");
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { data: order, isLoading } = useMyOrderQuery(orderId ?? "", { skip: !orderId });

  return (
    <div className="container mx-auto max-w-2xl space-y-6 px-4 py-12">
      <div className="space-y-3 text-center">
        <CircleCheckBigIcon aria-hidden className="mx-auto size-14 text-success" />
        <h1 className="text-3xl font-bold">Payment successful!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. We&apos;ll get it ready for shipping.
        </p>
      </div>
      {isLoading ? (
        <PageLoader label="Loading your order" />
      ) : (
        order && (
          <Card>
            <CardContent className="p-6">
              <OrderSummary order={order} />
            </CardContent>
          </Card>
        )
      )}
      <div className="flex justify-center gap-3">
        <Button asChild>
          <Link to="/shop/account">View my orders</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/shop/listing">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}
