import { Outlet } from "react-router";
import { SITE_NAME } from "@/shared/constants/site";
import { ShopHeader } from "./ShopHeader";

const CURRENT_YEAR = new Date().getFullYear();

export function ShopLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ShopHeader />
      <main id="main" className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        © {CURRENT_YEAR} {SITE_NAME}. Demo store, payments run in PayPal sandbox or demo mode.
      </footer>
    </div>
  );
}
