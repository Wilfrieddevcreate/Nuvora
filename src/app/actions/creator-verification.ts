"use server";

import { db } from "@/lib/db";
import { notifyCreatorVerified } from "./notifications";
import { sendCreatorVerifiedEmail } from "@/lib/email";

export type CreatorVerificationData = {
  creator: {
    id: string;
    slug: string;
    bio?: string;
    avatar?: string;
    specialty?: string;
    platform?: string;
    verified: boolean;
    createdAt: Date;
    user: {
      name: string;
      email: string;
    };
  };
  criteria: {
    hasCompleteProfile: boolean;
    hasMinimumProducts: boolean;
    hasNoRecentRejections: boolean;
    isOldEnough: boolean;
    productCount: number;
    rejectedCount: number;
    daysOld: number;
  };
  products: Array<{
    id: string;
    title: string;
    status: string;
    price: number;
    isFree: boolean;
    createdAt: Date;
  }>;
};

export async function getCreatorVerificationData(creatorId: string): Promise<CreatorVerificationData | null> {
  const creator = await db.creator.findUnique({
    where: { id: creatorId },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  if (!creator) return null;

  const products = await db.product.findMany({
    where: { creatorId },
    select: { id: true, title: true, status: true, price: true, isFree: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  // Critères
  const hasCompleteProfile = !!(creator.bio && creator.avatar && creator.specialty);
  const productCount = products.length;
  const hasMinimumProducts = productCount >= 3;
  const activeCount = products.filter((p) => p.status === "active").length;
  const rejectedCount = products.filter((p) => p.status === "rejected").length;
  const hasNoRecentRejections = rejectedCount === 0;
  const daysOld = Math.floor((Date.now() - creator.createdAt.getTime()) / (1000 * 60 * 60 * 24));
  const isOldEnough = daysOld >= 14;

  return {
    creator: {
      id: creator.id,
      slug: creator.slug,
      bio: creator.bio || undefined,
      avatar: creator.avatar || undefined,
      specialty: creator.specialty || undefined,
      platform: creator.platform || undefined,
      verified: creator.verified,
      createdAt: creator.createdAt,
      user: creator.user,
    },
    criteria: {
      hasCompleteProfile,
      hasMinimumProducts,
      hasNoRecentRejections,
      isOldEnough,
      productCount,
      rejectedCount,
      daysOld,
    },
    products,
  };
}

export async function verifyCreatorWithReason(creatorId: string, reason: string): Promise<void> {
  const creator = await db.creator.findUnique({
    where: { id: creatorId },
    include: { user: { select: { name: true, email: true } } },
  });

  if (!creator) return;

  await db.creator.update({
    where: { id: creatorId },
    data: { verified: true },
  });

  // Envoyer notification en base
  await notifyCreatorVerified(creatorId, creator.user.name);

  // Envoyer email (non-blocking)
  sendCreatorVerifiedEmail(creator.user.email, creator.user.name).catch(console.error);
}

export async function rejectCreatorVerification(creatorId: string, reason: string): Promise<void> {
  // On stocke pas le rejet, juste une notification
  const creator = await db.creator.findUnique({
    where: { id: creatorId },
    include: { user: { select: { email: true, name: true } } },
  });
  
  if (!creator) return;
  
  // TODO: Ajouter notification créateur avec raison du rejet
  console.log(`Créateur ${creator.user.name} rejeté: ${reason}`);
}
