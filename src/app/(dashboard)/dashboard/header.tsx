"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoBadge } from "@/components/logo";

const NOTIFICATIONS = [
  {
    id: 1,
    type: "view",
    text: "Votre formation « Maîtriser Claude » a reçu 48 vues aujourd'hui.",
    time: "Il y a 2 h",
    unread: true,
  },
  {
    id: 2,
    type: "click",
    text: "3 nouveaux clics vers votre boutique Systeme.io.",
    time: "Il y a 4 h",
    unread: true,
  },
  {
    id: 3,
    type: "milestone",
    text: "🎉 Vous avez atteint 6 000 vues cumulées sur Nuvora !",
    time: "Il y a 1 j",
    unread: true,
  },
  {
    id: 4,
    type: "fav",
    text: "« Pack de prompts marketing » ajouté aux favoris par 5 utilisateurs.",
    time: "Il y a 2 j",
    unread: false,
  },
  {
    id: 5,
    type: "validated",
    text: "Votre produit « Pack de prompts marketing » a été validé par notre équipe.",
    time: "Il y a 3 j",
    unread: false,
  },
];

const ICON: Record<string, React.ReactNode> = {
  view: (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8Z" /><circle cx="12" cy="12" r="3" /></svg>
  ),
  click: (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
  ),
  milestone: (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l7 4v5c0 4-3 7-7 8-4-1-7-4-7-8V7z" /><path d="M9 12l2 2 4-4" /></svg>
  ),
  fav: (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
  ),
  validated: (
    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
  ),
};

const ICON_COLOR: Record<string, string> = {
  view: "bg-sky-100 text-sky-600 dark:bg-sky-500/20 dark:text-sky-400",
  click: "bg-accent-soft text-accent",
  milestone: "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
  fav: "bg-rose-100 text-rose-500 dark:bg-rose-500/20 dark:text-rose-400",
  validated: "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400",
};

const BREADCRUMBS: Record<string, string> = {
  "/dashboard": "Vue d'ensemble",
  "/dashboard/produits": "Mes produits",
  "/dashboard/produits/nouveau": "Nouveau produit",
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
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => n.unread).length;
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notifOpen) return;
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [notifOpen]);

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

        {/* Cloche notifs */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notifOpen}
            onClick={() => {
              setNotifOpen((o) => !o);
              // marquer toutes comme lues à l'ouverture
              setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
            }}
            className="relative grid size-9 place-items-center rounded-xl border border-border text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Panneau notifications */}
          {notifOpen && (
            <div className="absolute right-0 top-11 z-40 w-80 overflow-hidden rounded-2xl border border-border bg-surface shadow-soft-lg">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="text-sm font-bold text-fg">Notifications</span>
                  <button
                    type="button"
                    onClick={() => setNotifOpen(false)}
                    className="text-xs font-medium text-accent hover:text-accent-hover"
                  >
                    Fermer
                  </button>
                </div>
                <ul className="max-h-96 divide-y divide-border overflow-y-auto">
                  {notifications.map((n) => (
                    <li key={n.id} className={`flex items-start gap-3 px-4 py-3.5 ${n.unread ? "bg-accent-soft/30" : ""}`}>
                      <span className={`mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg ${ICON_COLOR[n.type]}`}>
                        {ICON[n.type]}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13px] leading-relaxed text-fg-2">{n.text}</p>
                        <p className="mt-1 text-xs text-muted">{n.time}</p>
                      </div>
                      {n.unread && (
                        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-accent" />
                      )}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border px-4 py-3 text-center">
                  <span className="text-xs text-muted">Toutes les notifications sont affichées.</span>
                </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <Link
          href="/dashboard/profil"
          aria-label="Mon profil"
          className="grid size-9 place-items-center rounded-full bg-indigo-500 text-sm font-bold text-white transition-opacity hover:opacity-85"
        >
          S
        </Link>
      </div>
    </header>
  );
}
