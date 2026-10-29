export const escapeRegex = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const roundMoney = (value: number) => Math.round(value * 100) / 100;

export const toMoneyString = (value: number) => roundMoney(value).toFixed(2);
