import { Router } from "express";
import { requireAdmin } from "../common/middleware/require-auth.js";
import { create, list, remove } from "./features.controller.js";

export const featuresRouter = Router();

featuresRouter.get("/", list);
featuresRouter.post("/", requireAdmin, create);
featuresRouter.delete("/:id", requireAdmin, remove);
