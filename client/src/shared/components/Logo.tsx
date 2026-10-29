import { ShoppingBagIcon } from "lucide-react";
import { Link } from "react-router";
import { cn } from "@/lib/utils";
import { SITE_NAME } from "@/shared/constants/site";

export function Logo({ to = "/shop/home", className }: { to?: string; className?: string }) {
  return (
    <Link to={to} className={cn("flex items-center gap-2 font-bold", className)}>
      <ShoppingBagIcon aria-hidden className="size-6" />
      <span className="text-lg">{SITE_NAME}</span>
    </Link>
  );
}
