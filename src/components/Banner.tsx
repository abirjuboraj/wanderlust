import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const searchFields = [
  { label: "Location", hint: "Address, City Or Zip" },
  { label: "Date/Duration", hint: "Anytime/3 Days" },
  { label: "Budget", hint: "$0-$3000" },
  { label: "People", hint: "5-10" },
];

const fieldBorders = [
  "",
  "border-l border-white/20",
  "border-t border-white/20 md:border-t-0 md:border-l",
  "border-t border-l border-white/20 md:border-t-0",
];

export default function Banner() {
  return (
    <section className="relative isolate -mt-16 flex min-h-[660px] w-full flex-col overflow-hidden sm:min-h-[704px]">
      <Image
        src="/images/Banner.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover"
      />

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-14 text-center sm:py-16">
        <h1 className="max-w-4xl text-4xl font-light leading-[1.06] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Discover Your
          <br />
          Next Adventure
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/85 sm:mt-6 sm:text-base lg:text-lg">
          Explore breathtaking destinations and create unforgettable memories with
          our curated travel experiences.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4">
          <Link
            href="/destinations"
            className="group inline-flex h-11 items-center gap-5 bg-[#29abe2] px-5 text-xs font-medium tracking-wide text-white uppercase transition-colors hover:bg-[#2296c4] sm:h-12 sm:gap-8 sm:px-8 sm:text-sm"
          >
            Explore Now
            <ArrowRight
              className="size-4 transition-transform group-hover:translate-x-1"
              strokeWidth={2}
            />
          </Link>
          <Link
            href="/destinations"
            className="inline-flex h-11 items-center bg-white/25 px-5 text-xs font-medium tracking-wide text-white uppercase backdrop-blur-sm transition-colors hover:bg-white/35 sm:h-12 sm:px-8 sm:text-sm"
          >
            View Destination
          </Link>
        </div>
      </div>

      <div className="grid w-full grid-cols-2 bg-black/45 backdrop-blur-[2px] md:grid-cols-[repeat(4,minmax(0,1fr))_auto]">
        {searchFields.map((field, index) => (
          <div
            key={field.label}
            className={`border-white/20 px-4 py-3 text-left sm:px-6 ${fieldBorders[index] ?? ""}`}
          >
            <p className="text-[15px] font-medium text-white">{field.label}</p>
            <p className="mt-0.5 text-xs text-white/70">{field.hint}</p>
          </div>
        ))}

        <button
          type="button"
          className="col-span-2 bg-[#29abe2] px-10 py-4 text-base font-semibold text-white transition-colors hover:bg-[#2296c4] md:col-span-1 md:px-14"
        >
          Search
        </button>
      </div>
    </section>
  );
}
