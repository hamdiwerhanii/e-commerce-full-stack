import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  titleAs?: "h1" | "h2" | "h3";
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  titleAs: Title = "h2",
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 px-4 py-12 text-center", className)}>
      <span className="flex size-14 items-center justify-center rounded-full bg-muted">
        <Icon aria-hidden className="size-7 text-muted-foreground" />
      </span>
      <Title className="text-lg font-semibold">{title}</Title>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action}
    </div>
  );
}
