import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";
import type { Brand, Category, SortOption } from "@/types";
import { parseFilters, parseSort, toggleValue, writeListParam } from "../utils/products.utils";

export function useListingParams() {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const sortBy = useMemo(() => parseSort(searchParams), [searchParams]);

  const toggle = useCallback(
    (key: "category" | "brand", value: Category | Brand) => {
      setSearchParams((current) => {
        const currentFilters = parseFilters(current);
        const values = toggleValue<string>(currentFilters[key], value);
        return writeListParam(current, key, values);
      });
    },
    [setSearchParams],
  );

  const setSort = useCallback(
    (value: SortOption) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current);
        next.set("sortBy", value);
        return next;
      });
    },
    [setSearchParams],
  );

  const clear = useCallback(() => setSearchParams(new URLSearchParams()), [setSearchParams]);

  return { filters, sortBy, toggle, setSort, clear };
}
