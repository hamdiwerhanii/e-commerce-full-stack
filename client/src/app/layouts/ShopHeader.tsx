import { LayoutDashboardIcon, LogInIcon, LogOutIcon, MenuIcon, UserCogIcon } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { CartSheet } from "@/modules/cart/components/CartSheet";
import { Button } from "@/shared/components/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/DropdownMenu";
import { Logo } from "@/shared/components/Logo";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/shared/components/Sheet";
import { SHOP_NAV } from "@/shared/constants/navigation";

function ShopNav({ onNavigate, className }: { onNavigate?: () => void; className?: string }) {
  const location = useLocation();
  const current = `${location.pathname}${location.search}`;

  return (
    <nav aria-label="Shop" className={className}>
      {SHOP_NAV.map((item) => {
        const active = item.to.includes("?")
          ? current === item.to
          : location.pathname === item.to && !location.search.includes("category=");
        return (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "rounded-md px-2 py-1 text-sm font-medium transition-colors hover:text-primary",
              active ? "text-foreground underline underline-offset-8" : "text-muted-foreground",
            )}
          >
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}

function UserMenu() {
  const { user, isAdmin, logout } = useAuth();

  if (!user) {
    return (
      <Button asChild size="sm">
        <Link to="/auth/login">
          <LogInIcon aria-hidden />
          Sign in
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="rounded-full font-extrabold uppercase"
          aria-label="Account menu"
        >
          {user.userName[0]}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Signed in as {user.userName}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/shop/account">
            <UserCogIcon aria-hidden />
            Account
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin/dashboard">
              <LayoutDashboardIcon aria-hidden />
              Admin panel
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={logout}>
          <LogOutIcon aria-hidden />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ShopHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Logo />
        <ShopNav className="hidden items-center gap-4 lg:flex" />
        <div className="flex items-center gap-3">
          {isAuthenticated && <CartSheet />}
          <UserMenu />
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            <MenuIcon />
          </Button>
        </div>
      </div>
      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-72">
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">Browse the shop</SheetDescription>
          <ShopNav
            onNavigate={() => setMenuOpen(false)}
            className="flex flex-col items-start gap-3"
          />
        </SheetContent>
      </Sheet>
    </header>
  );
}
