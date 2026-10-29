import request from "supertest";
import { seedDatabase } from "../../src/seed/seed.service.js";
import { adminAgent, app } from "../support/helpers.js";

describe("app", () => {
  it("answers health checks and sets security headers", async () => {
    const res = await request(app).get("/api/health").expect(200);
    expect(res.body).toEqual({ status: "ok" });
    expect(res.headers["x-content-type-options"]).toBe("nosniff");
  });

  it("returns JSON 404s for unknown API routes and 400 for broken JSON", async () => {
    const missing = await request(app).get("/api/nope").expect(404);
    expect(missing.body.error.message).toMatch(/not found/);

    await request(app)
      .post("/api/auth/login")
      .set("Content-Type", "application/json")
      .send("{broken")
      .expect(400);
  });

  it("seeds demo data once without duplicating it", async () => {
    const first = await seedDatabase();
    const second = await seedDatabase();
    expect(first.products).toBeGreaterThan(10);
    expect(second).toEqual({ users: 0, products: 0, features: 0 });

    const products = await request(app).get("/api/products").expect(200);
    expect(products.body.products).toHaveLength(first.products);
  });

  it("lets admins manage home banners and blocks uploads when Cloudinary is not set up", async () => {
    const { agent } = await adminAgent();
    await request(app).post("/api/features").send({ image: "/banners/banner-1.webp" }).expect(401);

    const created = await agent
      .post("/api/features")
      .send({ image: "/banners/banner-1.webp" })
      .expect(201);
    await agent.post("/api/features").send({ image: "javascript:alert(1)" }).expect(400);
    await agent.delete(`/api/features/${created.body.feature.id}`).expect(204);

    await agent
      .post("/api/uploads/images")
      .attach("image", Buffer.from("fake"), { filename: "a.png", contentType: "image/png" })
      .expect(503);
    await agent
      .post("/api/uploads/images")
      .attach("image", Buffer.from("fake"), { filename: "a.txt", contentType: "text/plain" })
      .expect(400);
  });
});
