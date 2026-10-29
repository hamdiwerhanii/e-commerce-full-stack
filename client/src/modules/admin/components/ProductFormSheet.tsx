import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateProductMutation, useUpdateProductMutation } from "@/api/products.api";
import { useServerErrors } from "@/modules/auth/hooks/useServerErrors";
import { Button } from "@/shared/components/Button";
import { fieldAria, FormField } from "@/shared/components/FormField";
import { Input, Select, Textarea } from "@/shared/components/Input";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/components/Sheet";
import { BRAND_OPTIONS, CATEGORY_OPTIONS } from "@/shared/constants/catalog";
import type { Product, ProductInput } from "@/types";
import { productSchema } from "../schemas/productSchema";
import { ImageInput } from "./ImageInput";

const EMPTY: ProductInput = {
  title: "",
  description: "",
  category: "men",
  brand: "nike",
  image: "",
  price: 0,
  salePrice: 0,
  totalStock: 0,
};

const toInput = (product: Product): ProductInput => ({
  title: product.title,
  description: product.description,
  category: product.category,
  brand: product.brand,
  image: product.image,
  price: product.price,
  salePrice: product.salePrice,
  totalStock: product.totalStock,
});

type ProductFormSheetProps = {
  open: boolean;
  product: Product | null;
  onClose: () => void;
};

export function ProductFormSheet({ open, product, onClose }: ProductFormSheetProps) {
  const [createProduct, createState] = useCreateProductMutation();
  const [updateProduct, updateState] = useUpdateProductMutation();
  const saving = createState.isLoading || updateState.isLoading;
  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ProductInput>({ resolver: zodResolver(productSchema), defaultValues: EMPTY });
  const onServerError = useServerErrors(setError);

  useEffect(() => {
    if (open) reset(product ? toInput(product) : EMPTY);
  }, [open, product, reset]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      if (product) await updateProduct({ id: product.id, changes: values }).unwrap();
      else await createProduct(values).unwrap();
      toast.success(product ? "Product updated" : "Product added");
      onClose();
    } catch (error) {
      onServerError(error);
    }
  });

  const aria = (name: keyof ProductInput) => fieldAria(`product-${name}`, errors[name]?.message);

  return (
    <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
      <SheetContent className="sm:max-w-lg">
        <SheetTitle>{product ? "Edit product" : "Add new product"}</SheetTitle>
        <SheetDescription>
          Prices are in USD. Leave the sale price at 0 for no discount.
        </SheetDescription>
        <form onSubmit={onSubmit} noValidate className="grid gap-4">
          <FormField id="product-image" label="Image" error={errors.image?.message}>
            <Controller
              control={control}
              name="image"
              render={({ field }) => (
                <ImageInput
                  id="product-image"
                  value={field.value}
                  onChange={field.onChange}
                  invalid={Boolean(errors.image)}
                  describedBy={errors.image ? "product-image-error" : undefined}
                />
              )}
            />
          </FormField>
          <FormField id="product-title" label="Title" error={errors.title?.message}>
            <Input {...aria("title")} {...register("title")} />
          </FormField>
          <FormField
            id="product-description"
            label="Description"
            error={errors.description?.message}
          >
            <Textarea rows={3} {...aria("description")} {...register("description")} />
          </FormField>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="product-category" label="Category" error={errors.category?.message}>
              <Select {...aria("category")} {...register("category")}>
                {CATEGORY_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>
            <FormField id="product-brand" label="Brand" error={errors.brand?.message}>
              <Select {...aria("brand")} {...register("brand")}>
                {BRAND_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField id="product-price" label="Price" error={errors.price?.message}>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...aria("price")}
                {...register("price", { valueAsNumber: true })}
              />
            </FormField>
            <FormField id="product-salePrice" label="Sale price" error={errors.salePrice?.message}>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...aria("salePrice")}
                {...register("salePrice", { valueAsNumber: true })}
              />
            </FormField>
            <FormField id="product-totalStock" label="Stock" error={errors.totalStock?.message}>
              <Input
                type="number"
                step="1"
                min="0"
                {...aria("totalStock")}
                {...register("totalStock", { valueAsNumber: true })}
              />
            </FormField>
          </div>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : product ? "Save changes" : "Add product"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  );
}
