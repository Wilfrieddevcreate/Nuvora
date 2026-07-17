"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { notifyAdminNewProduct } from "./notifications";

export type ProductState = {
  error?: string;
};

type ProductInput = {
  title: string;
  description: string;
  category: string;
  subCategory: string;
  tags: string[];
  price: number;
  isFree: boolean;
  language: string;
  country: string;
  platform: string;
  purchaseUrl: string;
  coverImage?: string;
};

function makeSlug(title: string, id: string): string {
  const base = title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
  return `${base}-${id.slice(-6)}`;
}

export async function submitProduct(input: ProductInput): Promise<ProductState> {
  const session = await verifySession();

  const creator = await db.creator.findUnique({
    where: { userId: session.userId },
    select: { id: true, user: { select: { name: true } } },
  });
  if (!creator) return { error: "Profil créateur introuvable." };

  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  const slug = makeSlug(input.title, id);

  const product = await db.product.create({
    data: {
      id,
      slug,
      title: input.title,
      description: input.description,
      category: input.category,
      subCategory: input.subCategory,
      tags: JSON.stringify(input.tags),
      price: input.isFree ? 0 : input.price,
      isFree: input.isFree,
      language: input.language,
      country: input.country || null,
      platform: input.platform,
      purchaseUrl: input.purchaseUrl,
      coverImage: input.coverImage || null,
      creatorId: creator.id,
    },
  });

  await notifyAdminNewProduct(input.title, creator.user.name, product.id);

  redirect("/dashboard/produits");
}

export async function updateProduct(
  productId: string,
  input: ProductInput
): Promise<ProductState> {
  const session = await verifySession();

  const product = await db.product.findUnique({
    where: { id: productId },
    include: { creator: { select: { userId: true } } },
  });

  if (!product || product.creator.userId !== session.userId) {
    return { error: "Produit introuvable ou accès refusé." };
  }

  await db.product.update({
    where: { id: productId },
    data: {
      title: input.title,
      description: input.description,
      category: input.category,
      subCategory: input.subCategory,
      tags: JSON.stringify(input.tags),
      price: input.isFree ? 0 : input.price,
      isFree: input.isFree,
      language: input.language,
      country: input.country || null,
      platform: input.platform,
      purchaseUrl: input.purchaseUrl,
      status: "pending",
    },
  });

  redirect("/dashboard/produits");
}

export async function deleteProduct(productId: string): Promise<ProductState> {
  const session = await verifySession();

  const product = await db.product.findUnique({
    where: { id: productId },
    include: { creator: { select: { userId: true } } },
  });

  if (!product || product.creator.userId !== session.userId) {
    return { error: "Produit introuvable ou accès refusé." };
  }

  await db.product.delete({ where: { id: productId } });
  redirect("/dashboard/produits");
}
