import { useState } from "react";
import { Link } from "react-router";
import { useFeaturesQuery } from "@/api/features.api";
import { useProductsQuery } from "@/api/products.api";
import { Card, CardContent } from "@/shared/components/Card";
import { BRAND_OPTIONS, CATEGORY_OPTIONS } from "@/shared/constants/catalog";
import { FALLBACK_BANNERS } from "@/shared/constants/site";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { CATEGORY_ICONS, FEATURED_COUNT } from "../consts/home.consts";
import { BannerSlider } from "./BannerSlider";
import { ProductDetailsDialog } from "./ProductDetailsDialog";
import { ProductGrid } from "./ProductGrid";

export function HomeRoot() {
  useDocumentTitle();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { data: features } = useFeaturesQuery();
  const { data: products, isLoading } = useProductsQuery({});
  const banners = features?.length ? features.map((feature) => feature.image) : FALLBACK_BANNERS;

  return (
    <div className="flex flex-col">
      <h1 className="sr-only">Ecommerce fashion store</h1>
      <BannerSlider images={banners} />

      <section aria-labelledby="categories-title" className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <h2 id="categories-title" className="mb-8 text-center text-3xl font-bold">
            Shop by category
          </h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {CATEGORY_OPTIONS.map(({ id, label }) => {
              const Icon = CATEGORY_ICONS[id];
              return (
                <li key={id}>
                  <Link
                    to={`/shop/listing?category=${id}`}
                    className="block rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                  >
                    <Card className="transition-shadow hover:shadow-lg">
                      <CardContent className="flex flex-col items-center justify-center gap-3 p-6">
                        <Icon aria-hidden className="size-12 text-primary" />
                        <span className="font-bold">{label}</span>
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section aria-labelledby="brands-title" className="py-12">
        <div className="container mx-auto px-4">
          <h2 id="brands-title" className="mb-8 text-center text-3xl font-bold">
            Shop by brand
          </h2>
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {BRAND_OPTIONS.map(({ id, label }) => (
              <li key={id}>
                <Link
                  to={`/shop/listing?brand=${encodeURIComponent(id)}`}
                  className="block rounded-xl focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <Card className="transition-shadow hover:shadow-lg">
                    <CardContent className="flex h-24 items-center justify-center p-6">
                      <span className="text-xl font-extrabold tracking-tight">{label}</span>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-labelledby="featured-title" className="bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <h2 id="featured-title" className="mb-8 text-center text-3xl font-bold">
            Featured products
          </h2>
          <ProductGrid
            products={products?.slice(0, FEATURED_COUNT)}
            isLoading={isLoading}
            onSelect={(product) => setSelectedId(product.id)}
          />
        </div>
      </section>

      <ProductDetailsDialog productId={selectedId} onClose={() => setSelectedId(null)} />
    </div>
  );
}
