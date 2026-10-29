import { Types } from "mongoose";
import { conflictError, forbiddenError } from "../common/errors/app-error.js";
import { PaymentStatus } from "../orders/enums/order.enums.js";
import { OrderModel } from "../orders/schema/order.schema.js";
import { getProduct } from "../products/products.service.js";
import { ProductModel } from "../products/schema/product.schema.js";
import type { UserDocument } from "../users/types/user.types.js";
import type { CreateReviewDto } from "./dto/review.dto.js";
import { ReviewModel } from "./schema/review.schema.js";

export async function listReviews(productId: string) {
  await getProduct(productId);
  return ReviewModel.find({ productId }).sort({ createdAt: -1 });
}

async function refreshRating(productId: string) {
  const [stats] = await ReviewModel.aggregate<{ average: number; count: number }>([
    { $match: { productId: new Types.ObjectId(productId) } },
    { $group: { _id: null, average: { $avg: "$reviewValue" }, count: { $sum: 1 } } },
  ]);
  await ProductModel.updateOne(
    { _id: productId },
    {
      averageReview: stats ? Math.round(stats.average * 10) / 10 : 0,
      reviewCount: stats?.count ?? 0,
    },
  );
}

export async function createReview(user: UserDocument, productId: string, data: CreateReviewDto) {
  await getProduct(productId);

  const purchased = await OrderModel.exists({
    userId: user._id,
    paymentStatus: PaymentStatus.Paid,
    "items.productId": productId,
  });
  if (!purchased) throw forbiddenError("You can review a product after buying it");

  const existing = await ReviewModel.exists({ productId, userId: user._id });
  if (existing) throw conflictError("You already reviewed this product");

  const review = await ReviewModel.create({
    ...data,
    productId,
    userId: user._id,
    userName: user.userName,
  });
  await refreshRating(productId);
  return review;
}
