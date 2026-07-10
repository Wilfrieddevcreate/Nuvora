"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";

const NAV = [
  { href: "/catalogue", label: "Catalogue" },
  { href: "/assistant", label: "Assistant IA" },
  { href: "/createur", label: "Espace créateur" },
];

export function TopBar() {
  // scrolled = true dès qu'on quitte le haut de page → le mot "Nuvora" se replie.
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 16));
    }
    onScroll(); // état initial (ex. rechargement en cours de page)
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          href="/"
          aria-label="Nuvora — accueil"
          className="flex items-center gap-2 text-lg font-extrabold"
        >
          <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-accent text-accent-fg text-sm">
            N
          </span>
          {/* Le mot se replie au scroll (largeur + opacité) et revient en haut */}
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out motion-reduce:transition-none ${
              scrolled ? "max-w-0 opacity-0" : "max-w-32 opacity-100"
            }`}
          >
            Nuvora
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/connexion"
            className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-fg-2 transition-colors hover:text-fg sm:inline-flex"
          >
            Connexion
          </Link>
          <ButtonLink href="/inscription" size="sm" className="hidden sm:inline-flex">
            S’inscrire
          </ButtonLink>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
