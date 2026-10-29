import request from "supertest";
import { ProductModel } from "../../src/products/schema/product.schema.js";
import { app, makeProduct, registerAgent } from "../support/helpers.js";

describe("cart", () => {
  it("requires sign in", async () => {
    await request(app).get("/api/cart").expect(401);
  });

  it("adds, merges, updates and removes items using catalog prices", async () => {
    const product = await makeProduct({ price: 50, salePrice: 40, totalStock: 10 });
    const { agent } = await registerAgent();

    await agent.post("/api/cart/items").send({ productId: product.id, quantity: 2 }).expect(201);
    const merged = await agent
      .post("/api/cart/items")
      .send({ productId: product.id, quantity: 1, price: 0.01 })
      .expect(201);

    expect(merged.body.cart).toMatchObject({ totalQuantity: 3, subtotal: 120 });

    const updated = await agent
      .patch(`/api/cart/items/${product.id}`)
      .send({ quantity: 5 })
      .expect(200);
    expect(updated.body.cart.subtotal).toBe(200);

    const removed = await agent.delete(`/api/cart/items/${product.id}`).expect(200);
    expect(removed.body.cart.items).toHaveLength(0);
  });

  it("does not allow more than the stock", async () => {
    const product = await makeProduct({ totalStock: 2 });
    const { agent } = await registerAgent();

    const res = await agent
      .post("/api/cart/items")
      .send({ productId: product.id, quantity: 3 })
      .expect(409);
    expect(res.body.error.message).toMatch(/Only 2/);
  });

  it("keeps carts private to each user", async () => {
    const product = await makeProduct();
    const { agent: first } = await registerAgent();
    const { agent: second } = await registerAgent();

    await first.post("/api/cart/items").send({ productId: product.id, quantity: 1 }).expect(201);
    const other = await second.get("/api/cart").expect(200);
    expect(other.body.cart.items).toHaveLength(0);
  });

  it("drops items whose product was deleted", async () => {
    const product = await makeProduct();
    const { agent } = await registerAgent();
    await agent.post("/api/cart/items").send({ productId: product.id, quantity: 1 }).expect(201);

    await ProductModel.deleteOne({ _id: product.id });
    const res = await agent.get("/api/cart").expect(200);
    expect(res.body.cart).toMatchObject({ items: [], subtotal: 0 });
  });
});
