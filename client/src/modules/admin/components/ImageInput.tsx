import { ImageUpIcon, XIcon } from "lucide-react";
import { useRef, type ChangeEvent } from "react";
import { toast } from "sonner";
import { useAppConfigQuery } from "@/api/config.api";
import { useUploadImageMutation } from "@/api/features.api";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { getErrorMessage } from "@/shared/utils/error.utils";

type ImageInputProps = {
  id: string;
  value: string;
  onChange: (url: string) => void;
  invalid?: boolean;
  describedBy?: string;
};

export function ImageInput({ id, value, onChange, invalid, describedBy }: ImageInputProps) {
  const { data: config } = useAppConfigQuery();
  const [uploadImage, { isLoading }] = useUploadImageMutation();
  const fileRef = useRef<HTMLInputElement>(null);

  const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const { url } = await uploadImage(file).unwrap();
      onChange(url);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="grid gap-3">
      {value && (
        <div className="relative">
          <img src={value} alt="Selected" className="h-40 w-full rounded-md border object-cover" />
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 size-8"
            onClick={() => onChange("")}
            aria-label="Remove image"
          >
            <XIcon />
          </Button>
        </div>
      )}
      {config?.uploads && (
        <>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            hidden
            onChange={onFile}
          />
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() => fileRef.current?.click()}
          >
            <ImageUpIcon aria-hidden />
            {isLoading ? "Uploading..." : "Upload an image (max 2 MB)"}
          </Button>
        </>
      )}
      <Input
        id={id}
        type="url"
        placeholder="https://... or /banners/banner-1.webp"
        value={value}
        onChange={(event) => onChange(event.target.value.trim())}
        aria-invalid={invalid || undefined}
        aria-describedby={describedBy}
      />
      {!config?.uploads && (
        <p className="text-xs text-muted-foreground">
          Uploads need Cloudinary keys in server/.env. You can paste an image URL instead.
        </p>
      )}
    </div>
  );
}
