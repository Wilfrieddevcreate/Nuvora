import type { Metadata } from "next";
import { db } from "@/lib/db";
import { CreatorVerificationClient } from "./client";

export const metadata: Metadata = {
  title: "Admin — Certification créateurs",
  robots: { index: false, follow: false },
};

export default async function VerificationPage() {
  const creators = await db.creator.findMany({
    include: {
      user: { select: { name: true, email: true } },
      _count: { select: { products: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const creatorsData = creators.map((c) => ({
    id: c.id,
    slug: c.slug,
    name: c.user.name,
    email: c.user.email,
    avatar: c.avatar || undefined,
    bio: c.bio || undefined,
    specialty: c.specialty || undefined,
    verified: c.verified,
    productCount: c._count.products,
    createdAt: c.createdAt,
  }));

  return <CreatorVerificationClient creators={creatorsData} />;
}
