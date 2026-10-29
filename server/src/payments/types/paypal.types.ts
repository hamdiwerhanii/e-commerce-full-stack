export type PaypalLineItem = {
  name: string;
  sku: string;
  unitAmountCents: number;
  quantity: number;
};

export type CreatePaypalOrderInput = {
  referenceId: string;
  items: PaypalLineItem[];
  returnUrl: string;
  cancelUrl: string;
};

export type PaypalOrderCreated = {
  id: string;
  approvalUrl: string;
};

export type PaypalCaptureResult = {
  status: string;
  captureId: string | null;
  amountCents: number | null;
  currency: string | null;
};

export type PaypalLink = { href: string; rel: string };

export type PaypalTokenResponse = { access_token: string; expires_in: number };

export type PaypalCreateResponse = { id: string; links?: PaypalLink[] };

export type PaypalCaptureResponse = {
  status: string;
  purchase_units?: {
    payments?: {
      captures?: { id: string; status: string; amount: { value: string; currency_code: string } }[];
    };
  }[];
};
