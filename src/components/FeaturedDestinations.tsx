"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRightIcon,
  ArrowUpRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import CarouselButtons from "@/components/CarouselButtons";

const destinations = [
  {
    id: 1,
    image: "/images/destinations/image1.png",
    location: "Nepal",
    title: "Bali Paradise",
    price: 2700,
    duration: "7 Days/6 Nights",
    rating: "4.5",
  },
  {
    id: 2,
    image: "/images/destinations/image2.png",
    location: "Indonesia",
    title: "Bali Paradise",
    price: 2700,
    duration: "7 Days/6 Nights",
    rating: "4.5",
  },
  {
    id: 3,
    image: "/images/destinations/image3.png",
    location: "Indonesia",
    title: "Bali Paradise",
    price: 2700,
    duration: "7 Days/6 Nights",
    rating: "4.5",
  },
  {
    id: 4,
    image: "/images/destinations/image4.png",
    location: "Nepal",
    title: "Bali Paradise",
    price: 2700,
    duration: "7 Days/6 Nights",
    rating: "4.5",
  },
  {
    id: 5,
    image: "/images/destinations/image5.png",
    location: "Indonesia",
    title: "Bali Paradise",
    price: 2700,
    duration: "7 Days/6 Nights",
    rating: "4.5",
  },
];

export default function FeaturedDestinations() {
  const [api, setApi] = React.useState<CarouselApi>();
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    const handleSelect = (api: CarouselApi) => {
      if (!api) return;
      setIndex(api.selectedScrollSnap());
    };

    api.on("select", handleSelect);
    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const progress = ((index + 1) / destinations.length) * 100;

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20">
      <div className="mx-auto w-full max-w-360 px-6 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
              Featured Destinations
            </h2>
            <p className="mt-3 text-sm text-neutral-500 sm:text-base">
              Handpicked travel experiences for the adventure seekers
            </p>
          </div>

          <Link
            href="/destinations"
            className="group inline-flex items-center gap-4 rounded-md border border-neutral-200 px-5 py-2.5 text-xs font-medium tracking-wider text-[#29abe2] uppercase transition-colors hover:border-[#29abe2]/50 hover:bg-[#29abe2]/5 sm:gap-5 sm:px-6 sm:py-3 sm:text-sm"
          >
            All Destinations
            <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <Carousel
          setApi={setApi}
          opts={{ align: "start", loop: false }}
          className="mt-8 sm:mt-10 lg:mt-12"
        >
          <CarouselContent>
            {destinations.map((destination) => (
              <CarouselItem
                key={destination.id}
                className="basis-[85%] md:basis-[47%]"
              >
                <article className="group flex flex-col">
                  <div className="relative aspect-3/2 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={destination.image}
                      alt={destination.title}
                      fill
                      sizes="(min-width: 768px) 47vw, 85vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1.5 rounded-md bg-white px-2.5 py-1.5 text-sm font-medium text-black shadow-sm">
                      {destination.rating}
                      <StarIcon className="size-3.5 fill-black text-black" />
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-sm text-neutral-600">
                    <MapPinIcon className="size-4 text-neutral-500" />
                    {destination.location}
                  </div>

                  <div className="mt-1.5 flex items-baseline justify-between gap-3 sm:gap-4">
                    <h3 className="min-w-0 truncate text-xl font-medium text-neutral-900 sm:text-2xl">
                      {destination.title}
                    </h3>
                    <p className="shrink-0 text-xl font-semibold text-neutral-900 sm:text-2xl">
                      ${destination.price}
                      <span className="text-xs font-normal text-neutral-400">
                        /Person
                      </span>
                    </p>
                  </div>

                  <div className="mt-3 flex items-center gap-1.5 text-sm text-neutral-500">
                    <CalendarDaysIcon className="size-4 text-neutral-500" />
                    {destination.duration}
                  </div>

                  <Link
                    href="/destinations"
                    className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-medium tracking-wider text-[#29abe2] uppercase underline underline-offset-4 transition-colors hover:text-[#2296c4]"
                  >
                    Book Now
                    <ArrowUpRightIcon className="size-3.5" />
                  </Link>
                </article>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-8 flex items-center gap-3 sm:mt-10 sm:gap-6 lg:mt-12">
            <span className="text-base font-medium text-neutral-900 tabular-nums sm:text-lg">
              {index + 1}/{destinations.length}
            </span>

            <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-neutral-200">
              <div
                className="h-full rounded-full bg-neutral-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>

            <CarouselButtons />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
