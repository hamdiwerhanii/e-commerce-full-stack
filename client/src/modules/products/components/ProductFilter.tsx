import { Button } from "@/shared/components/Button";
import { Checkbox } from "@/shared/components/Checkbox";
import { BRAND_OPTIONS, CATEGORY_OPTIONS } from "@/shared/constants/catalog";
import type { Brand, Category, Option, ProductFilters } from "@/types";

type ProductFilterProps = {
  filters: ProductFilters;
  onToggle: (key: "category" | "brand", value: Category | Brand) => void;
  onClear: () => void;
};

type GroupProps<T extends Category | Brand> = {
  name: "category" | "brand";
  title: string;
  options: Option<T>[];
  selected: T[];
  onToggle: ProductFilterProps["onToggle"];
};

function FilterGroup<T extends Category | Brand>({
  name,
  title,
  options,
  selected,
  onToggle,
}: GroupProps<T>) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-base font-bold">{title}</legend>
      {options.map((option) => {
        const id = `${name}-${option.id.replace(/[^a-z0-9]/gi, "")}`;
        return (
          <div key={option.id} className="flex items-center gap-2">
            <Checkbox
              id={id}
              checked={selected.includes(option.id)}
              onCheckedChange={() => onToggle(name, option.id)}
            />
            <label htmlFor={id} className="text-sm font-medium">
              {option.label}
            </label>
          </div>
        );
      })}
    </fieldset>
  );
}

export function ProductFilter({ filters, onToggle, onClear }: ProductFilterProps) {
  const active = filters.category.length + filters.brand.length;

  return (
    <aside aria-label="Filters" className="rounded-xl border bg-background">
      <div className="flex items-center justify-between border-b p-4">
        <h2 className="text-lg font-extrabold">Filters</h2>
        {active > 0 && (
          <Button variant="link" size="sm" onClick={onClear} className="h-auto p-0">
            Clear ({active})
          </Button>
        )}
      </div>
      <div className="space-y-6 p-4">
        <FilterGroup
          name="category"
          title="Category"
          options={CATEGORY_OPTIONS}
          selected={filters.category}
          onToggle={onToggle}
        />
        <FilterGroup
          name="brand"
          title="Brand"
          options={BRAND_OPTIONS}
          selected={filters.brand}
          onToggle={onToggle}
        />
      </div>
    </aside>
  );
}
