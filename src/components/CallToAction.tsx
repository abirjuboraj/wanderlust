import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="relative isolate flex min-h-[320px] w-full items-center justify-center overflow-hidden sm:min-h-[380px]">
      <Image
        src="/images/CTA.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      <div className="-z-10 absolute inset-0 bg-black/55" />

      <div className="flex flex-col items-center px-4 py-16 text-center sm:py-20">
        <h2 className="text-3xl font-light tracking-tight text-white sm:text-4xl lg:text-5xl">
          Ready To Start Your Journey?
        </h2>

        <p className="mt-4 max-w-2xl text-sm text-white/85 sm:text-base">
          Join thousands of travelers who have discovered the world with us
        </p>

        <Link
          href="/destinations"
          className="group mt-7 inline-flex h-11 items-center gap-4 bg-white px-6 text-xs font-medium tracking-wider text-neutral-900 uppercase transition-colors hover:bg-neutral-100 sm:mt-8 sm:h-12 sm:gap-6 sm:px-8 sm:text-sm"
        >
          Book Your Trip Today
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  );
}
