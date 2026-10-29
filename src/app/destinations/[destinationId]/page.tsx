import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftIcon,
  CheckIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
} from "lucide-react";
import EditDestinationDialog from "@/components/EditDestinationDialog";
import DeleteDestinationDialog from "@/components/DeleteDestinationDialog";


import {
  API_BASE_URL,
  isRemoteImage,
  normalizeDestination,
  type Destination,
  type RawDestination,
} from "@/lib/constants";
import BookingCard from "@/components/booking/BookingCard";
import { getTokenFromServer } from "@/utils/getTokenFromServer";

const API_URL = `${API_BASE_URL}/destinations`;

/** Mirrors the design while the API is unavailable. */
const seedDestination: Destination = {
  id: "bali-paradise",
  title: "Bali Paradise",
  location: "Indonesia",
  price: 1299,
  duration: "7 Days / 6 Nights",
  departureDate: "2026-05-15",
  rating: "4.9",
  reviews: 234,
  image: "/images/destinations/image1.png",
  overview:
    "Experience the magic of Bali with its stunning rice terraces, ancient temples, and pristine beaches. This carefully crafted itinerary takes you through the heart of Indonesian culture, from the artistic hub of Ubud to the vibrant shores of Seminyak. Enjoy luxurious accommodations, authentic local cuisine, and unforgettable sunsets over the Indian Ocean.",
  highlights: [
    "Visit the iconic Tanah Lot Temple",
    "Explore the Tegallalang Rice Terraces in Ubud",
    "Traditional Balinese cooking class",
    "Sunset cruise along the southern coast",
    "Relax on the pristine beaches of Seminyak",
  ],
};

function DestinationImage({ src, alt }: { src: string; alt: string }) {
  if (isRemoteImage(src)) {
    // External API hosts may not be configured in next.config.ts, so render
    // these directly instead of going through the image optimizer.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full rounded-xl object-cover"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 1280px) 1280px, 100vw"
      className="rounded-xl object-cover"
    />
  );
}

export default async function DestinationDetailPage({
  params,
}: PageProps<"/destinations/[destinationId]">) {
  const { destinationId } = await params;

  let destination = seedDestination;

 const token = await getTokenFromServer();


  try {
    const res = await fetch(`${API_URL}/${destinationId}`, { cache: "no-store",
      headers: {
        "authorization": `Bearer ${token}`,
      }
     });
    if (res.ok) destination = normalizeDestination((await res.json()) as RawDestination);
  } catch {
    // Backend not reachable (or CORS blocked) — keep the seed data so the
    // page still renders exactly like the design.
  }

  const { title, location, price, duration, rating, image, overview, highlights } =
    destination;

  return (
    <div className="mx-auto w-full max-w-360 px-6 pt-8 pb-14 sm:px-10 sm:pt-12 sm:pb-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <ArrowLeftIcon className="size-4" />
          Back to Destinations
        </Link>

        <div className="flex items-center gap-3">
          <EditDestinationDialog
            initialData={{
              id: destinationId,
              _id: destinationId,
              destinationName: title,
              country: location,
              price,
              duration,
              imageUrl: isRemoteImage(image) ? image : "",
              description: overview,
            }}
          />
          <DeleteDestinationDialog
            destinationId={destinationId}
            destinationTitle={title}
          />
        </div>
      </div>

      <div className="relative mt-6 aspect-12/5 w-full overflow-hidden rounded-xl bg-muted sm:mt-8">
        <DestinationImage src={image} alt={title} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 sm:mt-10 lg:grid-cols-[1fr_320px] lg:gap-12">
        <div>
          <p className="flex items-center gap-1.5 text-sm text-neutral-500 sm:text-base">
            <MapPinIcon className="size-4" />
            {location}
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
            {title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-600 sm:text-base">
            <span className="inline-flex items-center gap-1.5">
              <StarIcon className="size-4 fill-neutral-900 text-neutral-900" />
              {rating}
            </span>
            <span className="h-4 w-px bg-neutral-300" />
            <span className="inline-flex items-center gap-1.5">
              <ClockIcon className="size-4 text-neutral-500" />
              {duration}
            </span>
          </div>

          <section className="mt-8 sm:mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
              Overview
            </h2>
            <p className="mt-3 text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
              {overview}
            </p>
          </section>

          <section className="mt-8 sm:mt-10">
            <h2 className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
              Highlights
            </h2>
            <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {(highlights ?? []).map((highlight) => (
                <li key={highlight} className="flex items-start gap-2.5">
                  <CheckIcon className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                  <span className="text-sm leading-6 text-neutral-700 sm:text-base">
                    {highlight}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>

              <BookingCard destination = {destination}></BookingCard>
        
      </div>
    </div>
  );
}
