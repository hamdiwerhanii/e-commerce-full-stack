import { ImageIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAdminOrdersQuery } from "@/api/orders.api";
import { useProductsQuery } from "@/api/products.api";
import {
  useAddFeatureMutation,
  useDeleteFeatureMutation,
  useFeaturesQuery,
} from "@/api/features.api";
import { Button } from "@/shared/components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";
import { FormField } from "@/shared/components/FormField";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { getErrorMessage } from "@/shared/utils/error.utils";
import { formatPrice } from "@/shared/utils/format.utils";
import { ImageInput } from "./ImageInput";

export function DashboardRoot() {
  useDocumentTitle("Admin dashboard");
  const { data: products } = useProductsQuery({});
  const { data: orders } = useAdminOrdersQuery();
  const { data: features } = useFeaturesQuery();
  const [addFeature, { isLoading: isAdding }] = useAddFeatureMutation();
  const [deleteFeature] = useDeleteFeatureMutation();
  const [image, setImage] = useState("");

  const revenue = (orders ?? [])
    .filter((order) => order.paymentStatus === "paid" && order.orderStatus !== "rejected")
    .reduce((sum, order) => sum + order.totalAmount, 0);

  const stats = [
    { label: "Products", value: String(products?.length ?? "-") },
    { label: "Orders", value: String(orders?.length ?? "-") },
    { label: "Revenue", value: orders ? formatPrice(revenue) : "-" },
    {
      label: "Out of stock",
      value: String(products?.filter((product) => product.totalStock === 0).length ?? "-"),
    },
  ];

  const add = async () => {
    try {
      await addFeature(image).unwrap();
      setImage("");
      toast.success("Banner added to the home page");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteFeature(id).unwrap();
      toast.success("Banner removed");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <dt className="text-sm text-muted-foreground">{stat.label}</dt>
              <dd className="text-3xl font-bold">{stat.value}</dd>
            </CardContent>
          </Card>
        ))}
      </dl>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className="text-lg">Home page banners</span>
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            These images rotate in the slider on the shop home page.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid max-w-xl gap-3">
            <FormField id="banner-image" label="New banner image">
              <ImageInput id="banner-image" value={image} onChange={setImage} />
            </FormField>
            <Button onClick={add} disabled={!image || isAdding} className="justify-self-start">
              {isAdding ? "Adding..." : "Add banner"}
            </Button>
          </div>
          {!features?.length ? (
            <EmptyState
              icon={ImageIcon}
              title="No banners"
              description="The shop shows the default banners."
              titleAs="h3"
            />
          ) : (
            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {features.map((feature, index) => (
                <li key={feature.id} className="relative overflow-hidden rounded-lg border">
                  <img
                    src={feature.image}
                    alt={`Banner ${index + 1}`}
                    className="h-40 w-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => remove(feature.id)}
                    aria-label={`Delete banner ${index + 1}`}
                  >
                    <Trash2Icon aria-hidden />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
