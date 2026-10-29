export type ErrorDetails = Record<string, string[] | undefined>;

export class AppError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly details?: ErrorDetails,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const badRequestError = (message: string, details?: ErrorDetails) =>
  new AppError(400, message, details);

export const notFoundError = (what = "Resource") => new AppError(404, `${what} not found`);

export const unauthorizedError = (message = "You need to sign in to do that") =>
  new AppError(401, message);

export const forbiddenError = (message = "You are not allowed to do that") =>
  new AppError(403, message);

export const conflictError = (message: string, details?: ErrorDetails) =>
  new AppError(409, message, details);
