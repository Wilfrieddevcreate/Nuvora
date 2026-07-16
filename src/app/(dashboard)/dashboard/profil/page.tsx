import type { Metadata } from "next";
import { verifySession } from "@/lib/dal";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import ProfilClient from "./client";

export const metadata: Metadata = {
  title: "Mon profil — Dashboard Nuvora",
  robots: { index: false, follow: false },
};

export default async function ProfilPage() {
  const session = await verifySession();

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: {
      creator: {
        include: {
          _count: { select: { products: true } },
        },
      },
    },
  });

  if (!user?.creator) redirect("/onboarding");

  const { creator } = user;

  return (
    <ProfilClient
      initialName={user.name}
      initialEmail={user.email}
      initialSpecialty={creator.specialty ?? ""}
      initialTagline={creator.tagline ?? ""}
      initialBio={creator.bio ?? ""}
      creatorSlug={creator.slug}
      verified={creator.verified}
      platform={creator.platform ?? ""}
      productCount={creator._count.products}
      joinedYear={creator.createdAt.getFullYear().toString()}
    />
  );
}
