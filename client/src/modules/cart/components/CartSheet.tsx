import { ShoppingCartIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/shared/components/Button";
import { EmptyState } from "@/shared/components/EmptyState";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/shared/components/Sheet";
import { formatPrice } from "@/shared/utils/format.utils";
import { useCart } from "../hooks/useCart";
import { CartLineItem } from "./CartLineItem";

export function CartSheet() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { cart, isUpdating, setQuantity, remove } = useCart();
  const count = cart.totalQuantity;

  const goToCheckout = () => {
    setOpen(false);
    navigate("/shop/checkout");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative"
          aria-label={`Cart, ${count} items`}
        >
          <ShoppingCartIcon />
          {count > 0 && (
            <span
              aria-hidden
              className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground"
            >
              {count}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetTitle>Your cart</SheetTitle>
        <SheetDescription>
          {count > 0
            ? `${count} item${count > 1 ? "s" : ""} ready for checkout.`
            : "Your cart is empty."}
        </SheetDescription>
        {cart.items.length === 0 ? (
          <EmptyState
            icon={ShoppingCartIcon}
            title="Nothing here yet"
            description="Browse the shop and add something you like."
            titleAs="h3"
          />
        ) : (
          <>
            <ul className="divide-y">
              {cart.items.map((line) => (
                <CartLineItem
                  key={line.productId}
                  line={line}
                  disabled={isUpdating}
                  onQuantityChange={setQuantity}
                  onRemove={remove}
                />
              ))}
            </ul>
            <div className="mt-auto space-y-4 border-t pt-4">
              <p className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(cart.subtotal)}</span>
              </p>
              <Button className="w-full" onClick={goToCheckout}>
                Checkout
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
