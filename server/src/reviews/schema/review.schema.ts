import { Schema, model } from "mongoose";
import { toJSONOptions } from "../../common/utils/json.utils.js";
import type { Review } from "../types/review.types.js";

const reviewSchema = new Schema<Review>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    reviewMessage: { type: String, required: true, trim: true },
    reviewValue: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: true, toJSON: toJSONOptions(["updatedAt"]) },
);

reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

export const ReviewModel = model<Review>("Review", reviewSchema);
