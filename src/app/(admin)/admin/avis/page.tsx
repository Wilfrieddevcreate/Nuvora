import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AdminAvisClient } from "./client";

export const metadata: Metadata = {
  title: "Admin — Avis",
  robots: { index: false, follow: false },
};

export default async function AdminAvisPage() {
  const reviews = await db.review.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true } },
      product: { select: { title: true, slug: true } },
    },
  });

  const items = reviews.map((r) => ({
    id: r.id,
    author: r.user.name,
    initial: r.user.name.charAt(0).toUpperCase(),
    rating: r.rating,
    comment: r.comment ?? "",
    productTitle: r.product.title,
    productSlug: r.product.slug,
    status: r.status as "pending" | "approved" | "rejected",
    createdAt: r.createdAt.toISOString(),
  }));

  return <AdminAvisClient reviews={items} />;
}
