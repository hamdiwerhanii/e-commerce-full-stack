import { Router } from "express";
import { requireAuth } from "../common/middleware/require-auth.js";
import { addItem, get, removeItem, updateItem } from "./cart.controller.js";

export const cartRouter = Router();

cartRouter.use(requireAuth);
cartRouter.get("/", get);
cartRouter.post("/items", addItem);
cartRouter.patch("/items/:productId", updateItem);
cartRouter.delete("/items/:productId", removeItem);
