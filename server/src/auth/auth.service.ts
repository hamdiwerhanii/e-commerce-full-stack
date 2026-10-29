import bcrypt from "bcryptjs";
import { AppError, conflictError } from "../common/errors/app-error.js";
import { UserModel } from "../users/schema/user.schema.js";
import { BCRYPT_ROUNDS, INVALID_CREDENTIALS } from "./consts/auth.consts.js";
import type { LoginDto, RegisterDto } from "./dto/auth.dto.js";

const TIMING_SAFE_HASH = bcrypt.hashSync("timing-safe-placeholder", BCRYPT_ROUNDS);

export async function register({ userName, email, password }: RegisterDto) {
  const existing = await UserModel.findOne({ $or: [{ email }, { userName }] }).lean();
  if (existing) {
    const field = existing.email === email ? "email" : "userName";
    const message =
      field === "email" ? "That email is already registered" : "That user name is taken";
    throw conflictError(message, { [field]: [message] });
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  return UserModel.create({ userName, email, passwordHash });
}

export async function login({ email, password }: LoginDto) {
  const user = await UserModel.findOne({ email }).select("+passwordHash");
  const matches = await bcrypt.compare(password, user?.passwordHash ?? TIMING_SAFE_HASH);
  if (!user || !matches) throw new AppError(401, INVALID_CREDENTIALS);
  return user;
}
