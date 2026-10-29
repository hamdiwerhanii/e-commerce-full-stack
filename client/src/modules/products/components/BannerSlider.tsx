import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/shared/components/Button";
import { BANNER_INTERVAL_MS } from "@/shared/constants/site";

type BannerSliderProps = {
  images: string[];
};

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function BannerSlider({ images: sources }: BannerSliderProps) {
  const images = [...new Set(sources)];
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = images.length;
  const active = count ? current % count : 0;

  useEffect(() => {
    if (count < 2 || paused || prefersReducedMotion()) return;
    const timer = window.setInterval(
      () => setCurrent((index) => (index + 1) % count),
      BANNER_INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [count, paused]);

  if (!count) return null;

  const go = (step: number) => setCurrent((active + step + count) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative h-[220px] w-full overflow-hidden sm:h-[360px] lg:h-[560px]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {images.map((image, index) => (
        <img
          key={image}
          src={image}
          alt={index === active ? `Featured collection ${index + 1} of ${count}` : ""}
          aria-hidden={index !== active}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000",
            index === active ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
      {count > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            onClick={() => go(-1)}
            aria-label="Previous slide"
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80"
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => go(1)}
            aria-label="Next slide"
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80"
          >
            <ChevronRightIcon />
          </Button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setCurrent(index)}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={index === active}
                className={cn(
                  "size-3 rounded-full border border-white transition-colors",
                  index === active ? "bg-white" : "bg-white/40",
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
