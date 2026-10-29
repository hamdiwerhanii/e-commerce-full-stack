import request from "supertest";
import { env } from "../../src/config/env.js";
import { resetPaypalTokenCache } from "../../src/payments/paypal.service.js";
import { ProductModel } from "../../src/products/schema/product.schema.js";
import { adminAgent, app, makeProduct, registerAgent, VALID_ADDRESS } from "../support/helpers.js";

type Agent = Awaited<ReturnType<typeof registerAgent>>["agent"];

async function prepareCheckout(agent: Agent, quantity = 2) {
  const product = await makeProduct({ price: 50, salePrice: 40, totalStock: 5 });
  await agent.post("/api/cart/items").send({ productId: product.id, quantity }).expect(201);
  const address = await agent.post("/api/addresses").send(VALID_ADDRESS).expect(201);
  return { product, addressId: address.body.address.id as string };
}

function mockPaypal(captureValue: string, captureStatus = "COMPLETED") {
  const fetchMock = vi.fn(async (input: string | URL | Request, _init?: RequestInit) => {
    const url = String(input);
    const json = (body: unknown) => new Response(JSON.stringify(body), { status: 200 });

    if (url.endsWith("/v1/oauth2/token")) return json({ access_token: "token", expires_in: 3600 });
    if (url.endsWith("/capture")) {
      return json({
        status: captureStatus,
        purchase_units: [
          {
            payments: {
              captures: [
                {
                  id: "CAPTURE-1",
                  status: captureStatus,
                  amount: { value: captureValue, currency_code: "USD" },
                },
              ],
            },
          },
        ],
      });
    }
    return json({
      id: "PAYPAL-ORDER-1",
      links: [
        {
          rel: "payer-action",
          href: "https://www.sandbox.paypal.com/checkoutnow?token=PAYPAL-ORDER-1",
        },
      ],
    });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("orders with demo payments", () => {
  it("charges the catalog price, reduces stock and empties the cart", async () => {
    const { agent } = await registerAgent();
    const { product, addressId } = await prepareCheckout(agent);

    const res = await agent
      .post("/api/orders")
      .send({ addressId, paymentMethod: "demo", totalAmount: 1 })
      .expect(201);

    expect(res.body.order).toMatchObject({
      totalAmount: 80,
      paymentStatus: "paid",
      orderStatus: "confirmed",
      address: { city: "Tunis" },
    });
    expect(res.body.approvalUrl).toBeNull();
    expect((await ProductModel.findById(product.id))?.totalStock).toBe(3);

    const cart = await agent.get("/api/cart").expect(200);
    expect(cart.body.cart.items).toHaveLength(0);
  });

  it("refuses an empty cart and someone else's address", async () => {
    const { agent: owner } = await registerAgent();
    const { agent: other } = await registerAgent();
    const { addressId } = await prepareCheckout(owner);

    await other.post("/api/orders").send({ addressId, paymentMethod: "demo" }).expect(400);
    await other.post("/api/cart/items").send({ productId: (await makeProduct()).id, quantity: 1 });
    await other.post("/api/orders").send({ addressId, paymentMethod: "demo" }).expect(404);
  });

  it("keeps orders private and lets only admins manage every order", async () => {
    const { agent } = await registerAgent();
    const { addressId } = await prepareCheckout(agent);
    const created = await agent
      .post("/api/orders")
      .send({ addressId, paymentMethod: "demo" })
      .expect(201);
    const orderId = created.body.order.id;

    const { agent: stranger } = await registerAgent();
    await stranger.get(`/api/orders/${orderId}`).expect(404);
    await stranger.get("/api/admin/orders").expect(403);

    const mine = await agent.get("/api/orders").expect(200);
    expect(mine.body.orders).toHaveLength(1);

    const { agent: admin } = await adminAgent();
    const all = await admin.get("/api/admin/orders").expect(200);
    expect(all.body.orders[0].userId.email).toMatch(/@example.com$/);

    const updated = await admin
      .patch(`/api/admin/orders/${orderId}/status`)
      .send({ orderStatus: "inShipping" })
      .expect(200);
    expect(updated.body.order.orderStatus).toBe("inShipping");
    await admin
      .patch(`/api/admin/orders/${orderId}/status`)
      .send({ orderStatus: "lost" })
      .expect(400);
  });
});

describe("orders with PayPal", () => {
  beforeEach(() => {
    env.PAYPAL_CLIENT_ID = "client-id";
    env.PAYPAL_CLIENT_SECRET = "client-secret";
    resetPaypalTokenCache();
  });

  afterEach(() => {
    env.PAYPAL_CLIENT_ID = undefined;
    env.PAYPAL_CLIENT_SECRET = undefined;
  });

  it("returns a PayPal approval link, then captures and confirms the order", async () => {
    const fetchMock = mockPaypal("80.00");
    const { agent } = await registerAgent();
    const { product, addressId } = await prepareCheckout(agent);

    const created = await agent
      .post("/api/orders")
      .send({ addressId, paymentMethod: "paypal" })
      .expect(201);
    expect(created.body.approvalUrl).toContain("sandbox.paypal.com");
    expect(created.body.order.paymentStatus).toBe("pending");

    const createCall = fetchMock.mock.calls.find(([url]) =>
      String(url).endsWith("/v2/checkout/orders"),
    );
    const sentBody = JSON.parse(String(createCall?.[1]?.body));
    expect(sentBody.purchase_units[0].amount.value).toBe("80.00");

    const orderId = created.body.order.id;
    const captured = await agent
      .post(`/api/orders/${orderId}/capture`)
      .send({ paypalOrderId: "PAYPAL-ORDER-1" })
      .expect(200);
    expect(captured.body.order).toMatchObject({ paymentStatus: "paid", paymentId: "CAPTURE-1" });
    expect((await ProductModel.findById(product.id))?.totalStock).toBe(3);

    const again = await agent
      .post(`/api/orders/${orderId}/capture`)
      .send({ paypalOrderId: "PAYPAL-ORDER-1" })
      .expect(200);
    expect(again.body.order.paymentStatus).toBe("paid");
    expect((await ProductModel.findById(product.id))?.totalStock).toBe(3);
  });

  it("does not confirm an order when PayPal captured the wrong amount", async () => {
    mockPaypal("1.00");
    const { agent } = await registerAgent();
    const { product, addressId } = await prepareCheckout(agent);
    const created = await agent
      .post("/api/orders")
      .send({ addressId, paymentMethod: "paypal" })
      .expect(201);

    await agent
      .post(`/api/orders/${created.body.order.id}/capture`)
      .send({ paypalOrderId: "PAYPAL-ORDER-1" })
      .expect(402);
    expect((await ProductModel.findById(product.id))?.totalStock).toBe(5);
  });

  it("rejects a capture for an order that belongs to someone else", async () => {
    mockPaypal("80.00");
    const { agent } = await registerAgent();
    const { addressId } = await prepareCheckout(agent);
    const created = await agent
      .post("/api/orders")
      .send({ addressId, paymentMethod: "paypal" })
      .expect(201);

    const { agent: stranger } = await registerAgent();
    await stranger
      .post(`/api/orders/${created.body.order.id}/capture`)
      .send({ paypalOrderId: "PAYPAL-ORDER-1" })
      .expect(404);
  });

  it("reports PayPal as unavailable when it is not configured", async () => {
    env.PAYPAL_CLIENT_ID = undefined;
    const { agent } = await registerAgent();
    const { addressId } = await prepareCheckout(agent);

    await agent.post("/api/orders").send({ addressId, paymentMethod: "paypal" }).expect(400);
    const config = await request(app).get("/api/config").expect(200);
    expect(config.body.payments).toEqual({ paypal: false, demo: true });
  });
});
