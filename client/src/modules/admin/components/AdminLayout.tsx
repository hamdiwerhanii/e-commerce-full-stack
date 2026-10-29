import { LogOutIcon, MenuIcon, StoreIcon } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet } from "react-router";
import { cn } from "@/lib/utils";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Button } from "@/shared/components/Button";
import { Logo } from "@/shared/components/Logo";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/components/Sheet";
import { ADMIN_NAV } from "@/shared/constants/navigation";

function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Admin" className="flex flex-col gap-1">
      {ADMIN_NAV.map(({ label, to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
              isActive && "bg-muted text-foreground",
            )
          }
        >
          <Icon aria-hidden className="size-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AdminLayout() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 shrink-0 flex-col gap-6 border-r bg-background p-6 lg:flex">
        <Logo to="/admin/dashboard" />
        <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Admin panel
        </p>
        <AdminNav />
      </aside>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-64">
          <SheetTitle>Admin panel</SheetTitle>
          <SheetDescription className="sr-only">Navigate the admin area</SheetDescription>
          <AdminNav onNavigate={() => setMenuOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b bg-background px-4 py-3">
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </Button>
          <p className="hidden text-sm text-muted-foreground sm:block">
            Signed in as {user?.userName}
          </p>
          <div className="ml-auto flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/shop/home">
                <StoreIcon aria-hidden />
                View shop
              </Link>
            </Button>
            <Button size="sm" onClick={logout}>
              <LogOutIcon aria-hidden />
              Logout
            </Button>
          </div>
        </header>
        <main id="main" className="flex-1 bg-muted/40 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
