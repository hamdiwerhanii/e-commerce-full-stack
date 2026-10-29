import type { Types } from "mongoose";

export type AddressFields = {
  address: string;
  city: string;
  pincode: string;
  phone: string;
  notes: string;
};

export type Address = AddressFields & {
  userId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};
