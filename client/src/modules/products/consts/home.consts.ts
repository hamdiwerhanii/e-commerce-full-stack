import {
  BabyIcon,
  FootprintsIcon,
  ShirtIcon,
  SparklesIcon,
  WatchIcon,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types";

export const CATEGORY_ICONS: Record<Category, LucideIcon> = {
  men: ShirtIcon,
  women: SparklesIcon,
  kids: BabyIcon,
  accessories: WatchIcon,
  footwear: FootprintsIcon,
};

export const FEATURED_COUNT = 8;
