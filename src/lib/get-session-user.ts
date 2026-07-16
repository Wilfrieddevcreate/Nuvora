import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import type { AuthUser } from "@/contexts/auth";


export async function getSessionUser(): Promise<AuthUser | null> {
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
}
