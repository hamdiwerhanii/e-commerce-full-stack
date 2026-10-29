import { Suspense } from "react";
import { Outlet, ScrollRestoration } from "react-router";
import { Toaster } from "sonner";
import { useMeQuery } from "@/api/auth.api";
import { PageLoader } from "@/shared/components/Skeleton";

export function RootLayout() {
  useMeQuery();

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:shadow"
      >
        Skip to content
      </a>
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
      <Toaster richColors closeButton position="top-right" />
      <ScrollRestoration />
    </>
  );
}
