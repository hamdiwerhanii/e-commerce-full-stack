import type { Request, Response } from "express";
import { parseInput, parseObjectId } from "../common/utils/validation.utils.js";
import { createReviewDto } from "./dto/review.dto.js";
import * as reviewsService from "./reviews.service.js";

const productIdOf = (req: Request<{ productId?: string }>) =>
  parseObjectId(req.params.productId, "product id");

export async function list(req: Request<{ productId?: string }>, res: Response) {
  res.json({ reviews: await reviewsService.listReviews(productIdOf(req)) });
}

export async function create(req: Request<{ productId?: string }>, res: Response) {
  const review = await reviewsService.createReview(
    req.user!,
    productIdOf(req),
    parseInput(createReviewDto, req.body),
  );
  res.status(201).json({ review });
}
