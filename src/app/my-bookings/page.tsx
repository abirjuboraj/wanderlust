"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDaysIcon,
  CheckCircle2Icon,
  ClockIcon,
  EyeIcon,
  TagIcon,
  Trash2Icon,
} from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { API_BASE_URL, isRemoteImage } from "@/lib/constants";
import { useSession } from "@/utils/auth-client";
import { toast } from "@/components/ui/toast";

// Backend contract:
//   GET    /booking?email=<user email> → the user's bookings (array)
//   DELETE /booking/<booking _id>      → 2xx cancelled / 404 not found

type BookingRecord = {
  _id?: string;
  bookingId?: string;
  title?: string;
  destinationName?: string;
  image?: string;
  imageUrl?: string;
  price?: number | string;
  departureDate?: string;
  destinationId?: string;
  id?: string;
  status?: string;
  bookingDate?: string;
};

const FALLBACK_IMAGE = "/images/destinations/image1.png";

const bookingTitle = (booking: BookingRecord | null): string =>
  booking?.title || booking?.destinationName || "this destination";

/** "2026-05-15" → "May 15, 2026" (built from parts so no timezone shift) */
const formatDeparture = (value?: string): string => {
  if (!value) return "—";
  const [year, month, day] = value.split("T")[0].split("-").map(Number);
  if (!year || !month || !day) return value;
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const bookingShortId = (booking: BookingRecord): string => {
  const raw = booking.bookingId || booking._id || "";
  if (!raw) return "—";
  return raw.length > 10 ? raw.slice(0, 8) : raw;
};

const bookingPrice = (booking: BookingRecord): string =>
  booking.price !== undefined && booking.price !== "" ? String(booking.price) : "—";

const destinationHref = (booking: BookingRecord): string => {
  const key = booking.destinationId || booking.id;
  return key ? `/destinations/${encodeURIComponent(key)}` : "/destinations";
};

const bookingTime = (booking: BookingRecord): number => {
  const time = Date.parse(booking.bookingDate ?? "");
  return Number.isNaN(time) ? 0 : time;
};

function BookingImage({ src, alt }: { src: string; alt: string }) {
  if (isRemoteImage(src)) {
    // External API hosts may not be configured in next.config.ts, so render
    // these directly instead of going through the image optimizer.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="(min-width: 640px) 208px, 100vw"
      className="object-cover"
    />
  );
}

export default function MyBookingsPage() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  // null = nothing loaded for this email yet (→ loading view)
  const [loaded, setLoaded] = useState<{ email: string; ok: boolean } | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [pendingCancel, setPendingCancel] = useState<BookingRecord | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!email) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/booking?email=${encodeURIComponent(email)}`
        );
        if (!res.ok) throw new Error(`GET /booking responded ${res.status}`);
        const payload: unknown = await res.json().catch(() => null);
        if (!cancelled) {
          setBookings(Array.isArray(payload) ? (payload as BookingRecord[]) : []);
          setLoaded({ email, ok: true });
        }
      } catch (error) {
        console.warn("Could not load bookings:", error);
        if (!cancelled) {
          setBookings([]);
          setLoaded({ email, ok: false });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [email, reloadKey]);

  const retryLoad = () => {
    setLoaded(null);
    setReloadKey((key) => key + 1);
  };

  const handleConfirmCancel = async () => {
    const target = pendingCancel;
    const bookingId = target?._id;
    if (!target) return;

    if (!bookingId) {
      toast.add({
        title: "Cancel Failed",
        description: "This booking has no ID and cannot be cancelled.",
        type: "error",
        timeout: 3000,
      });
      return;
    }

    setIsCancelling(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/booking/${encodeURIComponent(bookingId)}`,
        { method: "DELETE" }
      );

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(
          typeof data.message === "string" && data.message
            ? data.message
            : `Cancel failed (status ${res.status})`
        );
      }

      setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
      setPendingCancel(null);
      toast.add({
        title: "Booking Cancelled",
        description: `Your booking for ${bookingTitle(target)} has been cancelled.`,
        type: "success",
        timeout: 3000,
      });
    } catch (error) {
      toast.add({
        title: "Cancel Failed",
        description:
          error instanceof Error ? error.message : "Could not cancel the booking.",
        type: "error",
        timeout: 3000,
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const view: "signed-out" | "loading" | "error" | "ready" = !email
    ? "signed-out"
    : loaded?.email === email
      ? loaded.ok
        ? "ready"
        : "error"
      : "loading";

  const visibleBookings = [...bookings].sort(
    (a, b) => bookingTime(b) - bookingTime(a)
  );

  return (
    <div className="mx-auto w-full max-w-360 px-6 pt-8 pb-14 sm:px-10 sm:pt-12 sm:pb-20">
      <h1 className="text-3xl font-medium tracking-tight text-neutral-900 sm:text-4xl">
        My Bookings
      </h1>
      <p className="mt-2 text-sm text-neutral-500 sm:text-base">
        Manage and view your upcoming travel plans
      </p>

      {view === "signed-out" && (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-dashed border-neutral-200 py-14 text-center">
          <p className="text-base font-medium text-neutral-700">
            Sign in to view and manage your bookings.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex h-10 items-center rounded-md bg-[#29abe2] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2296c4]"
          >
            Sign In
          </Link>
        </div>
      )}

      {view === "loading" && (
        <div className="mt-8 flex flex-col gap-4 sm:gap-5">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:gap-5 sm:p-5"
            >
              <Skeleton className="h-44 w-full rounded-lg sm:h-32 sm:w-52" />
              <div className="flex flex-1 flex-col gap-3">
                <Skeleton className="h-5 w-24 rounded-full" />
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-40" />
                <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                  <Skeleton className="h-7 w-20" />
                  <div className="flex gap-2.5">
                    <Skeleton className="h-9 w-24 rounded-md" />
                    <Skeleton className="h-9 w-20 rounded-md" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "error" && (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-dashed border-neutral-200 py-14 text-center">
          <p className="text-base font-medium text-neutral-700">
            We couldn&apos;t load your bookings.
          </p>
          <p className="text-sm text-neutral-500">
            Please check that the backend is running and try again.
          </p>
          <button
            type="button"
            onClick={retryLoad}
            className="inline-flex h-10 items-center rounded-md bg-[#29abe2] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2296c4]"
          >
            Try Again
          </button>
        </div>
      )}

      {view === "ready" && visibleBookings.length === 0 && (
        <div className="mt-8 flex flex-col items-center gap-4 rounded-xl border border-dashed border-neutral-200 py-14 text-center">
          <CalendarDaysIcon className="size-8 text-neutral-400" />
          <p className="text-base font-medium text-neutral-700">
            You haven&apos;t booked any trips yet.
          </p>
          <Link
            href="/destinations"
            className="inline-flex h-10 items-center rounded-md bg-[#29abe2] px-5 text-sm font-medium text-white transition-colors hover:bg-[#2296c4]"
          >
            Explore Destinations
          </Link>
        </div>
      )}

      {view === "ready" && visibleBookings.length > 0 && (
        <div className="mt-8 flex flex-col gap-4 sm:gap-5">
          {visibleBookings.map((booking) => {
            const isPending =
              String(booking.status ?? "confirmed").toLowerCase() === "pending";
            const image = booking.image || booking.imageUrl || FALLBACK_IMAGE;
            const shortId = bookingShortId(booking);
            const fullId = booking.bookingId || booking._id || "";

            return (
              <article
                key={booking._id || fullId || bookingTitle(booking)}
                className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:gap-5 sm:p-5"
              >
                <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-lg bg-muted sm:h-32 sm:w-52">
                  <BookingImage src={image} alt={bookingTitle(booking)} />
                </div>

                <div className="flex min-w-0 flex-1 flex-col">
                  <span
                    className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                      isPending
                        ? "bg-amber-50 text-amber-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {isPending ? (
                      <ClockIcon className="size-3.5" />
                    ) : (
                      <CheckCircle2Icon className="size-3.5" />
                    )}
                    {isPending ? "Pending" : "Confirmed"}
                  </span>

                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl">
                    {bookingTitle(booking)}
                  </h2>

                  <div className="mt-2 flex flex-col gap-1.5 text-sm text-neutral-500">
                    <span className="flex items-center gap-2">
                      <CalendarDaysIcon className="size-4 shrink-0 text-neutral-400" />
                      Departure: {formatDeparture(booking.departureDate)}
                    </span>
                    <span className="flex items-center gap-2" title={fullId}>
                      <TagIcon className="size-4 shrink-0 text-neutral-400" />
                      Booking ID:{" "}
                      <span className="font-medium text-neutral-600">{shortId}</span>
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 sm:mt-auto sm:pt-4">
                    <p className="text-2xl font-bold text-[#29abe2]">
                      ${bookingPrice(booking)}
                    </p>

                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => setPendingCancel(booking)}
                        disabled={isCancelling}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md border border-red-300 bg-white px-3.5 text-sm font-medium text-red-500 transition-colors hover:border-red-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-60 sm:h-10"
                      >
                        <Trash2Icon className="size-4" />
                        Cancel
                      </button>
                      <Link
                        href={destinationHref(booking)}
                        className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#0097b2] px-4 text-sm font-medium text-white transition-colors hover:bg-[#008299] sm:h-10"
                      >
                        <EyeIcon className="size-4" />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Dialog
        open={!!pendingCancel}
        onOpenChange={(open) => {
          if (!open && !isCancelling) setPendingCancel(null);
        }}
      >
        <DialogContent className="rounded-xl bg-white p-6 shadow-xl sm:max-w-md">
          <DialogHeader className="flex flex-row items-center gap-3 text-left">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Trash2Icon className="size-5" />
            </span>
            <div className="flex flex-col gap-1.5">
              <DialogTitle className="text-lg font-semibold text-neutral-900">
                Cancel Booking
              </DialogTitle>
              <DialogDescription className="text-sm text-neutral-600">
                Are you sure you want to cancel your booking for{" "}
                <strong className="font-semibold text-neutral-900">
                  {bookingTitle(pendingCancel)}
                </strong>
                ? This action cannot be undone.
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogFooter className="-mx-4 -mb-4 flex flex-row justify-end gap-2.5 border-t border-neutral-100 bg-white p-4 sm:px-6">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  disabled={isCancelling}
                  className="h-10 rounded-md border-neutral-200 px-5 font-medium text-neutral-700 hover:bg-neutral-50"
                />
              }
            >
              Keep Booking
            </DialogClose>
            <Button
              type="button"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
              className="h-10 gap-2 rounded-md bg-red-500 px-5 font-medium text-white hover:bg-red-600 disabled:opacity-50"
            >
              <Trash2Icon className="size-4" />
              {isCancelling ? "Cancelling..." : "Yes, Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
