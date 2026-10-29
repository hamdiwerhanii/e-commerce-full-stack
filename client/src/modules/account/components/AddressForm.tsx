import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateAddressMutation, useUpdateAddressMutation } from "@/api/addresses.api";
import { useServerErrors } from "@/modules/auth/hooks/useServerErrors";
import { Button } from "@/shared/components/Button";
import { fieldAria, FormField } from "@/shared/components/FormField";
import { Input, Textarea } from "@/shared/components/Input";
import type { Address, AddressInput } from "@/types";
import { addressSchema } from "../schemas/addressSchema";

const EMPTY: AddressInput = { address: "", city: "", pincode: "", phone: "", notes: "" };

type AddressFormProps = {
  editing: Address | null;
  disabled?: boolean;
  onDone: () => void;
};

export function AddressForm({ editing, disabled, onDone }: AddressFormProps) {
  const [createAddress, createState] = useCreateAddressMutation();
  const [updateAddress, updateState] = useUpdateAddressMutation();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<AddressInput>({ resolver: zodResolver(addressSchema), defaultValues: EMPTY });
  const onServerError = useServerErrors(setError);
  const saving = createState.isLoading || updateState.isLoading;

  useEffect(() => {
    if (editing) {
      const { address, city, pincode, phone, notes } = editing;
      reset({ address, city, pincode, phone, notes });
    } else {
      reset(EMPTY);
    }
  }, [editing, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (editing) await updateAddress({ id: editing.id, data }).unwrap();
      else await createAddress(data).unwrap();
      toast.success(editing ? "Address updated" : "Address saved");
      reset(EMPTY);
      onDone();
    } catch (error) {
      onServerError(error);
    }
  });

  const field = (name: keyof AddressInput) => ({
    ...fieldAria(`address-${name}`, errors[name]?.message),
    ...register(name),
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <h3 className="text-lg font-semibold">{editing ? "Edit address" : "Add a new address"}</h3>
      <fieldset disabled={disabled || saving} className="grid gap-4 disabled:opacity-60">
        <FormField id="address-address" label="Address" error={errors.address?.message}>
          <Input autoComplete="street-address" {...field("address")} />
        </FormField>
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="address-city" label="City" error={errors.city?.message}>
            <Input autoComplete="address-level2" {...field("city")} />
          </FormField>
          <FormField id="address-pincode" label="Postal code" error={errors.pincode?.message}>
            <Input autoComplete="postal-code" {...field("pincode")} />
          </FormField>
        </div>
        <FormField id="address-phone" label="Phone" error={errors.phone?.message}>
          <Input type="tel" autoComplete="tel" {...field("phone")} />
        </FormField>
        <FormField id="address-notes" label="Notes (optional)" error={errors.notes?.message}>
          <Textarea rows={2} {...field("notes")} />
        </FormField>
        <div className="flex gap-2">
          <Button type="submit">
            {saving ? "Saving..." : editing ? "Save changes" : "Add address"}
          </Button>
          {editing && (
            <Button type="button" variant="outline" onClick={onDone}>
              Cancel
            </Button>
          )}
        </div>
      </fieldset>
      {disabled && !editing && (
        <p className="text-sm text-muted-foreground">
          You can save up to 3 addresses. Delete one to add another.
        </p>
      )}
    </form>
  );
}
