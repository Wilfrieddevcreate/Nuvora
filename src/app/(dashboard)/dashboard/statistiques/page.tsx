import type { Metadata } from "next";
import StatistiquesClient from "./client";

export const metadata: Metadata = {
  title: "Statistiques — Dashboard Nuvora",
  robots: { index: false, follow: false },
};

export default function StatistiquesPage() {
  return <StatistiquesClient />;
}
