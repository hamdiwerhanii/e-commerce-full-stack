import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ADMIN, mockApi, renderApp, SHOPPER } from "../helpers";

describe("auth and guards", () => {
  it("validates the login form before calling the API", async () => {
    const calls = mockApi({});
    const user = userEvent.setup();
    renderApp("/auth/login");

    await user.click(await screen.findByRole("button", { name: "Sign in" }, { timeout: 5000 }));
    expect(await screen.findByText("Enter your email", {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.getByText("Enter your password")).toBeInTheDocument();
    expect(calls.some((call) => call.path === "/api/auth/login")).toBe(false);
  });

  it("signs an admin in and opens the admin dashboard", async () => {
    mockApi({
      "POST /api/auth/login": () => ({ body: { user: ADMIN } }),
      "GET /api/products": () => ({ body: { products: [] } }),
      "GET /api/admin/orders": () => ({ body: { orders: [] } }),
    });
    const user = userEvent.setup();
    const { router } = renderApp("/auth/login");

    await user.type(
      await screen.findByLabelText("Email", {}, { timeout: 5000 }),
      "admin@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "Admin12345");
    await user.click(screen.getByRole("button", { name: "Sign in" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/admin/dashboard"));
    expect(
      await screen.findByRole("heading", { level: 1, name: "Dashboard" }, { timeout: 5000 }),
    ).toBeInTheDocument();
  });

  it("shows server field errors from registration", async () => {
    mockApi({
      "POST /api/auth/register": () => ({
        status: 409,
        body: {
          error: {
            message: "That email is already registered",
            details: { email: ["That email is already registered"] },
          },
        },
      }),
    });
    const user = userEvent.setup();
    renderApp("/auth/register");

    await user.type(await screen.findByLabelText("User name", {}, { timeout: 5000 }), "new_user");
    await user.type(screen.getByLabelText("Email"), "taken@example.com");
    await user.type(screen.getByLabelText("Password"), "Password123");
    await user.click(screen.getByRole("button", { name: "Create account" }));

    expect(await screen.findByRole("alert", {}, { timeout: 5000 })).toHaveTextContent(
      "That email is already registered",
    );
  });

  it("redirects guests away from checkout and blocks shoppers from admin", async () => {
    mockApi({});
    const guest = renderApp("/shop/checkout");
    await waitFor(() => expect(guest.router.state.location.pathname).toBe("/auth/login"));
    guest.unmount();

    mockApi({}, SHOPPER);
    renderApp("/admin/products");
    expect(
      await screen.findByRole(
        "heading",
        { level: 1, name: "You don't have access to this page" },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
  });
});
