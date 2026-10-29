import { StarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const STARS = [1, 2, 3, 4, 5];

type StarRatingProps = {
  value: number;
  count?: number;
  className?: string;
};

export function StarRating({ value, count, className }: StarRatingProps) {
  const label =
    count === 0
      ? "No reviews yet"
      : `Rated ${value.toFixed(1)} out of 5${count ? ` from ${count} reviews` : ""}`;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <span role="img" aria-label={label} className="flex">
        {STARS.map((star) => (
          <StarIcon
            key={star}
            aria-hidden
            className={cn(
              "size-4",
              star <= Math.round(value)
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/40",
            )}
          />
        ))}
      </span>
      {count !== undefined && <span className="text-xs text-muted-foreground">({count})</span>}
    </div>
  );
}

type StarRatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  id?: string;
};

export function StarRatingInput({ value, onChange, id }: StarRatingInputProps) {
  return (
    <div id={id} role="radiogroup" aria-label="Your rating" className="flex gap-1">
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          className="rounded-sm p-0.5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <StarIcon
            aria-hidden
            className={cn(
              "size-6",
              star <= value ? "fill-amber-400 text-amber-400" : "text-muted-foreground/50",
            )}
          />
        </button>
      ))}
    </div>
  );
}
