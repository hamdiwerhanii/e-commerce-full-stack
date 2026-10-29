import type { AddToCartInput, Cart, CartResponse } from "@/types";
import { apiClient } from "./api.client";

const toCart = (response: CartResponse) => response.cart;

export const cartApi = apiClient.injectEndpoints({
  endpoints: (build) => ({
    cart: build.query<Cart, void>({
      query: () => "/cart",
      transformResponse: toCart,
      providesTags: ["Cart"],
    }),
    addToCart: build.mutation<Cart, AddToCartInput>({
      query: (body) => ({ url: "/cart/items", method: "POST", body }),
      transformResponse: toCart,
      invalidatesTags: ["Cart"],
    }),
    updateCartItem: build.mutation<Cart, AddToCartInput>({
      query: ({ productId, quantity }) => ({
        url: `/cart/items/${productId}`,
        method: "PATCH",
        body: { quantity },
      }),
      transformResponse: toCart,
      invalidatesTags: ["Cart"],
    }),
    removeCartItem: build.mutation<Cart, string>({
      query: (productId) => ({ url: `/cart/items/${productId}`, method: "DELETE" }),
      transformResponse: toCart,
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useCartQuery,
  useAddToCartMutation,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} = cartApi;
