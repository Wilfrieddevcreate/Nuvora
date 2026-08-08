"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoBadge } from "@/components/logo";
import { NotificationsBell } from "@/components/notifications-panel";

const BREADCRUMBS: Record<string, string> = {
  "/admin": "Vue d'ensemble",
  "/admin/produits": "Produits",
  "/admin/createurs": "Créateurs",
  "/admin/avis": "Avis & modération",
  "/admin/parametres": "Paramètres",
};

function getPageTitle(pathname: string): string {
  if (BREADCRUMBS[pathname]) return BREADCRUMBS[pathname];
  return "Admin";
}

export function AdminHeader({
  onMenuOpen,
}: {
  onMenuOpen: () => void;
}) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-bg/80 px-4 backdrop-blur-md sm:px-6">
      {/* Bouton hamburger — mobile uniquement */}
      <button
        type="button"
        onClick={onMenuOpen}
        aria-label="Ouvrir le menu"
        className="grid size-9 place-items-center rounded-xl border border-border text-fg transition-colors hover:bg-surface-2 lg:hidden"
      >
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {/* Logo mobile */}
      <Link href="/" className="lg:hidden" aria-label="Nuvora — accueil">
        <LogoBadge className="size-7" />
      </Link>

      {/* Breadcrumb / titre de page */}
      <div className="hidden items-center gap-2 text-sm text-muted lg:flex">
        <Link href="/admin" className="hover:text-fg">Admin</Link>
        {pathname !== "/admin" && (
          <>
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
            <span className="font-semibold text-fg">{pageTitle}</span>
          </>
        )}
      </div>

      {/* Titre mobile */}
      <span className="flex-1 text-center text-sm font-semibold text-fg lg:hidden">
        {pageTitle}
      </span>

      {/* Actions droite */}
      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <NotificationsBell />

        {/* Avatar */}
        <Link
          href="/admin"
          aria-label="Admin"
          className="grid size-9 place-items-center rounded-full bg-rose-500 text-sm font-bold text-white transition-smooth hover:bg-rose-600 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
        >
          A
        </Link>
      </div>
    </header>
  );
}
