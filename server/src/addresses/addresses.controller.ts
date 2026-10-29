import type { Request, Response } from "express";
import { parseInput, parseObjectId } from "../common/utils/validation.utils.js";
import * as addressesService from "./addresses.service.js";
import { addressDto } from "./dto/address.dto.js";

const userIdOf = (req: Request) => req.user!.id as string;
const addressIdOf = (req: Request) => parseObjectId(req.params.id, "address id");

export async function list(req: Request, res: Response) {
  res.json({ addresses: await addressesService.listAddresses(userIdOf(req)) });
}

export async function create(req: Request, res: Response) {
  const address = await addressesService.createAddress(
    userIdOf(req),
    parseInput(addressDto, req.body),
  );
  res.status(201).json({ address });
}

export async function update(req: Request, res: Response) {
  const address = await addressesService.updateAddress(
    userIdOf(req),
    addressIdOf(req),
    parseInput(addressDto, req.body),
  );
  res.json({ address });
}

export async function remove(req: Request, res: Response) {
  await addressesService.deleteAddress(userIdOf(req), addressIdOf(req));
  res.status(204).end();
}
