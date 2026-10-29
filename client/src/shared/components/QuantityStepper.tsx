import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "./Button";

type QuantityStepperProps = {
  value: number;
  max: number;
  label: string;
  disabled?: boolean;
  onChange: (value: number) => void;
};

export function QuantityStepper({ value, max, label, disabled, onChange }: QuantityStepperProps) {
  return (
    <div role="group" aria-label={`Quantity for ${label}`} className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        aria-label="Decrease quantity"
      >
        <MinusIcon />
      </Button>
      <span aria-live="polite" className="w-6 text-center font-semibold">
        {value}
      </span>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="size-8"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        aria-label="Increase quantity"
      >
        <PlusIcon />
      </Button>
    </div>
  );
}
