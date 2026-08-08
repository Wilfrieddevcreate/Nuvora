"use server";

import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function getNotifications() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const notifications = await db.notification.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return notifications;
}

export async function getUnreadCount() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const count = await db.notification.count({
    where: { userId: session.userId, read: false },
  });

  return count;
}

export async function markNotificationAsRead(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const notification = await db.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== session.userId) {
    throw new Error("Notification not found or unauthorized");
  }

  await db.notification.update({
    where: { id },
    data: { read: true },
  });
}

export async function markAllNotificationsAsRead() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  await db.notification.updateMany({
    where: { userId: session.userId, read: false },
    data: { read: true },
  });
}

export async function deleteNotification(id: string) {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");

  const notification = await db.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== session.userId) {
    throw new Error("Notification not found or unauthorized");
  }

  await db.notification.delete({ where: { id } });
}

// Internal functions pour créer les notifications (appelées par les actions admin/creator)

export async function notifyCreatorProductApproved(creatorId: string, productId: string, productTitle: string) {
  const creator = await db.creator.findUnique({ where: { id: creatorId }, select: { userId: true } });
  if (!creator) return;

  await db.notification.create({
    data: {
      userId: creator.userId,
      type: "product_approved",
      title: "Produit approuvé ✅",
      message: `Votre produit "${productTitle}" a été approuvé et est maintenant en ligne.`,
      productId,
    },
  });
}

export async function notifyCreatorProductRejected(creatorId: string, productId: string, productTitle: string, reason?: string) {
  const creator = await db.creator.findUnique({ where: { id: creatorId }, select: { userId: true } });
  if (!creator) return;

  await db.notification.create({
    data: {
      userId: creator.userId,
      type: "product_rejected",
      title: "Produit rejeté ❌",
      message: reason
        ? `Votre produit "${productTitle}" a été rejeté. Raison : ${reason}`
        : `Votre produit "${productTitle}" a été rejeté. Veuillez améliorer votre fiche produit.`,
      productId,
    },
  });
}

export async function notifyAdminNewProduct(productTitle: string, creatorName: string, productId: string) {
  const admins = await db.user.findMany({ where: { role: "admin" } });
  for (const admin of admins) {
    await db.notification.create({
      data: {
        userId: admin.id,
        type: "product_pending",
        title: "Nouveau produit à modérer 📦",
        message: `Nouveau produit "${productTitle}" de ${creatorName} en attente d'approbation.`,
        productId,
      },
    });
  }
}

export async function notifyAdminNewReview(productTitle: string, reviewerName: string, productId: string) {
  const admins = await db.user.findMany({ where: { role: "admin" } });
  for (const admin of admins) {
    await db.notification.create({
      data: {
        userId: admin.id,
        type: "review_pending",
        title: "Nouvel avis à modérer 💬",
        message: `Nouvel avis sur "${productTitle}" par ${reviewerName} en attente d'approbation.`,
        productId,
      },
    });
  }
}

export async function notifyCreatorNewReview(creatorId: string, productTitle: string, reviewerName: string, rating: number, productId: string) {
  const creator = await db.creator.findUnique({ where: { id: creatorId }, select: { userId: true } });
  if (!creator) return;

  const stars = "⭐".repeat(rating);
  await db.notification.create({
    data: {
      userId: creator.userId,
      type: "review_received",
      title: `Nouvel avis ${stars}`,
      message: `${reviewerName} a laissé un avis sur votre produit "${productTitle}".`,
      productId,
    },
  });
}

export async function notifyAdminCreatorVerificationRequest(creatorSlug: string, creatorName: string, creatorId: string) {
  const admins = await db.user.findMany({ where: { role: "admin" } });
  for (const admin of admins) {
    await db.notification.create({
      data: {
        userId: admin.id,
        type: "creator_verification",
        title: "Demande de vérification créateur 🔐",
        message: `${creatorName} demande une vérification de créateur.`,
      },
    });
  }
}

export async function notifyCreatorVerified(creatorId: string, creatorName: string) {
  const creator = await db.creator.findUnique({ where: { id: creatorId }, select: { userId: true } });
  if (!creator) return;

  await db.notification.create({
    data: {
      userId: creator.userId,
      type: "creator_verified",
      title: "🎉 Tu es créateur vérifié!",
      message: `Félicitations ${creatorName}! Tu as été certifié comme créateur. Le badge "Créateur vérifié" apparaît maintenant sur tous tes produits.`,
    },
  });
}
