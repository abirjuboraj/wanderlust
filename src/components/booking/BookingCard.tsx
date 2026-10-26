'use client';
import {
    CalendarDaysIcon,
    CheckCircle2Icon,
    ClockIcon,
    Loader2Icon,
    UserIcon,
} from "lucide-react";

import { Input } from "@/components/ui/input";

import {
    API_BASE_URL,
    TravelPackageData,
} from "@/lib/constants";
import { useSession } from "@/utils/auth-client";
import React, { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { toast } from "../ui/toast";

// Backend contract this card relies on:
//   GET  /booking?email=<user email>
//     → 200 with the user's bookings as an array (or { bookings: [...] } /
//       { data: [...] }). Each booking identifies its destination
//       (destinationId or the destination's _id/id, and/or destinationName/
//       title) and has a departureDate.
//   POST /booking
//     → 2xx when created; 409 { message } when the same user already has a
//       booking for the same destination + departure date.

// ---------- Signed-out (guest) fallback: per-browser localStorage ----------

const EMPTY_BOOKED_DATES: string[] = [];

// Parsing cache so getSnapshot stays referentially stable between calls
// (useSyncExternalStore re-renders forever if the snapshot identity changes).
const parseCache = new Map<string, string[]>();
const parseBookedDates = (raw: string | null): string[] => {
    if (raw === null) return EMPTY_BOOKED_DATES;
    const cached = parseCache.get(raw);
    if (cached) return cached;

    let parsed: string[] = EMPTY_BOOKED_DATES;
    try {
        const value: unknown = JSON.parse(raw);
        if (Array.isArray(value)) {
            parsed = value.filter((date): date is string => typeof date === "string");
        }
    } catch {
        parsed = EMPTY_BOOKED_DATES;
    }
    parseCache.set(raw, parsed);
    return parsed;
};

const readBookedDates = (storageKey: string): string[] => {
    if (typeof window === "undefined") return EMPTY_BOOKED_DATES;
    try {
        return parseBookedDates(localStorage.getItem(storageKey));
    } catch {
        return EMPTY_BOOKED_DATES;
    }
};

const getServerBookedDates = () => EMPTY_BOOKED_DATES;

// ---------- Server bookings helpers ----------

/** "2026-05-15T00:00:00.000Z" / "2026-05-15" → "2026-05-15" */
const normalizeDateOnly = (value: unknown): string =>
    typeof value === "string" && value ? value.split("T")[0].trim() : "";

type BookingLike = {
    departureDate?: unknown;
    destinationId?: unknown;
    _id?: unknown;
    id?: unknown;
    destinationName?: unknown;
    title?: unknown;
};

/**
 * Picks out the booked dates that belong to THIS destination from whatever
 * the bookings endpoint returned (tolerates a few common response shapes).
 */
const extractBookedDates = (
    payload: unknown,
    destinationId: string | undefined,
    destTitle: string
): string[] => {
    const list: unknown = Array.isArray(payload)
        ? payload
        : payload && typeof payload === "object"
            ? (payload as { bookings?: unknown; data?: unknown }).bookings ??
              (payload as { bookings?: unknown; data?: unknown }).data
            : null;

    if (!Array.isArray(list)) return [];

    const dates = new Set<string>();
    for (const item of list) {
        if (!item || typeof item !== "object") continue;
        const booking = item as BookingLike;

        const bookingDestId = [booking.destinationId, booking._id, booking.id]
            .map((v) => (v == null ? "" : String(v)))
            .find(Boolean);
        const bookingTitle = [booking.destinationName, booking.title]
            .map((v) => (v == null ? "" : String(v)))
            .find(Boolean);

        const matchesDestination =
            (!!destinationId && bookingDestId === destinationId) ||
            (!!bookingTitle && bookingTitle === destTitle);
        if (!matchesDestination) continue;

        const date = normalizeDateOnly(booking.departureDate);
        if (date) dates.add(date);
    }
    return [...dates];
};

const isDuplicateRejection = (status: number, message: string) =>
    status === 409 || /already|duplicate|exist|taken|booked/i.test(message);

const BookingCard = ({ destination }: { destination: TravelPackageData }) => {
    const { destinationName, price, departureDate } = destination;

    // Use destinationName or title or id to uniquely identify this destination
    const destinationId = destination._id || destination.id;
    const destTitle = destinationName || (destination as Record<string, unknown>).title as string || "this destination";

    const { data: session } = useSession();

    const user = session?.user;
    const userEmail = user?.email;

    const formattedDate = departureDate
        ? departureDate.includes("T")
            ? departureDate.split("T")[0]
            : departureDate
        : "";

    const perks = [
        { icon: CalendarDaysIcon, label: "Free cancellation" },
        { icon: UserIcon, label: "Best price guarantee" },
        { icon: ClockIcon, label: "24/7 support" },
    ];

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedDate, setSelectedDate] = useState(formattedDate);

    // ----- Signed-in users: the server is the source of truth -----
    // Look up this user's bookings once per (user, destination) so the
    // "Booked" state follows the account across devices and browsers.
    const lookupKey = `${userEmail ?? ""}|${destinationId ?? ""}|${destTitle}`;
    const [lookup, setLookup] = useState<{ key: string; dates: string[] } | null>(null);

    useEffect(() => {
        if (!userEmail) return;
        let cancelled = false;

        (async () => {
            try {
                const res = await fetch(
                    `${API_BASE_URL}/booking?email=${encodeURIComponent(userEmail)}`
                );
                if (!res.ok) throw new Error(`GET /booking responded ${res.status}`);
                const payload: unknown = await res.json().catch(() => null);
                if (!cancelled) {
                    setLookup({
                        key: lookupKey,
                        dates: extractBookedDates(payload, destinationId, destTitle),
                    });
                }
            } catch (error) {
                // Endpoint missing/failed → treat as "no known bookings" and
                // let the POST /booking rejection be the safety net.
                console.warn("Could not load existing bookings:", error);
                if (!cancelled) setLookup({ key: lookupKey, dates: [] });
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [lookupKey, userEmail, destinationId, destTitle]);

    const isCheckingBookings = Boolean(userEmail) && lookup?.key !== lookupKey;

    // ----- Signed-out guests: per-browser localStorage fallback -----
    // Guests have no server identity, so their booked dates can only be
    // remembered on this device.
    const guestStorageKey = `booked_guest_${destinationId || destTitle}`;
    const subscribeToGuestBookings = useCallback(
        (onChange: () => void) => {
            const onStorage = (event: StorageEvent) => {
                // key === null means the whole store was cleared
                if (event.key === null || event.key === guestStorageKey) onChange();
            };
            window.addEventListener("storage", onStorage);
            return () => window.removeEventListener("storage", onStorage);
        },
        [guestStorageKey]
    );
    const getGuestBookingsSnapshot = useCallback(
        () => readBookedDates(guestStorageKey),
        [guestStorageKey]
    );
    const guestBookedDates = useSyncExternalStore(
        subscribeToGuestBookings,
        getGuestBookingsSnapshot,
        getServerBookedDates
    );

    const bookedDates = userEmail
        ? lookup?.key === lookupKey
            ? lookup.dates
            : EMPTY_BOOKED_DATES
        : guestBookedDates;

    const isDateBooked = (date: string) => date !== "" && bookedDates.includes(date);

    // The button is disabled / shows "Booked" only for a date this user
    // already booked on this destination. A different date stays bookable.
    const isCurrentDateBooked = isDateBooked(selectedDate);

    /** Optimistically record a booked date (after success OR a duplicate reject). */
    const markDateBooked = (date: string) => {
        if (!userEmail) {
            if (typeof window === "undefined") return;
            const nextDates = [...new Set([...readBookedDates(guestStorageKey), date])];
            localStorage.setItem(guestStorageKey, JSON.stringify(nextDates));
            // Same-tab writes don't fire "storage" — notify manually
            window.dispatchEvent(new StorageEvent("storage", { key: guestStorageKey }));
            return;
        }
        setLookup((prev) => {
            const current = prev?.key === lookupKey ? prev.dates : bookedDates;
            if (current.includes(date)) return prev ?? { key: lookupKey, dates: current };
            return { key: lookupKey, dates: [...current, date] };
        });
    };

    const handleBooking = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmitting || isCheckingBookings) return;

        const departureDateInput = selectedDate;

        if (!departureDateInput) {
            toast.add({
                title: "Select a Date",
                description: "Please select a departure date before booking.",
                type: "error",
                timeout: 3000,
            });
            return;
        }

        // Same user + same destination + same date → block the duplicate
        if (isDateBooked(departureDateInput)) {
            toast.add({
                title: "Already Booked",
                description: `You have already booked ${destTitle} for ${departureDateInput}.`,
                type: "error",
                timeout: 3000,
            });
            return;
        }

        const data = {
            name: user?.name,
            email: userEmail,
            ...destination,
            destinationId,
            departureDate: departureDateInput,
            bookingDate: new Date().toISOString()
        };

        setIsSubmitting(true);

        try {
            const res = await fetch(`${API_BASE_URL}/booking`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const bookingData = await res.json().catch(() => ({}));
            const serverMessage =
                typeof bookingData?.message === "string" ? bookingData.message : "";

            if (res.ok) {
                markDateBooked(departureDateInput);
                toast.add({
                    title: "Booking Successful",
                    description: `Successfully booked ${destTitle} for ${departureDateInput}`,
                    type: "success",
                    timeout: 3000,
                });
            } else if (isDuplicateRejection(res.status, serverMessage)) {
                // The backend rejected it as a duplicate (same user +
                // destination + date) — flip the UI to "Booked".
                markDateBooked(departureDateInput);
                toast.add({
                    title: "Already Booked",
                    description:
                        serverMessage ||
                        `You have already booked ${destTitle} for ${departureDateInput}.`,
                    type: "error",
                    timeout: 3000,
                });
            } else {
                toast.add({
                    title: "Booking Failed",
                    description: serverMessage || "Failed to book destination",
                    type: "error",
                    timeout: 3000,
                });
            }
        } catch {
            toast.add({
                title: "Error",
                description: "An unexpected error occurred. Please try again",
                type: "error",
                timeout: 3000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="flex flex-col gap-5 rounded-xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
                    <div>
                        <p className="text-sm text-neutral-500">Starting from</p>
                        <p className="mt-1 text-4xl font-semibold tracking-tight text-neutral-900">
                            <span className="text-[#29abe2]">${price}</span>
                        </p>
                        <p className="mt-1 text-sm text-neutral-400">per person</p>
                    </div>

                    <form onSubmit={handleBooking} className="border-t border-neutral-200 pt-5">
                        <label
                            htmlFor="departure-date"
                            className="text-sm font-medium text-neutral-900"
                        >
                            Select Date
                        </label>
                        <Input
                            id="departure-date"
                            type="date"
                            name="departureDate"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            disabled={isSubmitting}
                            className="mt-2 h-10 rounded-md border-transparent bg-[#f4f7fa] px-3 text-sm text-neutral-900 focus-visible:border-[#29abe2]/60 focus-visible:ring-[#29abe2]/25 sm:h-11 disabled:opacity-60"
                        />
                        {isCurrentDateBooked && (
                            <p className="mt-2 text-sm text-emerald-600">
                                You already booked this destination for the selected date.
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={isSubmitting || isCheckingBookings || isCurrentDateBooked}
                            className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md text-base font-medium transition-colors ${
                                isCurrentDateBooked
                                    ? "bg-emerald-600 text-white hover:bg-emerald-700 cursor-default"
                                    : "bg-[#29abe2] text-white hover:bg-[#2296c4] disabled:opacity-75 disabled:cursor-not-allowed"
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2Icon className="size-5 animate-spin" />
                                    <span>Booking...</span>
                                </>
                            ) : isCheckingBookings ? (
                                <>
                                    <Loader2Icon className="size-5 animate-spin" />
                                    <span>Checking...</span>
                                </>
                            ) : isCurrentDateBooked ? (
                                <>
                                    <CheckCircle2Icon className="size-5" />
                                    <span>Booked</span>
                                </>
                            ) : (
                                <span>Book Now</span>
                            )}
                        </button>
                    </form>

                    <ul className="flex flex-col gap-2.5 border-t border-neutral-200 pt-5">
                        {perks.map(({ icon: Icon, label }) => (
                            <li
                                key={label}
                                className="flex items-center gap-2.5 text-sm text-neutral-600"
                            >
                                <Icon className="size-4 text-neutral-500" />
                                {label}
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </div>
    )
}

export default BookingCard
