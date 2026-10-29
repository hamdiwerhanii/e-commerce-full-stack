import { CheckCircle2Icon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/Button";
import type { Address } from "@/types";

type AddressCardProps = {
  address: Address;
  selected?: boolean;
  onSelect?: (address: Address) => void;
  onEdit: (address: Address) => void;
  onDelete: (address: Address) => void;
};

export function AddressCard({ address, selected, onSelect, onEdit, onDelete }: AddressCardProps) {
  return (
    <li
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-4",
        selected && "border-primary ring-2 ring-primary",
      )}
    >
      <address className="space-y-1 text-sm not-italic">
        <p className="font-semibold">{address.address}</p>
        <p>
          {address.city}, {address.pincode}
        </p>
        <p>{address.phone}</p>
        {address.notes && <p className="text-muted-foreground">{address.notes}</p>}
      </address>
      <div className="mt-auto flex flex-wrap gap-2">
        {onSelect && (
          <Button
            size="sm"
            variant={selected ? "default" : "outline"}
            onClick={() => onSelect(address)}
            aria-pressed={selected}
          >
            {selected && <CheckCircle2Icon aria-hidden />}
            {selected ? "Delivering here" : "Deliver here"}
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(address)}
          aria-label={`Edit ${address.address}`}
        >
          Edit
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive"
          onClick={() => onDelete(address)}
          aria-label={`Delete ${address.address}`}
        >
          Delete
        </Button>
      </div>
    </li>
  );
}
