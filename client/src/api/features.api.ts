import type { Feature, FeaturesResponse, UploadResponse } from "@/types";
import { apiClient } from "./api.client";

export const featuresApi = apiClient.injectEndpoints({
  endpoints: (build) => ({
    features: build.query<Feature[], void>({
      query: () => "/features",
      transformResponse: (response: FeaturesResponse) => response.features,
      providesTags: ["Features"],
    }),
    addFeature: build.mutation<Feature, string>({
      query: (image) => ({ url: "/features", method: "POST", body: { image } }),
      transformResponse: (response: { feature: Feature }) => response.feature,
      invalidatesTags: ["Features"],
    }),
    deleteFeature: build.mutation<void, string>({
      query: (id) => ({ url: `/features/${id}`, method: "DELETE" }),
      invalidatesTags: ["Features"],
    }),
    uploadImage: build.mutation<UploadResponse, File>({
      query: (file) => {
        const body = new FormData();
        body.append("image", file);
        return { url: "/uploads/images", method: "POST", body };
      },
    }),
  }),
});

export const {
  useFeaturesQuery,
  useAddFeatureMutation,
  useDeleteFeatureMutation,
  useUploadImageMutation,
} = featuresApi;
