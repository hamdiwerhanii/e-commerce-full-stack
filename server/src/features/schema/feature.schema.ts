import { Schema, model } from "mongoose";
import { toJSONOptions } from "../../common/utils/json.utils.js";
import type { Feature } from "../types/feature.types.js";

const featureSchema = new Schema<Feature>(
  {
    image: { type: String, required: true },
  },
  { timestamps: true, toJSON: toJSONOptions(["updatedAt"]) },
);

export const FeatureModel = model<Feature>("Feature", featureSchema);
