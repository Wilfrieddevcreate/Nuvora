import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";
import { db } from "@/lib/db";
import ProduitsClient from "./client";

export const metadata: Metadata = {
  title: "Mes produits — Dashboard Nuvora",
  robots: { index: false, follow: false },
};

export default async function ProduitsPage() {
  const session = await verifySession();

  const creator = await db.creator.findUnique({
    where: { userId: session.userId },
    include: {
      products: { orderBy: { createdAt: "desc" } },
    },
  });

  const products = (creator?.products ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    category: p.category,
    platform: p.platform,
    status: p.status as "pending" | "active" | "rejected",
    views: p.views,
    clicks: p.clicks,
    createdAt: p.createdAt.toISOString(),
  }));

  return <ProduitsClient products={products} />;
}
