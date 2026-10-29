import request from "supertest";
import { app, makeProduct, registerAgent, VALID_ADDRESS } from "../support/helpers.js";

describe("reviews", () => {
  it("only lets customers who bought a product review it, once", async () => {
    const product = await makeProduct();
    const { agent } = await registerAgent();
    const review = { reviewValue: 4, reviewMessage: "Great quality, fits well." };

    await request(app).post(`/api/products/${product.id}/reviews`).send(review).expect(401);
    await agent.post(`/api/products/${product.id}/reviews`).send(review).expect(403);

    await agent.post("/api/cart/items").send({ productId: product.id, quantity: 1 }).expect(201);
    const address = await agent.post("/api/addresses").send(VALID_ADDRESS).expect(201);
    await agent
      .post("/api/orders")
      .send({ addressId: address.body.address.id, paymentMethod: "demo" })
      .expect(201);

    await agent
      .post(`/api/products/${product.id}/reviews`)
      .send({ reviewValue: 9, reviewMessage: "x" })
      .expect(400);
    const created = await agent
      .post(`/api/products/${product.id}/reviews`)
      .send(review)
      .expect(201);
    expect(created.body.review.userName).toMatch(/^user_/);
    await agent.post(`/api/products/${product.id}/reviews`).send(review).expect(409);

    const list = await request(app).get(`/api/products/${product.id}/reviews`).expect(200);
    expect(list.body.reviews).toHaveLength(1);

    const updated = await request(app).get(`/api/products/${product.id}`).expect(200);
    expect(updated.body.product).toMatchObject({ averageReview: 4, reviewCount: 1 });
  });
});
