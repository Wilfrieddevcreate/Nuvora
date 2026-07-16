"use client";

import { ArrowUpRight } from "@/components/icons";

export function BuyButton({
  productId,
  purchaseUrl,
}: {
  productId: string;
  purchaseUrl: string;
}) {
  function handleClick() {
    // Fire-and-forget — n'attend pas la réponse pour ouvrir le lien
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
      keepalive: true,
    }).catch(() => {});
  }

  return (
    <a
      href={purchaseUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3.5 font-semibold text-accent-fg shadow-soft transition-colors hover:bg-accent-hover"
    >
      Acheter maintenant
      <ArrowUpRight className="size-4" />
    </a>
  );
}
