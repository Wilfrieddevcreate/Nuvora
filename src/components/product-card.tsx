import Link from "next/link";
import type { Product } from "@/data/products";

function formatPrice(price: number): string {
  return price === 0 ? "Gratuit" : `${price} €`;
}

const COVER_CLASS: Record<Product["cover"], string> = {
  // Motif hachuré diagonal (papier / papier-2)
  hatch:
    "bg-[repeating-linear-gradient(45deg,var(--paper-2),var(--paper-2)_12px,var(--paper)_12px,var(--paper)_24px)]",
  wash: "bg-accent-wash",
  ink: "bg-ink",
};

export function ProductCard({ product }: { product: Product }) {
  const onInk = product.cover === "ink";

  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group flex flex-col border-b-2 border-r-2 border-line-strong bg-card transition-colors hover:bg-paper-2"
    >
      {/* Couverture générée — pas d'image externe */}
      <div
        className={`relative flex aspect-[16/11] items-end justify-between border-b-2 border-line-strong p-3 ${COVER_CLASS[product.cover]}`}
      >
        <div className="absolute inset-x-3 top-3 flex justify-start">
          {product.isNew ? (
            <span className="rounded-[2px] border-[1.5px] border-accent bg-accent-wash px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.04em] text-accent-ink">
              Nouveau
            </span>
          ) : product.verified ? (
            <span className="rounded-[2px] border-[1.5px] border-line-strong bg-paper-2 px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-[0.04em] text-ink">
              Vérifié
            </span>
          ) : null}
        </div>
        <span
          className={`font-display text-[15px] ${onInk ? "text-paper opacity-70" : "text-ink opacity-50"}`}
        >
          {product.category}
        </span>
      </div>

      {/* Corps */}
      <div className="flex flex-1 flex-col p-3.5">
        <div className="font-mono text-[11px] uppercase tracking-[0.04em] text-muted">
          {product.category} · {product.subCategory}
        </div>
        <h3 className="mt-1.5 font-display text-[19px] normal-case leading-[1.02] tracking-[-0.01em]">
          {product.title}
        </h3>
        <div className="mt-1 text-[12.5px] font-medium text-muted">
          par {product.creator}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
          <span className="font-display text-[20px]">
            {formatPrice(product.price)}
          </span>
          <span className="rounded-[2px] border-[1.5px] border-line px-2 py-0.5 font-mono text-[10.5px] uppercase text-muted">
            {product.platform}
          </span>
        </div>
      </div>
    </Link>
  );
}
