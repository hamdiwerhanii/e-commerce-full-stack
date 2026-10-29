import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockApi, renderApp, SHOPPER } from "../helpers";

const CART = {
  items: [
    {
      productId: "p1",
      title: "Essential Cotton T-Shirt",
      image: "",
      price: 20,
      salePrice: 15,
      finalPrice: 15,
      totalStock: 10,
      quantity: 2,
      lineTotal: 30,
    },
  ],
  totalQuantity: 2,
  subtotal: 30,
};

const ADDRESS = {
  id: "a1",
  address: "12 Avenue Habib Bourguiba",
  city: "Tunis",
  pincode: "1000",
  phone: "+216 20 123 456",
  notes: "",
  createdAt: "2026-01-01T00:00:00.000Z",
};

const ORDER = {
  id: "6ae35bdfc3b449041155bb17",
  userId: "u1",
  items: [
    { productId: "p1", title: "Essential Cotton T-Shirt", image: "", price: 15, quantity: 2 },
  ],
  address: ADDRESS,
  paymentMethod: "demo",
  paymentStatus: "paid",
  orderStatus: "confirmed",
  totalAmount: 30,
  createdAt: "2026-01-01T00:00:00.000Z",
};

describe("checkout", () => {
  it("requires an address, then places a demo order and shows the confirmation", async () => {
    const calls = mockApi(
      {
        "GET /api/cart": () => ({ body: { cart: CART } }),
        "GET /api/addresses": () => ({ body: { addresses: [ADDRESS] } }),
        "POST /api/orders": () => ({ status: 201, body: { order: ORDER, approvalUrl: null } }),
        [`GET /api/orders/${ORDER.id}`]: () => ({ body: { order: ORDER } }),
      },
      SHOPPER,
    );
    const user = userEvent.setup();
    const { router } = renderApp("/shop/checkout");

    const placeButton = await screen.findByRole(
      "button",
      { name: "Place demo order" },
      { timeout: 5000 },
    );
    expect(screen.getByText("$30.00", { selector: "p span" })).toBeInTheDocument();
    await user.click(placeButton);
    expect(calls.some((call) => call.method === "POST" && call.path === "/api/orders")).toBe(false);

    await user.click(screen.getByRole("button", { name: "Deliver here" }));
    await user.click(placeButton);

    await waitFor(() => expect(router.state.location.pathname).toBe("/shop/payment-success"));
    expect(
      await screen.findByRole(
        "heading",
        { level: 1, name: "Payment successful!" },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
    expect(
      calls.find((call) => call.method === "POST" && call.path === "/api/orders")?.body,
    ).toEqual({
      addressId: "a1",
      paymentMethod: "demo",
    });
  });

  it("captures the PayPal payment when the shopper returns from PayPal", async () => {
    const calls = mockApi(
      {
        [`POST /api/orders/${ORDER.id}/capture`]: () => ({
          body: { order: { ...ORDER, paymentMethod: "paypal" } },
        }),
        [`GET /api/orders/${ORDER.id}`]: () => ({
          body: { order: { ...ORDER, paymentMethod: "paypal" } },
        }),
      },
      SHOPPER,
    );
    const { router } = renderApp(
      `/shop/paypal-return?orderId=${ORDER.id}&token=PAYPAL-ORDER-1&PayerID=X`,
    );

    await waitFor(() => expect(router.state.location.pathname).toBe("/shop/payment-success"));
    const captures = calls.filter((call) => call.path.endsWith("/capture"));
    expect(captures).toHaveLength(1);
    expect(captures[0]?.body).toEqual({ paypalOrderId: "PAYPAL-ORDER-1" });
  });

  it("explains when the PayPal return link is incomplete", async () => {
    mockApi({}, SHOPPER);
    renderApp("/shop/paypal-return");
    expect(
      await screen.findByRole(
        "heading",
        { level: 1, name: "We could not confirm your payment" },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
  });
});
