import type { Request, Response } from "express";
import { parseInput, parseObjectId } from "../common/utils/validation.utils.js";
import { createFeatureDto } from "./dto/feature.dto.js";
import * as featuresService from "./features.service.js";

export async function list(_req: Request, res: Response) {
  res.json({ features: await featuresService.listFeatures() });
}

export async function create(req: Request, res: Response) {
  const feature = await featuresService.createFeature(parseInput(createFeatureDto, req.body));
  res.status(201).json({ feature });
}

export async function remove(req: Request, res: Response) {
  await featuresService.deleteFeature(parseObjectId(req.params.id, "banner id"));
  res.status(204).end();
}
