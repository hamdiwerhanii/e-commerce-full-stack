import { startServer } from "./bootstrap.js";

try {
  await startServer();
} catch (error) {
  console.error(
    `Could not start the API: ${error instanceof Error ? error.message : String(error)}`,
  );
  console.error(
    "Is MongoDB running? Tip: use `npm run dev:demo` to start with an in-memory database.",
  );
  process.exit(1);
}
