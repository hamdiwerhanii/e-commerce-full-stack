export type FieldErrors = Record<string, string[] | undefined>;

export type ApiErrorBody = {
  error?: { message?: string; details?: FieldErrors };
};

export type AppConfig = {
  payments: { paypal: boolean; demo: boolean };
  uploads: boolean;
};

export type UploadResponse = { url: string };
