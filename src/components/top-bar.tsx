"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { ButtonLink } from "@/components/ui/button";
import { LogoBadge } from "@/components/logo";
import { useAuth } from "@/contexts/auth";

const NAV = [
  { href: "/catalogue", label: "Explorer" },
  { href: "/assistant", label: "Assistant IA" },
  { href: "/createur", label: "Référencer" },
];

const RESOURCES = [
  {
    href: "/guide-createur",
    label: "Guide créateur",
    desc: "Tout pour référencer vos produits",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    href: "/blog",
    label: "Blog",
    desc: "Conseils, guides et ressources",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    href: "/a-propos",
    label: "À propos",
    desc: "Notre mission et notre histoire",
    icon: (
      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
];

function ResourcesMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // ferme au changement de page
  useEffect(() => { setOpen(false); }, [pathname]);

  // ferme au clic extérieur
  useEffect(() => {
    if (!open) return;
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const isActive = RESOURCES.some((r) => pathname.startsWith(r.href));

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors lg:px-3.5 ${
          isActive ? "bg-surface-2 text-fg" : "text-fg-2 hover:bg-surface-2 hover:text-fg"
        }`}
      >
        Ressources
        <svg
          viewBox="0 0 24 24"
          className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-border bg-surface shadow-soft-lg">
          <ul className="p-1.5">
            {RESOURCES.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-2"
                >
                  <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                    {r.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-fg">{r.label}</p>
                    <p className="text-xs text-muted">{r.desc}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function TopBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 16));
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

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
          aria-label="Nuvora, page d'accueil"
          className="flex items-center gap-2 text-lg font-extrabold"
        >
          <LogoBadge className="size-7" />
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
          <ResourcesMenu />
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
                href={user.role === "admin" ? "/admin" : user.role === "creator" ? "/dashboard" : "/compte"}
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
                  S'inscrire
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
          <button
            type="button"
            aria-label="Fermer le menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/40"
          />
          <nav className="relative border-b border-border bg-bg px-5 pb-6 pt-2 shadow-soft-lg">
            <ul className="flex flex-col">
              {NAV.map((item) => (
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
              ))}

              {/* Ressources mobile — section dépliable */}
              <li>
                <button
                  type="button"
                  onClick={() => setResourcesOpen((o) => !o)}
                  aria-expanded={resourcesOpen}
                  aria-controls="mobile-resources-submenu"
                  className="flex w-full items-center justify-between rounded-xl px-3 py-3.5 text-[15px] font-semibold text-fg transition-colors hover:bg-surface-2"
                >
                  Ressources
                  <svg
                    viewBox="0 0 24 24"
                    className={`size-4 text-muted transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
                {resourcesOpen && (
                  <ul id="mobile-resources-submenu" className="mb-1 ml-3 space-y-0.5 border-l border-border pl-3">
                    {RESOURCES.map((r) => (
                      <li key={r.href}>
                        <Link
                          href={r.href}
                          onClick={() => { setMenuOpen(false); setResourcesOpen(false); }}
                          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-[14px] font-medium text-fg-2 transition-colors hover:bg-surface-2 hover:text-fg"
                        >
                          <span className="grid size-6 shrink-0 place-items-center rounded-lg bg-accent-soft text-accent">
                            {r.icon}
                          </span>
                          {r.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
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
                    S'inscrire
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
