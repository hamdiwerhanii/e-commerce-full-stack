import type { ComponentType } from "react";
import { Navigate, type RouteObject } from "react-router";
import { AdminLayout } from "@/modules/admin/components/AdminLayout";
import { AuthLayout } from "@/modules/auth/components/AuthLayout";
import { GuestOnly, HomeRedirect, RequireAuth } from "@/modules/auth/components/RouteGuards";
import { PageLoader } from "@/shared/components/Skeleton";
import { NotFound, Unauthorized } from "@/shared/components/StatusPage";
import { RootLayout } from "./layouts/RootLayout";
import { ShopLayout } from "./layouts/ShopLayout";

const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
});

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    HydrateFallback: PageLoader,
    children: [
      { path: "/", element: <HomeRedirect /> },
      {
        path: "auth",
        element: <GuestOnly />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { index: true, element: <Navigate to="login" replace /> },
              { path: "login", lazy: page(() => import("./pages/auth/LoginPage")) },
              { path: "register", lazy: page(() => import("./pages/auth/RegisterPage")) },
            ],
          },
        ],
      },
      {
        path: "admin",
        element: <RequireAuth role="admin" />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <Navigate to="dashboard" replace /> },
              { path: "dashboard", lazy: page(() => import("./pages/admin/DashboardPage")) },
              { path: "products", lazy: page(() => import("./pages/admin/ProductsPage")) },
              { path: "orders", lazy: page(() => import("./pages/admin/OrdersPage")) },
            ],
          },
        ],
      },
      {
        path: "shop",
        element: <ShopLayout />,
        children: [
          { index: true, element: <Navigate to="home" replace /> },
          { path: "home", lazy: page(() => import("./pages/shop/HomePage")) },
          { path: "listing", lazy: page(() => import("./pages/shop/ListingPage")) },
          { path: "search", lazy: page(() => import("./pages/shop/SearchPage")) },
          {
            element: <RequireAuth />,
            children: [
              { path: "checkout", lazy: page(() => import("./pages/shop/CheckoutPage")) },
              { path: "account", lazy: page(() => import("./pages/shop/AccountPage")) },
              { path: "paypal-return", lazy: page(() => import("./pages/shop/PaypalReturnPage")) },
              {
                path: "payment-success",
                lazy: page(() => import("./pages/shop/PaymentSuccessPage")),
              },
            ],
          },
          { path: "*", element: <NotFound /> },
        ],
      },
      { path: "unauth-page", element: <Unauthorized /> },
      { path: "*", element: <ShopLayout />, children: [{ path: "*", element: <NotFound /> }] },
    ],
  },
];
