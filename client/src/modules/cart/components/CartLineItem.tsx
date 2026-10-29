import { Trash2Icon } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { QuantityStepper } from "@/shared/components/QuantityStepper";
import { MAX_QUANTITY_PER_ITEM } from "@/shared/constants/site";
import { formatPrice } from "@/shared/utils/format.utils";
import type { CartLine } from "@/types";

type CartLineItemProps = {
  line: CartLine;
  disabled?: boolean;
  onQuantityChange?: (productId: string, quantity: number) => void;
  onRemove?: (productId: string, title: string) => void;
};

export function CartLineItem({ line, disabled, onQuantityChange, onRemove }: CartLineItemProps) {
  const max = Math.min(line.totalStock, MAX_QUANTITY_PER_ITEM);
  const editable = Boolean(onQuantityChange && onRemove);

  return (
    <li className="flex gap-4 py-4">
      <img
        src={line.image}
        alt=""
        className="size-20 shrink-0 rounded-md object-cover"
        loading="lazy"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate font-semibold">{line.title}</h3>
          <p className="font-semibold">{formatPrice(line.lineTotal)}</p>
        </div>
        <p className="text-sm text-muted-foreground">
          {formatPrice(line.finalPrice)} each{!editable && ` · Qty ${line.quantity}`}
        </p>
        {editable && (
          <div className="flex items-center justify-between">
            <QuantityStepper
              value={line.quantity}
              max={max}
              label={line.title}
              disabled={disabled}
              onChange={(quantity) => onQuantityChange?.(line.productId, quantity)}
            />
            <Button
              variant="ghost"
              size="icon"
              disabled={disabled}
              onClick={() => onRemove?.(line.productId, line.title)}
              aria-label={`Remove ${line.title}`}
            >
              <Trash2Icon />
            </Button>
          </div>
        )}
      </div>
    </li>
  );
}
