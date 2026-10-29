import { MapPinIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddressesQuery, useDeleteAddressMutation } from "@/api/addresses.api";
import { Card, CardContent } from "@/shared/components/Card";
import { EmptyState } from "@/shared/components/EmptyState";
import { Skeleton } from "@/shared/components/Skeleton";
import { MAX_ADDRESSES } from "@/shared/constants/site";
import { getErrorMessage } from "@/shared/utils/error.utils";
import type { Address } from "@/types";
import { AddressCard } from "./AddressCard";
import { AddressForm } from "./AddressForm";

type AddressBookProps = {
  selectedId?: string | null;
  onSelect?: (address: Address | null) => void;
};

export function AddressBook({ selectedId, onSelect }: AddressBookProps) {
  const { data: addresses, isLoading } = useAddressesQuery();
  const [deleteAddress] = useDeleteAddressMutation();
  const [editing, setEditing] = useState<Address | null>(null);
  const count = addresses?.length ?? 0;

  const remove = async (address: Address) => {
    try {
      await deleteAddress(address.id).unwrap();
      if (editing?.id === address.id) setEditing(null);
      if (selectedId === address.id) onSelect?.(null);
      toast.success("Address deleted");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : count === 0 ? (
          <EmptyState
            icon={MapPinIcon}
            title="No saved addresses"
            description="Add a delivery address below."
            titleAs="h3"
            className="py-4"
          />
        ) : (
          <ul aria-label="Saved addresses" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {addresses?.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                selected={selectedId === address.id}
                onSelect={onSelect}
                onEdit={setEditing}
                onDelete={remove}
              />
            ))}
          </ul>
        )}
        <AddressForm
          editing={editing}
          disabled={!editing && count >= MAX_ADDRESSES}
          onDone={() => setEditing(null)}
        />
      </CardContent>
    </Card>
  );
}
