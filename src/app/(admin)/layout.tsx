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
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
