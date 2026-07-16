"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { createSession } from "@/lib/auth";

type OnboardingInput = {
  displayName: string;
  tagline: string;
  platform: string;
  specialty: string;
};

function makeCreatorSlug(name: string, userId: string): string {
  const base = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 50);
  return `${base}-${userId.slice(-6)}`;
}

export async function completeOnboarding(input: OnboardingInput): Promise<{ error?: string }> {
  const session = await verifySession();

  // Already a creator — nothing to do
  const existing = await db.creator.findUnique({ where: { userId: session.userId } });
  if (existing) redirect("/dashboard");

  if (!input.displayName.trim()) return { error: "Le nom d'affichage est obligatoire." };

  const slug = makeCreatorSlug(input.displayName, session.userId);

  await db.$transaction([
    db.creator.create({
      data: {
        userId: session.userId,
        slug,
        bio: null,
        tagline: input.tagline || null,
        specialty: input.specialty || null,
        platform: input.platform || null,
        verified: false,
      },
    }),
    db.user.update({
      where: { id: session.userId },
      data: { role: "creator" },
    }),
  ]);

  // Refresh session cookie with new role
  await createSession({ userId: session.userId, role: "creator", name: session.name });

  redirect("/dashboard");
}
