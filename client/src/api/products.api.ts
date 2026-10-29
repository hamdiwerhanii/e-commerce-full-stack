import type {
  Product,
  ProductInput,
  ProductListParams,
  ProductResponse,
  ProductsResponse,
} from "@/types";
import { apiClient } from "./api.client";

const toSearchParams = ({ category, brand, sortBy, search }: ProductListParams) => {
  const params = new URLSearchParams();
  if (category?.length) params.set("category", category.join(","));
  if (brand?.length) params.set("brand", brand.join(","));
  if (sortBy) params.set("sortBy", sortBy);
  if (search) params.set("search", search);
  return params.toString();
};

export const productsApi = apiClient.injectEndpoints({
  endpoints: (build) => ({
    products: build.query<Product[], ProductListParams>({
      query: (params) => `/products?${toSearchParams(params)}`,
      transformResponse: (response: ProductsResponse) => response.products,
      providesTags: ["Products"],
    }),
    product: build.query<Product, string>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: ProductResponse) => response.product,
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
    }),
    createProduct: build.mutation<Product, ProductInput>({
      query: (body) => ({ url: "/products", method: "POST", body }),
      transformResponse: (response: ProductResponse) => response.product,
      invalidatesTags: ["Products"],
    }),
    updateProduct: build.mutation<Product, { id: string; changes: Partial<ProductInput> }>({
      query: ({ id, changes }) => ({ url: `/products/${id}`, method: "PUT", body: changes }),
      transformResponse: (response: ProductResponse) => response.product,
      invalidatesTags: ["Products", "Cart"],
    }),
    deleteProduct: build.mutation<void, string>({
      query: (id) => ({ url: `/products/${id}`, method: "DELETE" }),
      invalidatesTags: ["Products", "Cart"],
    }),
  }),
});

export const {
  useProductsQuery,
  useProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
