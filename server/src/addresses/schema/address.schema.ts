import { Schema, model } from "mongoose";
import { toJSONOptions } from "../../common/utils/json.utils.js";
import type { Address } from "../types/address.types.js";

const addressSchema = new Schema<Address>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    notes: { type: String, default: "", trim: true },
  },
  { timestamps: true, toJSON: toJSONOptions(["userId", "updatedAt"]) },
);

export const AddressModel = model<Address>("Address", addressSchema);
