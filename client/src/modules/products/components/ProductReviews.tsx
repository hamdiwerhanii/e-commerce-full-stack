import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "sonner";
import { useAddReviewMutation, useReviewsQuery } from "@/api/reviews.api";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import { Button } from "@/shared/components/Button";
import { fieldAria, FormField } from "@/shared/components/FormField";
import { Textarea } from "@/shared/components/Input";
import { Skeleton } from "@/shared/components/Skeleton";
import { StarRating, StarRatingInput } from "@/shared/components/StarRating";
import { getErrorMessage } from "@/shared/utils/error.utils";
import { formatDate } from "@/shared/utils/format.utils";
import type { ReviewInput } from "@/types";
import { reviewSchema } from "../schemas/reviewSchema";

export function ProductReviews({ productId }: { productId: string }) {
  const { isAuthenticated } = useAuth();
  const { data: reviews, isLoading } = useReviewsQuery(productId);
  const [addReview, { isLoading: isSaving }] = useAddReviewMutation();
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { reviewValue: 0, reviewMessage: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await addReview({ productId, data }).unwrap();
      toast.success("Thanks for your review!");
      reset();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  });

  return (
    <section aria-labelledby="reviews-title" className="space-y-4">
      <h3 id="reviews-title" className="text-lg font-bold">
        Reviews
      </h3>
      {isLoading ? (
        <Skeleton className="h-16 w-full" />
      ) : reviews?.length ? (
        <ul className="max-h-60 space-y-4 overflow-y-auto pr-2">
          {reviews.map((review) => (
            <li key={review.id} className="flex gap-3">
              <span
                aria-hidden
                className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold uppercase"
              >
                {review.userName[0]}
              </span>
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  {review.userName}{" "}
                  <span className="font-normal text-muted-foreground">
                    · {formatDate(review.createdAt)}
                  </span>
                </p>
                <StarRating value={review.reviewValue} />
                <p className="text-sm text-muted-foreground">{review.reviewMessage}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">
          No reviews yet. Bought this item? Be the first to review it.
        </p>
      )}

      {isAuthenticated ? (
        <form onSubmit={onSubmit} noValidate className="grid gap-3 border-t pt-4">
          <FormField id="review-rating" label="Your rating" error={errors.reviewValue?.message}>
            <Controller
              control={control}
              name="reviewValue"
              render={({ field }) => (
                <StarRatingInput id="review-rating" value={field.value} onChange={field.onChange} />
              )}
            />
          </FormField>
          <FormField id="review-message" label="Your review" error={errors.reviewMessage?.message}>
            <Textarea
              rows={3}
              placeholder="What did you think about this product?"
              {...fieldAria("review-message", errors.reviewMessage?.message)}
              {...register("reviewMessage")}
            />
          </FormField>
          <Button type="submit" disabled={isSaving} className="justify-self-start">
            {isSaving ? "Sending..." : "Submit review"}
          </Button>
        </form>
      ) : (
        <p className="border-t pt-4 text-sm">
          <Link to="/auth/login" className="font-medium underline underline-offset-4">
            Sign in
          </Link>{" "}
          to review products you bought.
        </p>
      )}
    </section>
  );
}
