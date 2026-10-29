import { CircleAlertIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useCapturePaymentMutation } from "@/api/orders.api";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import { PageLoader } from "@/shared/components/Skeleton";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { getErrorMessage } from "@/shared/utils/error.utils";

export function PaypalReturnRoot() {
  useDocumentTitle("Confirming payment");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [capturePayment] = useCapturePaymentMutation();
  const [error, setError] = useState<string | null>(null);
  const startedRef = useRef(false);

  const orderId = searchParams.get("orderId");
  const paypalOrderId = searchParams.get("token");
  const missingParams = !orderId || !paypalOrderId;

  useEffect(() => {
    if (missingParams || startedRef.current) return;
    startedRef.current = true;
    capturePayment({ orderId, paypalOrderId })
      .unwrap()
      .then((order) => navigate(`/shop/payment-success?orderId=${order.id}`, { replace: true }))
      .catch((captureError: unknown) => setError(getErrorMessage(captureError)));
  }, [capturePayment, missingParams, navigate, orderId, paypalOrderId]);

  if (missingParams || error) {
    return (
      <EmptyState
        icon={CircleAlertIcon}
        titleAs="h1"
        title="We could not confirm your payment"
        description={
          error ?? "The PayPal link is incomplete. Please go back to checkout and try again."
        }
        action={
          <Button asChild>
            <Link to="/shop/checkout">Back to checkout</Link>
          </Button>
        }
        className="min-h-[60vh] justify-center"
      />
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-2">
      <h1 className="text-2xl font-bold">Processing your payment...</h1>
      <p className="text-muted-foreground">Please don&apos;t close this page.</p>
      <PageLoader label="Processing payment" />
    </div>
  );
}
