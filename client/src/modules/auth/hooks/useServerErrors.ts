import { useCallback } from "react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { getErrorMessage, getFieldErrors } from "@/shared/utils/error.utils";

export function useServerErrors<T extends FieldValues>(setError: UseFormSetError<T>) {
  return useCallback(
    (error: unknown) => {
      const fields = Object.entries(getFieldErrors(error));
      for (const [field, messages] of fields) {
        if (messages?.[0]) setError(field as Path<T>, { type: "server", message: messages[0] });
      }
      toast.error(getErrorMessage(error));
    },
    [setError],
  );
}
