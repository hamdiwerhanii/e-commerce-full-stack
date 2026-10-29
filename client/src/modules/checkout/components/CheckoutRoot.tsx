import { ShoppingCartIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";
import accountImage from "@/assets/images/account.jpg";
import { useAppConfigQuery } from "@/api/config.api";
import { useCreateOrderMutation } from "@/api/orders.api";
import { AddressBook } from "@/modules/account/components/AddressBook";
import { CartLineItem } from "@/modules/cart/components/CartLineItem";
import { useCart } from "@/modules/cart/hooks/useCart";
import { Button } from "@/shared/components/Button";
import { Card, CardContent } from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";
import { PageLoader } from "@/shared/components/Skeleton";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { getErrorMessage } from "@/shared/utils/error.utils";
import { formatPrice } from "@/shared/utils/format.utils";
import type { PaymentMethod } from "@/types";
import { PaymentMethodPicker } from "./PaymentMethodPicker";

export function CheckoutRoot() {
  useDocumentTitle("Checkout");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cart, isLoading } = useCart();
  const { data: config } = useAppConfigQuery();
  const [createOrder, { isLoading: isPlacing }] = useCreateOrderMutation();
  const [addressId, setAddressId] = useState<string | null>(null);
  const [chosenMethod, setChosenMethod] = useState<PaymentMethod | null>(null);

  const methods: PaymentMethod[] = config
    ? (["paypal", "demo"] as const).filter((method) => config.payments[method])
    : [];
  const method =
    chosenMethod && methods.includes(chosenMethod) ? chosenMethod : (methods[0] ?? null);

  const placeOrder = async () => {
    if (!addressId) {
      toast.error("Choose a delivery address first");
      return;
    }
    if (!method) return;
    try {
      const { order, approvalUrl } = await createOrder({
        addressId,
        paymentMethod: method,
      }).unwrap();
      if (approvalUrl) {
        toast.info("Redirecting you to PayPal...");
        window.location.assign(approvalUrl);
        return;
      }
      navigate(`/shop/payment-success?orderId=${order.id}`, { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  if (isLoading) return <PageLoader label="Loading your cart" />;

  return (
    <div className="flex flex-col">
      <div className="relative h-[220px] w-full overflow-hidden sm:h-[300px]">
        <img src={accountImage} alt="" className="h-full w-full object-cover object-center" />
      </div>
      <div className="container mx-auto space-y-6 px-4 py-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        {searchParams.get("cancelled") && (
          <p
            role="status"
            className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"
          >
            The PayPal payment was cancelled. Your cart is still here, you can try again.
          </p>
        )}
        {cart.items.length === 0 ? (
          <EmptyState
            icon={ShoppingCartIcon}
            title="Your cart is empty"
            description="Add some products before checking out."
            action={
              <Button asChild>
                <Link to="/shop/listing">Browse products</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <section aria-labelledby="address-title" className="space-y-3">
              <h2 id="address-title" className="text-xl font-semibold">
                Delivery address
              </h2>
              <AddressBook
                selectedId={addressId}
                onSelect={(address) => setAddressId(address?.id ?? null)}
              />
            </section>
            <section aria-labelledby="summary-title">
              <Card className="lg:sticky lg:top-24">
                <CardContent className="space-y-6 p-6">
                  <h2 id="summary-title" className="text-xl font-semibold">
                    Order summary
                  </h2>
                  <ul className="divide-y">
                    {cart.items.map((line) => (
                      <CartLineItem key={line.productId} line={line} />
                    ))}
                  </ul>
                  <p className="flex justify-between border-t pt-4 text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(cart.subtotal)}</span>
                  </p>
                  {methods.length ? (
                    <PaymentMethodPicker
                      methods={methods}
                      value={method}
                      onChange={setChosenMethod}
                    />
                  ) : (
                    <p className="text-sm text-destructive">
                      No payment method is available on this server.
                    </p>
                  )}
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={isPlacing || !method}
                    onClick={placeOrder}
                  >
                    {isPlacing
                      ? "Placing order..."
                      : method === "paypal"
                        ? "Pay with PayPal"
                        : "Place demo order"}
                  </Button>
                  {!addressId && (
                    <p className="text-center text-sm text-muted-foreground">
                      Choose a delivery address to continue.
                    </p>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
