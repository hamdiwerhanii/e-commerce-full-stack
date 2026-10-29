import { ShoppingCartIcon } from "lucide-react";
import { useProductQuery } from "@/api/products.api";
import { useCart } from "@/modules/cart/hooks/useCart";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/shared/components/Dialog";
import { PriceTag } from "@/shared/components/PriceTag";
import { PageLoader } from "@/shared/components/Skeleton";
import { StarRating } from "@/shared/components/StarRating";
import { BRAND_LABELS, CATEGORY_LABELS } from "@/shared/constants/catalog";
import { LOW_STOCK_THRESHOLD } from "@/shared/constants/site";
import { ProductReviews } from "./ProductReviews";

type ProductDetailsDialogProps = {
  productId: string | null;
  onClose: () => void;
};

export function ProductDetailsDialog({ productId, onClose }: ProductDetailsDialogProps) {
  const { data: product, isLoading } = useProductQuery(productId ?? "", { skip: !productId });
  const { add, isUpdating } = useCart();

  return (
    <Dialog open={Boolean(productId)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl sm:p-8">
        {isLoading || !product ? (
          <>
            <DialogTitle className="sr-only">Loading product</DialogTitle>
            <DialogDescription className="sr-only">Please wait</DialogDescription>
            <PageLoader label="Loading product" />
          </>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            <img
              src={product.image}
              alt={product.title}
              className="aspect-square w-full rounded-lg object-cover"
            />
            <div className="flex flex-col gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  {CATEGORY_LABELS[product.category]} · {BRAND_LABELS[product.brand]}
                </p>
                <DialogTitle className="text-3xl font-extrabold">{product.title}</DialogTitle>
                <DialogDescription className="text-base">{product.description}</DialogDescription>
              </div>
              <PriceTag
                price={product.price}
                finalPrice={product.finalPrice}
                className="[&>span:first-child]:text-2xl"
              />
              <StarRating value={product.averageReview} count={product.reviewCount} />
              {product.totalStock > 0 && product.totalStock < LOW_STOCK_THRESHOLD && (
                <Badge variant="destructive" className="self-start">
                  Only {product.totalStock} left
                </Badge>
              )}
              <Button
                size="lg"
                disabled={product.totalStock === 0 || isUpdating}
                onClick={() => add(product.id, product.title)}
              >
                <ShoppingCartIcon aria-hidden />
                {product.totalStock === 0 ? "Out of stock" : "Add to cart"}
              </Button>
              <ProductReviews productId={product.id} />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
