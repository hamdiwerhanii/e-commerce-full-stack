import type { Request, Response } from "express";
import { parseInput } from "../common/utils/validation.utils.js";
import * as authService from "./auth.service.js";
import { loginDto, registerDto } from "./dto/auth.dto.js";
import { clearAuthCookie, setAuthCookie } from "./utils/token.utils.js";

export async function register(req: Request, res: Response) {
  const user = await authService.register(parseInput(registerDto, req.body));
  setAuthCookie(res, user.id);
  res.status(201).json({ user });
}

export async function login(req: Request, res: Response) {
  const user = await authService.login(parseInput(loginDto, req.body));
  setAuthCookie(res, user.id);
  res.json({ user });
}

export function logout(_req: Request, res: Response) {
  clearAuthCookie(res);
  res.status(204).end();
}

export function me(req: Request, res: Response) {
  res.json({ user: req.user });
}
