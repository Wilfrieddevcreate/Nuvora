import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AdminProduitsClient } from "./client";

export const metadata: Metadata = {
  title: "Admin — Produits",
  robots: { index: false, follow: false },
};

export default async function AdminProduitsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { creator: { select: { slug: true, user: { select: { name: true } } } } },
  });

  const items = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    platform: p.platform,
    price: p.price,
    isFree: p.isFree,
    status: p.status as "pending" | "active" | "rejected",
    creatorName: p.creator.user.name,
    creatorSlug: p.creator.slug,
  }));

  return <AdminProduitsClient products={items} />;
}
