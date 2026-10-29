import type { CookieOptions, Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { env, isProduction } from "../../config/env.js";
import { AUTH_COOKIE, SEVEN_DAYS_MS } from "../consts/auth.consts.js";

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
};

export const signToken = (userId: string) =>
  jwt.sign({ sub: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });

export function verifyToken(token: string): string {
  const payload = jwt.verify(token, env.JWT_SECRET);
  if (typeof payload === "string" || typeof payload.sub !== "string") {
    throw new Error("Invalid token payload");
  }
  return payload.sub;
}

export const setAuthCookie = (res: Response, userId: string) =>
  res.cookie(AUTH_COOKIE, signToken(userId), { ...cookieOptions, maxAge: SEVEN_DAYS_MS });

export const clearAuthCookie = (res: Response) => res.clearCookie(AUTH_COOKIE, cookieOptions);
