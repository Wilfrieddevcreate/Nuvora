import type { Metadata } from "next";
import ProduitsClient from "./client";

export const metadata: Metadata = {
  title: "Mes produits — Dashboard Nuvora",
  robots: { index: false, follow: false },
};

export default function ProduitsPage() {
  return <ProduitsClient />;
}
