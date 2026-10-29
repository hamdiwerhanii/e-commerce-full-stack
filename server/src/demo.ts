import { randomBytes } from "node:crypto";

process.env.JWT_SECRET ??= randomBytes(32).toString("hex");

const { MongoMemoryServer } = await import("mongodb-memory-server");
const { DEMO_USERS } = await import("./seed/seed.data.js");
const { seedDatabase } = await import("./seed/seed.service.js");
const { startServer } = await import("./bootstrap.js");

const memoryServer = await MongoMemoryServer.create();

await startServer({
  mongoUri: memoryServer.getUri("e-commerce-demo"),
  onShutdown: () => memoryServer.stop(),
});
await seedDatabase();

console.log("Demo mode: in-memory database seeded. Data is lost when the server stops.");
console.table(DEMO_USERS.map(({ email, password, role }) => ({ email, password, role })));
