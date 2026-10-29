import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import cookieParser from "cookie-parser";
import express from "express";
import helmet from "helmet";
import { addressesRouter } from "./addresses/addresses.routes.js";
import { authRouter } from "./auth/auth.routes.js";
import { cartRouter } from "./cart/cart.routes.js";
import { errorHandler, notFoundHandler } from "./common/middleware/error-handler.js";
import { isCloudinaryConfigured, isProduction } from "./config/env.js";
import { featuresRouter } from "./features/features.routes.js";
import { availablePaymentMethods } from "./orders/orders.service.js";
import { adminOrdersRouter, ordersRouter } from "./orders/orders.routes.js";
import { productsRouter } from "./products/products.routes.js";
import { uploadsRouter } from "./uploads/uploads.routes.js";

const CLIENT_DIST = fileURLToPath(new URL("../../client/dist", import.meta.url));

export function createApp() {
  const app = express();

  if (isProduction) app.set("trust proxy", 1);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: { "img-src": ["'self'", "data:", "https:"] },
      },
      strictTransportSecurity: isProduction,
    }),
  );
  app.use(express.json({ limit: "100kb" }));
  app.use(cookieParser());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.get("/api/config", (_req, res) => {
    res.json({ payments: availablePaymentMethods(), uploads: isCloudinaryConfigured() });
  });
  app.use("/api/auth", authRouter);
  app.use("/api/products", productsRouter);
  app.use("/api/cart", cartRouter);
  app.use("/api/addresses", addressesRouter);
  app.use("/api/orders", ordersRouter);
  app.use("/api/features", featuresRouter);
  app.use("/api/uploads", uploadsRouter);
  app.use("/api/admin/orders", adminOrdersRouter);
  app.use("/api", notFoundHandler);

  if (isProduction && existsSync(CLIENT_DIST)) {
    app.use(express.static(CLIENT_DIST, { index: false, maxAge: "1y", immutable: true }));
    app.get("/{*path}", (_req, res) => {
      res.sendFile("index.html", { root: CLIENT_DIST, maxAge: 0 });
    });
  }

  app.use(errorHandler);
  return app;
}
