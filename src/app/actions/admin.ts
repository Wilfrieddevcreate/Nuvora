"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import {
  notifyCreatorProductApproved,
  notifyCreatorProductRejected,
  notifyAdminNewProduct,
  notifyAdminNewReview,
  notifyCreatorNewReview,
} from "./notifications";

async function requireAdmin() {
  const session = await verifySession();
  if (session.role !== "admin") throw new Error("Accès refusé.");
  return session;
}

export async function approveProduct(productId: string): Promise<void> {
  await requireAdmin();
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { id: true, title: true, creatorId: true },
  });
  if (!product) throw new Error("Produit introuvable");

  await db.product.update({
    where: { id: productId },
    data: { status: "active" },
  });

  await notifyCreatorProductApproved(product.creatorId, product.id, product.title);
  revalidatePath("/admin/produits");
}

export async function rejectProduct(productId: string): Promise<void> {
  await requireAdmin();
  const product = await db.product.findUnique({
    where: { id: productId },
    select: { id: true, title: true, creatorId: true },
  });
  if (!product) throw new Error("Produit introuvable");

  await db.product.update({
    where: { id: productId },
    data: { status: "rejected" },
  });

  await notifyCreatorProductRejected(product.creatorId, product.id, product.title);
  revalidatePath("/admin/produits");
}

export async function approveReview(reviewId: string): Promise<void> {
  await requireAdmin();
  const review = await db.review.findUnique({
    where: { id: reviewId },
    include: {
      user: { select: { name: true } },
      product: { select: { slug: true, title: true, creatorId: true } },
    },
  });
  if (!review) throw new Error("Avis introuvable");

  await db.review.update({
    where: { id: reviewId },
    data: { status: "approved" },
  });

  await notifyCreatorNewReview(
    review.product.creatorId,
    review.product.title,
    review.user.name,
    review.rating,
    review.product.slug,
  );
  revalidatePath("/admin/avis");
  revalidatePath(`/produit/${review.product.slug}`);
}

export async function rejectReview(reviewId: string): Promise<void> {
  await requireAdmin();
  await db.review.update({
    where: { id: reviewId },
    data: { status: "rejected" },
  });
  revalidatePath("/admin/avis");
}

export async function verifyCreator(creatorId: string): Promise<void> {
  await requireAdmin();
  await db.creator.update({
    where: { id: creatorId },
    data: { verified: true },
  });
  revalidatePath("/admin/createurs");
}
