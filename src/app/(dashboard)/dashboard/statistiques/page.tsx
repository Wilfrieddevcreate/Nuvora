import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";
import { db } from "@/lib/db";
import StatistiquesClient from "./client";

export const metadata: Metadata = {
  title: "Statistiques — Dashboard Nuvora",
  robots: { index: false, follow: false },
};

export default async function StatistiquesPage() {
  const session = await verifySession();

  const creator = await db.creator.findUnique({
    where: { userId: session.userId },
    include: {
      products: { orderBy: { views: "desc" } },
    },
  });

  const products = (creator?.products ?? []).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    views: p.views,
    clicks: p.clicks,
  }));

  return <StatistiquesClient products={products} />;
}
