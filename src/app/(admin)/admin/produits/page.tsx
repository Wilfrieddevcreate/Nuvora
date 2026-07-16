import type { Metadata } from "next";
import { PRODUCTS, CREATORS } from "@/data/products";
import { AdminProduitsClient } from "./client";

export const metadata: Metadata = {
  title: "Admin — Produits",
  robots: { index: false, follow: false },
};

export default function AdminProduitsPage() {
  return <AdminProduitsClient products={PRODUCTS} creators={CREATORS} />;
}
