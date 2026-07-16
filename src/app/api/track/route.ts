import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { productId } = await req.json();
    if (!productId || typeof productId !== "string") {
      return new Response(null, { status: 400 });
    }
    await db.product.update({
      where: { id: productId },
      data: { clicks: { increment: 1 } },
    });
  } catch {
    // Silencieux — le tracking ne doit jamais bloquer l'UX
  }
  return new Response(null, { status: 204 });
}
