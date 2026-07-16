import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";
import { db } from "@/lib/db";
import DashboardClient from "./client";

export const metadata: Metadata = {
  title: "Dashboard — Nuvora",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await verifySession();

  const creator = await db.creator.findUnique({
    where: { userId: session.userId },
    include: {
      products: {
        orderBy: { createdAt: "desc" },
        take: 20,
      },
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

  return (
    <DashboardClient
      userName={session.name}
      creatorSlug={creator?.slug}
      verified={creator?.verified ?? false}
      products={products}
    />
  );
}
