import type { HydratedDocument } from "mongoose";
import type { Role } from "../enums/role.enum.js";

export type User = {
  userName: string;
  email: string;
  passwordHash: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
};

export type UserDocument = HydratedDocument<User>;
