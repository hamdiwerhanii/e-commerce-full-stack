import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const API_TAGS = [
  "Me",
  "Config",
  "Products",
  "Cart",
  "Addresses",
  "Orders",
  "AdminOrders",
  "Reviews",
  "Features",
] as const;

export const apiClient = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: new URL("/api", window.location.origin).toString(),
    credentials: "include",
  }),
  tagTypes: API_TAGS,
  endpoints: () => ({}),
});
