import { ArrowUpDownIcon } from "lucide-react";
import { useState } from "react";
import { useProductsQuery } from "@/api/products.api";
import { Button } from "@/shared/components/Button";
import { Label, Select } from "@/shared/components/Input";
import { SORT_OPTIONS } from "@/shared/constants/catalog";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import type { SortOption } from "@/types";
import { useListingParams } from "../hooks/useListingParams";
import { ProductDetailsDialog } from "./ProductDetailsDialog";
import { ProductFilter } from "./ProductFilter";
import { ProductGrid } from "./ProductGrid";

export function ListingRoot() {
  useDocumentTitle("All products");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { filters, sortBy, toggle, setSort, clear } = useListingParams();
  const { data: products, isFetching } = useProductsQuery({ ...filters, sortBy });
  const hasFilters = filters.category.length + filters.brand.length > 0;

  return (
    <div className="container mx-auto grid gap-6 px-4 py-8 md:grid-cols-[220px_1fr]">
      <ProductFilter filters={filters} onToggle={toggle} onClear={clear} />
      <section aria-labelledby="listing-title" className="rounded-xl border bg-background">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
          <h1 id="listing-title" className="text-lg font-extrabold">
            All products
          </h1>
          <div className="flex items-center gap-3">
            <span aria-live="polite" className="text-sm text-muted-foreground">
              {products ? `${products.length} product${products.length === 1 ? "" : "s"}` : ""}
            </span>
            <Label htmlFor="sort" className="flex items-center gap-1 text-muted-foreground">
              <ArrowUpDownIcon aria-hidden className="size-4" />
              <span className="sr-only">Sort by</span>
            </Label>
            <Select
              id="sort"
              value={sortBy}
              onChange={(event) => setSort(event.target.value as SortOption)}
              className="w-48"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="p-4">
          <ProductGrid
            products={products}
            isLoading={isFetching && !products}
            onSelect={(product) => setSelectedId(product.id)}
            headingLevel="h2"
            emptyAction={
              hasFilters ? (
                <Button variant="outline" onClick={clear}>
                  Clear filters
                </Button>
              ) : undefined
            }
          />
        </div>
      </section>
      <ProductDetailsDialog productId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
