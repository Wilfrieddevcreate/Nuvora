import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import type { AuthUser } from "@/contexts/auth";

// Memoized per render pass — DB hit only once even if called from multiple components
export const verifySession = cache(async (): Promise<{ userId: string; role: string; name: string }> => {
  const session = await getSession();
  if (!session?.userId) redirect("/connexion");
  return session;
});

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const session = await getSession();
  if (!session) return null;

  const user = await db.user.findUnique({
    where: { id: session.userId },
    include: { creator: { select: { slug: true } } },
  });
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    initial: user.name.charAt(0).toUpperCase(),
    role: user.role,
    isCreator: user.role === "creator",
    slug: user.creator?.slug,
  };
});
