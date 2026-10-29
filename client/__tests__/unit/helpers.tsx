import { render } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router";
import { routes } from "@/app/routes";
import { Providers } from "@/lib/providers";
import { createStore } from "@/lib/store";
import type { Product, User } from "@/types";

type Handler = (body: unknown, url: URL) => { status?: number; body?: unknown };
export type ApiMock = Record<string, Handler>;

export const SHOPPER: User = {
  id: "u1",
  userName: "shopper",
  email: "shopper@example.com",
  role: "user",
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const ADMIN: User = { ...SHOPPER, id: "u2", userName: "admin", role: "admin" };

export const makeProduct = (overrides: Partial<Product> = {}): Product => ({
  id: "p1",
  title: "Essential Cotton T-Shirt",
  description: "Soft cotton tee.",
  category: "men",
  brand: "h&m",
  image: "https://images.example.com/tee.jpg",
  price: 20,
  salePrice: 15,
  finalPrice: 15,
  totalStock: 50,
  averageReview: 4,
  reviewCount: 2,
  createdAt: "2026-01-01T00:00:00.000Z",
  ...overrides,
});

export const EMPTY_CART = { items: [], totalQuantity: 0, subtotal: 0 };

export function mockApi(handlers: ApiMock, user: User | null = null) {
  const calls: { method: string; path: string; body: unknown; url: URL }[] = [];
  const defaults: ApiMock = {
    "GET /api/auth/me": () =>
      user ? { body: { user } } : { status: 401, body: { error: { message: "Sign in" } } },
    "GET /api/config": () => ({
      body: { payments: { paypal: false, demo: true }, uploads: false },
    }),
    "GET /api/features": () => ({ body: { features: [] } }),
    "GET /api/cart": () => ({ body: { cart: EMPTY_CART } }),
  };

  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const request = input instanceof Request ? input : new Request(input);
    const url = new URL(request.url);
    const text = await request.text();
    const body = text ? JSON.parse(text) : undefined;
    calls.push({ method: request.method, path: url.pathname, body, url });

    const key = `${request.method} ${url.pathname}`;
    const handler = handlers[key] ?? defaults[key];
    if (!handler)
      return new Response(JSON.stringify({ error: { message: `No mock for ${key}` } }), {
        status: 404,
      });
    const result = handler(body, url);
    const status = result.status ?? 200;
    return new Response(status === 204 ? null : JSON.stringify(result.body ?? {}), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  });

  vi.stubGlobal("fetch", fetchMock);
  return calls;
}

export function renderApp(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const store = createStore();
  const view = render(
    <Providers store={store}>
      <RouterProvider router={router} />
    </Providers>,
  );
  return { ...view, router, store };
}
