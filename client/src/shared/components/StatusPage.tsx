import { CompassIcon, ShieldAlertIcon } from "lucide-react";
import { Link } from "react-router";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";

export function NotFound() {
  useDocumentTitle("Page not found");
  return (
    <EmptyState
      icon={CompassIcon}
      titleAs="h1"
      title="Page not found"
      description="The page you are looking for does not exist or was moved."
      action={
        <Button asChild>
          <Link to="/shop/home">Back to the shop</Link>
        </Button>
      }
      className="min-h-[60vh] justify-center"
    />
  );
}

export function Unauthorized() {
  useDocumentTitle("Access denied");
  return (
    <EmptyState
      icon={ShieldAlertIcon}
      titleAs="h1"
      title="You don't have access to this page"
      description="This area is for store administrators only."
      action={
        <Button asChild>
          <Link to="/shop/home">Back to the shop</Link>
        </Button>
      }
      className="min-h-screen justify-center"
    />
  );
}
