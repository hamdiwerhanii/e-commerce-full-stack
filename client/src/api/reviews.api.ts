import type { Review, ReviewInput, ReviewsResponse } from "@/types";
import { apiClient } from "./api.client";

export const reviewsApi = apiClient.injectEndpoints({
  endpoints: (build) => ({
    reviews: build.query<Review[], string>({
      query: (productId) => `/products/${productId}/reviews`,
      transformResponse: (response: ReviewsResponse) => response.reviews,
      providesTags: (_result, _error, productId) => [{ type: "Reviews", id: productId }],
    }),
    addReview: build.mutation<Review, { productId: string; data: ReviewInput }>({
      query: ({ productId, data }) => ({
        url: `/products/${productId}/reviews`,
        method: "POST",
        body: data,
      }),
      transformResponse: (response: { review: Review }) => response.review,
      invalidatesTags: (_result, _error, { productId }) => [
        { type: "Reviews", id: productId },
        { type: "Products", id: productId },
        "Products",
      ],
    }),
  }),
});

export const { useReviewsQuery, useAddReviewMutation } = reviewsApi;
