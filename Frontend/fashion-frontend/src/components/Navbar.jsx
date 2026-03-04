"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ShoppingBag, User } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import { useApp } from "@/context/AppContext";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { isLoggedIn, cartCount, logout, loading } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  /* =========================
     SCROLL EFFECT
  ========================= */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* =========================
     LOADING GUARD
  ========================= */
  if (loading) {
    return <header className="h-20" />;
  }

  return (
<header
  className={`fixed w-full z-50
    bg-white dark:bg-black
    border-b border-gray-200 dark:border-gray-800
    transition-shadow duration-300
    ${scrolled ? "shadow-md" : ""}
  `}
>
<nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between text-gray-900 dark:text-white">


        {/* BRAND */}
        <Link
          href="/"
          className="text-2xl tracking-widest font-extrabold uppercase font-serif"
        >
          FASHION <span className="ml-1">STORE</span>
        </Link>

        {/* DESKTOP MENU */}
        <ul className="hidden md:flex items-center gap-10 text-sm font-medium">
          <Link href="/" className={`pb-1 ${pathname === "/" ? "border-b-2 border-current" : ""}`}>
            Home
          </Link>

          <Link
            href="/collections"
            className={pathname.startsWith("/collections") ? "border-b-2" : ""}
          >
            Collections
          </Link>

          <Link
            href="/orders"
            className={pathname === "/orders" ? "border-b-2" : ""}
          >
            Orders
          </Link>
        </ul>

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-5">
          <DarkModeToggle />

          {/* CART */}
          <Link href="/cart" className="relative">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 text-xs bg-black text-white dark:bg-white dark:text-black rounded-full px-1">
                {cartCount}
              </span>
            )}
          </Link>

          {/* AUTH */}
          {isLoggedIn ? (
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="text-sm hover:underline"
            >
              Logout
            </button>
          ) : (
            <Link href="/login">
              <User size={20} />
            </Link>
          )}
        </div>

        {/* MOBILE */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </nav>
    </header>
  );
}
