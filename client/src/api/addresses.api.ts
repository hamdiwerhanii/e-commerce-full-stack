import type { Address, AddressesResponse, AddressInput, AddressResponse } from "@/types";
import { apiClient } from "./api.client";

const toAddress = (response: AddressResponse) => response.address;

export const addressesApi = apiClient.injectEndpoints({
  endpoints: (build) => ({
    addresses: build.query<Address[], void>({
      query: () => "/addresses",
      transformResponse: (response: AddressesResponse) => response.addresses,
      providesTags: ["Addresses"],
    }),
    createAddress: build.mutation<Address, AddressInput>({
      query: (body) => ({ url: "/addresses", method: "POST", body }),
      transformResponse: toAddress,
      invalidatesTags: ["Addresses"],
    }),
    updateAddress: build.mutation<Address, { id: string; data: AddressInput }>({
      query: ({ id, data }) => ({ url: `/addresses/${id}`, method: "PUT", body: data }),
      transformResponse: toAddress,
      invalidatesTags: ["Addresses"],
    }),
    deleteAddress: build.mutation<void, string>({
      query: (id) => ({ url: `/addresses/${id}`, method: "DELETE" }),
      invalidatesTags: ["Addresses"],
    }),
  }),
});

export const {
  useAddressesQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressesApi;
