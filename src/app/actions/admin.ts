"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";

async function requireAdmin() {
  const session = await verifySession();
  if (session.role !== "admin") throw new Error("Accès refusé.");
  return session;
}

export async function approveProduct(productId: string): Promise<void> {
  await requireAdmin();
  await db.product.update({
    where: { id: productId },
    data: { status: "active" },
  });
  revalidatePath("/admin/produits");
}

export async function rejectProduct(productId: string): Promise<void> {
  await requireAdmin();
  await db.product.update({
    where: { id: productId },
    data: { status: "rejected" },
  });
  revalidatePath("/admin/produits");
}

export async function verifyCreator(creatorId: string): Promise<void> {
  await requireAdmin();
  await db.creator.update({
    where: { id: creatorId },
    data: { verified: true },
  });
  revalidatePath("/admin/createurs");
}
