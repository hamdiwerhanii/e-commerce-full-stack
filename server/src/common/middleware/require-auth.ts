import type { RequestHandler } from "express";
import { AUTH_COOKIE } from "../../auth/consts/auth.consts.js";
import { verifyToken } from "../../auth/utils/token.utils.js";
import { UserModel } from "../../users/schema/user.schema.js";
import { Role } from "../../users/enums/role.enum.js";
import { forbiddenError, unauthorizedError } from "../errors/app-error.js";

export const requireAuth: RequestHandler = async (req, _res, next) => {
  const token: unknown = req.cookies?.[AUTH_COOKIE];
  if (typeof token !== "string") return next(unauthorizedError());

  let userId: string;
  try {
    userId = verifyToken(token);
  } catch {
    return next(unauthorizedError("Your session has expired, please sign in again"));
  }

  const user = await UserModel.findById(userId);
  if (!user) return next(unauthorizedError());

  req.user = user;
  next();
};

export const requireRole =
  (...roles: Role[]): RequestHandler =>
  (req, _res, next) => {
    if (!req.user) return next(unauthorizedError());
    if (!roles.includes(req.user.role)) return next(forbiddenError());
    next();
  };

export const requireAdmin = [requireAuth, requireRole(Role.Admin)];
