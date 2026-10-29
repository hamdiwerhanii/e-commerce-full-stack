import { SearchXIcon } from "lucide-react";
import type { ReactNode } from "react";
import { useCart } from "@/modules/cart/hooks/useCart";
import { EmptyState } from "@/shared/components/EmptyState";
import { Skeleton } from "@/shared/components/Skeleton";
import type { Product } from "@/types";
import { ProductTile } from "./ProductTile";

type ProductGridProps = {
  products: Product[] | undefined;
  isLoading: boolean;
  onSelect: (product: Product) => void;
  emptyTitle?: string;
  emptyAction?: ReactNode;
  headingLevel?: "h2" | "h3";
  skeletons?: number;
};

export function ProductGrid({
  products,
  isLoading,
  onSelect,
  emptyTitle = "No products found",
  emptyAction,
  headingLevel,
  skeletons = 8,
}: ProductGridProps) {
  const { add } = useCart();

  if (isLoading) {
    return (
      <div
        role="status"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        <span className="sr-only">Loading products</span>
        {Array.from({ length: skeletons }, (_, index) => (
          <Skeleton key={index} className="aspect-[4/6] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <EmptyState
        icon={SearchXIcon}
        title={emptyTitle}
        description="Try another search or remove some filters."
        action={emptyAction}
      />
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <li key={product.id} className="flex">
          <div className="w-full">
            <ProductTile
              product={product}
              onSelect={onSelect}
              onAddToCart={(item) => add(item.id, item.title)}
              headingLevel={headingLevel}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
