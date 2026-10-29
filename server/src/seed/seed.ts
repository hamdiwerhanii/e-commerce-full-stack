import { env } from "../config/env.js";
import { connectDatabase, disconnectDatabase } from "../database/connect.js";
import { DEMO_USERS } from "./seed.data.js";
import { seedDatabase } from "./seed.service.js";

try {
  await connectDatabase(env.MONGODB_URI);
  const created = await seedDatabase();
  console.log(
    `Seed finished: ${created.users} users, ${created.products} products, ${created.features} banners added.`,
  );
  console.log("Existing data was kept. Demo accounts:");
  console.table(DEMO_USERS.map(({ email, password, role }) => ({ email, password, role })));
} catch (error) {
  console.error(`Seed failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  await disconnectDatabase();
}
