"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";

export type CreatorProfileState = {
  error?: string;
  success?: boolean;
};

export async function updateCreatorProfile(
  data: {
    name: string;
    specialty: string;
    tagline: string;
    bio: string;
    email: string;
  }
): Promise<CreatorProfileState> {
  const session = await verifySession();

  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();

  if (!name) return { error: "Le nom est obligatoire." };
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { error: "Adresse e-mail invalide." };

  const emailTaken = await db.user.findFirst({
    where: { email, NOT: { id: session.userId } },
  });
  if (emailTaken) return { error: "Cette adresse e-mail est déjà utilisée." };

  await db.$transaction([
    db.user.update({
      where: { id: session.userId },
      data: { name, email },
    }),
    db.creator.update({
      where: { userId: session.userId },
      data: {
        specialty: data.specialty.trim() || null,
        tagline: data.tagline.trim() || null,
        bio: data.bio.trim() || null,
      },
    }),
  ]);

  revalidatePath("/dashboard/profil");
  return { success: true };
}
