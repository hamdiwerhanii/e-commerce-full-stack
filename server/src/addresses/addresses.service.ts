import { conflictError, notFoundError } from "../common/errors/app-error.js";
import { MAX_ADDRESSES_PER_USER } from "./consts/address.consts.js";
import type { AddressDto } from "./dto/address.dto.js";
import { AddressModel } from "./schema/address.schema.js";

export const listAddresses = (userId: string) =>
  AddressModel.find({ userId }).sort({ createdAt: 1 });

export async function getAddress(userId: string, addressId: string) {
  const address = await AddressModel.findOne({ _id: addressId, userId });
  if (!address) throw notFoundError("Address");
  return address;
}

export async function createAddress(userId: string, data: AddressDto) {
  const count = await AddressModel.countDocuments({ userId });
  if (count >= MAX_ADDRESSES_PER_USER) {
    throw conflictError(`You can save up to ${MAX_ADDRESSES_PER_USER} addresses`);
  }
  return AddressModel.create({ ...data, userId });
}

export async function updateAddress(userId: string, addressId: string, data: AddressDto) {
  const address = await AddressModel.findOneAndUpdate({ _id: addressId, userId }, data, {
    returnDocument: "after",
    runValidators: true,
  });
  if (!address) throw notFoundError("Address");
  return address;
}

export async function deleteAddress(userId: string, addressId: string) {
  const address = await AddressModel.findOneAndDelete({ _id: addressId, userId });
  if (!address) throw notFoundError("Address");
}
