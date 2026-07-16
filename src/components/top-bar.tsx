"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { LogoBadge } from "@/components/logo";
import { useAuth } from "@/contexts/auth";

const NAV = [
  { href: "/catalogue", label: "Explorer" },
  { href: "/assistant", label: "Assistant IA" },
  { href: "/createur", label: "Vendre" },
];

export function TopBar() {
  // scrolled = true dès qu'on quitte le haut de page → le mot "Nuvora" se replie.
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

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

  // Ferme le menu quand on change de page (navigation via un lien du menu).
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMenuOpen(false);
  }, [pathname]);

  // Bloque le scroll du body + ferme à Échap quand le menu est ouvert.
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Link
          href="/"
          aria-label="Nuvora — accueil"
          className="flex items-center gap-2 text-lg font-extrabold"
        >
          <LogoBadge className="size-7" />
          {/* Le mot se replie au scroll (largeur + opacité) et revient en haut */}
          <span
            className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-out motion-reduce:transition-none ${
              scrolled ? "max-w-0 opacity-0" : "max-w-32 opacity-100"
            }`}
          >
            Nuvora
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg lg:px-3.5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              {user.isCreator && (
                <Link
                  href="/dashboard"
                  className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-fg-2 transition-colors hover:text-fg md:inline-flex"
                >
                  Dashboard
                </Link>
              )}
              <Link
                href="/compte"
                aria-label="Mon compte"
                className="grid size-9 place-items-center rounded-full bg-indigo-500 text-sm font-bold text-white transition-opacity hover:opacity-85"
              >
                {user.initial}
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="hidden rounded-full px-3.5 py-2 text-sm font-medium text-fg-2 transition-colors hover:text-fg md:inline-flex"
              >
                Connexion
              </Link>
              <span className="hidden md:inline-flex">
                <ButtonLink href="/inscription" size="sm">
                  S’inscrire
                </ButtonLink>
              </span>
            </>
          )}

          {/* Bouton hamburger — mobile uniquement */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            className="grid size-10 place-items-center rounded-full border border-border-2 text-fg transition-colors hover:bg-surface-2 md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              className="size-5"
              aria-hidden="true"
            >
              {menuOpen ? (
                <>
                  <path d="M6 6l12 12" />
                  <path d="M18 6L6 18" />
                </>
              ) : (
                <>
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Panneau mobile */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 z-40 md:hidden">
          {/* overlay */}
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          {/* contenu */}
          <nav className="relative border-b border-border bg-bg px-5 pb-6 pt-2 shadow-soft-lg">
            <ul className="flex flex-col">
              {NAV.map(
                (item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-3.5 text-[15px] font-semibold text-fg transition-colors hover:bg-surface-2"
                    >
                      {item.label}
                      <svg viewBox="0 0 24 24" className="size-4 text-muted" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
                    </Link>
                  </li>
                ),
              )}
            </ul>

            <div className="mt-4 flex flex-col gap-2.5 border-t border-border pt-4">
              {user ? (
                <>
                  <ButtonLink href="/compte" size="lg" className="w-full" onClick={() => setMenuOpen(false)}>
                    Mon compte
                  </ButtonLink>
                  {user.isCreator && (
                    <ButtonLink href="/dashboard" variant="secondary" size="lg" className="w-full" onClick={() => setMenuOpen(false)}>
                      Dashboard créateur
                    </ButtonLink>
                  )}
                  <button
                    type="button"
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full rounded-xl border border-border px-4 py-3 text-[15px] font-semibold text-fg transition-colors hover:bg-surface-2"
                  >
                    Se déconnecter
                  </button>
                </>
              ) : (
                <>
                  <ButtonLink href="/inscription" size="lg" className="w-full" onClick={() => setMenuOpen(false)}>
                    S’inscrire
                  </ButtonLink>
                  <ButtonLink href="/connexion" variant="secondary" size="lg" className="w-full" onClick={() => setMenuOpen(false)}>
                    Connexion
                  </ButtonLink>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
