export const PAYPAL_API_URL = {
  sandbox: "https://api-m.sandbox.paypal.com",
  live: "https://api-m.paypal.com",
} as const;

export const PAYPAL_CURRENCY = "USD";

export const TOKEN_REFRESH_MARGIN_MS = 60_000;

export const PAYPAL_TIMEOUT_MS = 15_000;
