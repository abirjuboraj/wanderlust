"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRightIcon,
  CalendarDaysIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "cn";

const API_URL = "http://localhost:5000/destinations";

const ALL = "all";

const categories = [
  "Beach",
  "Mountain",
  "City Break",
  "Adventure",
  "Cultural",
  "Wildlife",
];

const priceOptions: {
  value: string;
  label: string;
  test: (price: number) => boolean;
}[] = [
  { value: ALL, label: "Price Range", test: () => true },
  { value: "under-1000", label: "Under $1,000", test: (price) => price < 1000 },
  {
    value: "1000-2000",
    label: "$1,000 – $2,000",
    test: (price) => price >= 1000 && price < 2000,
  },
  {
    value: "2000-3000",
    label: "$2,000 – $3,000",
    test: (price) => price >= 2000 && price < 3000,
  },
  { value: "3000-plus", label: "$3,000 & Above", test: (price) => price >= 3000 },
];

const sortOptions: { value: string; label: string }[] = [
  { value: ALL, label: "Sort By" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Rating: High to Low" },
  { value: "name-asc", label: "Name: A – Z" },
];

type Destination = {
  id: string;
  title: string;
  location: string;
  price: number;
  duration: string;
  rating: string;
  image: string;
  category: string;
};

type RawDestination = {
  id?: string | number;
  _id?: string | number;
  title?: string;
  name?: string;
  destinationName?: string;
  location?: string;
  country?: string;
  price?: number | string;
  priceUSD?: number | string;
  duration?: string;
  rating?: number | string;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  category?: string;
};

const localImages = [1, 2, 3, 4, 5, 6].map(
  (number) => `/images/destinations/image${number}.png`
);

/** Mirrors the design while the API is unavailable. */
const seedDestinations: Destination[] = localImages.map((image, index) => ({
  id: `seed-${index + 1}`,
  title: "Bali Paradise",
  location: "Nepal",
  price: 2700,
  duration: "7 Days/6 Nights",
  rating: "4.5",
  image,
  category: categories[index % categories.length],
}));

function normalizeDestination(raw: RawDestination, index: number): Destination {
  const price = Number(raw.price ?? raw.priceUSD ?? 0);

  return {
    id: String(raw.id ?? raw._id ?? index + 1),
    title: String(raw.title ?? raw.name ?? raw.destinationName ?? "Untitled Destination"),
    location: String(raw.location ?? raw.country ?? "Unknown"),
    price: Number.isFinite(price) ? price : 0,
    duration: String(raw.duration ?? ""),
    rating: String(raw.rating ?? "4.5"),
    image:
      raw.image ??
      raw.imageUrl ??
      raw.thumbnail ??
      localImages[index % localImages.length],
    category: String(raw.category ?? categories[index % categories.length]),
  };
}

function DestinationImage({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes: string;
}) {
  const classNames =
    "absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105";

  if (/^https?:\/\//.test(src)) {
    // External API hosts may not be configured in next.config.ts, so render
    // these directly instead of going through the image optimizer.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} loading="lazy" className={classNames} />
    );
  }

  return <Image src={src} alt={alt} fill sizes={sizes} className={classNames} />;
}

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>(seedDestinations);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadDestinations = async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

        const data: unknown = await res.json();
        const list = Array.isArray(data)
          ? data
          : Array.isArray((data as { destinations?: unknown[] })?.destinations)
            ? (data as { destinations: unknown[] }).destinations
            : [];

        const normalized = list.map((item, index) =>
          normalizeDestination(item as RawDestination, index)
        );

        if (!cancelled && normalized.length > 0) {
          console.log("destinations:", normalized);
          setDestinations(normalized);
        }
      } catch {
        // Backend not reachable (or CORS blocked) — keep the seed data so the
        // page still renders exactly like the design.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDestinations();

    return () => {
      cancelled = true;
    };
  }, []);

  const visibleDestinations = useMemo(() => {
    let list = [...destinations];

    if (category && category !== ALL) {
      list = list.filter((destination) => destination.category === category);
    }

    if (priceRange && priceRange !== ALL) {
      const option = priceOptions.find((item) => item.value === priceRange);
      if (option) list = list.filter((item) => option.test(item.price));
    }

    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        list.sort((a, b) => Number(b.rating) - Number(a.rating));
        break;
      case "name-asc":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return list;
  }, [destinations, category, priceRange, sortBy]);

  const selectedPriceLabel =
    priceOptions.find((item) => item.value === (priceRange ?? ALL))?.label ??
    "Price Range";
  const selectedSortLabel =
    sortOptions.find((item) => item.value === (sortBy ?? ALL))?.label ?? "Sort By";

  const resetFilters = () => {
    setCategory(null);
    setPriceRange(null);
    setSortBy(null);
  };

  const triggerClassName =
    "h-10 w-full justify-between rounded-md border-neutral-200 bg-white px-3.5 text-sm shadow-none transition-colors hover:border-neutral-300 focus-visible:border-[#29abe2]/60 focus-visible:ring-[#29abe2]/25 sm:h-11";

  const filterLabelClassName =
    "truncate text-xs font-medium tracking-wider text-neutral-400 uppercase sm:text-[13px]";
  const valueLabelClassName =
    "truncate text-sm font-medium text-neutral-800";

  return (
    <div className="mx-auto w-full max-w-360 px-6 pt-8 pb-14 sm:px-10 sm:pt-12 sm:pb-20">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
        Explore All Destinations
      </h1>
      <p className="mt-3 text-sm text-neutral-500 sm:text-base">
        Find your perfect travel experience from our curated collection
      </p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-3 sm:gap-4">
        <Select value={category} onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className={triggerClassName}>
            <span
              className={cn(
                category && category !== ALL
                  ? valueLabelClassName
                  : filterLabelClassName
              )}
            >
              {category && category !== ALL ? category : "Category"}
            </span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Categories</SelectItem>
            {categories.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={(value) => setPriceRange(value)}>
          <SelectTrigger className={triggerClassName}>
            <span
              className={cn(
                priceRange && priceRange !== ALL
                  ? valueLabelClassName
                  : filterLabelClassName
              )}
            >
              {selectedPriceLabel}
            </span>
          </SelectTrigger>
          <SelectContent>
            {priceOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger className={triggerClassName}>
            <span
              className={cn(
                sortBy && sortBy !== ALL ? valueLabelClassName : filterLabelClassName
              )}
            >
              {selectedSortLabel}
            </span>
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <p className="mt-5 text-[13px] text-neutral-500 sm:text-sm">
        Showing {visibleDestinations.length} destination
        {visibleDestinations.length === 1 ? "" : "s"}
      </p>

      {loading ? (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:mt-7 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="flex flex-col">
              <Skeleton className="aspect-3/2 w-full rounded-lg" />
              <Skeleton className="mt-4 h-4 w-24" />
              <Skeleton className="mt-2 h-6 w-40" />
              <Skeleton className="mt-3 h-4 w-32" />
              <Skeleton className="mt-4 h-4 w-24" />
            </div>
          ))}
        </div>
      ) : visibleDestinations.length === 0 ? (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-lg border border-dashed border-neutral-200 py-14 text-center">
          <p className="text-base font-medium text-neutral-700">
            No destinations match your filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="text-sm font-medium text-[#29abe2] underline underline-offset-4 transition-colors hover:text-[#2296c4]"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 sm:mt-7 sm:grid-cols-2 md:grid-cols-3">
          {visibleDestinations.map((destination) => (
            <article key={destination.id} className="group flex flex-col">
              <div className="relative aspect-3/2 overflow-hidden rounded-lg bg-muted">
                <DestinationImage
                  src={destination.image}
                  alt={destination.title}
                  sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
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
                <h2 className="min-w-0 truncate text-xl font-medium text-neutral-900 sm:text-2xl">
                  {destination.title}
                </h2>
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
                href={`/destinations/${destination.id}`}
                className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-semibold tracking-wider text-[#29abe2] uppercase underline underline-offset-4 transition-colors hover:text-[#2296c4]"
              >
                Book Now
                <ArrowUpRightIcon className="size-3.5" />
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
