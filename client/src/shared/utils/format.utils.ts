const priceFormatter = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export const formatPrice = (value: number) => priceFormatter.format(value);

export const formatDate = (value: string | Date) => dateFormatter.format(new Date(value));

export const shortId = (id: string) => id.slice(-8).toUpperCase();
