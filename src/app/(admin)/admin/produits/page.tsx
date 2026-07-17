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

  // Calculer les stats
  const stats = {
    total: products.length,
    active: products.filter((p) => p.status === "active").length,
    pending: products.filter((p) => p.status === "pending").length,
    rejected: products.filter((p) => p.status === "rejected").length,
    revenue: products
      .filter((p) => p.status === "active" && !p.isFree)
      .reduce((sum, p) => sum + (p.price || 0), 0),
  };

  // Grouper par plateforme
  const platformStats: Record<string, number> = {};
  products.forEach((p) => {
    platformStats[p.platform] = (platformStats[p.platform] || 0) + 1;
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
    views: p.views,
  }));

  return <AdminProduitsClient products={items} stats={stats} platformStats={platformStats} />;
}
