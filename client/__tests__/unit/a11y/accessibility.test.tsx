import { screen } from "@testing-library/react";
import axe from "axe-core";
import { makeProduct, mockApi, renderApp, SHOPPER } from "../helpers";

const PAGES = [
  { path: "/shop/home", heading: "Ecommerce fashion store", user: null },
  { path: "/shop/listing", heading: "All products", user: null },
  { path: "/auth/login", heading: "Sign in to your account", user: null },
  { path: "/auth/register", heading: "Create a new account", user: null },
  { path: "/shop/account", heading: "My account", user: SHOPPER },
];

describe("accessibility", () => {
  it.each(PAGES)("$path has no axe violations", async ({ path, heading, user }) => {
    mockApi(
      {
        "GET /api/products": () => ({
          body: { products: [makeProduct(), makeProduct({ id: "p2", title: "Hoodie" })] },
        }),
        "GET /api/orders": () => ({ body: { orders: [] } }),
      },
      user,
    );
    const { container } = renderApp(path);
    await screen.findByRole("heading", { level: 1, name: heading }, { timeout: 5000 });

    const results = await axe.run(container, { rules: { "color-contrast": { enabled: false } } });
    expect(
      results.violations.map(
        (violation) =>
          `${violation.id}: ${violation.help} ${violation.nodes.map((node) => node.html).join(" ")}`,
      ),
    ).toEqual([]);
  });
});
