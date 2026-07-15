"use client";

import { useState } from "react";
import { Sidebar, MobileSidebar } from "@/app/(dashboard)/dashboard/sidebar";
import { DashboardHeader } from "@/app/(dashboard)/dashboard/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-dvh bg-bg">
      {/* Sidebar desktop */}
      <Sidebar />

      {/* Sidebar mobile */}
      <MobileSidebar
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Zone principale décalée à droite sur desktop */}
      <div className="flex flex-col lg:pl-60">
        <DashboardHeader onMenuOpen={() => setMobileOpen(true)} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
