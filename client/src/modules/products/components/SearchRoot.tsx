import { SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { useProductsQuery } from "@/api/products.api";
import { EmptyState } from "@/shared/components/EmptyState";
import { Input } from "@/shared/components/Input";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { SEARCH_DEBOUNCE_MS, SEARCH_MIN_LENGTH } from "../consts/search.consts";
import { ProductDetailsDialog } from "./ProductDetailsDialog";
import { ProductGrid } from "./ProductGrid";

export function SearchRoot() {
  useDocumentTitle("Search");
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";
  const [draft, setDraft] = useState(keyword);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const ready = keyword.trim().length >= SEARCH_MIN_LENGTH;
  const { data: products, isFetching } = useProductsQuery(
    { search: keyword.trim() },
    { skip: !ready },
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const value = draft.trim();
      setSearchParams(value ? { keyword: value } : {}, { replace: true });
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [draft, setSearchParams]);

  return (
    <div className="container mx-auto space-y-8 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-3 text-center">
        <h1 className="text-3xl font-bold">Search products</h1>
        <label htmlFor="search" className="sr-only">
          Search products
        </label>
        <div className="relative">
          <SearchIcon
            aria-hidden
            className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="search"
            type="search"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Search by name, brand or category..."
            className="h-12 pl-10 text-base"
            autoFocus
          />
        </div>
      </div>
      {ready ? (
        <ProductGrid
          products={products}
          isLoading={isFetching}
          onSelect={(product) => setSelectedId(product.id)}
          emptyTitle={`No results for "${keyword}"`}
          headingLevel="h2"
        />
      ) : (
        <EmptyState
          icon={SearchIcon}
          title="Start typing to search"
          description={`Enter at least ${SEARCH_MIN_LENGTH} characters, for example "jeans" or "nike".`}
        />
      )}
      <ProductDetailsDialog productId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
