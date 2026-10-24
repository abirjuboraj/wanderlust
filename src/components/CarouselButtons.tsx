"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCarousel } from "@/components/ui/carousel";

export default function CarouselButtons() {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  const buttonClassName =
    "size-10 rounded-full border-border bg-white text-neutral-500 shadow-none hover:bg-neutral-50 hover:text-neutral-800 sm:size-11";

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <Button
        variant="outline"
        size="icon"
        aria-label="Previous slide"
        className={buttonClassName}
        disabled={!canScrollPrev}
        onClick={scrollPrev}
      >
        <ArrowLeftIcon />
      </Button>
      <Button
        variant="outline"
        size="icon"
        aria-label="Next slide"
        className={buttonClassName}
        disabled={!canScrollNext}
        onClick={scrollNext}
      >
        <ArrowRightIcon />
      </Button>
    </div>
  );
}
