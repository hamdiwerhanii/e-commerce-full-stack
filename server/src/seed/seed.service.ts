import bcrypt from "bcryptjs";
import { BCRYPT_ROUNDS } from "../auth/consts/auth.consts.js";
import { FeatureModel } from "../features/schema/feature.schema.js";
import { ProductModel } from "../products/schema/product.schema.js";
import { UserModel } from "../users/schema/user.schema.js";
import { DEMO_FEATURES, DEMO_PRODUCTS, DEMO_USERS } from "./seed.data.js";

const finalPriceOf = (price: number, salePrice: number) => (salePrice > 0 ? salePrice : price);

export async function seedDatabase() {
  const created = { users: 0, products: 0, features: 0 };

  for (const { password, ...user } of DEMO_USERS) {
    if (await UserModel.exists({ email: user.email })) continue;
    await UserModel.create({ ...user, passwordHash: await bcrypt.hash(password, BCRYPT_ROUNDS) });
    created.users += 1;
  }

  if ((await ProductModel.countDocuments()) === 0) {
    await ProductModel.insertMany(
      DEMO_PRODUCTS.map((product) => ({
        ...product,
        finalPrice: finalPriceOf(product.price, product.salePrice),
      })),
    );
    created.products = DEMO_PRODUCTS.length;
  }

  if ((await FeatureModel.countDocuments()) === 0) {
    await FeatureModel.insertMany(DEMO_FEATURES.map((image) => ({ image })));
    created.features = DEMO_FEATURES.length;
  }

  return created;
}
