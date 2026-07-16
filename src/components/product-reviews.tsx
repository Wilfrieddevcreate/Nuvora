import { db } from "@/lib/db";
import { ProductReviewsClient } from "@/components/product-reviews-client";

export async function ProductReviews({ productId }: { productId: string }) {
  const reviews = await db.review.findMany({
    where: { productId, status: "approved" },
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true } } },
  });

  const data = reviews.map((r) => ({
    id: r.id,
    author: r.user.name,
    initial: r.user.name.charAt(0).toUpperCase(),
    rating: r.rating,
    comment: r.comment ?? "",
    createdAt: r.createdAt.toISOString(),
  }));

  return <ProductReviewsClient productId={productId} reviews={data} />;
}
