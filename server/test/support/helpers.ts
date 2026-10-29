import request from "supertest";
import { createApp } from "../../src/app.js";
import { createProduct } from "../../src/products/products.service.js";
import type { CreateProductDto } from "../../src/products/dto/product.dto.js";
import { UserModel } from "../../src/users/schema/user.schema.js";
import { Role } from "../../src/users/enums/role.enum.js";

export const app = createApp();

let counter = 0;

export async function registerAgent(overrides: Record<string, string> = {}) {
  counter += 1;
  const agent = request.agent(app);
  const credentials = {
    userName: `user_${counter}`,
    email: `user${counter}@example.com`,
    password: "Password123",
    ...overrides,
  };
  const res = await agent.post("/api/auth/register").send(credentials).expect(201);
  return { agent, user: res.body.user as { id: string; userName: string; email: string } };
}

export async function adminAgent() {
  const session = await registerAgent();
  await UserModel.updateOne({ _id: session.user.id }, { role: Role.Admin });
  return session;
}

export const VALID_PRODUCT: CreateProductDto = {
  title: "Test Hoodie",
  description: "A warm hoodie used by the automated tests.",
  category: "men",
  brand: "nike",
  image: "https://images.example.com/hoodie.jpg",
  price: 50,
  salePrice: 40,
  totalStock: 5,
};

export const makeProduct = (overrides: Partial<CreateProductDto> = {}) =>
  createProduct({ ...VALID_PRODUCT, ...overrides });

export const VALID_ADDRESS = {
  address: "12 Avenue Habib Bourguiba",
  city: "Tunis",
  pincode: "1000",
  phone: "+216 20 123 456",
  notes: "Ring twice",
};
