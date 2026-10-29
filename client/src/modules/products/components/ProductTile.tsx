import { ShoppingCartIcon } from "lucide-react";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { Card, CardContent, CardFooter } from "@/shared/components/Card";
import { PriceTag } from "@/shared/components/PriceTag";
import { StarRating } from "@/shared/components/StarRating";
import { BRAND_LABELS, CATEGORY_LABELS } from "@/shared/constants/catalog";
import { LOW_STOCK_THRESHOLD } from "@/shared/constants/site";
import type { Product } from "@/types";
import { discountPercent } from "../utils/products.utils";

type ProductTileProps = {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  headingLevel?: "h2" | "h3";
};

function StockBadge({ product }: { product: Product }) {
  if (product.totalStock === 0) return <Badge variant="destructive">Out of stock</Badge>;
  if (product.totalStock < LOW_STOCK_THRESHOLD) {
    return <Badge variant="destructive">Only {product.totalStock} left</Badge>;
  }
  const discount = discountPercent(product);
  return discount > 0 ? <Badge>-{discount}%</Badge> : null;
}

export function ProductTile({
  product,
  onSelect,
  onAddToCart,
  headingLevel: Heading = "h3",
}: ProductTileProps) {
  const outOfStock = product.totalStock === 0;

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <button
        type="button"
        onClick={() => onSelect(product)}
        className="group relative block text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        aria-label={`View details for ${product.title}`}
      >
        <img
          src={product.image}
          alt=""
          loading="lazy"
          className="aspect-[4/5] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span className="absolute top-3 left-3">
          <StockBadge product={product} />
        </span>
      </button>
      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <Heading className="line-clamp-1 text-base font-semibold">{product.title}</Heading>
        <p className="flex justify-between text-sm text-muted-foreground">
          <span>{CATEGORY_LABELS[product.category]}</span>
          <span>{BRAND_LABELS[product.brand]}</span>
        </p>
        <StarRating value={product.averageReview} count={product.reviewCount} />
        <PriceTag price={product.price} finalPrice={product.finalPrice} className="mt-auto" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          disabled={outOfStock}
          onClick={() => onAddToCart(product)}
          aria-label={
            outOfStock ? `${product.title} is out of stock` : `Add ${product.title} to cart`
          }
        >
          <ShoppingCartIcon aria-hidden />
          {outOfStock ? "Out of stock" : "Add to cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
