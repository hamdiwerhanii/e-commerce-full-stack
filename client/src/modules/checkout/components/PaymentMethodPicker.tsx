import { cn } from "@/lib/utils";
import { PAYMENT_METHOD_LABELS } from "@/shared/constants/orders";
import type { PaymentMethod } from "@/types";

const DESCRIPTIONS: Record<PaymentMethod, string> = {
  paypal: "You will be sent to PayPal (sandbox) to approve the payment.",
  demo: "No real money is taken. The order is paid instantly for testing.",
};

type PaymentMethodPickerProps = {
  methods: PaymentMethod[];
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
};

export function PaymentMethodPicker({ methods, value, onChange }: PaymentMethodPickerProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="mb-3 text-lg font-semibold">Payment method</legend>
      {methods.map((method) => (
        <label
          key={method}
          className={cn(
            "flex cursor-pointer gap-3 rounded-lg border p-4 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-ring",
            value === method && "border-primary bg-muted/50",
          )}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={method}
            checked={value === method}
            onChange={() => onChange(method)}
            className="mt-1 accent-primary"
          />
          <span>
            <span className="block font-medium">{PAYMENT_METHOD_LABELS[method]}</span>
            <span className="block text-sm text-muted-foreground">{DESCRIPTIONS[method]}</span>
          </span>
        </label>
      ))}
    </fieldset>
  );
}
