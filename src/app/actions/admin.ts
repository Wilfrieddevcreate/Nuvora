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
import {
  sendProductApprovedEmail,
  sendProductRejectedEmail,
  sendNewReviewEmail,
  sendNewReviewSubmittedEmail,
} from "@/lib/email";

async function requireAdmin() {
  const session = await verifySession();
  if (session.role !== "admin") throw new Error("Accès refusé.");
  return session;
}

export async function approveProduct(productId: string): Promise<void> {
  await requireAdmin();
  const product = await db.product.findUnique({
    where: { id: productId },
    include: { creator: { select: { user: { select: { email: true } } } } },
  });
  if (!product) throw new Error("Produit introuvable");

  await db.product.update({
    where: { id: productId },
    data: { status: "active" },
  });

  await notifyCreatorProductApproved(product.creatorId, product.id, product.title);

  // Send email (non-blocking)
  sendProductApprovedEmail(product.creator.user.email, product.title).catch(console.error);

  revalidatePath("/admin/produits");
}

export async function rejectProduct(productId: string): Promise<void> {
  await requireAdmin();
  const product = await db.product.findUnique({
    where: { id: productId },
    include: { creator: { select: { user: { select: { email: true } } } } },
  });
  if (!product) throw new Error("Produit introuvable");

  await db.product.update({
    where: { id: productId },
    data: { status: "rejected" },
  });

  await notifyCreatorProductRejected(product.creatorId, product.id, product.title);

  // Send email (non-blocking)
  sendProductRejectedEmail(product.creator.user.email, product.title).catch(console.error);

  revalidatePath("/admin/produits");
}

export async function approveReview(reviewId: string): Promise<void> {
  await requireAdmin();
  const review = await db.review.findUnique({
    where: { id: reviewId },
    include: {
      user: { select: { name: true } },
      product: {
        select: {
          slug: true,
          title: true,
          creatorId: true,
          creator: { select: { user: { select: { email: true } } } },
        },
      },
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

  // Send email (non-blocking)
  sendNewReviewEmail(
    review.product.creator.user.email,
    review.product.title,
    review.user.name,
    review.rating,
  ).catch(console.error);

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

export async function submitReview(
  productSlug: string,
  rating: number,
  comment: string,
): Promise<void> {
  const session = await verifySession();
  if (!session) throw new Error("Non authentifié");

  const product = await db.product.findUnique({ where: { slug: productSlug } });
  if (!product) throw new Error("Produit introuvable");

  const review = await db.review.create({
    data: {
      userId: session.userId,
      productId: product.id,
      rating,
      comment,
      status: "pending",
    },
    include: {
      product: { select: { title: true, creatorId: true } },
      user: { select: { name: true } },
    },
  });

  await notifyAdminNewReview(
    review.product.title,
    review.user.name,
    product.id,
  );
  await notifyCreatorNewReview(
    review.product.creatorId,
    review.product.title,
    review.user.name,
    rating,
    product.id,
  );

  revalidatePath(`/produit/${productSlug}`);
}
