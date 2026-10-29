import { z } from "zod";

export const createFeatureDto = z.object({
  image: z.union(
    [z.url({ protocol: /^https?$/ }), z.string().regex(/^\/[\w./-]+\.(webp|png|jpe?g|avif)$/i)],
    "Upload an image or paste an image URL",
  ),
});

export type CreateFeatureDto = z.infer<typeof createFeatureDto>;
