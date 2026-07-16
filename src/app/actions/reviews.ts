"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export type ReviewState = { error?: string; success?: boolean };

export async function submitReview(
  productId: string,
  rating: number,
  comment: string,
): Promise<ReviewState> {
  const session = await getSession();
  if (!session?.userId) return { error: "Connectez-vous pour laisser un avis." };

  if (!rating || rating < 1 || rating > 5) return { error: "Choisissez une note entre 1 et 5." };

  const product = await db.product.findUnique({
    where: { id: productId, status: "active" },
    select: { slug: true },
  });
  if (!product) return { error: "Produit introuvable." };

  const existing = await db.review.findUnique({
    where: { userId_productId: { userId: session.userId, productId } },
  });
  if (existing) return { error: "Vous avez déjà laissé un avis sur ce produit." };

  await db.review.create({
    data: {
      userId: session.userId,
      productId,
      rating,
      comment: comment.trim() || null,
      status: "pending",
    },
  });

  revalidatePath(`/produit/${product.slug}`);
  return { success: true };
}
