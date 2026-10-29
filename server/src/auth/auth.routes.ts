import { Router } from "express";
import rateLimit from "express-rate-limit";
import { requireAuth } from "../common/middleware/require-auth.js";
import { env } from "../config/env.js";
import { login, logout, me, register } from "./auth.controller.js";
import { FIFTEEN_MINUTES_MS } from "./consts/auth.consts.js";

const authLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES_MS,
  limit: env.AUTH_RATE_LIMIT_MAX,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { error: { message: "Too many attempts, please try again in 15 minutes" } },
});

export const authRouter = Router();

authRouter.post("/register", authLimiter, register);
authRouter.post("/login", authLimiter, login);
authRouter.post("/logout", logout);
authRouter.get("/me", requireAuth, me);
