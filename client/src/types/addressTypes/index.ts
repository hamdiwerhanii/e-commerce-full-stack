export type AddressInput = {
  address: string;
  city: string;
  pincode: string;
  phone: string;
  notes: string;
};

export type Address = AddressInput & {
  id: string;
  createdAt: string;
};

export type AddressesResponse = { addresses: Address[] };
export type AddressResponse = { address: Address };
