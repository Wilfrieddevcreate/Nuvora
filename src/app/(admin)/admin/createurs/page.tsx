import type { Metadata } from "next";
import { CREATORS, PRODUCTS } from "@/data/products";
import { AdminCreateursClient } from "./client";

export const metadata: Metadata = {
  title: "Admin — Créateurs",
  robots: { index: false, follow: false },
};

export default function AdminCreateursPage() {
  return <AdminCreateursClient creators={CREATORS} products={PRODUCTS} />;
}
