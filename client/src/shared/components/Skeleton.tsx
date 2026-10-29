import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div aria-hidden className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
  );
}

export function PageLoader({ label = "Loading" }: { label?: string }) {
  return (
    <div role="status" className="flex min-h-[50vh] items-center justify-center">
      <span className="size-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
