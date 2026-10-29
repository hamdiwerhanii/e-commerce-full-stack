import type { Types } from "mongoose";

export type Review = {
  productId: Types.ObjectId;
  userId: Types.ObjectId;
  userName: string;
  reviewMessage: string;
  reviewValue: number;
  createdAt: Date;
  updatedAt: Date;
};
