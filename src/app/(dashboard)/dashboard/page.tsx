import type { Metadata } from "next";
import DashboardClient from "./client";

export const metadata: Metadata = {
  title: "Dashboard — Nuvora",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <DashboardClient />;
}
