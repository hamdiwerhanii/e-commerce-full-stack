import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { makeProduct, mockApi, renderApp, SHOPPER } from "../helpers";

const PRODUCTS = [
  makeProduct(),
  makeProduct({
    id: "p2",
    title: "Air Runner Sneakers",
    category: "footwear",
    brand: "nike",
    price: 130,
    salePrice: 0,
    finalPrice: 130,
  }),
  makeProduct({ id: "p3", title: "Round Sunglasses", category: "accessories", totalStock: 0 }),
];

describe("shop pages", () => {
  it("lists products and sends the selected filters and sort to the API", async () => {
    const calls = mockApi({ "GET /api/products": () => ({ body: { products: PRODUCTS } }) });
    const user = userEvent.setup();
    const { router } = renderApp("/shop/listing");

    expect(
      await screen.findByRole(
        "heading",
        { level: 2, name: "Air Runner Sneakers" },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Round Sunglasses is out of stock" })).toBeDisabled();
    expect(screen.getByText("3 products")).toBeInTheDocument();

    await user.click(screen.getByRole("checkbox", { name: "Footwear" }));
    await user.selectOptions(screen.getByLabelText("Sort by"), "title-ztoa");

    await waitFor(() =>
      expect(router.state.location.search).toBe("?category=footwear&sortBy=title-ztoa"),
    );
    const last = calls.filter((call) => call.path === "/api/products").at(-1);
    expect(last?.url.searchParams.get("category")).toBe("footwear");
    expect(last?.url.searchParams.get("sortBy")).toBe("title-ztoa");
  });

  it("sends anonymous shoppers to sign in when they add to cart", async () => {
    mockApi({ "GET /api/products": () => ({ body: { products: PRODUCTS } }) });
    const user = userEvent.setup();
    const { router } = renderApp("/shop/listing");

    await user.click(
      await screen.findByRole(
        "button",
        { name: "Add Air Runner Sneakers to cart" },
        { timeout: 5000 },
      ),
    );
    await waitFor(() => expect(router.state.location.pathname).toBe("/auth/login"));
    expect(
      await screen.findByRole(
        "heading",
        { level: 1, name: "Sign in to your account" },
        { timeout: 5000 },
      ),
    ).toBeInTheDocument();
  });

  it("adds an item to the cart for signed-in shoppers", async () => {
    let cart = { items: [] as unknown[], totalQuantity: 0, subtotal: 0 };
    const calls = mockApi(
      {
        "GET /api/products": () => ({ body: { products: PRODUCTS } }),
        "GET /api/cart": () => ({ body: { cart } }),
        "POST /api/cart/items": () => {
          cart = {
            items: [
              {
                productId: "p2",
                title: "Air Runner Sneakers",
                image: "",
                price: 130,
                salePrice: 0,
                finalPrice: 130,
                totalStock: 5,
                quantity: 1,
                lineTotal: 130,
              },
            ],
            totalQuantity: 1,
            subtotal: 130,
          };
          return { status: 201, body: { cart } };
        },
      },
      SHOPPER,
    );
    const user = userEvent.setup();
    renderApp("/shop/listing");

    await user.click(
      await screen.findByRole(
        "button",
        { name: "Add Air Runner Sneakers to cart" },
        { timeout: 5000 },
      ),
    );
    expect(
      await screen.findByRole("button", { name: "Cart, 1 items" }, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(calls.find((call) => call.method === "POST")?.body).toEqual({
      productId: "p2",
      quantity: 1,
    });
  });

  it("searches after the shopper types a keyword", async () => {
    const calls = mockApi({
      "GET /api/products": (_body, url) => ({
        body: {
          products: PRODUCTS.filter((product) =>
            product.title.toLowerCase().includes(url.searchParams.get("search") ?? ""),
          ),
        },
      }),
    });
    const user = userEvent.setup();
    renderApp("/shop/search");

    await user.type(
      await screen.findByRole("searchbox", { name: "Search products" }, { timeout: 5000 }),
      "sung",
    );
    expect(
      await screen.findByRole("heading", { level: 2, name: "Round Sunglasses" }, { timeout: 5000 }),
    ).toBeInTheDocument();
    expect(calls.some((call) => call.url.searchParams.get("search") === "sung")).toBe(true);
  });
});
