import { registerAgent, VALID_ADDRESS } from "../support/helpers.js";

describe("addresses", () => {
  it("creates, lists, updates and deletes the user's addresses", async () => {
    const { agent } = await registerAgent();

    const created = await agent.post("/api/addresses").send(VALID_ADDRESS).expect(201);
    const id = created.body.address.id;
    expect(created.body.address.userId).toBeUndefined();

    const updated = await agent
      .put(`/api/addresses/${id}`)
      .send({ ...VALID_ADDRESS, city: "Sfax" })
      .expect(200);
    expect(updated.body.address.city).toBe("Sfax");

    const list = await agent.get("/api/addresses").expect(200);
    expect(list.body.addresses).toHaveLength(1);

    await agent.delete(`/api/addresses/${id}`).expect(204);
  });

  it("validates fields and limits each user to 3 addresses", async () => {
    const { agent } = await registerAgent();
    const invalid = await agent
      .post("/api/addresses")
      .send({ ...VALID_ADDRESS, phone: "abc" })
      .expect(400);
    expect(invalid.body.error.details.phone).toBeDefined();

    for (let i = 0; i < 3; i += 1)
      await agent.post("/api/addresses").send(VALID_ADDRESS).expect(201);
    await agent.post("/api/addresses").send(VALID_ADDRESS).expect(409);
  });

  it("does not let one user edit or delete another user's address", async () => {
    const { agent: owner } = await registerAgent();
    const { agent: intruder } = await registerAgent();
    const created = await owner.post("/api/addresses").send(VALID_ADDRESS).expect(201);
    const id = created.body.address.id;

    await intruder.put(`/api/addresses/${id}`).send(VALID_ADDRESS).expect(404);
    await intruder.delete(`/api/addresses/${id}`).expect(404);
  });
});
