import { AppError } from "../common/errors/app-error.js";
import { env, isPaypalConfigured } from "../config/env.js";
import {
  PAYPAL_API_URL,
  PAYPAL_CURRENCY,
  PAYPAL_TIMEOUT_MS,
  TOKEN_REFRESH_MARGIN_MS,
} from "./consts/paypal.consts.js";
import type {
  CreatePaypalOrderInput,
  PaypalCaptureResponse,
  PaypalCaptureResult,
  PaypalCreateResponse,
  PaypalOrderCreated,
  PaypalTokenResponse,
} from "./types/paypal.types.js";

let cachedToken: { value: string; expiresAt: number } | null = null;

const centsToString = (cents: number) => (cents / 100).toFixed(2);

const paypalUnavailable = () =>
  new AppError(502, "PayPal is not available right now, please try again in a moment");

function baseUrl() {
  if (!isPaypalConfigured()) throw new AppError(400, "PayPal payments are not configured");
  return PAYPAL_API_URL[env.PAYPAL_MODE];
}

async function paypalFetch<T>(path: string, init: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${baseUrl()}${path}`, {
      ...init,
      signal: AbortSignal.timeout(PAYPAL_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw paypalUnavailable();
  }

  if (!response.ok) {
    console.error(`PayPal ${path} failed with ${response.status}: ${await response.text()}`);
    throw paypalUnavailable();
  }
  return (await response.json()) as T;
}

async function accessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  const credentials = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString(
    "base64",
  );
  const token = await paypalFetch<PaypalTokenResponse>("/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  cachedToken = {
    value: token.access_token,
    expiresAt: Date.now() + token.expires_in * 1000 - TOKEN_REFRESH_MARGIN_MS,
  };
  return cachedToken.value;
}

async function authorizedJson<T>(path: string, body: unknown, requestId: string) {
  return paypalFetch<T>(path, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${await accessToken()}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": requestId,
    },
    body: JSON.stringify(body),
  });
}

export async function createPaypalOrder({
  referenceId,
  items,
  returnUrl,
  cancelUrl,
}: CreatePaypalOrderInput): Promise<PaypalOrderCreated> {
  const totalCents = items.reduce((sum, item) => sum + item.unitAmountCents * item.quantity, 0);
  const total = { currency_code: PAYPAL_CURRENCY, value: centsToString(totalCents) };

  const order = await authorizedJson<PaypalCreateResponse>(
    "/v2/checkout/orders",
    {
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: referenceId,
          custom_id: referenceId,
          amount: { ...total, breakdown: { item_total: total } },
          items: items.map((item) => ({
            name: item.name.slice(0, 127),
            sku: item.sku,
            quantity: String(item.quantity),
            unit_amount: {
              currency_code: PAYPAL_CURRENCY,
              value: centsToString(item.unitAmountCents),
            },
          })),
        },
      ],
      payment_source: {
        paypal: {
          experience_context: {
            return_url: returnUrl,
            cancel_url: cancelUrl,
            user_action: "PAY_NOW",
            shipping_preference: "NO_SHIPPING",
          },
        },
      },
    },
    `create-${referenceId}`,
  );

  const approvalUrl = order.links?.find(
    (link) => link.rel === "payer-action" || link.rel === "approve",
  )?.href;
  if (!approvalUrl) throw paypalUnavailable();

  return { id: order.id, approvalUrl };
}

export async function capturePaypalOrder(paypalOrderId: string): Promise<PaypalCaptureResult> {
  const result = await authorizedJson<PaypalCaptureResponse>(
    `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`,
    {},
    `capture-${paypalOrderId}`,
  );

  const capture = result.purchase_units?.[0]?.payments?.captures?.[0];
  return {
    status: capture?.status ?? result.status,
    captureId: capture?.id ?? null,
    amountCents: capture ? Math.round(Number(capture.amount.value) * 100) : null,
    currency: capture?.amount.currency_code ?? null,
  };
}

export function resetPaypalTokenCache() {
  cachedToken = null;
}
