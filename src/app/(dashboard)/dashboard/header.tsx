"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoBadge } from "@/components/logo";
import { NotificationsBell } from "@/components/notifications-panel";
import { useAuth } from "@/contexts/auth";

const BREADCRUMBS: Record<string, string> = {
  "/dashboard": "Vue d'ensemble",
  "/dashboard/produits": "Mes produits",
  "/dashboard/produits/nouveau": "Nouveau produit",
  "/dashboard/notifications": "Notifications",
  "/dashboard/statistiques": "Statistiques",
  "/dashboard/profil": "Mon profil",
};

function getPageTitle(pathname: string): string {
  if (BREADCRUMBS[pathname]) return BREADCRUMBS[pathname];
  if (pathname.match(/^\/dashboard\/produits\/[^/]+$/)) return "Modifier le produit";
  return "Dashboard";
}

export function DashboardHeader({
  onMenuOpen,
}: {
  onMenuOpen: () => void;
}) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const { user } = useAuth();

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
        <Link href="/dashboard" className="hover:text-fg">Dashboard</Link>
        {pathname !== "/dashboard" && (
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
          href="/dashboard/profil"
          aria-label="Mon profil"
          className="grid size-9 place-items-center rounded-full bg-indigo-500 text-sm font-bold text-white transition-opacity hover:opacity-85"
        >
          {user?.initial ?? "?"}
        </Link>
      </div>
    </header>
  );
}
