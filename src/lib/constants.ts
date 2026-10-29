export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const CATEGORIES = [
  "Beach",
  "Mountain",
  "City Break",
  "Adventure",
  "Cultural",
  "Wildlife",
] as const;

export type Category = (typeof CATEGORIES)[number];

export type TravelPackageData = {
  id?: string;
  _id?: string;
  destinationName?: string;
  country?: string;
  category?: string;
  price?: number | string;
  duration?: string;
  departureDate?: string;
  imageUrl?: string;
  description?: string;
};

export type Destination = {
  id: string;
  _id?: string;
  title: string;
  location: string;
  price: number;
  duration: string;
  departureDate?: string;
  rating: string;
  reviews?: number;
  image: string;
  category?: string;
  overview?: string;
  highlights?: string[];
};

export type RawDestination = {
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
  departureDate?: string;
  rating?: number | string;
  reviews?: number | string;
  image?: string;
  imageUrl?: string;
  thumbnail?: string;
  category?: string;
  overview?: string;
  description?: string;
  highlights?: string[];
};

export function isRemoteImage(src: string): boolean {
  return /^https?:\/\//.test(src);
}

export function normalizeDestination(
  raw: RawDestination,
  fallbackIndex = 0
): Destination {
  const price = Number(raw.price ?? raw.priceUSD ?? 0);
  const reviews = Number(raw.reviews ?? 0);
  const image =
    raw.image ??
    raw.imageUrl ??
    raw.thumbnail ??
    `/images/destinations/image${(fallbackIndex % 6) + 1}.png`;

  return {
    id: String(raw._id ?? raw.id ?? `dest-${fallbackIndex + 1}`),
    _id: raw._id ? String(raw._id) : undefined,
    title: String(raw.title ?? raw.name ?? raw.destinationName ?? "Untitled Destination"),
    location: String(raw.location ?? raw.country ?? "Unknown"),
    price: Number.isFinite(price) ? price : 0,
    duration: String(raw.duration ?? "7 Days/6 Nights"),
    departureDate: raw.departureDate,
    rating: String(raw.rating ?? "4.8"),
    reviews: Number.isFinite(reviews) ? reviews : 120,
    image,
    category: raw.category ?? "Beach",
    overview: String(raw.overview ?? raw.description ?? ""),
    highlights: Array.isArray(raw.highlights) ? raw.highlights : [],
  };
}
