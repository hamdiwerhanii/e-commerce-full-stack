import { PackagePlusIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteProductMutation, useProductsQuery } from "@/api/products.api";
import { Badge } from "@/shared/components/Badge";
import { Button } from "@/shared/components/Button";
import { Card, CardContent, CardFooter } from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";
import { PriceTag } from "@/shared/components/PriceTag";
import { Skeleton } from "@/shared/components/Skeleton";
import { BRAND_LABELS, CATEGORY_LABELS } from "@/shared/constants/catalog";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { getErrorMessage } from "@/shared/utils/error.utils";
import type { Product } from "@/types";
import { ProductFormSheet } from "./ProductFormSheet";

export function AdminProductsRoot() {
  useDocumentTitle("Manage products");
  const { data: products, isLoading } = useProductsQuery({ sortBy: "title-atoz" });
  const [deleteProduct] = useDeleteProductMutation();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const openForm = (product: Product | null) => {
    setEditing(product);
    setFormOpen(true);
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`Delete "${product.title}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(product.id).unwrap();
      toast.success("Product deleted");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => openForm(null)}>
          <PackagePlusIcon aria-hidden />
          Add new product
        </Button>
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-80 w-full rounded-xl" />
          ))}
        </div>
      ) : !products?.length ? (
        <EmptyState
          icon={PackagePlusIcon}
          title="No products yet"
          description="Add your first product to the store."
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <li key={product.id}>
              <Card className="flex h-full flex-col overflow-hidden">
                <img
                  src={product.image}
                  alt=""
                  className="h-48 w-full object-cover"
                  loading="lazy"
                />
                <CardContent className="flex flex-1 flex-col gap-2 p-4">
                  <h2 className="line-clamp-1 font-semibold">{product.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    {CATEGORY_LABELS[product.category]} · {BRAND_LABELS[product.brand]}
                  </p>
                  <PriceTag price={product.price} finalPrice={product.finalPrice} />
                  <Badge
                    variant={product.totalStock === 0 ? "destructive" : "secondary"}
                    className="self-start"
                  >
                    {product.totalStock} in stock
                  </Badge>
                </CardContent>
                <CardFooter className="justify-between gap-2 p-4 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openForm(product)}
                    aria-label={`Edit ${product.title}`}
                  >
                    <PencilIcon aria-hidden />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(product)}
                    aria-label={`Delete ${product.title}`}
                  >
                    <Trash2Icon aria-hidden />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </li>
          ))}
        </ul>
      )}
      <ProductFormSheet open={formOpen} product={editing} onClose={() => setFormOpen(false)} />
    </div>
  );
}
