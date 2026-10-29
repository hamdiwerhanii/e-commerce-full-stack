import type { ApiErrorBody, FieldErrors } from "@/types";

const DEFAULT_MESSAGE = "Something went wrong, please try again";

function errorBody(error: unknown): ApiErrorBody | undefined {
  if (typeof error === "object" && error !== null && "data" in error) {
    return (error as { data?: ApiErrorBody }).data;
  }
  return undefined;
}

export function getErrorMessage(error: unknown, fallback = DEFAULT_MESSAGE) {
  if (typeof error === "object" && error !== null && "status" in error) {
    const { status } = error as { status: unknown };
    if (status === "FETCH_ERROR") return "Cannot reach the server, check that the API is running";
  }
  return errorBody(error)?.error?.message ?? fallback;
}

export function getFieldErrors(error: unknown): FieldErrors {
  return errorBody(error)?.error?.details ?? {};
}

export const isStatus = (error: unknown, status: number) =>
  typeof error === "object" && error !== null && "status" in error && error.status === status;
