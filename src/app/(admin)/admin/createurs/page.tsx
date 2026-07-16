import type { Metadata } from "next";
import { db } from "@/lib/db";
import { AdminCreateursClient } from "./client";

export const metadata: Metadata = {
  title: "Admin — Créateurs",
  robots: { index: false, follow: false },
};

export default async function AdminCreateursPage() {
  const creators = await db.creator.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { products: true } },
    },
  });

  const data = creators.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.user.name,
    email: c.user.email,
    tagline: c.tagline ?? "",
    specialty: c.specialty ?? "",
    platform: c.platform ?? "",
    verified: c.verified,
    productCount: c._count.products,
    joinedYear: new Date(c.createdAt).getFullYear().toString(),
  }));

  return <AdminCreateursClient creators={data} />;
}
