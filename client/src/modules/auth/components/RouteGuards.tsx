import { Navigate, Outlet, useLocation } from "react-router";
import { PageLoader } from "@/shared/components/Skeleton";
import { Unauthorized } from "@/shared/components/StatusPage";
import type { Role } from "@/types";
import { useAuth } from "../hooks/useAuth";

export function RequireAuth({ role }: { role?: Role }) {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === "unknown") return <PageLoader label="Checking your session" />;
  if (!user) {
    return (
      <Navigate
        to="/auth/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }
  if (role && user.role !== role) return <Unauthorized />;
  return <Outlet />;
}

export function GuestOnly() {
  const { status, user } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  if (status === "unknown") return <PageLoader label="Checking your session" />;
  if (user) {
    return (
      <Navigate to={from ?? (user.role === "admin" ? "/admin/dashboard" : "/shop/home")} replace />
    );
  }
  return <Outlet />;
}

export function HomeRedirect() {
  const { status, user } = useAuth();
  if (status === "unknown") return <PageLoader />;
  return <Navigate to={user?.role === "admin" ? "/admin/dashboard" : "/shop/home"} replace />;
}
