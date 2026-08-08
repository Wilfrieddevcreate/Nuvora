"use client";

import { useTransition } from "react";
import { trackProductClick } from "@/app/actions/products";
import { ArrowUpRight } from "@/components/icons";

interface ProductPurchaseButtonProps {
  productId: string;
  purchaseUrl: string;
}

export function ProductPurchaseButton({ productId, purchaseUrl }: ProductPurchaseButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    startTransition(async () => {
      await trackProductClick(productId);
      // Open link after tracking
      window.open(purchaseUrl, "_blank", "noopener,noreferrer");
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-accent-fg shadow-soft transition-smooth hover:bg-accent-hover hover:shadow-soft-lg active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      Acheter maintenant
      <ArrowUpRight className="size-4" />
    </button>
  );
}
