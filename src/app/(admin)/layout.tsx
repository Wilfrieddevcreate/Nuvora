"use client";

import { useState } from "react";
import { AdminSidebar, AdminMobileSidebar } from "@/app/(admin)/admin/sidebar";
import { AdminHeader } from "@/app/(admin)/admin/header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-bg">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-9999 focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-accent-fg focus:shadow-soft-lg"
      >
        Aller au contenu principal
      </a>

      {/* Sidebar desktop */}
      <AdminSidebar />

      {/* Sidebar mobile */}
      <AdminMobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Zone principale décalée à droite sur desktop */}
      <div className="flex flex-col lg:pl-60">
        <AdminHeader onMenuOpen={() => setMobileOpen(true)} />
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
