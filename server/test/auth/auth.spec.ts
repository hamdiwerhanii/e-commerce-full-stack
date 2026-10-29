import request from "supertest";
import { app, registerAgent } from "../support/helpers.js";

describe("auth", () => {
  it("registers a user, sets an httpOnly cookie and never returns the password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ userName: "jane_doe", email: "Jane@Example.com", password: "Password123" })
      .expect(201);

    expect(res.body.user).toMatchObject({
      userName: "jane_doe",
      email: "jane@example.com",
      role: "user",
    });
    expect(res.body.user.passwordHash).toBeUndefined();
    expect(res.headers["set-cookie"]?.[0]).toMatch(/token=.+HttpOnly/);
  });

  it("rejects weak passwords and invalid emails with field errors", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ userName: "x", email: "not-an-email", password: "short" })
      .expect(400);

    expect(Object.keys(res.body.error.details)).toEqual(
      expect.arrayContaining(["userName", "email", "password"]),
    );
  });

  it("refuses a duplicate email", async () => {
    await registerAgent({ email: "taken@example.com" });
    const res = await request(app)
      .post("/api/auth/register")
      .send({ userName: "another", email: "taken@example.com", password: "Password123" })
      .expect(409);
    expect(res.body.error.details.email).toBeDefined();
  });

  it("logs in, returns the current user and logs out", async () => {
    const { user } = await registerAgent({ email: "login@example.com" });
    const agent = request.agent(app);

    await agent
      .post("/api/auth/login")
      .send({ email: "login@example.com", password: "wrong-password1" })
      .expect(401);
    await agent
      .post("/api/auth/login")
      .send({ email: "login@example.com", password: "Password123" })
      .expect(200);

    const me = await agent.get("/api/auth/me").expect(200);
    expect(me.body.user.id).toBe(user.id);

    await agent.post("/api/auth/logout").expect(204);
    await agent.get("/api/auth/me").expect(401);
  });

  it("rejects a forged token", async () => {
    await request(app).get("/api/auth/me").set("Cookie", "token=forged.token.value").expect(401);
  });
});
