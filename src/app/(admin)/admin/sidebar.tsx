"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { LogoBadge } from "@/components/logo";
import { useAuth } from "@/contexts/auth";
import { Modal, ModalActions } from "@/components/modal";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  external?: boolean;
};

const NAV: NavItem[] = [
  {
    href: "/admin",
    label: "Vue d'ensemble",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    href: "/admin/produits",
    label: "Produits",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h10" />
      </svg>
    ),
  },
  {
    href: "/admin/createurs",
    label: "Créateurs",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="9" cy="7" r="4" />
        <path d="M17 11a4 4 0 0 1 0 8" />
        <path d="M3 21a8 8 0 0 1 12 0" />
      </svg>
    ),
  },
  {
    href: "/admin/notifications",
    label: "Notifications",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
  },
  {
    href: "/admin/verification",
    label: "Certification",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M9 12l2 2 4-4M7 12a5 5 0 1 0 10 0A5 5 0 0 0 7 12Z" />
      </svg>
    ),
  },
  {
    href: "/admin/avis",
    label: "Avis",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
  },
  {
    href: "/admin/parametres",
    label: "Paramètres",
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

const SECONDARY: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard créateur",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    ),
  },
  {
    href: "/catalogue",
    label: "Voir le catalogue",
    external: true,
    icon: (
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <polyline points="15 3 21 3 21 9" />
        <line x1="10" y1="14" x2="21" y2="3" />
      </svg>
    ),
  },
];

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      target={item.external ? "_blank" : undefined}
      rel={item.external ? "noopener noreferrer" : undefined}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400"
          : "text-fg-2 hover:bg-surface-2 hover:text-fg"
      }`}
    >
      <span className={active ? "text-rose-600 dark:text-rose-400" : "text-muted"}>{item.icon}</span>
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[11px] font-semibold text-white">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

// Version desktop — fixe à gauche
export function AdminSidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-border bg-surface lg:flex">
      <SidebarContent />
    </aside>
  );
}

// Version mobile — panneau glissant piloté par le parent
export function AdminMobileSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* overlay */}
      <button
        type="button"
        aria-label="Fermer le menu"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />
      {/* panneau */}
      <aside className="absolute inset-y-0 left-0 flex w-64 flex-col border-r border-border bg-surface shadow-soft-lg">
        {/* Bouton fermeture visible en haut du panneau */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold text-fg">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-fg"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <SidebarContent onNavClick={onClose} />
      </aside>
    </div>
  );
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const { logout } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);

  async function handleLogout() {
    if (onNavClick) onNavClick();
    logout();
  }

  return (
    <>
    <div className="flex h-full flex-col gap-1 overflow-y-auto px-3 py-4">
      {/* Logo */}
      <Link
        href="/"
        className="mb-4 flex items-center gap-2.5 rounded-xl px-2 py-2 text-base font-extrabold transition-colors hover:bg-surface-2"
        onClick={onNavClick}
      >
        <LogoBadge className="size-8" />
        <span>Nuvora</span>
        <span className="ml-auto rounded-md bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-600 dark:bg-rose-500/20 dark:text-rose-400">
          Admin
        </span>
      </Link>

      {/* Nav principale */}
      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => (
          <NavLink key={item.href} item={item} onClick={onNavClick} />
        ))}
      </nav>

      {/* Séparateur */}
      <div className="my-3 border-t border-border" />

      {/* Liens secondaires */}
      <nav className="flex flex-col gap-0.5">
        <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted">
          Liens utiles
        </p>
        {SECONDARY.map((item) => (
          <NavLink key={item.href} item={item} onClick={onNavClick} />
        ))}
      </nav>

      {/* Pied de sidebar — profil admin */}
      <div className="mt-auto pt-4 border-t border-border space-y-2">
        <div className="flex items-center justify-between px-3">
          <div className="flex items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-rose-500 text-sm font-bold text-white">
              A
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-fg">Admin Nuvora</p>
              <p className="truncate whitespace-nowrap text-xs text-muted">admin@nuvora.app</p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setConfirmLogout(true)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
        >
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Se déconnecter
        </button>
      </div>
    </div>

    <Modal
      open={confirmLogout}
      onClose={() => setConfirmLogout(false)}
      title="Se déconnecter ?"
      size="sm"
    >
      <p className="text-[15px] text-fg-2">
        Vous allez être déconnecté de l'espace d'administration Nuvora.
      </p>
      <ModalActions>
        <button
          type="button"
          onClick={() => setConfirmLogout(false)}
          className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-fg transition-colors hover:bg-surface-2"
        >
          Annuler
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex-1 rounded-xl bg-danger px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-85"
        >
          Se déconnecter
        </button>
      </ModalActions>
    </Modal>
    </>
  );
}
