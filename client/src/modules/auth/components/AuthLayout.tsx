import { Outlet } from "react-router";
import { Logo } from "@/shared/components/Logo";
import { SITE_TAGLINE } from "@/shared/constants/site";

export function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-1/2 flex-col justify-between bg-primary p-12 text-primary-foreground lg:flex">
        <Logo className="text-primary-foreground" />
        <div className="max-w-md space-y-4">
          <p className="text-4xl font-extrabold tracking-tight">Welcome to Ecommerce</p>
          <p className="text-lg text-primary-foreground/80">{SITE_TAGLINE}</p>
        </div>
        <p className="text-sm text-primary-foreground/60">
          Secure sign in with an httpOnly session cookie.
        </p>
      </aside>
      <main
        id="main"
        className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="w-full max-w-md">
          <Logo className="mb-8 justify-center lg:hidden" />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
