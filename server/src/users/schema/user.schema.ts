import { Schema, model } from "mongoose";
import { toJSONOptions } from "../../common/utils/json.utils.js";
import { Role } from "../enums/role.enum.js";
import type { User } from "../types/user.types.js";

const userSchema = new Schema<User>(
  {
    userName: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(Role), default: Role.User },
  },
  { timestamps: true, toJSON: toJSONOptions(["passwordHash", "updatedAt"]) },
);

export const UserModel = model<User>("User", userSchema);
