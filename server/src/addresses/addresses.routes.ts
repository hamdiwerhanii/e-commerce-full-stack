import { Router } from "express";
import { requireAuth } from "../common/middleware/require-auth.js";
import { create, list, remove, update } from "./addresses.controller.js";

export const addressesRouter = Router();

addressesRouter.use(requireAuth);
addressesRouter.get("/", list);
addressesRouter.post("/", create);
addressesRouter.put("/:id", update);
addressesRouter.delete("/:id", remove);
