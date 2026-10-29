export type Review = {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  reviewMessage: string;
  reviewValue: number;
  createdAt: string;
};

export type ReviewInput = {
  reviewValue: number;
  reviewMessage: string;
};

export type ReviewsResponse = { reviews: Review[] };
