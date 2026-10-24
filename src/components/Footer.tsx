"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRightIcon } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/my-bookings", label: "My Bookings" },
  { href: "/profile", label: "My Profile" },
];

const supportLinks = [
  { href: "/help-center", label: "Help Center" },
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
];

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0Z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full bg-neutral-950 text-neutral-300">
      <div className="mx-auto w-full max-w-360 px-6 pt-16 pb-8 sm:px-10 sm:pt-20 lg:pt-24">
        <div>
          <Image
            src="/images/Wanderlast-1.png"
            alt="Wanderlast"
            width={542}
            height={80}
            className="h-10 w-auto sm:h-14 lg:h-20"
          />
          <p className="mt-4 text-sm text-neutral-400 sm:text-base">
            Your gateway to extraordinary travel experiences around the world.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-8">
          <div>
            <h3 className="text-xs font-medium tracking-widest text-neutral-400 uppercase sm:text-[13px]">
              Newsletter
            </h3>
            <p className="mt-4 text-sm text-neutral-400">
              Subscribe for exclusive travel deals and inspiration.
            </p>
            <form
              className="mt-5 flex h-11 w-full max-w-sm items-center rounded-md bg-neutral-800 pr-2 pl-4 transition-colors focus-within:ring-1 focus-within:ring-white/30"
              onSubmit={(event) => event.preventDefault()}
            >
              <input
                type="email"
                name="email"
                required
                placeholder="Enter email"
                aria-label="Email address"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-neutral-400"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="grid size-9 shrink-0 place-items-center text-white transition-colors hover:text-[#29abe2]"
              >
                <ArrowUpRightIcon className="size-4" />
              </button>
            </form>
          </div>

          <div>
            <h3 className="text-xs font-medium tracking-widest text-neutral-400 uppercase sm:text-[13px]">
              Quick Links
            </h3>
            <ul className="mt-5 space-y-4 sm:space-y-5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-neutral-300 transition-colors hover:text-white sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium tracking-widest text-neutral-400 uppercase sm:text-[13px]">
              Support
            </h3>
            <ul className="mt-5 space-y-4 sm:space-y-5">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[15px] text-neutral-300 transition-colors hover:text-white sm:text-base"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-medium tracking-widest text-neutral-400 uppercase sm:text-[13px]">
              Contact Us
            </h3>
            <ul className="mt-5 space-y-4 sm:space-y-5">
              <li>
                <a
                  href="tel:7869011622"
                  className="text-[15px] text-neutral-300 transition-colors hover:text-white sm:text-base"
                >
                  786 901 1622
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@wandariland.com"
                  className="text-[15px] break-all text-neutral-300 transition-colors hover:text-white sm:text-base"
                >
                  info@wandariland.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col-reverse items-center justify-between gap-5 border-t border-white/10 pt-6 sm:mt-12 sm:flex-row">
          <p className="text-xs text-neutral-500 sm:text-sm">
            © 2026 Wanderlust. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="#"
              aria-label="X"
              className="text-neutral-300 transition-colors hover:text-white"
            >
              <XIcon className="size-4" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="text-neutral-300 transition-colors hover:text-white"
            >
              <LinkedInIcon className="size-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="text-neutral-300 transition-colors hover:text-white"
            >
              <InstagramIcon className="size-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
