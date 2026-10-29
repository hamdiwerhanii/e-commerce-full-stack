import { Router } from "express";
import { requireAuth } from "../common/middleware/require-auth.js";
import { create, list } from "./reviews.controller.js";

export const reviewsRouter = Router({ mergeParams: true });

reviewsRouter.get("/", list);
reviewsRouter.post("/", requireAuth, create);
