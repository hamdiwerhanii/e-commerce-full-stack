import { Router } from "express";
import { requireAdmin, requireAuth } from "../common/middleware/require-auth.js";
import {
  capture,
  create,
  getAny,
  getMine,
  listAll,
  listMine,
  updateStatus,
} from "./orders.controller.js";

export const ordersRouter = Router();

ordersRouter.use(requireAuth);
ordersRouter.get("/", listMine);
ordersRouter.post("/", create);
ordersRouter.get("/:id", getMine);
ordersRouter.post("/:id/capture", capture);

export const adminOrdersRouter = Router();

adminOrdersRouter.use(requireAdmin);
adminOrdersRouter.get("/", listAll);
adminOrdersRouter.get("/:id", getAny);
adminOrdersRouter.patch("/:id/status", updateStatus);
