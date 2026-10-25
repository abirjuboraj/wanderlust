"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, MenuIcon, User, XIcon } from "lucide-react";
import { cn } from "cn";
import { useSession, signOut } from "@/utils/auth-client";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/destinations", label: "Destinations" },
  { href: "/add-destination", label: "Add Destination" },
  { href: "/my-bookings", label: "My Bookings" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const user = session?.user;
  const initial = user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "U");

  const handleSignOut = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in")
        },
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-2 sm:px-4">
      <div className="relative w-full border-b border-black/5 bg-white">
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

          <div className="flex items-center justify-end gap-3 sm:gap-4">
            {isPending ? (
              <div className="h-8 w-20 animate-pulse rounded-full bg-neutral-100" />
            ) : user ? (
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-neutral-50 sm:pr-2.5"
                  title={user.name || user.email}
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-[#29abe2] text-xs font-semibold text-white shadow-sm ring-2 ring-white">
                    {initial}
                  </div>
                  <span className="hidden text-sm font-medium text-neutral-800 sm:inline max-w-28 truncate">
                    {user.name || user.email.split("@")[0]}
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  title="Sign out"
                  aria-label="Sign out"
                  className="flex items-center gap-1 rounded-md p-1.5 text-xs text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-destructive sm:px-2.5 sm:py-1.5"
                >
                  <LogOut className="size-4" strokeWidth={1.75} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <ul className="flex items-center justify-end gap-3 sm:gap-5 md:gap-6">
                <li>
                  <Link
                    href="/sign-in"
                    className="flex items-center gap-1.5 text-sm text-neutral-800 transition-colors hover:text-[#29abe2] sm:text-[17px]"
                  >
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sign-up"
                    className="flex items-center gap-1.5 rounded-full bg-[#29abe2] px-3.5 py-1 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:text-[15px]"
                  >
                    Sign Up
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </nav>

        {menuOpen && (
          <div className="absolute top-full left-0 right-0 z-50 border-b border-black/10 bg-white shadow-xl md:hidden">
            <ul className="mx-auto flex w-full max-w-360 flex-col px-4 py-2 sm:px-6">
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
                          ? "text-[#29abe2] font-medium"
                          : "text-neutral-800 hover:text-[#29abe2]"
                      )}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}

              <li className="my-1 border-t border-neutral-100 pt-1">
                {user ? (
                  <div className="flex items-center justify-between py-2.5">
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2"
                    >
                      <div className="flex size-7 items-center justify-center rounded-full bg-[#29abe2] text-xs font-semibold text-white">
                        {initial}
                      </div>
                      <span className="text-sm font-medium text-neutral-800 truncate max-w-40">
                        {user.name || user.email}
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        handleSignOut();
                      }}
                      className="flex items-center gap-1 text-xs text-destructive hover:underline"
                    >
                      <LogOut className="size-3.5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 py-2.5 text-sm">
                    <Link
                      href="/sign-in"
                      onClick={() => setMenuOpen(false)}
                      className="text-neutral-800 hover:text-[#29abe2]"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setMenuOpen(false)}
                      className="font-medium text-[#29abe2]"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
}
