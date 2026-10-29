import { conflictError, notFoundError } from "../common/errors/app-error.js";
import { MAX_FEATURES } from "./consts/feature.consts.js";
import type { CreateFeatureDto } from "./dto/feature.dto.js";
import { FeatureModel } from "./schema/feature.schema.js";

export const listFeatures = () => FeatureModel.find().sort({ createdAt: 1 });

export async function createFeature(data: CreateFeatureDto) {
  if ((await FeatureModel.countDocuments()) >= MAX_FEATURES) {
    throw conflictError(`You can show up to ${MAX_FEATURES} banners, delete one first`);
  }
  return FeatureModel.create(data);
}

export async function deleteFeature(id: string) {
  const feature = await FeatureModel.findByIdAndDelete(id);
  if (!feature) throw notFoundError("Banner");
}
