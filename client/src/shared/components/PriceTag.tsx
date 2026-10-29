import { cn } from "@/lib/utils";
import { formatPrice } from "@/shared/utils/format.utils";

type PriceTagProps = {
  price: number;
  finalPrice: number;
  className?: string;
};

export function PriceTag({ price, finalPrice, className }: PriceTagProps) {
  const onSale = finalPrice < price;
  return (
    <p className={cn("flex items-baseline gap-2", className)}>
      <span className="text-lg font-bold">{formatPrice(finalPrice)}</span>
      {onSale && (
        <span className="text-sm text-muted-foreground line-through">
          <span className="sr-only">Was </span>
          {formatPrice(price)}
        </span>
      )}
    </p>
  );
}
