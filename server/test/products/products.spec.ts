import request from "supertest";
import { adminAgent, app, makeProduct, registerAgent, VALID_PRODUCT } from "../support/helpers.js";

describe("products", () => {
  it("filters by category and brand and sorts by the price customers pay", async () => {
    await makeProduct({ title: "Cheap Sale", price: 100, salePrice: 10, brand: "nike" });
    await makeProduct({ title: "Mid", price: 30, salePrice: 0, brand: "adidas" });
    await makeProduct({ title: "Kids Item", category: "kids", price: 5, salePrice: 0 });

    const res = await request(app)
      .get("/api/products?category=men&brand=nike,adidas&sortBy=price-lowtohigh")
      .expect(200);

    expect(res.body.products.map((product: { title: string }) => product.title)).toEqual([
      "Cheap Sale",
      "Mid",
    ]);
  });

  it("searches safely, treating regex characters as text", async () => {
    await makeProduct({ title: "Plain Shirt" });
    await request(app).get("/api/products?search=(.*").expect(200);

    const res = await request(app).get("/api/products?search=plain").expect(200);
    expect(res.body.products).toHaveLength(1);
  });

  it("returns 404 for an unknown product and 400 for an invalid id", async () => {
    await request(app).get("/api/products/64b7f0f0f0f0f0f0f0f0f0f0").expect(404);
    await request(app).get("/api/products/not-an-id").expect(400);
  });

  it("only lets admins create, update and delete products", async () => {
    const { agent: shopper } = await registerAgent();
    await request(app).post("/api/products").send(VALID_PRODUCT).expect(401);
    await shopper.post("/api/products").send(VALID_PRODUCT).expect(403);

    const { agent: admin } = await adminAgent();
    const created = await admin.post("/api/products").send(VALID_PRODUCT).expect(201);
    expect(created.body.product.finalPrice).toBe(40);

    const updated = await admin
      .put(`/api/products/${created.body.product.id}`)
      .send({ salePrice: 0 })
      .expect(200);
    expect(updated.body.product.finalPrice).toBe(50);

    await admin.delete(`/api/products/${created.body.product.id}`).expect(204);
  });

  it("rejects a sale price that is not lower than the price", async () => {
    const { agent: admin } = await adminAgent();
    const res = await admin
      .post("/api/products")
      .send({ ...VALID_PRODUCT, price: 20, salePrice: 25 })
      .expect(400);
    expect(res.body.error.details.salePrice).toBeDefined();

    const product = await makeProduct({ price: 50, salePrice: 0 });
    await admin.put(`/api/products/${product.id}`).send({ price: 10, salePrice: 30 }).expect(400);
  });
});
