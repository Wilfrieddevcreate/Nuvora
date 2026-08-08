"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import { notifyAdminNewProduct } from "./notifications";
import { sendNewProductSubmittedEmail } from "@/lib/email";

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
  currency?: string;
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
      currency: input.currency || "EUR",
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

  // Send email to admins (non-blocking)
  const admins = await db.user.findMany({ where: { role: "admin" } });
  admins.forEach((admin) => {
    sendNewProductSubmittedEmail(admin.email, input.title, creator.user.name).catch(console.error);
  });

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
      currency: input.currency || "EUR",
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

export async function trackProductView(
  productId: string,
  context?: { ipAddress?: string; userAgent?: string }
): Promise<void> {
  try {
    const { validateTrackingRequest, logTracking, detectBot, detectAnomaly } = await import("@/lib/fraud-detection");

    const ipAddress = context?.ipAddress || "unknown";
    const userAgent = context?.userAgent;

    const trackingContext = {
      productId,
      ipAddress,
      userAgent,
      type: "view" as const,
    };

    // Validate request
    const validation = await validateTrackingRequest(trackingContext);
    const isBot = detectBot(userAgent);
    const anomalyCheck = await detectAnomaly(trackingContext);

    // Log the tracking attempt
    await logTracking(trackingContext, {
      isBot,
      rateLimited: !validation.valid,
      suspicious: anomalyCheck.suspicious,
    });

    // Only increment if valid
    if (validation.valid) {
      await db.product.update({
        where: { id: productId },
        data: { views: { increment: 1 } },
      });
    }
  } catch {
    // Silently fail - tracking is not critical
  }
}

export async function trackProductClick(
  productId: string,
  context?: { ipAddress?: string; userAgent?: string }
): Promise<void> {
  try {
    const { validateTrackingRequest, logTracking, detectBot, detectAnomaly } = await import("@/lib/fraud-detection");

    // Get IP and user-agent from headers if not provided
    let ipAddress = context?.ipAddress;
    let userAgent = context?.userAgent;

    if (!ipAddress || !userAgent) {
      try {
        const headersList = await headers();
        ipAddress = ipAddress || headersList.get("x-forwarded-for")?.split(",")[0] || headersList.get("x-real-ip") || "unknown";
        userAgent = userAgent || headersList.get("user-agent") || undefined;
      } catch {
        // If headers() fails (not in a request context), use defaults
        ipAddress = ipAddress || "unknown";
      }
    }

    const trackingContext = {
      productId,
      ipAddress,
      userAgent,
      type: "click" as const,
    };

    // Validate request
    const validation = await validateTrackingRequest(trackingContext);
    const isBot = detectBot(userAgent);
    const anomalyCheck = await detectAnomaly(trackingContext);

    // Log the tracking attempt
    await logTracking(trackingContext, {
      isBot,
      rateLimited: !validation.valid,
      suspicious: anomalyCheck.suspicious,
    });

    // Only increment if valid
    if (validation.valid) {
      await db.product.update({
        where: { id: productId },
        data: { clicks: { increment: 1 } },
      });
    }
  } catch {
    // Silently fail - tracking is not critical
  }
}
