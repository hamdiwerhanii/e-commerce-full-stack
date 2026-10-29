import { Router } from "express";
import { requireAdmin } from "../common/middleware/require-auth.js";
import { reviewsRouter } from "../reviews/reviews.routes.js";
import { create, getById, list, remove, update } from "./products.controller.js";

export const productsRouter = Router();

productsRouter.get("/", list);
productsRouter.get("/:id", getById);
productsRouter.post("/", requireAdmin, create);
productsRouter.put("/:id", requireAdmin, update);
productsRouter.delete("/:id", requireAdmin, remove);
productsRouter.use("/:productId/reviews", reviewsRouter);
