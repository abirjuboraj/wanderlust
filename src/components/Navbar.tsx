"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuIcon, User, XIcon } from "lucide-react";
import { cn } from "cn";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/add-destination", label: "Add Destination" },
  { href: "/my-bookings", label: "My Bookings" },
];

const accountLinks = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/login", label: "Login" },
  { href: "/signup", label: "Sign Up" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-2 sm:px-4">
      <div className="w-full border-b border-black/5 bg-white">
        <nav className="mx-auto grid h-14 w-full max-w-360 grid-cols-[auto_1fr_auto] items-center gap-3 px-4 sm:px-6 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center gap-4">
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="text-neutral-800 transition-colors hover:text-[#29abe2] md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <XIcon className="size-5" /> : <MenuIcon className="size-5" />}
            </button>

            <ul className="hidden items-center gap-7 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "text-[17px] transition-colors",
                        isActive
                          ? "text-[#29abe2] underline decoration-[#29abe2] underline-offset-[6px]"
                          : "text-neutral-800 hover:text-[#29abe2]"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <Link
            href="/"
            className="justify-self-center"
            aria-label="WanderLust home"
          >
            <Image
              src="/images/Wanderlast.png"
              alt="WanderLust"
              width={208}
              height={40}
              priority
              className="h-6 w-auto sm:h-7 md:h-8"
            />
          </Link>

          <ul className="flex items-center justify-end gap-3 sm:gap-5 md:gap-6">
            {accountLinks.map((link) => {
              const Icon = link.icon;
              return (
                <li key={link.href} className={cn(link.icon && "hidden sm:block")}>
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 text-sm text-neutral-800 transition-colors hover:text-[#29abe2] sm:text-[17px]"
                  >
                    {Icon ? <Icon className="size-4" strokeWidth={1.75} /> : null}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {menuOpen && (
          <div className="border-t border-neutral-100 md:hidden">
            <ul className="mx-auto flex w-full max-w-360 flex-col px-4 py-1 sm:px-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "block py-2.5 text-[15px] transition-colors",
                        isActive
                          ? "text-[#29abe2]"
                          : "text-neutral-800 hover:text-[#29abe2]"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
